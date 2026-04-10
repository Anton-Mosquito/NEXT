// src/shared/config/index.ts
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ?? "https://jsonplaceholder.typicode.com",
  TIMEOUT: 10_000,
  RETRY_COUNT: 3,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const CACHE = {
  // Час у секундах до видалення незаписаного кешу
  DEFAULT_KEEP_UNUSED_DATA: 60,
  // Час у секундах після якого дані вважаються застарілими
  STALE_TIME: 30,
} as const;
