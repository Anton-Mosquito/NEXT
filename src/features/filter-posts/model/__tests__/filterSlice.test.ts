// src/features/filter-posts/model/__tests__/filterSlice.test.ts
import {
  filterSlice,
  setSearch,
  setUserId,
  setPage,
  resetFilters,
} from "../filterSlice";

const reducer = filterSlice.reducer;

describe("filterSlice", () => {
  const initialState = {
    search: "",
    userId: null,
    page: 1,
    limit: 5,
  };

  it("має правильний initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("setSearch", () => {
    it("встановлює пошуковий запит", () => {
      const state = reducer(undefined, setSearch("typescript"));
      expect(state.search).toBe("typescript");
    });

    it("скидає page до 1 при зміні пошуку", () => {
      // Спочатку переходимо на сторінку 3
      let state = reducer(undefined, setPage(3));
      expect(state.page).toBe(3);

      // Пошук має скинути page
      state = reducer(state, setSearch("react"));
      expect(state.page).toBe(1);
    });

    it("приймає порожній рядок", () => {
      let state = reducer(undefined, setSearch("something"));
      state = reducer(state, setSearch(""));
      expect(state.search).toBe("");
    });
  });

  describe("setUserId", () => {
    it("встановлює userId", () => {
      const state = reducer(undefined, setUserId(5));
      expect(state.userId).toBe(5);
    });

    it("приймає null для скидання фільтру", () => {
      let state = reducer(undefined, setUserId(3));
      state = reducer(state, setUserId(null));
      expect(state.userId).toBeNull();
    });

    it("скидає page до 1", () => {
      let state = reducer(undefined, setPage(5));
      state = reducer(state, setUserId(2));
      expect(state.page).toBe(1);
    });
  });

  describe("setPage", () => {
    it("встановлює номер сторінки", () => {
      const state = reducer(undefined, setPage(3));
      expect(state.page).toBe(3);
    });

    it("не впливає на інші фільтри", () => {
      let state = reducer(undefined, setSearch("test"));
      state = reducer(state, setUserId(2));
      state = reducer(state, setPage(4));

      expect(state.search).toBe("test");
      expect(state.userId).toBe(2);
      expect(state.page).toBe(4);
    });
  });

  describe("resetFilters", () => {
    it("скидає всі фільтри до початкових", () => {
      let state = reducer(undefined, setSearch("react"));
      state = reducer(state, setUserId(3));
      state = reducer(state, setPage(5));

      state = reducer(state, resetFilters());

      expect(state).toEqual(initialState);
    });
  });
});
