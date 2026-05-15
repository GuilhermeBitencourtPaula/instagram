import OpenAI from 'openai';
import logger from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_placeholder_key',
});

export const generateSearchInsights = async (query: string, posts: any[]) => {
  if (posts.length === 0) {
    return {
      summary: 'Nenhum post encontrado para análise.',
      detectedTrends: 'N/A',
      suggestedNiche: 'N/A',
      viralPatterns: 'N/A',
    };
  }

  try {
    // Format minimal data for the prompt to save tokens and avoid errors
    const postsSummary = posts.slice(0, 15).map((p, i) => 
      `${i+1}. Legenda: ${p.caption.substring(0, 100)} | Curtidas: ${p.likesCount} | Comentários: ${p.commentsCount}`
    ).join('\n');
 
    const prompt = `
      Analise estes dados de posts do Instagram sobre "${query}":
      ${postsSummary}
      
      Gere um JSON com:
      1. summary: Resumo da estratégia (2 frases).
      2. detectedTrends: 3 principais hashtags ou temas.
      3. suggestedNiche: Um sub-nicho lucrativo.
      4. viralPatterns: O que faz esses posts terem likes.
 
      Responda APENAS o JSON.
    `;
 
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um analista de marketing que responde apenas em JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    logger.info(`Insights refinados gerados com sucesso para: ${query}`);
    return result;

  } catch (error: any) {
    console.error('DETALHE ERRO IA:', error);
    logger.error(`Erro ao gerar insights refinados: ${error.message}`);
    return {
      summary: 'Erro ao processar insights detalhados.',
      detectedTrends: 'N/A',
      suggestedNiche: 'N/A',
      viralPatterns: 'N/A',
    };
  }
};
