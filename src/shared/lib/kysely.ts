// src/shared/lib/kysely.ts
// Kysely database instance — wraps the existing pg.Pool singleton so we keep
// a single connection pool across both raw pg queries and Kysely query builder.
//
// CamelCasePlugin automatically converts camelCase TypeScript property names
// to snake_case SQL column names (and back), matching our Postgres schema.
//
// The global singleton pattern prevents connection pool exhaustion during
// Next.js HMR development reloads — identical to the pattern in db.ts.

import "server-only";
import { Kysely, PostgresDialect, CamelCasePlugin } from "kysely";
import { pool } from "./db";
import type { Database } from "@/shared/types/database";

declare global {
  var _kyselyDb: Kysely<Database> | undefined;
}

function createKysely(): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      // Reuse the existing Pool — no extra connections consumed.
      pool,
    }),
    plugins: [
      // Maps camelCase ↔ snake_case so TypeScript and SQL stay in sync.
      new CamelCasePlugin(),
    ],
  });
}

// In development, reuse across HMR reloads.
// In production, create a fresh instance per server process.
export const db: Kysely<Database> =
  process.env.NODE_ENV === "production"
    ? createKysely()
    : (globalThis._kyselyDb ??= createKysely());
