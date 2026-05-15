import prisma from '../database/connection';
import logger from '../utils/logger';
import * as instagramService from './instagram.service';
import { generateSearchInsights } from './ai.service';

export const processSearchInternal = async (searchId: number, userId: number) => {
  try {
    const search = await prisma.search.findFirst({
      where: { id: searchId, userId }
    });

    if (!search) {
      throw new Error('Pesquisa não encontrada.');
    }

    // Update status to processing
    await prisma.search.update({
      where: { id: search.id },
      data: { status: 'PROCESSING' }
    });

    // 0. Check Instagram Connection
    const config = await prisma.instagramConfig.findUnique({
      where: { userId }
    });

    if (!config || !config.isConnected || !config.accessToken) {
      throw new Error('Conta do Instagram não conectada.');
    }

    // 1. Fetch Data from Instagram Graph API
    const instagramUserId = config.instagramUserId;
    const hashtagName = search.query.replace('#', '').trim();

    console.log(`[SEARCH] Iniciando busca. Instagram ID: ${instagramUserId}, Hashtag: ${hashtagName}`);
    logger.info(`Agente IA: Iniciando busca real no Instagram para: #${hashtagName}`);

    // Get Hashtag ID
    const hashtagId = await instagramService.getHashtagId(config.accessToken, instagramUserId, hashtagName);

    if (!hashtagId) {
      await prisma.search.update({
        where: { id: search.id },
        data: { status: 'FAILED' }
      });
      throw new Error(`Hashtag #${hashtagName} não encontrada ou erro na API.`);
    }

    // Get Media (Mudamos para 'top' para garantir que tragamos posts com conteúdo relevante)
    const rawPosts = await instagramService.getHashtagMedia(config.accessToken, instagramUserId, hashtagId, 'top');

    if (rawPosts.length === 0) {
      const accountType = await instagramService.getAccountType(config.accessToken, instagramUserId);
      const hasOwnPosts = await instagramService.getUserMedia(config.accessToken, instagramUserId);
      
      await prisma.search.update({
        where: { id: search.id },
        data: { status: 'FAILED' }
      });
      throw new Error(`Nenhum post encontrado para #${hashtagName}. Perfil: ${accountType}. Consigo ver seus posts? ${hasOwnPosts}`);
    }

    // Map to internal structure and calculate engagement
    let totalLikes = 0;
    let totalComments = 0;

    const scrapedPosts = [];
    for (const post of rawPosts) {
      const likes = post.like_count || 0;
      const comments = post.comments_count || 0;
      totalLikes += likes;
      totalComments += comments;

      const engagement = likes + (comments * 2);
      let realUsername = post.username || `ig_user_${post.id.split('_')[0]}`;

      // --- NEW: PROACTIVE RESCUE ---
      // If we have a masked username and a permalink, try to rescue it NOW
      if (realUsername.startsWith('ig_user_') && post.permalink) {
        try {
          const oembed = await instagramService.getOEmbedInfo(config.accessToken, post.permalink);
          if (oembed && oembed.author_name) {
            realUsername = oembed.author_name;
            logger.info(`Username resgatado proativamente: ${realUsername}`);
          }
        } catch (e) {
          // Silent fail, use masked
        }
      }

      scrapedPosts.push({
        instagramPostId: post.id,
        caption: post.caption || '',
        mediaUrl: post.media_url || '',
        mediaType: post.media_type,
        likesCount: likes,
        commentsCount: comments,
        estimatedEngage: engagement,
        postedAt: new Date(post.timestamp),
        username: realUsername,
        permalink: post.permalink
      });
    }

    // 2. Save Data to Database
    for (const post of scrapedPosts) {
      // Find or create profile
      const profile = await prisma.instagramProfile.upsert({
        where: { username: post.username },
        update: {},
        create: { username: post.username }
      });

      // Extract hashtags from caption
      const hashtagsInCaption = post.caption.match(/#[\wÀ-ÿ]+/g) || [];
      const cleanHashtags = [...new Set(hashtagsInCaption.map(h => h.replace('#', '').toLowerCase()))];

      // Create post with hashtags
      await prisma.post.upsert({
        where: { instagramPostId: post.instagramPostId },
        update: {
          searchId: search.id,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          caption: post.caption,
          estimatedEngage: post.estimatedEngage,
          permalink: post.permalink,
          hashtags: {
            connectOrCreate: cleanHashtags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        },
        create: {
          searchId: search.id,
          profileId: profile.id,
          instagramPostId: post.instagramPostId,
          caption: post.caption,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          estimatedEngage: post.estimatedEngage,
          permalink: post.permalink,
          postedAt: post.postedAt,
          hashtags: {
            connectOrCreate: cleanHashtags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        }
      });
    }

    // 3. Populate Analytics Table
    const avgEngage = scrapedPosts.length > 0 ? (totalLikes + totalComments) / scrapedPosts.length : 0;
    
    await prisma.analytics.create({
      data: {
        searchId: search.id,
        totalPosts: scrapedPosts.length,
        totalLikes,
        totalComments,
        avgEngagement: avgEngage,
        calculatedAt: new Date()
      }
    });

    // 4. Generate AI Insights
    const insights = await generateSearchInsights(search.query, scrapedPosts);

    // 5. Save Insights
    await prisma.aiInsight.create({
      data: {
        searchId: search.id,
        summary: insights.summary,
        detectedTrends: insights.detectedTrends,
        suggestedNiche: insights.suggestedNiche,
        viralPatterns: insights.viralPatterns
      }
    });

    // 6. Update Status to Completed
    const updatedSearch = await prisma.search.update({
      where: { id: search.id },
      data: { status: 'COMPLETED' },
      include: { insights: true, posts: true, analytics: true }
    });

    return updatedSearch;

  } catch (error: any) {
    logger.error(`Erro no processamento da pesquisa ${searchId}: ${error.message}`);
    
    await prisma.search.update({
      where: { id: searchId },
      data: { status: 'FAILED' }
    });

    throw error;
  }
};
