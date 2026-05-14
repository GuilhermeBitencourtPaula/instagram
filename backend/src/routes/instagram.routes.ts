import { Router } from 'express';
import { getAuthUrl, handleCallback, getStatus, disconnect } from '../controllers/instagram.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import prisma from '../database/connection';
import { gerarInsightsInstagram } from '../services/openaiService';
import * as instagramService from '../services/instagram.service';

const router = Router();

// OAuth callback
router.get('/callback', handleCallback);

// Protected routes
router.use(authenticateToken);

router.get('/auth-url', getAuthUrl);
router.get('/status', getStatus);
router.post('/disconnect', disconnect);

/**
 * Agente de Análise Inteligente: Instagram + IA
 */
router.post('/gerar-analise-ia', async (req, res) => {
  const { accessToken, facebookPageId, hashtag } = req.body;

  if (!accessToken || !facebookPageId || !hashtag) {
    return res.status(400).json({ error: 'Parâmetros insuficientes para a análise.' });
  }

  try {
    // 1. LÓGICA DE CACHE (Evita gastos desnecessários com OpenAI/Facebook)
    const umDiaAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const insightExistente = await prisma.instagramInsight.findFirst({
      where: {
        hashtag,
        createdAt: { gte: umDiaAtras }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (insightExistente) {
      return res.status(200).json({ success: true, insight: insightExistente, cached: true });
    }

    // 2. Busca de Dados via Agente Instagram
    const hashtagId = await instagramService.getHashtagId(accessToken, facebookPageId, hashtag);
    if (!hashtagId) return res.status(404).json({ error: 'Hashtag não localizada no Instagram.' });

    const posts = await instagramService.getHashtagMedia(accessToken, facebookPageId, hashtagId);
    if (!posts || posts.length === 0) {
      return res.status(422).json({ error: 'Postagens insuficientes para análise.' });
    }

    // 3. Processamento de IA
    const insightsIA = await gerarInsightsInstagram(hashtag, posts);

    // 4. Persistência
    const novoInsight = await prisma.instagramInsight.create({
      data: {
        hashtag,
        sentiment: insightsIA.sentiment,
        trends: insightsIA.trends,
        suggestions: insightsIA.suggestions,
        rawAnalysis: JSON.stringify(insightsIA)
      }
    });

    return res.status(200).json({ success: true, insight: novoInsight });

  } catch (error: any) {
    console.error('Erro no fluxo de análise IA:', error.message);
    return res.status(500).json({ error: 'Falha na unificação de dados e IA.' });
  }
});

export default router;
