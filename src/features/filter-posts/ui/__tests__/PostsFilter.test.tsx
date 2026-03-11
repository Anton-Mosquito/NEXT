// src/features/filter-posts/ui/__tests__/PostsFilter.test.tsx
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { PostsFilter } from "../PostsFilter";
import { selectPostsFilter } from "../../model/filterSlice";

describe("PostsFilter", () => {
  it("рендерить поле пошуку", () => {
    renderWithProviders(<PostsFilter />);
    expect(screen.getByPlaceholderText(/пошук/i)).toBeInTheDocument();
  });

  it("рендерить dropdown для авторів", () => {
    renderWithProviders(<PostsFilter />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it('не показує "Скинути" кнопку якщо нема фільтрів', () => {
    renderWithProviders(<PostsFilter />);
    expect(screen.queryByText(/скинути/i)).not.toBeInTheDocument();
  });

  it('показує "Скинути" та badge при активному фільтрі', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PostsFilter />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "1");

    await waitFor(() => {
      expect(screen.getByText(/скинути/i)).toBeInTheDocument();
      expect(screen.getByText(/фільтр активний/i)).toBeInTheDocument();
    });
  });

  it("dispatch setUserId при виборі в dropdown", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<PostsFilter />);

    await user.selectOptions(screen.getByRole("combobox"), "3");

    await waitFor(() => {
      const state = store.getState();
      expect(selectPostsFilter(state).userId).toBe(3);
    });
  });

  it('dispatch resetFilters при кліку "Скинути"', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<PostsFilter />);

    // Активуємо фільтр
    await user.selectOptions(screen.getByRole("combobox"), "2");

    // Скидаємо
    await waitFor(() => screen.getByText(/скинути/i));
    await user.click(screen.getByText(/скинути/i));

    await waitFor(() => {
      const state = store.getState();
      expect(selectPostsFilter(state).userId).toBeNull();
    });
  });

  it("debounce: search dispatch спрацьовує після затримки", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { store } = renderWithProviders(<PostsFilter />);

    const searchInput = screen.getByPlaceholderText(/пошук/i);
    await user.type(searchInput, "react");

    // До debounce — store ще не оновився
    expect(selectPostsFilter(store.getState()).search).toBe("");

    // Після debounce (400мс)
    act(() => jest.advanceTimersByTime(400));

    await waitFor(() => {
      expect(selectPostsFilter(store.getState()).search).toBe("react");
    });

    jest.useRealTimers();
  });
});
