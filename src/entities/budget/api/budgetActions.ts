"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";
import { categoryGoalSaveSchema } from "../lib/categoryGoalSchema";

const createBudgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.coerce.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format must be YYYY-MM"),
});

const updateBudgetSchema = z.object({
  amount: z.coerce.number().positive(),
});

export async function getCategoryGoalCards(monthInput: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  const parsedMonth = z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .safeParse(monthInput);

  if (!parsedMonth.success) throw new Error("Invalid month.");

  return db
    .selectFrom("category as c")
    .leftJoin("budget as b", (join) =>
      join
        .onRef("b.categoryId", "=", "c.id")
        .on("b.userId", "=", userId)
        .on("b.month", "=", parsedMonth.data),
    )
    .select([
      "c.id as categoryId",
      "c.name as categoryName",
      "c.color as categoryColor",
      "c.icon as categoryIcon",
      "b.id as budgetId",
      "b.amount as goalAmount",
    ])
    .where("c.userId", "=", userId)
    .where("c.type", "=", "expense")
    .orderBy("c.name", "asc")
    .execute()
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        goalAmount: row.goalAmount === null ? null : Number(row.goalAmount),
      })),
    );
}

export async function setCategoryGoal(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  const parsed = categoryGoalSaveSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { categoryId, amount, month } = parsed.data;
  const category = await db
    .selectFrom("category")
    .select("id")
    .where("id", "=", categoryId)
    .where("userId", "=", userId)
    .where("type", "=", "expense")
    .executeTakeFirst();

  if (!category) throw new Error("Expense category not found.");

  await db
    .insertInto("budget")
    .values({ userId, categoryId, amount, month })
    .onConflict((conflict) =>
      conflict
        .columns(["userId", "categoryId", "month"])
        .doUpdateSet({ amount }),
    )
    .execute();

  return { success: true };
}

export async function getBudgetsWithSpending(month?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  // Default to current month if not provided
  if (!month) {
    const now = new Date();
    month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  const budgets = await db
    .selectFrom("budget")
    .innerJoin("category", "category.id", "budget.categoryId")
    .where("budget.userId", "=", userId)
    .where("budget.month", "=", month)
    .select([
      "budget.id",
      "budget.amount as limitAmount",
      "budget.month",
      "budget.categoryId",
      "category.name as categoryName",
      "category.color as categoryColor",
    ])
    .execute();

  const [year, mon] = month.split("-");
  const dateFrom = `${year}-${mon}-01`;
  const dateTo = `${year}-${mon}-31`;

  const results = await Promise.all(
    budgets.map(async (budget) => {
      const spendingResult = await db
        .selectFrom("transaction")
        .where("userId", "=", userId)
        .where("categoryId", "=", budget.categoryId)
        .where("type", "=", "expense")
        .where("date", ">=", new Date(dateFrom))
        .where("date", "<=", new Date(dateTo))
        .select((eb) => eb.fn.sum("amount").as("total"))
        .executeTakeFirst();

      const limitAmount = Number(budget.limitAmount);
      const spentAmount = Number(spendingResult?.total ?? 0);
      const percentage =
        limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0;
      const remaining = limitAmount - spentAmount;

      let status: "ok" | "warning" | "exceeded" = "ok";
      if (percentage >= 100) status = "exceeded";
      else if (percentage >= 80) status = "warning";

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.categoryName,
        categoryColor: budget.categoryColor,
        limitAmount,
        spentAmount,
        percentage,
        remaining,
        status,
      };
    }),
  );

  return results;
}

export async function createBudget(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = createBudgetSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { categoryId, amount, month } = parsed.data;

  try {
    await db
      .insertInto("budget")
      .values({
        userId,
        categoryId,
        amount,
        month,
      })
      .execute();
    return { success: true };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new Error("Budget for this category already exists for this month");
    }
    throw error;
  }
}

export async function updateBudget(id: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const parsed = updateBudgetSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { amount } = parsed.data;

  const updated = await db
    .updateTable("budget")
    .set({ amount })
    .where("id", "=", id)
    .where("userId", "=", userId)
    .executeTakeFirst();

  if (Number(updated.numUpdatedRows) === 0) {
    throw new Error("Budget not found or unauthorized");
  }

  return { success: true };
}

export async function deleteBudget(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const deleted = await db
    .deleteFrom("budget")
    .where("id", "=", id)
    .where("userId", "=", userId)
    .executeTakeFirst();

  if (Number(deleted.numDeletedRows) === 0) {
    throw new Error("Budget not found or unauthorized");
  }

  return { success: true };
}
