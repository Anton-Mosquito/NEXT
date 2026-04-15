// src/shared/lib/migrations/kysely/002_auth_tables.ts
// Auth.js adapter migration — extends the existing `users` table and adds
// the three tables required by @auth/kysely-adapter:
//
//   account            — links an OAuth provider account to a local user
//   session            — database-backed active sessions
//   verification_token — short-lived tokens for email magic-link sign-in
//
// This migration also renames `users` → `user` to match the Auth.js adapter
// convention, converts the primary key from SERIAL (integer) to TEXT (UUID),
// and adds the `email_verified` and `image` columns.
//
// The `down()` function reverses every step so the migration is fully
// reversible during development.

import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // 1. Enable pgcrypto for gen_random_uuid() — idempotent.
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(db);

  // 2. Rename the existing table from the legacy name to the Auth.js name.
  await sql`ALTER TABLE IF EXISTS users RENAME TO "user"`.execute(db);

  // 3. Add new columns required by Auth.js to the `user` table.
  await db.schema
    .alterTable("user")
    .addColumn("email_verified", "timestamptz")
    .execute();

  await db.schema.alterTable("user").addColumn("image", "text").execute();

  // 4. Make `name` nullable — OAuth providers may not supply a name.
  await sql`ALTER TABLE "user" ALTER COLUMN name DROP NOT NULL`.execute(db);

  // 5. Migrate the primary key from SERIAL integer → TEXT UUID.
  //    a) Add a new column with a UUID default.
  await sql`ALTER TABLE "user" ADD COLUMN new_id TEXT NOT NULL DEFAULT gen_random_uuid()::text`.execute(
    db,
  );

  //    b) Drop the old integer PK constraint (try both possible names).
  await sql`ALTER TABLE "user" DROP CONSTRAINT IF EXISTS users_pkey`.execute(
    db,
  );
  await sql`ALTER TABLE "user" DROP CONSTRAINT IF EXISTS user_pkey`.execute(db);

  //    c) Drop the old serial id column.
  await sql`ALTER TABLE "user" DROP COLUMN id`.execute(db);

  //    d) Rename new_id → id and declare it the primary key.
  await sql`ALTER TABLE "user" RENAME COLUMN new_id TO id`.execute(db);
  await sql`ALTER TABLE "user" ADD PRIMARY KEY (id)`.execute(db);

  // 6. Create the `account` table.
  await db.schema
    .createTable("account")
    .ifNotExists()
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("provider_account_id", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "integer")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .execute();

  // 7. Create the `session` table.
  await db.schema
    .createTable("session")
    .ifNotExists()
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("session_token", "text", (col) => col.notNull().unique())
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  // 8. Create the `verification_token` table.
  await db.schema
    .createTable("verification_token")
    .ifNotExists()
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .addPrimaryKeyConstraint("verification_token_pkey", ["identifier", "token"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  // Reverse order of `up`.
  await db.schema.dropTable("verification_token").ifExists().execute();
  await db.schema.dropTable("session").ifExists().execute();
  await db.schema.dropTable("account").ifExists().execute();

  // Restore integer PK on `user`.
  await sql`ALTER TABLE "user" DROP COLUMN id`.execute(db);
  await sql`ALTER TABLE "user" ADD COLUMN id SERIAL PRIMARY KEY`.execute(db);

  // Remove the Auth.js columns.
  await db.schema.alterTable("user").dropColumn("image").execute();
  await db.schema.alterTable("user").dropColumn("email_verified").execute();

  // Restore NOT NULL on name.
  await sql`ALTER TABLE "user" ALTER COLUMN name SET NOT NULL`.execute(db);

  // Rename back to legacy name.
  await sql`ALTER TABLE "user" RENAME TO users`.execute(db);
}
