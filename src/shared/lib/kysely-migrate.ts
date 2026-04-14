// src/shared/lib/kysely-migrate.ts
// Kysely migration runner using the official Migrator + FileMigrationProvider.
//
// IMPORTANT: This script creates its own Kysely + pg.Pool instance directly
// (instead of importing from kysely.ts) to avoid the `server-only` guard,
// which throws when imported outside of a Next.js Server Component context.
//
// Usage:
//   npm run db:migrate:kysely          (run all pending migrations)
//   npx tsx --env-file=.env.local src/shared/lib/kysely-migrate.ts

import * as path from "path";
import * as fsSync from "fs";
import { Kysely, PostgresDialect, CamelCasePlugin, Migrator, FileMigrationProvider } from "kysely";
import { Pool } from "pg";
import type { Database } from "@/shared/types/database";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const sslUrl = url.replace(/sslmode=require/g, "sslmode=verify-full");
const ssl = url.includes("sslmode=") ? { rejectUnauthorized: false } : undefined;

const pool = new Pool({ connectionString: sslUrl, ssl });

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

async function migrate() {
  const migrationsDir = path.join(__dirname, "migrations", "kysely");

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs: {
        readdir: async (dirPath: string): Promise<string[]> => {
          const entries = await fsSync.promises.readdir(dirPath);
          return entries as string[];
        },
      },
      path,
      migrationFolder: migrationsDir,
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  for (const result of results ?? []) {
    if (result.status === "Success") {
      console.log(`  ✅ ${result.migrationName} — applied`);
    } else if (result.status === "Error") {
      console.error(`  ❌ ${result.migrationName} — failed`);
    }
  }

  if (error) {
    console.error("Migration failed:", error);
    await db.destroy();
    process.exit(1);
  }

  if (!results || results.length === 0) {
    console.log("  ℹ️  No pending migrations.");
  }

  console.log("✅ Kysely migrations complete");
  await db.destroy();
}

migrate().catch((err) => {
  console.error("❌ Migration runner failed:", err);
  process.exit(1);
});


