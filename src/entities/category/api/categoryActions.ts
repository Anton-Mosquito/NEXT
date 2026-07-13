// src/entities/category/api/categoryActions.ts
"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

/**
 * Retrieves categories, optionally filtered by type.
 * Note: Categories are global (no userId), so no userId filter is applied.
 */
export async function getCategories(type?: "income" | "expense") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  let query = db.selectFrom("category").selectAll().where("userId", "=", userId).orderBy("name", "asc");

  if (type) {
    query = query.where("type", "=", type);
  }

  return await query.execute();
}

/**
 * Creates a new category
 */
export async function createCategory(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const row = await db
    .insertInto("category")
    .values({
      userId,
      name: parsed.data.name,
      type: parsed.data.type,
      color: parsed.data.color,
      icon: parsed.data.icon,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return row;
}

/**
 * Deletes a category
 */
export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  // Check if any transactions reference this category
  const transactionExists = await db
    .selectFrom("transaction")
    .select("id")
    .where("categoryId", "=", id)
    .where("userId", "=", userId)
    .limit(1)
    .executeTakeFirst();

  if (transactionExists) {
    throw new Error("Cannot delete category with existing transactions");
  }

  await db
    .deleteFrom("category")
    .where("id", "=", id)
    .where("userId", "=", userId)
    .execute();

  return { success: true };
}
