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
      await prisma.search.update({
        where: { id: search.id },
        data: { status: 'FAILED' }
      });
      throw new Error(`Nenhum post encontrado para #${hashtagName} usando o ID de Instagram ${instagramUserId}. Verifique se a sua conta é Business e se o recurso de Public Content está ativo.`);
    }

    // Map to internal structure
    const scrapedPosts = rawPosts.map(post => ({
      instagramPostId: post.id,
      caption: post.caption || '',
      mediaUrl: post.media_url || '',
      mediaType: post.media_type,
      likesCount: post.like_count,
      commentsCount: post.comments_count,
      postedAt: new Date(post.timestamp),
      username: post.username
    }));

    // 2. Save Data to Database
    for (const post of scrapedPosts) {
      // Find or create profile
      const profile = await prisma.instagramProfile.upsert({
        where: { username: post.username },
        update: {},
        create: { username: post.username }
      });

      // Create post
      await prisma.post.upsert({
        where: { instagramPostId: post.instagramPostId },
        update: {
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          caption: post.caption
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
          postedAt: post.postedAt
        }
      });
    }

    // 3. Generate AI Insights
    const insights = await generateSearchInsights(search.query, scrapedPosts);

    // 4. Save Insights
    await prisma.aiInsight.create({
      data: {
        searchId: search.id,
        summary: insights.summary,
        detectedTrends: insights.detectedTrends,
        suggestedNiche: insights.suggestedNiche,
        viralPatterns: insights.viralPatterns
      }
    });

    // 5. Update Status to Completed
    const updatedSearch = await prisma.search.update({
      where: { id: search.id },
      data: { status: 'COMPLETED' },
      include: { insights: true, posts: true }
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
