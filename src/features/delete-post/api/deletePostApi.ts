// src/features/delete-post/api/deletePostApi.ts
import { baseApi } from "@/shared/api";

export const deletePostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deletePost: builder.mutation<void, number>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      // Optimistic: видаляємо з кешу одразу
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          (baseApi.util as any).updateQueryData(
            "getPosts",
            undefined,
            (draft: any) => {
              const index = draft.findIndex((p: any) => p.id === id);
              if (index !== -1) draft.splice(index, 1);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useDeletePostMutation } = deletePostApi;
