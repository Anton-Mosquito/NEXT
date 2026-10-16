import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("savings_goal")
    .addColumn("id", "text", (column) =>
      column.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("user_id", "text", (column) =>
      column.references("user.id").onDelete("cascade").notNull().unique(),
    )
    .addColumn("monthly_target", sql`numeric(12, 2)`, (column) =>
      column.notNull().check(sql`monthly_target > 0`),
    )
    .addColumn("created_at", "timestamptz", (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("savings_goal").ifExists().execute();
}
