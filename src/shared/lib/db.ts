// src/shared/lib/db.ts
// Next.js server-only entry-point for the pg.Pool singleton.
//
// The `server-only` guard makes it a build-time error to import this module
// from a Client Component. All pool logic lives in db-pool.ts so that plain
// Node scripts (tsx migrations, seeds) can import it without triggering the guard.
import "server-only";
export { pool, query } from "./db-pool";
