// src/shared/lib/db.ts
// pg.Pool singleton — reused across Next.js HMR reloads in development
// to prevent connection exhaustion.
//
// "server-only" guard: importing this module in a Client Component will
// throw a build-time error, making the mistake impossible to miss.
import "server-only";
import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Enable SSL for cloud databases (sslmode=require in the URL).
  // We switch to sslmode=verify-full in the URL to adopt the stricter semantics
  // that pg v9 will enforce by default, which silences the deprecation warning.
  const sslUrl = url.replace(
    /sslmode=require/g,
    "sslmode=verify-full",
  );
  const ssl = url.includes("sslmode=") ? { rejectUnauthorized: false } : undefined;

  return new Pool({
    connectionString: sslUrl,
    ssl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

// In development, attach the pool to globalThis so it survives HMR.
// In production, always create a fresh pool per server instance.
export const pool: Pool =
  process.env.NODE_ENV === "production"
    ? createPool()
    : (globalThis._pgPool ??= createPool());

/**
 * Execute a parameterized SQL query.
 *
 * SECURITY: Always use $1, $2, ... placeholders for user-supplied values.
 * Never interpolate values directly into the query string.
 *
 * @example
 *   await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}
