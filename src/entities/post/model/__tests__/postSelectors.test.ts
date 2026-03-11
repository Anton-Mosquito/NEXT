// src/entities/post/model/__tests__/postSelectors.test.ts
import {
  makeSelectLikesByPost,
  selectLikesStats,
  selectPostsQueryArgs,
  selectHasActiveFilters,
} from "../postSelectors";
import type { RootState } from "@/app/store";

// Мінімальний mock state
const createMockState = (overrides?: Partial<RootState>): RootState =>
  ({
    auth: {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    },
    likes: {
      likes: {
        1: { count: 10, isLiked: false },
        2: { count: 5, isLiked: true },
      },
    },
    postsFilter: {
      search: "",
      userId: null,
      page: 1,
      limit: 5,
    },
    currentPost: { post: null, isHydrated: false },
    api: {} as any,
    ...overrides,
  }) as RootState;

describe("postSelectors", () => {
  describe("makeSelectLikesByPost", () => {
    it("повертає likes для конкретного поста", () => {
      const state = createMockState();
      const selectPost1Likes = makeSelectLikesByPost(1);
      expect(selectPost1Likes(state)).toEqual({ count: 10, isLiked: false });
    });

    it("повертає дефолт для відсутнього поста", () => {
      const state = createMockState();
      const selectPost99Likes = makeSelectLikesByPost(99);
      expect(selectPost99Likes(state)).toEqual({ count: 0, isLiked: false });
    });

    it("✅ МЕМОІЗАЦІЯ: повертає той самий об'єкт при однакових вхідних", () => {
      const state = createMockState();
      const selector = makeSelectLikesByPost(1);

      const result1 = selector(state);
      const result2 = selector(state);

      // toBe перевіряє посилання (не лише значення)
      expect(result1).toBe(result2); // ← Той самий об'єкт!
    });

    it("✅ МЕМОІЗАЦІЯ: різний результат коли дані змінились", () => {
      const state1 = createMockState();
      const state2 = createMockState({
        likes: {
          likes: {
            1: { count: 11, isLiked: true },
            2: { count: 5, isLiked: true },
          },
        },
      } as any);

      const selector = makeSelectLikesByPost(1);
      const result1 = selector(state1);
      const result2 = selector(state2);

      expect(result1).not.toBe(result2); // Різні об'єкти
      expect(result2.count).toBe(11);
    });
  });

  describe("selectLikesStats", () => {
    it("рахує загальну кількість лайків", () => {
      const state = createMockState();
      const stats = selectLikesStats(state);

      expect(stats.total).toBe(15); // 10 + 5
      expect(stats.liked).toBe(1); // тільки пост #2 isLiked
    });

    it("✅ МЕМОІЗАЦІЯ: повертає той самий об'єкт", () => {
      const state = createMockState();
      const result1 = selectLikesStats(state);
      const result2 = selectLikesStats(state);
      expect(result1).toBe(result2);
    });
  });

  describe("selectHasActiveFilters", () => {
    it("false при дефолтних фільтрах", () => {
      const state = createMockState();
      expect(selectHasActiveFilters(state)).toBe(false);
    });

    it("true при активному search", () => {
      const state = createMockState({
        postsFilter: { search: "react", userId: null, page: 1, limit: 5 },
      } as any);
      expect(selectHasActiveFilters(state)).toBe(true);
    });

    it("true при активному userId", () => {
      const state = createMockState({
        postsFilter: { search: "", userId: 3, page: 1, limit: 5 },
      } as any);
      expect(selectHasActiveFilters(state)).toBe(true);
    });
  });

  describe("selectPostsQueryArgs", () => {
    it("конвертує filter state у query args", () => {
      const state = createMockState({
        postsFilter: { search: "test", userId: 2, page: 3, limit: 10 },
      } as any);

      const args = selectPostsQueryArgs(state);
      expect(args).toEqual({
        search: "test",
        userId: 2,
        page: 3,
        limit: 10,
      });
    });

    it("виключає undefined значення", () => {
      const state = createMockState();
      const args = selectPostsQueryArgs(state);

      expect(args.search).toBeUndefined();
      expect(args.userId).toBeUndefined();
    });
  });
});
