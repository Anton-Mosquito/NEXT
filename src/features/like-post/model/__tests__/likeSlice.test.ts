// src/features/like-post/model/__tests__/likeSlice.test.ts
import { likeSlice, toggleLike } from "../likeSlice";

const reducer = likeSlice.reducer;

describe("likeSlice", () => {
  describe("toggleLike", () => {
    it("ініціалізує лайки для нового поста", () => {
      // Пост #999 — немає в initial state
      const state = reducer(undefined, toggleLike(999));

      expect(state.likes[999]).toBeDefined();
      expect(state.likes[999].isLiked).toBe(true);
      expect(state.likes[999].count).toBe(1);
    });

    it("перемикає isLiked true → false", () => {
      let state = reducer(undefined, toggleLike(999));
      expect(state.likes[999].isLiked).toBe(true);

      state = reducer(state, toggleLike(999));
      expect(state.likes[999].isLiked).toBe(false);
    });

    it("збільшує count при лайку", () => {
      const state = reducer(undefined, toggleLike(999));
      expect(state.likes[999].count).toBe(1);
    });

    it("зменшує count при анлайку", () => {
      let state = reducer(undefined, toggleLike(999)); // +1
      state = reducer(state, toggleLike(999)); // -1

      expect(state.likes[999].count).toBe(0);
    });

    it("не впливає на інші пости", () => {
      let state = reducer(undefined, toggleLike(1));
      const initialPost2 = state.likes[2];

      state = reducer(state, toggleLike(1));

      // Пост #2 не змінився
      expect(state.likes[2]).toEqual(initialPost2);
    });

    it("не має від'ємного count", () => {
      // Антилайк від нуля
      const state = reducer(undefined, toggleLike(999)); // isLiked: true, count: 1
      const state2 = reducer(state, toggleLike(999)); // isLiked: false, count: 0
      const state3 = reducer(state2, toggleLike(999)); // isLiked: true, count: 1

      expect(state3.likes[999].count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("initial state", () => {
    it("генерує початкові лайки для постів 1-20", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      // Перевіряємо що пости 1-20 мають початкові лайки
      for (let i = 1; i <= 20; i++) {
        expect(state.likes[i]).toBeDefined();
        expect(state.likes[i].isLiked).toBe(false);
        expect(state.likes[i].count).toBeGreaterThanOrEqual(0);
        expect(state.likes[i].count).toBeLessThan(100);
      }
    });
  });
});
