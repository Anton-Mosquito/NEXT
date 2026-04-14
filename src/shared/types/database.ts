// src/shared/types/database.ts
// Kysely Database type definitions.
//
// Every table the application touches must have a corresponding interface here.
// Kysely's CamelCasePlugin maps snake_case column names in Postgres to camelCase
// TypeScript properties — so we write camelCase here.
//
// Generated<T> marks columns that the DB fills in automatically (serial / default).
// These can be omitted in INSERT statements.

import type { Generated, ColumnType } from "kysely";

// ---------------------------------------------------------------------------
// Existing application tables
// ---------------------------------------------------------------------------

/**
 * The `user` table — upgraded to be Auth.js-compatible.
 *
 * Auth.js uses text UUIDs for `id` (not serial integers).
 * `name` is nullable because some OAuth providers only supply an email.
 * `emailVerified` and `image` are added by the Auth.js adapter contract.
 * `createdAt` is our own column retained from the original `users` table.
 */
export interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Generated<Date>;
}

// ---------------------------------------------------------------------------
// Auth.js adapter tables
// ---------------------------------------------------------------------------

/**
 * `account` — links an OAuth provider account to a local user row.
 * One user can have multiple linked providers.
 */
export interface AccountTable {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  // OAuth 2.0 token fields (all optional — not every provider supplies each)
  refreshToken: string | null;
  accessToken: string | null;
  /** Unix epoch seconds when the access token expires. */
  expiresAt: number | null;
  tokenType: string | null;
  scope: string | null;
  idToken: string | null;
  sessionState: string | null;
}

/**
 * `session` — database-backed sessions created by Auth.js.
 * Each row represents one active browser session.
 */
export interface SessionTable {
  id: Generated<string>;
  sessionToken: string;
  userId: string;
  expires: ColumnType<Date, Date, Date>;
}

/**
 * `verification_token` — short-lived tokens for email-based sign-in (magic links).
 * The composite PK is (identifier, token).
 */
export interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires: ColumnType<Date, Date, Date>;
}

// ---------------------------------------------------------------------------
// Expense Tracker core tables
// ---------------------------------------------------------------------------

/**
 * `financial_account` — a user's money account (cash, bank card, crypto wallet).
 *
 * Named `financial_account` (not `account`) to avoid collision with the
 * Auth.js `account` table that OAuth provider links are stored in.
 *
 * `balance` is stored as NUMERIC(12,2) in Postgres; Kysely receives it as a
 * string from `pg` — use `parseFloat` / `Number()` when displaying in the UI.
 */
export interface FinancialAccountTable {
  id: Generated<string>;
  userId: string;
  name: string;
  /** 'cash' | 'card' | 'crypto' — enforced by a CHECK constraint */
  type: string;
  /** NUMERIC(12,2) arrives as a string from pg driver */
  balance: ColumnType<string, number | string, number | string>;
  currency: Generated<string>;
  createdAt: Generated<Date>;
}

/**
 * `category` — income or expense label for a transaction.
 *
 * Categories are global (no user_id) — they are shared across all users.
 * `color` stores a CSS hex string (e.g. "#4ade80").
 * `icon`  stores a Lucide icon component name (e.g. "ShoppingCart").
 */
export interface CategoryTable {
  id: Generated<string>;
  name: string;
  /** 'income' | 'expense' — enforced by a CHECK constraint */
  type: string;
  color: string | null;
  icon: string | null;
  createdAt: Generated<Date>;
}

/**
 * `transaction` — a single income or expense record.
 *
 * `amount` is always stored as a positive NUMERIC(12,2); the `type` column
 * ('income' | 'expense') indicates the direction.
 *
 * FK to `financial_account` uses CASCADE (delete account → lose its transactions).
 * FK to `category` uses RESTRICT (prevent deleting a category with transactions).
 */
export interface TransactionTable {
  id: Generated<string>;
  userId: string;
  accountId: string;
  categoryId: string;
  /** NUMERIC(12,2) arrives as a string from pg driver */
  amount: ColumnType<string, number | string, number | string>;
  /** 'income' | 'expense' — enforced by a CHECK constraint */
  type: string;
  date: Date;
  description: string | null;
  createdAt: Generated<Date>;
}

// ---------------------------------------------------------------------------
// Root Database interface — used everywhere Kysely is typed
// ---------------------------------------------------------------------------

/**
 * Maps table names (as written in SQL) to their row interfaces.
 *
 * Note: CamelCasePlugin converts `snake_case` SQL names to camelCase at
 * runtime, but Kysely's type system uses the camelCase key here directly.
 * The physical table names in SQL are snake_case (e.g. `verification_token`),
 * but when referenced in Kysely query builders we use camelCase
 * (`verificationToken`) because the plugin intercepts the name conversion.
 */
export interface Database {
  user: UserTable;
  account: AccountTable;
  session: SessionTable;
  verificationToken: VerificationTokenTable;
  // Expense Tracker tables
  financialAccount: FinancialAccountTable;
  category: CategoryTable;
  transaction: TransactionTable;
}
