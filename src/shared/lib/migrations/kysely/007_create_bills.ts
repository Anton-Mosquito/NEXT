import { type Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("bills_seeded", "boolean", (column) =>
      column.notNull().defaultTo(false),
    )
    .execute();

  await db.schema
    .createTable("bill")
    .ifNotExists()
    .addColumn("id", "text", (column) =>
      column.primaryKey().defaultTo(sql`gen_random_uuid()::text`),
    )
    .addColumn("user_id", "text", (column) =>
      column.references("user.id").onDelete("cascade").notNull(),
    )
    .addColumn("vendor_name", "text", (column) => column.notNull())
    .addColumn("title", "text", (column) => column.notNull())
    .addColumn("description", "text", (column) => column.notNull())
    .addColumn("due_date", "date", (column) => column.notNull())
    .addColumn("last_charge_date", "date")
    .addColumn("amount", sql`numeric(12, 2)`, (column) =>
      column.notNull().check(sql`amount > 0`),
    )
    .addColumn("currency", "text", (column) =>
      column.notNull().defaultTo("USD"),
    )
    .addColumn("status", "text", (column) =>
      column.notNull().defaultTo("unpaid"),
    )
    .addColumn("paid_at", "timestamptz")
    .addColumn("created_at", "timestamptz", (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (column) =>
      column.notNull().defaultTo(sql`now()`),
    )
    .addCheckConstraint("bill_status_check", sql`status IN ('unpaid', 'paid')`)
    .execute();

  await sql`
    CREATE INDEX bill_user_due_date_idx
    ON bill (user_id, due_date ASC)
  `.execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("bill").ifExists().execute();
  await db.schema.alterTable("user").dropColumn("bills_seeded").execute();
}
