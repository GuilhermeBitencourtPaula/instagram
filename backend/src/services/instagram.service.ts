import axios from 'axios';
import logger from '../utils/logger';

const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/v20.0';

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
    // 1. Get the list of pages managed by the user
    const pagesResponse = await axios.get(`${FACEBOOK_GRAPH_URL}/me/accounts`, {
      params: { access_token: accessToken },
    });

    const pages = pagesResponse.data.data;
    if (!pages || pages.length === 0) return null;

    // 2. For each page, check if there's a connected Instagram Business Account
    for (const page of pages) {
      const igResponse = await axios.get(`${FACEBOOK_GRAPH_URL}/${page.id}`, {
        params: {
          fields: 'instagram_business_account',
          access_token: accessToken,
        },
      });

      if (igResponse.data.instagram_business_account) {
        return igResponse.data.instagram_business_account.id;
      }
    }

    return null;
  } catch (error: any) {
    logger.error(`Error fetching Instagram Business ID: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
};

/**
 * Get Hashtag ID by name
 */
export const getHashtagId = async (accessToken: string, instagramUserId: string, hashtagName: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${FACEBOOK_GRAPH_URL}/ig_hashtag_search`, {
      params: {
        user_id: instagramUserId,
        q: hashtagName,
        access_token: accessToken,
      },
    });

    return response.data.data?.[0]?.id || null;
  } catch (error: any) {
    logger.error(`Error fetching hashtag ID for #${hashtagName}: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
};

/**
 * Get Media from Hashtag
 */
export const getHashtagMedia = async (accessToken: string, instagramUserId: string, hashtagId: string, type: 'recent' | 'top' = 'recent'): Promise<InstagramMedia[]> => {
  try {
    const endpoint = type === 'recent' ? 'recent_media' : 'top_media';
    const response = await axios.get(`${FACEBOOK_GRAPH_URL}/${hashtagId}/${endpoint}`, {
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
