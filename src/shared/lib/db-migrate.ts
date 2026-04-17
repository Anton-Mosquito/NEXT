// src/shared/lib/db-migrate.ts
// Simple migration runner — reads .sql files from ./migrations/ and runs them
// in alphabetical order.  Safe to re-run: all DDL uses IF NOT EXISTS.
//
// Usage:
//   npx tsx src/shared/lib/db-migrate.ts
//   npm run db:migrate

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { pool } from "./db-pool";

async function migrate() {
  const migrationsDir = join(__dirname, "migrations");

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Running ${files.length} migration(s)...`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    console.log(`  → ${file}`);
    await pool.query(sql);
  }

  console.log("✅ Migrations complete");
  await pool.end();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
