// src/entities/post/model/types.ts
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostWithMeta extends Post {
  excerpt: string;
  readingTimeMin: number;
  wordCount: number;
  createdAt?: string;
}

export type PostsFilter = {
  page?: number;
  limit?: number;
  userId?: number;
  search?: string;
};
