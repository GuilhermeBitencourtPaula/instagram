import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';

import * as instagramService from '../services/instagram.service';

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

export const syncProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const profile = await prisma.instagramProfile.findUnique({
      where: { id: Number(id) }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    // Check for Instagram Config
    const config = await prisma.instagramConfig.findFirst({
      where: { userId }
    });

    if (!config) {
      return res.status(400).json({ message: 'Conecte seu Instagram nas configurações primeiro.' });
    }

    // --- STAGE 1: Direct Sync ---
    let discoveryData = await instagramService.getBusinessDiscovery(
      config.accessToken,
      config.instagramUserId,
      profile.username
    );

    // --- STAGE 2: Rescue Username from Permalink (OEmbed) ---
    if (!discoveryData) {
      const latestPost = await prisma.post.findFirst({
        where: { profileId: profile.id },
        orderBy: { postedAt: 'desc' }
      });

      if (latestPost && latestPost.permalink) {
        logger.info(`Tentando resgate de username via OEmbed para: ${latestPost.permalink}`);
        const oembed = await instagramService.getOEmbedInfo(config.accessToken, latestPost.permalink);
        
        if (oembed && oembed.author_name) {
          logger.info(`Username resgatado: ${oembed.author_name}. Tentando Business Discovery novamente...`);
          discoveryData = await instagramService.getBusinessDiscovery(
            config.accessToken,
            config.instagramUserId,
            oembed.author_name
          );
        }
      }
    }

    if (!discoveryData) {
      return res.status(404).json({ 
        message: 'Não foi possível encontrar dados reais. O perfil pode ser privado ou não ser uma conta Profissional.' 
      });
    }

    // Update Profile with Real Data
    const updated = await prisma.instagramProfile.update({
      where: { id: profile.id },
      data: {
        username: discoveryData.username,
        fullName: discoveryData.name,
        followersCount: discoveryData.followers_count,
        profilePicUrl: discoveryData.profile_picture_url,
      }
    });

    res.status(200).json(updated);
  } catch (error: any) {
    logger.error(`Erro ao sincronizar perfil ${id}: ${error.message}`);
    res.status(500).json({ message: 'Erro ao sincronizar dados com o Instagram.' });
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
