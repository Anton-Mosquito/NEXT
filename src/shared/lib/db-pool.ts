// src/shared/lib/db-pool.ts
// Node-safe pg.Pool singleton — no Next.js / server-only dependency.
// Imported by migration scripts (tsx) and by db.ts (Next.js server context).
//
// db.ts adds the `server-only` guard on top of this module so that
// Client Components cannot accidentally import the pool.
import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sslUrl = url.replace(/sslmode=require/g, "sslmode=verify-full");
  const ssl = url.includes("sslmode=")
    ? { rejectUnauthorized: false }
    : undefined;

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
