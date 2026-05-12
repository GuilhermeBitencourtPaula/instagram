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
    // Format posts for the prompt
    const postsData = posts.map(p => ({
      caption: p.caption,
      likes: p.likesCount,
      comments: p.commentsCount,
      type: p.mediaType
    })).slice(0, 15); // limit to top 15 posts for context window

    const prompt = `
      Você é um especialista em Marketing Digital e Instagram. 
      Analise os seguintes dados coletados de posts do Instagram para a busca: "${query}".
      
      Dados dos Posts:
      ${JSON.stringify(postsData)}
      
      Responda em JSON com os seguintes campos:
      - summary: Um resumo do que está sendo postado.
      - detectedTrends: Tendências de conteúdo ou hashtags identificadas.
      - suggestedNiche: Sugestão de sub-nicho lucrativo.
      - viralPatterns: Padrões identificados nos posts com mais engajamento.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    logger.info(`Insights gerados com sucesso para a busca: ${query}`);
    return result;

  } catch (error: any) {
    logger.error(`Erro ao gerar insights com IA: ${error.message}`);
    return {
      summary: 'Erro ao processar insights com a IA.',
      detectedTrends: 'N/A',
      suggestedNiche: 'N/A',
      viralPatterns: 'N/A',
    };
  }
};
