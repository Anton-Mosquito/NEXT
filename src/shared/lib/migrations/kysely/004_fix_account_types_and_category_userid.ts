import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // Step A — financial_account type constraint
  await sql`
    ALTER TABLE financial_account
      DROP CONSTRAINT IF EXISTS financial_account_type_check
  `.execute(db);

  await sql`
    ALTER TABLE financial_account
      ADD CONSTRAINT financial_account_type_check
      CHECK (type IN ('cash', 'card', 'savings', 'crypto'))
  `.execute(db);

  // Fetch an existing user to use as the default to satisfy the foreign key constraint
  const user = await sql<{ id: string }>`SELECT id FROM "user" LIMIT 1`.execute(db);
  const defaultUserId = user.rows[0]?.id || "";

  // Step B — category user_id
  await db.schema
    .alterTable("category")
    .addColumn("user_id", "text", (col) => col.notNull().defaultTo(defaultUserId))
    .execute();

  await db.schema
    .alterTable("category")
    .addForeignKeyConstraint("category_user_id_fk", ["user_id"], "user", ["id"])
    .onDelete("cascade")
    .execute();

  await db.schema
    .alterTable("category")
    .alterColumn("user_id", (col) => col.dropDefault())
    .execute();

  await db.schema
    .createIndex("category_user_id_index")
    .on("category")
    .column("user_id")
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  // Reverse Step B
  await db.schema.dropIndex("category_user_id_index").execute();
  await db.schema
    .alterTable("category")
    .dropConstraint("category_user_id_fk")
    .execute();
  await db.schema.alterTable("category").dropColumn("user_id").execute();

  // Reverse Step A
  await sql`
    ALTER TABLE financial_account
      DROP CONSTRAINT IF EXISTS financial_account_type_check
  `.execute(db);

  await sql`
    ALTER TABLE financial_account
      ADD CONSTRAINT financial_account_type_check
      CHECK (type IN ('cash', 'card', 'crypto'))
  `.execute(db);
}
