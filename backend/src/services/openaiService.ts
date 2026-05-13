import OpenAI from 'openai';

// Inicializa a OpenAI com a chave salva nas variáveis de ambiente (.env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function gerarInsightsInstagram(hashtag: string, posts: any[]) {
  // Limpa e resume os dados dos posts para não estourar o limite de tokens da API
  const dadosParaIA = posts.map(post => ({
    legenda: post.caption || "Sem legenda",
    tipo: post.mediaType || post.media_type,
    likes: post.likesCount || post.like_count || 0
  }));

  const promptSistema = `Você é um analista de marketing digital especialista em inteligência de dados do Instagram. 
Sua tarefa é analisar uma lista de postagens recentes de uma hashtag e extrair insights estratégicos de mercado.`;

  const promptUsuario = `Analise os seguintes posts extraídos da hashtag #${hashtag}:
${JSON.stringify(dadosParaIA, null, 2)}

Responda estritamente em formato JSON com as seguintes chaves:
{
  "sentiment": "Análise geral do sentimento do público (ex: Altamente Positivo, Crítico, Comercial)",
  "trends": "Liste as 3 principais tendências, palavras-chave ou dores comuns identificadas nessas legendas",
  "suggestions": "3 ideias práticas de postagens ou estratégias que o usuário do meu SaaS pode criar para se destacar nesta tag"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo recomendado por ser rápido, moderno e econômico
      messages: [
        { role: 'system', content: promptSistema },
        { role: 'user', content: promptUsuario }
      ],
      response_format: { type: "json_object" } // Garante que a resposta venha estruturada em JSON limpo
    });

    const conteudo = response.choices[0].message.content;
    return conteudo ? JSON.parse(conteudo) : null;
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
    throw new Error("Falha na geração de insights por IA.");
  }
}
