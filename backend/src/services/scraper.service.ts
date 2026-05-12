import logger from '../utils/logger';

export interface ScrapedPost {
  instagramPostId: string;
  caption: string;
  mediaUrl: string;
  mediaType: string;
  likesCount: number;
  commentsCount: number;
  postedAt: Date;
  username: string;
}

export const scrapeInstagramData = async (query: string): Promise<ScrapedPost[]> => {
  logger.info(`Iniciando Mock Scrape para: ${query}`);
  
  // Simulating delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Returning mock data
  return [
    {
      instagramPostId: `post_${Math.random().toString(36).substr(2, 9)}`,
      caption: `Dica de marketing para ${query}! #marketing #tendencia`,
      mediaUrl: 'https://example.com/img1.jpg',
      mediaType: 'IMAGE',
      likesCount: 1500,
      commentsCount: 45,
      postedAt: new Date(),
      username: 'expert_marketing'
    },
    {
      instagramPostId: `post_${Math.random().toString(36).substr(2, 9)}`,
      caption: `Como crescer no nicho de ${query} em 2024.`,
      mediaUrl: 'https://example.com/vid1.mp4',
      mediaType: 'VIDEO',
      likesCount: 3200,
      commentsCount: 120,
      postedAt: new Date(),
      username: 'growth_hacker'
    }
  ];
};
