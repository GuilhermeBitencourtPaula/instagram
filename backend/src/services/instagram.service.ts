import axios from 'axios';
import logger from '../utils/logger';

const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/v17.0';

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_url?: string;
  media_type: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
  permalink: string;
  username: string;
}

/**
 * Exchange code for short-lived token
 */
export const exchangeCodeForToken = async (code: string, redirectUri: string): Promise<string> => {
  const response = await axios.get(`${FACEBOOK_GRAPH_URL}/oauth/access_token`, {
    params: {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      redirect_uri: redirectUri,
      code: code,
    },
  });

  return response.data.access_token;
};

/**
 * Exchange short-lived for long-lived token
 */
export const getLongLivedToken = async (shortLivedToken: string): Promise<{ token: string, expires_in: number }> => {
  const response = await axios.get(`${FACEBOOK_GRAPH_URL}/oauth/access_token`, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      fb_exchange_token: shortLivedToken,
    },
  });

  return {
    token: response.data.access_token,
    expires_in: response.data.expires_in,
  };
};

/**
 * Get Instagram Business Account ID from User's Pages
 */
export const getInstagramBusinessId = async (accessToken: string): Promise<string | null> => {
  try {
    // Busca direta e profunda: Pega o usuário e já traz as contas de Instagram das páginas em um único passo
    const response = await axios.get(`${FACEBOOK_GRAPH_URL}/me`, {
      params: {
        fields: 'accounts{instagram_business_account,name}',
        access_token: accessToken,
      },
    });

    let accounts = response.data.accounts?.data || [];
    
    // FORÇA BRUTA: Se a lista veio vazia, tentamos o ID conhecido da sua página "viryon"
    if (accounts.length === 0) {
      console.log('Lista de páginas vazia. Tentando conexão direta com a página viryon (1102322679628518)...');
      try {
        const directPage = await axios.get(`${FACEBOOK_GRAPH_URL}/1102322679628518`, {
          params: {
            fields: 'instagram_business_account,name',
            access_token: accessToken,
          },
        });
        if (directPage.data.instagram_business_account) {
          console.log(`Sucesso na Força Bruta! Instagram encontrado diretamente na página: ${directPage.data.name}`);
          return directPage.data.instagram_business_account.id;
        }
      } catch (e: any) {
        console.warn('Falha na tentativa de conexão direta:', e.message);
      }
    }

    if (accounts.length === 0) {
      console.warn('O Facebook retornou zero páginas (accounts) para este token.');
      return null;
    }

    for (const page of accounts) {
      if (page.instagram_business_account) {
        console.log(`Sucesso! Instagram Business encontrado via busca profunda na página: ${page.name}`);
        return page.instagram_business_account.id;
      }
    }

    console.warn('Páginas encontradas, mas nenhuma tem um Instagram Business vinculado na resposta do Facebook.');
    return null;
  } catch (error: any) {
    logger.error(`Erro na busca profunda de Instagram Business: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
};

/**
 * Get Hashtag ID by name
 */
export const getHashtagId = async (accessToken: string, instagramUserId: string, hashtagName: string): Promise<string | null> => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v12.0/ig_hashtag_search`, {
      params: {
        user_id: instagramUserId,
        q: hashtagName,
        access_token: accessToken,
      },
    });

    return response.data.data?.[0]?.id || null;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    logger.error(`Erro ao buscar ID da hashtag #${hashtagName}: ${errorMsg}`);
    throw new Error(`Erro do Facebook: ${errorMsg}`);
  }
};

/**
 * Get Media from Hashtag
 */
export const getHashtagMedia = async (accessToken: string, instagramUserId: string, hashtagId: string, type: 'recent' | 'top' = 'recent'): Promise<InstagramMedia[]> => {
  try {
    const endpoint = type === 'recent' ? 'recent_media' : 'top_media';
    const response = await axios.get(`https://graph.facebook.com/v12.0/${hashtagId}/${endpoint}`, {
      params: {
        user_id: instagramUserId,
        fields: 'id,caption,media_url,media_type,like_count,comments_count,timestamp,permalink,username',
        access_token: accessToken,
      },
    });

    return response.data.data || [];
  } catch (error: any) {
    logger.error(`Error fetching media for hashtag ${hashtagId}: ${error.response?.data?.error?.message || error.message}`);
    return [];
  }
};

/**
 * Get Instagram Account Type
 */
export const getAccountType = async (accessToken: string, instagramUserId: string): Promise<string> => {
  try {
    const response = await axios.get(`${FACEBOOK_GRAPH_URL}/${instagramUserId}`, {
      params: {
        fields: 'id,username',
        access_token: accessToken,
      },
    });
    return `ID: ${response.data.id}, Username: ${response.data.username}`;
  } catch (error: any) {
    return 'ERRO: ' + (error.response?.data?.error?.message || error.message);
  }
};
