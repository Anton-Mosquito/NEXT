import React, { PropsWithChildren, type JSX } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type AppStore, type RootState } from "@/app/store";

// Використовуємо Partial<RootState> замість PreloadedState
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Створюємо store окремо, щоб уникнути конфліктів у параметрах
    store = makeStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export async function waitForRtkQuery() {
  // Для RTK Query іноді надійніше використовувати не просто setTimeout,
  // а чекати на завершення активних промісів, але setTimeout(0) — це базовий мінімум.
  await new Promise((resolve) => setTimeout(resolve, 0));
}
