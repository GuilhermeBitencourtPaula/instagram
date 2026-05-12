import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';
import { scrapeInstagramData } from '../services/scraper.service';
import { generateSearchInsights } from '../services/ai.service';
import * as instagramService from '../services/instagram.service';
import { processSearchInternal } from '../services/search.service';

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

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const search = await prisma.search.findFirst({
      where: { id: Number(id), userId }
    });

    if (!search) {
      return res.status(404).json({ message: 'Pesquisa não encontrada.' });
    }

    // Use the shared service logic
    const updatedSearch = await processSearchInternal(Number(id), userId);

    res.status(200).json({ 
      message: 'Processamento concluído com sucesso.',
      search: updatedSearch 
    });

  } catch (error: any) {
    logger.error(`Erro no processamento da pesquisa ${id}: ${error.message}`);
    res.status(500).json({ message: error.message || 'Erro ao processar pesquisa.' });
  }
};


export const getStats = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const totalSearches = await prisma.search.count({
      where: { userId, deletedAt: null }
    });

    const totalPosts = await prisma.post.count({
      where: { search: { userId, deletedAt: null } }
    });

    const totalInsights = await prisma.aiInsight.count({
      where: { search: { userId, deletedAt: null } }
    });

    // Calculate average engagement (simplified)
    const avgEngage = await prisma.post.aggregate({
      where: { search: { userId, deletedAt: null } },
      _avg: {
        likesCount: true
      }
    });

    // Get Top Hashtags (Tags)
    const topTags = await prisma.tag.findMany({
      where: {
        searches: {
          some: {
            userId,
            deletedAt: null
          }
        }
      },
      include: {
        _count: {
          select: { searches: true }
        }
      },
      orderBy: {
        searches: { _count: 'desc' }
      },
      take: 5
    });

    res.status(200).json({
      totalSearches,
      totalPosts,
      totalInsights,
      avgEngagement: avgEngage._avg.likesCount ? (avgEngage._avg.likesCount / 100).toFixed(1) + '%' : '0%',
      topTags: topTags.map((t: any) => ({ name: t.name, count: t._count.searches }))
    });
  } catch (error: any) {
    logger.error(`Erro ao buscar estatísticas: ${error.message}`);
    res.status(500).json({ message: 'Erro ao carregar estatísticas.' });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isFavorite } = req.body;
  const userId = req.user?.userId;

  try {
    const updatedSearch = await prisma.search.updateMany({
      where: { id: Number(id), userId },
      data: { isFavorite }
    });

    if (updatedSearch.count === 0) {
      return res.status(404).json({ message: 'Pesquisa não encontrada.' });
    }

    res.status(200).json({ message: 'Status de favorito atualizado.' });
  } catch (error: any) {
    logger.error(`Erro ao favoritar pesquisa: ${error.message}`);
    res.status(500).json({ message: 'Erro ao atualizar favorito.' });
  }
};
