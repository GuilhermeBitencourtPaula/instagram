import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalSearches = await prisma.search.count();
    const activeAlerts = await prisma.scheduledSearch.count({ where: { isActive: true } });
    
    res.json({
      totalUsers,
      totalSearches,
      activeAlerts,
      systemHealth: '100%',
      dbStatus: 'Ativo'
    });
  } catch (error: any) {
    logger.error(`Admin Stats Error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { searches: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    logger.error(`Admin Users Error: ${error.message}`);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    // For now, returning mocked logs as we don't have a Logs table
    // but pulling real context where possible
    const recentSearches = await prisma.search.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
    });

    const logs = recentSearches.map(s => ({
      id: s.id,
      action: 'Pesquisa Realizada',
      user: s.user.email,
      target: s.query,
      timestamp: s.createdAt,
      status: 'success'
    }));

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        searches: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { posts: true } } }
        },
        instagramConfig: true,
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do usuário' });
  }
};

