// src/shared/lib/json.ts

// ✅ Утиліта для безпечного парсингу JSON
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// ✅ Валідація на серіалізацію
export function isSerializable(value: unknown): boolean {
  if (value === null || typeof value === "undefined") return true;
  if (typeof value === "function" || value instanceof Date) return false;
  if (typeof value !== "object") return true;
  return Object.values(value as object).every(isSerializable);
}
