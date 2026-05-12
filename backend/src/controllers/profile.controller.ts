import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';

export const getProfiles = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    // Get profiles that have posts linked to this user's searches
    const profiles = await prisma.instagramProfile.findMany({
      where: {
        posts: {
          some: {
            search: {
              userId: userId
            }
          }
        }
      },
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { followersCount: 'desc' },
      take: 50
    });

    res.status(200).json(profiles);
  } catch (error: any) {
    logger.error(`Erro ao buscar perfis: ${error.message}`);
    res.status(500).json({ message: 'Erro ao listar perfis encontrados.' });
  }
};

export const getProfileDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const profile = await prisma.instagramProfile.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
          where: {
            search: { userId }
          },
          orderBy: { postedAt: 'desc' },
          take: 12
        },
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    res.status(200).json(profile);
  } catch (error: any) {
    logger.error(`Erro ao buscar detalhes do perfil ${id}: ${error.message}`);
    res.status(500).json({ message: 'Erro ao carregar detalhes do perfil.' });
  }
};
