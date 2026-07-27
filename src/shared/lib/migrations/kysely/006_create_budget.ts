import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE TABLE budget (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      category_id TEXT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
      amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
      month TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, category_id, month)
    );
  `.execute(db);

  await sql`
    CREATE INDEX budget_user_id_month_index ON budget(user_id, month);
  `.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TABLE budget;`.execute(db);
}
