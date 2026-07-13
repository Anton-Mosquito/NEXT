// src/app/store/serverStore.ts
// ✅ Server-side store utilities
// Ці функції БЕЗПЕЧНІ для використання у Server Components

import { makeStore } from "./makeStore";
import type { RootState } from "./makeStore";

// ✅ Створює ephemeral store для server-side операцій
// НЕ зберігається між запитами!
export function createServerStore(preloadedState?: Partial<RootState>) {
  // Кожен виклик = новий store instance
  // Безпечно для concurrent requests!
  return makeStore(preloadedState);
}

// ✅ Отримати initial state для конкретної сторінки
// Використовується у Server Components
export async function getInitialPageState(
  fetchFn: () => Promise<Partial<RootState>>,
): Promise<Partial<RootState>> {
  const serverData = await fetchFn();
  // Серіалізуємо (видаляємо non-serializable values)
  return JSON.parse(JSON.stringify(serverData)) as Partial<RootState>;
}
