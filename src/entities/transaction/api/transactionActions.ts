// src/entities/transaction/api/transactionActions.ts
"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";
import { sql } from "kysely";

const getTransactionsFiltersSchema = z.object({
  financialAccountId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().max(100).default(20),
});

const createTransactionSchema = z.object({
  financialAccountId: z.string(),
  categoryId: z.string(),
  amount: z.number().positive().min(0.01),
  type: z.enum(["income", "expense"]),
  description: z.string().max(200).optional(),
  date: z.string(),
});

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().optional(),
});

/**
 * Returns a paginated list of transactions joined with category and financialAccount
 */
export async function getTransactions(filters?: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = getTransactionsFiltersSchema.safeParse(filters ?? {});
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { financialAccountId, categoryId, type, dateFrom, dateTo, page, limit } = parsed.data;

  // Data Query
  let query = db
    .selectFrom("transaction as t")
    .innerJoin("category as c", "t.categoryId", "c.id")
    .innerJoin("financialAccount as fa", "t.accountId", "fa.id")
    .select([
      "t.id",
      "t.userId",
      "t.accountId",
      "t.categoryId",
      "t.amount",
      "t.type",
      "t.date",
      "t.description",
      "t.createdAt",
      "c.name as categoryName",
      "c.color as categoryColor",
      "fa.name as accountName",
    ])
    .where("t.userId", "=", userId);

  // Count Query
  let countQuery = db
    .selectFrom("transaction as t")
    .select(({ fn }) => [fn.count<string>("t.id").as("count")])
    .where("t.userId", "=", userId);

  // Apply Filters
  if (financialAccountId) {
    query = query.where("t.accountId", "=", financialAccountId);
    countQuery = countQuery.where("t.accountId", "=", financialAccountId);
  }
  if (categoryId) {
    query = query.where("t.categoryId", "=", categoryId);
    countQuery = countQuery.where("t.categoryId", "=", categoryId);
  }
  if (type) {
    query = query.where("t.type", "=", type);
    countQuery = countQuery.where("t.type", "=", type);
  }
  if (dateFrom) {
    query = query.where("t.date", ">=", new Date(dateFrom));
    countQuery = countQuery.where("t.date", ">=", new Date(dateFrom));
  }
  if (dateTo) {
    query = query.where("t.date", "<=", new Date(dateTo));
    countQuery = countQuery.where("t.date", "<=", new Date(dateTo));
  }

  const offset = (page - 1) * limit;

  const [data, countResult] = await Promise.all([
    query.orderBy("t.date", "desc").limit(limit).offset(offset).execute(),
    countQuery.executeTakeFirst(),
  ]);

  const total = Number(countResult?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    totalPages,
  };
}

/**
 * Creates a transaction and atomically updates the financial account balance
 */
export async function createTransaction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { financialAccountId, categoryId, amount, type, description, date } = parsed.data;

  return await db.transaction().execute(async (trx) => {
    // 1. Insert transaction
    const newTx = await trx
      .insertInto("transaction")
      .values({
        userId,
        accountId: financialAccountId,
        categoryId,
        amount,
        type,
        description: description ?? null,
        date: new Date(date),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // 2. Update financialAccount balance
    const balanceChange = type === "income" ? amount : -amount;

    await trx
      .updateTable("financialAccount")
      .set((eb) => ({
        balance: sql`balance + ${balanceChange}`,
      }))
      .where("id", "=", financialAccountId)
      .where("userId", "=", userId)
      .execute();

    return newTx;
  });
}

/**
 * Updates an existing transaction and adjusts the financial account balance if the amount changed
 */
export async function updateTransaction(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = updateTransactionSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { amount, description, date, categoryId } = parsed.data;

  return await db.transaction().execute(async (trx) => {
    // Get existing transaction
    const existingTx = await trx
      .selectFrom("transaction")
      .selectAll()
      .where("id", "=", id)
      .where("userId", "=", userId)
      .executeTakeFirstOrThrow();

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (amount !== undefined) updateData.amount = amount;

    // Update the transaction
    const updatedTx = await trx
      .updateTable("transaction")
      .set(updateData)
      .where("id", "=", id)
      .where("userId", "=", userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    // Reconcile balance if amount changed
    if (amount !== undefined && Number(existingTx.amount) !== amount) {
      const oldAmount = Number(existingTx.amount);
      const isIncome = existingTx.type === "income";

      // Reverse old balance effect
      const reverseOld = isIncome ? -oldAmount : oldAmount;
      // Apply new balance effect
      const applyNew = isIncome ? amount : -amount;

      const balanceChange = reverseOld + applyNew;

      await trx
        .updateTable("financialAccount")
        .set((eb) => ({
          balance: sql`balance + ${balanceChange}`,
        }))
        .where("id", "=", existingTx.accountId)
        .where("userId", "=", userId)
        .execute();
    }

    return updatedTx;
  });
}

/**
 * Deletes a transaction and reverses its balance effect
 */
export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  await db.transaction().execute(async (trx) => {
    // Get the transaction to know how to reverse the balance
    const existingTx = await trx
      .selectFrom("transaction")
      .selectAll()
      .where("id", "=", id)
      .where("userId", "=", userId)
      .executeTakeFirstOrThrow();

    // Reverse balance effect
    const balanceChange = existingTx.type === "income" ? -Number(existingTx.amount) : Number(existingTx.amount);

    await trx
      .updateTable("financialAccount")
      .set((eb) => ({
        balance: sql`balance + ${balanceChange}`,
      }))
      .where("id", "=", existingTx.accountId)
      .where("userId", "=", userId)
      .execute();

    // Delete transaction
    await trx
      .deleteFrom("transaction")
      .where("id", "=", id)
      .where("userId", "=", userId)
      .execute();
  });

  return { success: true };
}
