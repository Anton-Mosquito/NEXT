// src/entities/post/api/postApi.ts
import { baseApi } from "@shared/api";
import type { Post, PostWithMeta, PostsFilter } from "../model/types";

// ✅ Функція збагачення даних
function enrichPost(post: Post): PostWithMeta {
  const words = post.body.split(" ");
  return {
    ...post,
    excerpt: `${post.body.slice(0, 120)}...`,
    wordCount: words.length,
    readingTimeMin: Math.ceil(words.length / 200),
  };
}

// ✅ injectEndpoints — Post API як частина baseApi
export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- Отримати пости ---
    getPosts: builder.query<PostWithMeta[], PostsFilter | void>({
      query: (filter = {}) => {
        const { page = 1, limit = 10, userId, search } = filter ?? {};
        return {
          url: "/posts",
          params: {
            _page: page,
            _limit: limit,
            ...(userId && { userId }),
            ...(search && { q: search }),
          },
        };
      },
      transformResponse: (posts: Post[]) => posts.map(enrichPost),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),

    // --- Отримати один пост ---
    getPostById: builder.query<PostWithMeta, number>({
      query: (id) => `/posts/${id}`,
      transformResponse: enrichPost,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // --- Пости юзера ---
    getPostsByUser: builder.query<PostWithMeta[], number>({
      query: (userId) => ({ url: "/posts", params: { userId, _limit: 5 } }),
      transformResponse: (posts: Post[]) => posts.map(enrichPost),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: "Post" as const, id })) : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPostsQuery, useGetPostByIdQuery, useGetPostsByUserQuery } =
  postApi;
