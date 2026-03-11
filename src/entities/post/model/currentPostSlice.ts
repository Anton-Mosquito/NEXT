// src/entities/post/model/currentPostSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { PostWithMeta } from "./types";

interface CurrentPostState {
  post: PostWithMeta | null;
  isHydrated: boolean; // чи було ініціалізовано з сервера
}

const initialState: CurrentPostState = {
  post: null,
  isHydrated: false,
};

export const currentPostSlice = createSlice({
  name: "currentPost",
  initialState,
  reducers: {
    // ✅ Action для ініціалізації з серверних даних
    initializePost: (state, action: PayloadAction<PostWithMeta>) => {
      state.post = action.payload;
      state.isHydrated = true;
    },
    clearCurrentPost: (state) => {
      state.post = null;
      state.isHydrated = false;
    },
  },
});

export const { initializePost, clearCurrentPost } = currentPostSlice.actions;

export const selectCurrentPost = (state: RootState) =>
  state.currentPost?.post ?? null;
export const selectCurrentPostHydrated = (state: RootState) =>
  state.currentPost?.isHydrated ?? false;
