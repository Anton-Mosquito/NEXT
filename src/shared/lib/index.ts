// src/shared/lib/index.ts

// ✅ classnames утиліта (без clsx/cn залежності)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ✅ Форматування дати
export function formatDate(date: string | Date, locale = "uk-UA"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

// ✅ Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ✅ Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

// ✅ Reading time
export function getReadingTime(text: string, wpm = 200): number {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  if (words === 0) return 0;
  return Math.ceil(words / wpm);
}

// ✅ Type guard
export function isApiError(
  error: unknown,
): error is { data: { message: string } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as any).data?.message === "string"
  );
}

// ✅ RTK Query cache hit rate metrics (dev-only)
export {
  rtkCacheMetricsMiddleware,
  getCacheMetrics,
  resetCacheMetrics,
} from "./rtkCacheMetrics";
export type { CacheMetrics, EndpointMetrics } from "./rtkCacheMetrics";

// NOTE: db.ts (pg pool) is intentionally NOT exported here.
// It uses Node.js-only built-ins and must be imported directly
// in server-side code only: import { query } from "@shared/lib/db"
