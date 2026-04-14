// src/shared/lib/migrations/kysely/003_expense_tables.ts
// Expense Tracker core tables migration.
//
// Creates three tables required for the Expense Tracker MVP:
//
//   financial_account  — user's money accounts (cash, card, crypto wallet)
//   category           — income / expense categories (global, shared across users)
//   transaction        — individual income/expense records
//
// Note: We deliberately named the financial accounts table `financial_account`
// (not `account`) to avoid collision with the Auth.js `account` table created
// in migration 002.
//
// Requires: migration 002 must already be applied (pgcrypto extension needed
// for gen_random_uuid(), `user` table with UUID PK must exist).

import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // ── 1. financial_account ─────────────────────────────────────────────────
  // Represents a user's money account: cash wallet, bank card, crypto wallet.
  await db.schema
    .createTable("financial_account")
    .ifNotExists()
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("balance", sql`numeric(12,2)`, (col) =>
      col.notNull().defaultTo(0),
    )
    .addColumn("currency", "text", (col) => col.notNull().defaultTo("UAH"))
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`),
    )
    .execute();

  // Enforce allowed account types at the DB level.
  await sql`
    ALTER TABLE financial_account
      ADD CONSTRAINT financial_account_type_check
      CHECK (type IN ('cash', 'card', 'crypto'))
  `.execute(db);

  // ── 2. category ──────────────────────────────────────────────────────────
  // Shared expense/income categories (no user_id — global across all users).
  await db.schema
    .createTable("category")
    .ifNotExists()
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("color", "text")
    .addColumn("icon", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`),
    )
    .execute();

  await sql`
    ALTER TABLE category
      ADD CONSTRAINT category_type_check
      CHECK (type IN ('income', 'expense'))
  `.execute(db);

  // ── 3. transaction ───────────────────────────────────────────────────────
  // A single income or expense record tied to an account and a category.
  // account_id uses CASCADE so deleting an account removes its transactions.
  // category_id uses RESTRICT so a category cannot be deleted while it has
  // transactions (forces explicit cleanup first).
  await db.schema
    .createTable("transaction")
    .ifNotExists()
    .addColumn("id", "text", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("user_id", "text", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("account_id", "text", (col) =>
      col.references("financial_account.id").onDelete("cascade").notNull(),
    )
    .addColumn("category_id", "text", (col) =>
      col.references("category.id").onDelete("restrict").notNull(),
    )
    .addColumn("amount", sql`numeric(12,2)`, (col) => col.notNull())
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("date", "timestamptz", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`),
    )
    .execute();

  await sql`
    ALTER TABLE transaction
      ADD CONSTRAINT transaction_type_check
      CHECK (type IN ('income', 'expense'))
  `.execute(db);

  // Index on user_id + date — the most common query pattern for dashboards.
  await sql`
    CREATE INDEX IF NOT EXISTS transaction_user_date_idx
      ON transaction (user_id, date DESC)
  `.execute(db);

  // Index for account-level queries (account statement view).
  await sql`
    CREATE INDEX IF NOT EXISTS transaction_account_idx
      ON transaction (account_id)
  `.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  // Drop in reverse dependency order.
  await db.schema.dropTable("transaction").ifExists().execute();
  await db.schema.dropTable("category").ifExists().execute();
  await db.schema.dropTable("financial_account").ifExists().execute();
}
