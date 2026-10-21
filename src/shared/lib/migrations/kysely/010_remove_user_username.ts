import { type Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("user_username_unique").ifExists().execute();
  await db.schema.alterTable("user").dropColumn("username").execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("username", "varchar(30)")
    .execute();

  await db.schema
    .createIndex("user_username_unique")
    .unique()
    .on("user")
    .column("username")
    .execute();
}
