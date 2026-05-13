import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';
import * as instagramService from '../services/instagram.service';

export const getAuthUrl = async (req: Request, res: Response) => {
  const appId = process.env.INSTAGRAM_APP_ID;
  const baseUrl = process.env.BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
  const redirectUri = encodeURIComponent(`${baseUrl}/api/instagram/callback`);
  
  const scopes = encodeURIComponent([
    'instagram_basic',
    'instagram_manage_insights',
    'instagram_business_basic',
    'instagram_manage_comments',
    'pages_show_list',
    'pages_read_engagement'
  ].join(' '));

  const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&state=viryon_auth_state`;

  res.json({ url: authUrl });
};

export const handleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const userId = req.user?.userId;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Código de autorização não fornecido.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  try {
    const baseUrl = process.env.BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    
    // 1. Exchange code for short-lived token
    const shortToken = await instagramService.exchangeCodeForToken(code, redirectUri);
    
    // 2. Exchange for long-lived token
    const { token: longToken, expires_in } = await instagramService.getLongLivedToken(shortToken);
    
    // 3. Get Instagram Business ID
    const igUserId = await instagramService.getInstagramBusinessId(longToken);
    
    if (!igUserId) {
      return res.status(400).json({ message: 'Não foi possível encontrar uma conta do Instagram Business vinculada a este perfil.' });
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (expires_in || 5184000)); // Default 60 days

    // 4. Save to database
    await prisma.instagramConfig.upsert({
      where: { userId },
      update: {
        accessToken: longToken,
        instagramUserId: igUserId,
        tokenExpiresAt: expiresAt,
        isConnected: true
      },
      create: {
        userId,
        accessToken: longToken,
        instagramUserId: igUserId,
        tokenExpiresAt: expiresAt,
        isConnected: true
      }
    });

    logger.info(`Instagram conectado com sucesso para o usuário ${userId}`);

    // Redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?status=success`);
  } catch (error: any) {
    logger.error(`Erro no callback do Instagram: ${error.message}`);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?status=error&message=${encodeURIComponent(error.message)}`);
  }
};

export const getStatus = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const config = await prisma.instagramConfig.findUnique({
      where: { userId }
    });

    res.json({
      isConnected: config?.isConnected || false,
      instagramUserId: config?.instagramUserId || null,
      expiresAt: config?.tokenExpiresAt || null
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar status do Instagram.' });
  }
};

export const disconnect = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    await prisma.instagramConfig.update({
      where: { userId },
      data: { isConnected: false, accessToken: '' }
    });

    res.json({ message: 'Instagram desconectado com sucesso.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao desconectar Instagram.' });
  }
};
