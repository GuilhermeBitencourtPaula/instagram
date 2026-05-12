export interface Tag {
  id: number;
  name: string;
}

export interface AiInsight {
  id: number;
  summary: string;
  detectedTrends: string;
  suggestedNiche: string;
  viralPatterns: string;
  createdAt: string;
}

export interface InstagramProfile {
  id: number;
  username: string;
  fullName?: string;
  profilePicUrl?: string;
  followersCount: number;
  postsCount: number;
}

export interface InstagramPost {
  id: number;
  instagramPostId: string;
  caption?: string;
  mediaUrl?: string;
  mediaType: string;
  likesCount: number;
  commentsCount: number;
  postedAt: string;
}

export interface Search {
  id: number;
  query: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  tags: Tag[];
  insights: AiInsight[];
  posts: InstagramPost[];
}
