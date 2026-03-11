// src/features/like-post/model/likeSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface LikeState {
  // { [postId]: { count: number, isLiked: boolean } }
  likes: Record<number, { count: number; isLiked: boolean }>;
}

// Детерміновано генеруємо початкові лайки на основі postId.
// Math.random() не можна використовувати — він дає різні значення
// на сервері та клієнті, що спричиняє Hydration mismatch.
const deterministicCount = (id: number) => ((id * 37 + 13) * 7) % 100;

const generateInitialLikes = () => {
  const likes: LikeState["likes"] = {};
  for (let i = 1; i <= 20; i++) {
    likes[i] = { count: deterministicCount(i), isLiked: false };
  }
  return likes;
};

const initialState: LikeState = {
  likes: generateInitialLikes(),
};

export const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      if (!state.likes[postId]) {
        state.likes[postId] = { count: 0, isLiked: false };
      }
      const like = state.likes[postId];
      like.isLiked = !like.isLiked;
      like.count += like.isLiked ? 1 : -1;
    },
  },
});

export const { toggleLike } = likeSlice.actions;

// Stable fallback — prevents new object creation when postId has no entry yet.
// Using a constant avoids breaking reference-equality checks in useAppSelector.
const DEFAULT_LIKES = { count: 0, isLiked: false } as const;

// Plain selector factory — no createSelector needed because there is no
// transformation to memoize. The selector is created inside useAppSelector
// on every render, so a createSelector instance would be recreated each
// time and lose its cache anyway; a plain function is correct and faster.
export const selectPostLikes =
  (postId: number) =>
  (state: RootState): { count: number; isLiked: boolean } =>
    state.likes.likes[postId] ?? DEFAULT_LIKES;
