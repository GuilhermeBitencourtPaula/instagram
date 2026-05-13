import { Router, Request, Response } from 'express';
import { getAuthUrl, handleCallback, getStatus, disconnect } from '../controllers/instagram.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { gerarInsightsInstagram } from '../services/openaiService';
import axios from 'axios';

const router = Router();

// OAuth callback is public but requires code
router.get('/callback', handleCallback);

// Other routes require internal authentication
router.use(authenticateToken);

router.get('/auth-url', getAuthUrl);
router.get('/status', getStatus);
router.post('/disconnect', disconnect);

router.post('/gerar-analise-ia', async (req: Request, res: Response) => {
  const { accessToken, facebookPageId, hashtag } = req.body;

  if (!accessToken || !facebookPageId || !hashtag) {
    return res.status(400).json({ error: 'Parâmetros insuficientes para a análise.' });
  }

  const prisma = new PrismaClient();

  try {
    // --- LÓGICA DE CACHE ---
    // Verifica se já existe uma análise para esta hashtag feita nas últimas 24 horas
    const umDiaAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const insightExistente = await prisma.instagramInsight.findFirst({
      where: {
        hashtag: hashtag,
        createdAt: { gte: umDiaAtras }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (insightExistente) {
      console.log(`[Cache] Retornando análise existente para #${hashtag}`);
      return res.status(200).json({ 
        success: true, 
        insight: insightExistente,
        cached: true 
      });
    }
    // -----------------------

    // 1. O agente busca a Tag na Meta
    const searchRes = await axios.get(`https://graph.facebook.com/v19.0/ig_hashtag_search`, {
      params: { user_id: facebookPageId, q: hashtag, access_token: accessToken }
    });
    const hashtagId = searchRes.data?.data?.[0]?.id;

    if (!hashtagId) return res.status(404).json({ error: 'Hashtag não localizada.' });

    // 2. O agente puxa os posts recentes
    const mediaRes = await axios.get(`https://graph.facebook.com/v19.0/${hashtagId}/recent_media`, {
      params: { user_id: facebookPageId, fields: 'id,media_type,caption,like_count', access_token: accessToken }
    });
    const posts = mediaRes.data?.data || [];

    if (posts.length === 0) {
      return res.status(422).json({ error: 'Não há postagens suficientes nesta hashtag para gerar insights.' });
    }

    // 3. A IA processa a lista de posts e gera os Insights estruturados
    const insightsIA = await gerarInsightsInstagram(hashtag, posts);

    // 4. Salva a análise gerada no banco MySQL usando Prisma
    const novoInsight = await prisma.instagramInsight.create({
      data: {
        hashtag: hashtag,
        sentiment: insightsIA.sentiment,
        trends: insightsIA.trends,
        suggestions: insightsIA.suggestions,
        rawAnalysis: JSON.stringify(insightsIA)
      }
    });

    // Retorna o resultado final estruturado
    return res.status(200).json({ success: true, insight: novoInsight });

  } catch (error: any) {
    console.error('Erro na cadeia de agentes:', error.message);
    return res.status(500).json({ error: 'Erro interno ao unificar Instagram e IA.' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
