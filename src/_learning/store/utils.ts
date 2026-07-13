// src/app/store/utils.ts
import type { RootState } from "./makeStore";

/**
 * ✅ Серіалізація: Видаляємо RTK Query cache, щоб не передавати
 * величезні об'єми даних від сервера до клієнта через window.__PRELOADED_STATE__
 */
export function serializePreloadedState(
  state: Partial<RootState>,
): Partial<RootState> {
  // Використовуємо деструктуризацію, щоб прибрати api (RTK Query)
  // Назва ключа має збігатися з тим, що ти вказав у combineReducers (baseApi.reducerPath)
  const { api, ...rest } = state as any;
  console.log("🚀 ~ serializePreloadedState ~ api:", api);
  return rest;
}
