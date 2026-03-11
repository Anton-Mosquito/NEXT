// src/entities/post/model/postSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { getReadingTime } from "@/shared/lib";

// ============================================================
// Base selectors (прості, без обчислень)
// ============================================================
const selectPostsState = (state: RootState) => state.api;

// ============================================================
// ✅ Мемоізовані selectors через createSelector
// ============================================================

// Selector з параметром — використовуємо factory pattern
export const makeSelectLikesByPost = (postId: number) =>
  createSelector(
    (state: RootState) => state.likes.likes,
    (likes) => likes[postId] ?? { count: 0, isLiked: false },
  );

// Агрегований selector — статистика по лайках
export const selectLikesStats = createSelector(
  (state: RootState) => state.likes.likes,
  (likes) => {
    const entries = Object.values(likes);
    const total = entries.reduce((sum, l) => sum + l.count, 0);
    const liked = entries.filter((l) => l.isLiked).length;
    return { total, liked, unliked: entries.length - liked };
  },
);

// Selector для фільтра → query об'єкт
export const selectPostsQueryArgs = createSelector(
  (state: RootState) => state.postsFilter,
  (filter) => ({
    page: filter.page,
    limit: filter.limit,
    userId: filter.userId ?? undefined,
    search: filter.search || undefined,
  }),
);

// Selector що перевіряє чи є активні фільтри
export const selectHasActiveFilters = createSelector(
  (state: RootState) => state.postsFilter,
  (filter) =>
    Boolean(filter.search) || filter.userId !== null || filter.page > 1,
);

// Selector для auth summary
export const selectAuthSummary = createSelector(
  (state: RootState) => state.auth,
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    userName: auth.user?.name ?? "Гість",
    userRole: auth.user?.role ?? null,
    hasToken: Boolean(auth.accessToken),
  }),
);
