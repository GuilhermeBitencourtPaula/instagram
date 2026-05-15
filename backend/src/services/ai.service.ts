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
    const postsSummary = posts
      .filter(p => p.caption) // Apenas posts com legenda
      .slice(0, 15)
      .map((p, i) => 
        `${i+1}. Legenda: ${p.caption.substring(0, 80)}... | Likes: ${p.likesCount}`
      ).join('\n');
 
    if (!postsSummary) {
       return {
          summary: 'Dados insuficientes para análise detalhada.',
          detectedTrends: 'N/A',
          suggestedNiche: 'N/A',
          viralPatterns: 'N/A',
        };
    }

    const prompt = `
      Analise estes posts do Instagram sobre "${query}":
      ${postsSummary}
      
      Gere um JSON estrito com exatamente estes campos:
      - summary: Resumo estratégico em 2 frases.
      - detectedTrends: Top 3 hashtags/temas.
      - suggestedNiche: Um sub-nicho lucrativo.
      - viralPatterns: Gatilhos de engajamento encontrados.
 
      Responda APENAS o JSON, sem markdown.
    `;
 
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um especialista em marketing digital. Responda apenas JSON puro." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    }, {
      timeout: 25000 // 25 segundos de limite no segundo argumento
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    logger.info(`Insights refinados gerados com sucesso para: ${query}`);
    return result;

  } catch (error: any) {
    console.error('DETALHE ERRO IA:', error);
    logger.error(`Erro ao gerar insights refinados: ${error.message}`);
    
    let friendlyMsg = 'Ocorreu um erro ao processar os insights da IA.';
    
    // Detecta erro de saldo/cota (429)
    if (error.message?.includes('429') || error.response?.data?.error?.code === 'insufficient_quota') {
      friendlyMsg = 'Sua conta OpenAI está sem saldo ou atingiu o limite de uso. Adicione créditos em platform.openai.com para ativar esta função.';
    } else if (error.message?.includes('401') || error.response?.data?.error?.code === 'invalid_api_key') {
      friendlyMsg = 'Sua chave da OpenAI parece inválida. Verifique as configurações no painel do Railway.';
    }
    
    return {
      summary: friendlyMsg,
      detectedTrends: 'Indisponível',
      suggestedNiche: 'Indisponível',
      viralPatterns: 'Indisponível',
    };
  }
};
