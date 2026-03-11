// src/entities/post/model/__tests__/currentPostSlice.test.ts
import {
  currentPostSlice,
  initializePost,
  clearCurrentPost,
} from "../currentPostSlice";
import type { PostWithMeta } from "../types";

// ✅ Тестуємо reducer як чисту функцію
const reducer = currentPostSlice.reducer;

// Фікстура тестового поста
const mockPost: PostWithMeta = {
  id: 1,
  userId: 1,
  title: "Test Post Title",
  body: "Test post body content that is long enough",
  excerpt: "Test post body...",
  wordCount: 8,
  readingTimeMin: 1,
};

describe("currentPostSlice", () => {
  // ============================================================
  // Initial State
  // ============================================================
  describe("initial state", () => {
    it("має правильний початковий стан", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        post: null,
        isHydrated: false,
      });
    });
  });

  // ============================================================
  // initializePost action
  // ============================================================
  describe("initializePost", () => {
    it("встановлює пост і isHydrated = true", () => {
      const state = reducer(undefined, initializePost(mockPost));

      expect(state.post).toEqual(mockPost);
      expect(state.isHydrated).toBe(true);
    });

    it("замінює існуючий пост", () => {
      const anotherPost = { ...mockPost, id: 2, title: "Another Post" };
      let state = reducer(undefined, initializePost(mockPost));
      state = reducer(state, initializePost(anotherPost));

      expect(state.post?.id).toBe(2);
      expect(state.post?.title).toBe("Another Post");
    });

    it("зберігає всі поля PostWithMeta", () => {
      const state = reducer(undefined, initializePost(mockPost));

      expect(state.post?.excerpt).toBe(mockPost.excerpt);
      expect(state.post?.wordCount).toBe(mockPost.wordCount);
      expect(state.post?.readingTimeMin).toBe(mockPost.readingTimeMin);
    });
  });

  // ============================================================
  // clearCurrentPost action
  // ============================================================
  describe("clearCurrentPost", () => {
    it("очищає пост та скидає isHydrated", () => {
      // Спочатку ініціалізуємо
      let state = reducer(undefined, initializePost(mockPost));
      expect(state.post).not.toBeNull();

      // Потім очищаємо
      state = reducer(state, clearCurrentPost());
      expect(state.post).toBeNull();
      expect(state.isHydrated).toBe(false);
    });

    it("безпечний на порожньому стані", () => {
      const state = reducer(undefined, clearCurrentPost());
      expect(state.post).toBeNull();
      expect(state.isHydrated).toBe(false);
    });
  });
});
