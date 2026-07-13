// src/entities/dashboard/api/dashboardActions.ts
"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { sql } from "kysely";

/**
 * Returns summary data for the dashboard combining multiple database queries
 */
export async function getDashboardSummary() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 1. totalBalance
  const totalBalanceRes = await db
    .selectFrom("financialAccount")
    .select(({ fn }) => [fn.sum<string>("balance").as("total")])
    .where("userId", "=", userId)
    .executeTakeFirst();
  const totalBalance = Number(totalBalanceRes?.total ?? 0);

  // 2. currentMonthIncome
  const incomeRes = await db
    .selectFrom("transaction")
    .select(({ fn }) => [fn.sum<string>("amount").as("total")])
    .where("userId", "=", userId)
    .where("type", "=", "income")
    .where("date", ">=", firstDayOfMonth)
    .executeTakeFirst();
  const currentMonthIncome = Number(incomeRes?.total ?? 0);

  // 3. currentMonthExpense
  const expenseRes = await db
    .selectFrom("transaction")
    .select(({ fn }) => [fn.sum<string>("amount").as("total")])
    .where("userId", "=", userId)
    .where("type", "=", "expense")
    .where("date", ">=", firstDayOfMonth)
    .executeTakeFirst();
  const currentMonthExpense = Number(expenseRes?.total ?? 0);

  // 4. expenseByCategory
  const categoryExpenses = await db
    .selectFrom("transaction as t")
    .innerJoin("category as c", "t.categoryId", "c.id")
    .select([
      "c.name",
      "c.color",
      ({ fn }) => fn.sum<string>("t.amount").as("total")
    ])
    .where("t.userId", "=", userId)
    .where("t.type", "=", "expense")
    .where("t.date", ">=", firstDayOfMonth)
    .groupBy(["c.id", "c.name", "c.color"])
    .orderBy("total", "desc")
    .execute();

  const expenseByCategory = categoryExpenses.map((ce) => {
    const total = Number(ce.total ?? 0);
    const percentage = currentMonthExpense > 0 ? (total / currentMonthExpense) * 100 : 0;
    return {
      name: ce.name,
      color: ce.color,
      total,
      percentage,
    };
  });

  // 5. last7DaysBalance
  const last7DaysBalance = await db
    .selectFrom("transaction")
    .select([
      sql<string>`DATE(date)`.as("day"),
      sql<string>`SUM(CASE WHEN type='income' THEN amount ELSE 0 END)`.as("income"),
      sql<string>`SUM(CASE WHEN type='expense' THEN amount ELSE 0 END)`.as("expense")
    ])
    .where("userId", "=", userId)
    .where("date", ">=", sevenDaysAgo)
    .groupBy(sql`DATE(date)`)
    .orderBy("day", "asc")
    .execute();

  const formattedLast7Days = last7DaysBalance.map((d) => ({
    day: String(d.day),
    income: Number(d.income ?? 0),
    expense: Number(d.expense ?? 0),
  }));

  // 6. recentTransactions
  const recentTransactions = await db
    .selectFrom("transaction as t")
    .innerJoin("category as c", "t.categoryId", "c.id")
    .innerJoin("financialAccount as fa", "t.accountId", "fa.id")
    .select([
      "t.id",
      "t.amount",
      "t.type",
      "t.date",
      "t.description",
      "c.name as categoryName",
      "c.color as categoryColor",
      "c.icon as categoryIcon",
      "fa.name as accountName",
    ])
    .where("t.userId", "=", userId)
    .orderBy("t.date", "desc")
    .limit(5)
    .execute();

  return {
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    expenseByCategory,
    last7DaysBalance: formattedLast7Days,
    recentTransactions,
  };
}
