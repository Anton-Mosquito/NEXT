// src/shared/lib/rtkCacheMetrics.ts
// ✅ Вимірювання RTK Query cache hit rate через кастомний middleware
// Підраховує queryFulfilled (мережеві запити) vs cacheHit (данні з кешу)
// Dev-only — не включається в production bundle

import type { Middleware, UnknownAction } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface EndpointMetrics {
  /** Реальні мережеві запити (queryFulfilled) */
  fetches: number;
  /** Повернуто з кешу без запиту (cacheHit) */
  hits: number;
}

export interface CacheMetrics {
  /** Загальна кількість викликів query (hits + fetches) */
  totalQueries: number;
  /** Кількість cache hit-ів (дані повернуто з кешу) */
  cacheHits: number;
  /** Кількість реальних мережевих запитів (queryFulfilled) */
  networkFetches: number;
  /** Hit rate у відсотках (0–100), або null якщо запитів ще не було */
  hitRate: number | null;
  /** Метрики в розрізі кожного endpoint-у */
  perEndpoint: Record<string, EndpointMetrics>;
}

// ─────────────────────────────────────────────
// In-memory store (module-level, не Redux state)
// Уникаємо dispatch з middleware → немає infinite loop
// ─────────────────────────────────────────────

const _metrics: CacheMetrics = {
  totalQueries: 0,
  cacheHits: 0,
  networkFetches: 0,
  hitRate: null,
  perEndpoint: {},
};

/** Порог логування — виводить summary кожні N запитів */
const LOG_EVERY_N = 10;

// ─────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────

function _recalcHitRate(): void {
  _metrics.hitRate =
    _metrics.totalQueries === 0
      ? null
      : Math.round((_metrics.cacheHits / _metrics.totalQueries) * 100);
}

function _logSummary(): void {
  const { totalQueries, cacheHits, networkFetches, hitRate, perEndpoint } =
    _metrics;

  console.groupCollapsed(
    `📊 [RTK Cache] ${totalQueries} queries | ` +
      `Hit rate: ${hitRate ?? 0}% ` +
      `(${cacheHits} hits / ${networkFetches} fetches)`,
  );

  if (Object.keys(perEndpoint).length > 0) {
    console.table(
      Object.fromEntries(
        Object.entries(perEndpoint).map(([name, m]) => [
          name,
          {
            fetches: m.fetches,
            hits: m.hits,
            total: m.fetches + m.hits,
            "hit rate %": Math.round((m.hits / (m.fetches + m.hits)) * 100),
          },
        ]),
      ),
    );
  }

  console.groupEnd();
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

/**
 * Кастомний Redux middleware для вимірювання RTK Query cache hit rate.
 *
 * Перехоплює `<reducerPath>/executeQuery/fulfilled` actions:
 * - `action.meta.condition === true`  → cache hit  (RTK Query повернув дані без запиту)
 * - `action.meta.condition !== true`  → queryFulfilled (мережевий запит виконано)
 *
 * @example
 * // В makeStore.ts:
 * middleware: (getDefaultMiddleware) =>
 *   getDefaultMiddleware().concat(baseApi.middleware, rtkCacheMetricsMiddleware)
 */
export const rtkCacheMetricsMiddleware: Middleware =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_api) => (next) => (action) => {
    if (process.env.NODE_ENV !== "production") {
      const a = action as UnknownAction & {
        meta?: { condition?: boolean; arg?: { endpointName?: string } };
      };

      // RTK Query dispatches `<reducerPath>/executeQuery/fulfilled`
      // Приклад типу: "api/executeQuery/fulfilled"
      if (
        typeof a.type === "string" &&
        a.type.endsWith("/executeQuery/fulfilled") &&
        a.meta !== undefined
      ) {
        const isCacheHit = a.meta.condition === true;
        const endpointName = a.meta.arg?.endpointName ?? "unknown";

        // Оновлюємо глобальні лічильники
        _metrics.totalQueries += 1;
        if (isCacheHit) {
          _metrics.cacheHits += 1;
        } else {
          _metrics.networkFetches += 1;
        }

        // Оновлюємо per-endpoint лічильники
        if (!_metrics.perEndpoint[endpointName]) {
          _metrics.perEndpoint[endpointName] = { fetches: 0, hits: 0 };
        }
        if (isCacheHit) {
          _metrics.perEndpoint[endpointName].hits += 1;
        } else {
          _metrics.perEndpoint[endpointName].fetches += 1;
        }

        _recalcHitRate();

        // Детальний лог кожного запиту у verbose режимі
        console.debug(
          `🗂️ [RTK Cache] ${isCacheHit ? "✅ HIT " : "🌐 FETCH"} ` +
            `endpoint="${endpointName}" | ` +
            `hit rate=${_metrics.hitRate ?? 0}% ` +
            `(${_metrics.cacheHits}/${_metrics.totalQueries})`,
        );

        // Summary-лог кожні LOG_EVERY_N запитів
        if (_metrics.totalQueries % LOG_EVERY_N === 0) {
          _logSummary();
        }
      }
    }

    return next(action);
  };

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * Повертає поточний snapshot метрик кешу.
 * Безпечно викликати з будь-якого місця (не залежить від React/Redux).
 *
 * @example
 * // В browser console (dev):
 * import { getCacheMetrics } from '@/shared/lib/rtkCacheMetrics'
 * console.table(getCacheMetrics().perEndpoint)
 */
export function getCacheMetrics(): Readonly<CacheMetrics> {
  return { ..._metrics, perEndpoint: { ..._metrics.perEndpoint } };
}

/**
 * Скидає всі лічильники до початкового стану.
 * Корисно в тестах або при ручному дебагу.
 */
export function resetCacheMetrics(): void {
  _metrics.totalQueries = 0;
  _metrics.cacheHits = 0;
  _metrics.networkFetches = 0;
  _metrics.hitRate = null;
  _metrics.perEndpoint = {};
}

// ─────────────────────────────────────────────
// Dev convenience: expose metrics on window for browser console access
// ─────────────────────────────────────────────

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (
    window as unknown as {
      __rtkCacheMetrics?: {
        get: typeof getCacheMetrics;
        reset: typeof resetCacheMetrics;
      };
    }
  ).__rtkCacheMetrics = {
    get: getCacheMetrics,
    reset: resetCacheMetrics,
  };
}
