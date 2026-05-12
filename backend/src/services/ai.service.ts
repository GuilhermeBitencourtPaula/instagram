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
      type: p.mediaType,
      author: p.username
    })).slice(0, 20);

    const prompt = `
      Você é um Consultor de Crescimento no Instagram e Cientista de Dados de Marketing.
      Sua missão é analisar os seguintes dados reais coletados de posts do Instagram sobre o termo: "${query}".
      
      DADOS BRUTOS:
      ${JSON.stringify(postsData)}
      
      INSTRUÇÕES DE ANÁLISE:
      1. Identifique o tom predominante (sentimento) do conteúdo.
      2. Descubra padrões visuais ou de legenda que estão gerando mais engajamento (likes/comments ratio).
      3. Liste hashtags secundárias que aparecem com frequência e são lucrativas.
      4. Forneça um resumo executivo de 2 frases.
      5. Sugira um sub-nicho específico que tenha baixa concorrência mas alto engajamento baseado nesses posts.

      SAÍDA ESPERADA (JSON estrito):
      {
        "summary": "Resumo executivo impactante.",
        "detectedTrends": "Lista de tendências e hashtags em destaque.",
        "suggestedNiche": "Sub-nicho lucrativo específico com justificativa curta.",
        "viralPatterns": "Análise técnica dos gatilhos de viralização encontrados nos posts top."
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Você é um assistente especializado em inteligência de mercado para Instagram. Você sempre responde em JSON." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    logger.info(`Insights refinados gerados com sucesso para: ${query}`);
    return result;

  } catch (error: any) {
    logger.error(`Erro ao gerar insights refinados: ${error.message}`);
    return {
      summary: 'Erro ao processar insights detalhados.',
      detectedTrends: 'N/A',
      suggestedNiche: 'N/A',
      viralPatterns: 'N/A',
    };
  }
};
