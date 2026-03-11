// src/shared/api/baseQuery.ts
import {
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { API_CONFIG } from "@/shared/config";
import { logout, setCredentials } from "@/entities/auth";

// Базовий fetcher
export const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Безпечне отримання токену — store може не мати auth слайс
    const state = getState() as RootState;
    const token = state.auth?.accessToken;

    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ============================================================
// 🔄 Функція refresh token (симуляція)
// ============================================================
async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    // В реальному проекті це запит до твого auth сервера
    // Ми симулюємо затримку та успішну відповідь
    await new Promise((r) => setTimeout(r, 300));

    // Симуляція: завжди повертаємо новий токен
    return `refreshed-token-${Date.now()}`;
  } catch {
    return null;
  }
}

// BaseQuery з auth refresh
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.log("🔄 [Auth] Access token expired, refreshing...");

    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      console.log("❌ [Auth] No refresh token, logging out");
      api.dispatch(logout());
      return result;
    }

    // Намагаємось оновити токен
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      // Зберігаємо новий токен
      api.dispatch(
        setCredentials({
          user: state.auth.user!,
          accessToken: newAccessToken,
          refreshToken,
        }),
      );

      console.log("✅ [Auth] Token refreshed, retrying request...");

      // Повторюємо оригінальний запит з новим токеном
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh провалився — розлогінюємо
      console.log("❌ [Auth] Token refresh failed, logging out");
      api.dispatch(logout());
    }
  }

  return result;
};
