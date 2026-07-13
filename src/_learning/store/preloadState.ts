// src/app/store/preloadState.ts
import type { RootState } from "./makeStore";
import type { AuthUser } from "@/entities/auth";

interface ServerContext {
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  // ✅ Приймаємо вже готовий RTK Query стан зі store.getState(),
  //    замість ручної реконструкції з неправильними ключами кешу
  apiState?: RootState["api"];
}

export function buildPreloadedState(
  context: ServerContext,
): Partial<RootState> {
  const state: Partial<RootState> = {
    auth: {
      user: context.user ?? null,
      isAuthenticated: !!context.user,
      accessToken: context.accessToken ?? null,
      refreshToken: context.refreshToken ?? null,
    },
  };

  // ✅ RTK Query стан вже містить правильні ключі кешу та всі обов'язкові
  //    поля (requestId, requestStatus, originalArgs тощо) — беремо напряму
  if (context.apiState) {
    state.api = context.apiState;
  }

  return state;
}
