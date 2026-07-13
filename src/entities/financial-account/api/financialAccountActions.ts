// src/entities/financial-account/api/financialAccountActions.ts
"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const createAccountSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["cash", "card", "savings", "crypto"]),
  currency: z.string().default("UAH"),
  balance: z.number().min(0).default(0),
});

const updateAccountSchema = z.object({
  name: z.string().optional(),
  currency: z.string().optional(),
});

/**
 * Returns all financial accounts for the current user ordered by createdAt desc
 */
export async function getFinancialAccounts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const accounts = await db
    .selectFrom("financialAccount")
    .selectAll()
    .where("userId", "=", userId)
    .orderBy("createdAt", "desc")
    .execute();

  return accounts;
}

/**
 * Creates a new financial account
 */
export async function createFinancialAccount(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = createAccountSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const row = await db
    .insertInto("financialAccount")
    .values({
      userId,
      name: parsed.data.name,
      type: parsed.data.type,
      currency: parsed.data.currency,
      balance: parsed.data.balance,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return row;
}

/**
 * Updates an existing financial account
 */
export async function updateFinancialAccount(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = updateAccountSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const row = await db
    .updateTable("financialAccount")
    .set(parsed.data)
    .where("id", "=", id)
    .where("userId", "=", userId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return row;
}

/**
 * Deletes a financial account
 */
export async function deleteFinancialAccount(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  // Check if any transactions reference this account
  const transactionExists = await db
    .selectFrom("transaction")
    .select("id")
    .where("accountId", "=", id)
    .where("userId", "=", userId)
    .limit(1)
    .executeTakeFirst();

  if (transactionExists) {
    throw new Error("Cannot delete account with existing transactions");
  }

  await db
    .deleteFrom("financialAccount")
    .where("id", "=", id)
    .where("userId", "=", userId)
    .execute();

  return { success: true };
}
