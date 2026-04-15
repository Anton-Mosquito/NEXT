// src/features/create-post/api/createPostApi.ts
import { baseApi } from "@/shared/api";
import type { Post, PostWithMeta } from "@/entities/post";

// ✅ Feature додає свої mutation endpoints до baseApi
export const createPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<Post, Omit<Post, "id">>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation<Post, Partial<PostWithMeta> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreatePostMutation, useUpdatePostMutation } = createPostApi;
