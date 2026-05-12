import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';
import { scrapeInstagramData } from '../services/scraper.service';
import { generateSearchInsights } from '../services/ai.service';

export const createSearch = async (req: Request, res: Response) => {
  const { query, tagNames } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    // Create the search and link tags (create tags if they don't exist)
    const newSearch = await prisma.search.create({
      data: {
        query,
        userId,
        status: 'PENDING',
        tags: {
          connectOrCreate: tagNames.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    logger.info(`Nova pesquisa criada por ${userId}: ${query}`);

    res.status(201).json(newSearch);
  } catch (error: any) {
    logger.error(`Erro ao criar pesquisa: ${error.message}`);
    res.status(500).json({ message: 'Erro interno ao processar pesquisa.' });
  }
};

export const getUserSearches = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const searches = await prisma.search.findMany({
      where: { userId, deletedAt: null },
      include: {
        tags: true,
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(searches);
  } catch (error: any) {
    logger.error(`Erro ao buscar pesquisas: ${error.message}`);
    res.status(500).json({ message: 'Erro ao listar pesquisas.' });
  }
};

export const deleteSearch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    // Soft delete
    await prisma.search.updateMany({
      where: { id: Number(id), userId },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: 'Pesquisa removida com sucesso.' });
  } catch (error: any) {
    logger.error(`Erro ao deletar pesquisa: ${error.message}`);
    res.status(500).json({ message: 'Erro ao remover pesquisa.' });
  }
};

export const processSearch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const search = await prisma.search.findFirst({
      where: { id: Number(id), userId }
    });

    if (!search) {
      return res.status(404).json({ message: 'Pesquisa não encontrada.' });
    }

    // Update status to processing
    await prisma.search.update({
      where: { id: search.id },
      data: { status: 'PROCESSING' }
    });

    // 1. Scrape Data (Mock)
    const scrapedPosts = await scrapeInstagramData(search.query);

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
        update: {},
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

    res.status(200).json({ 
      message: 'Processamento concluído com sucesso.',
      search: updatedSearch 
    });

  } catch (error: any) {
    logger.error(`Erro no processamento da pesquisa ${id}: ${error.message}`);
    
    await prisma.search.update({
      where: { id: Number(id) },
      data: { status: 'FAILED' }
    });

    res.status(500).json({ message: 'Erro ao processar pesquisa.' });
  }
};

