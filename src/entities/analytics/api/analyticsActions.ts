"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { sql } from "kysely";

export async function getAnalytics() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const twelveMonthsAgoStr = twelveMonthsAgo.toISOString().split("T")[0];

  const [monthlyTrendRes, topCategoriesRes, currentMonthData, previousMonthData, biggestTransactions] = await Promise.all([
    // Query 1: monthlyTrend (last 12 months)
    db
      .selectFrom("transaction")
      .select([
        sql<string>`TO_CHAR(date, 'YYYY-MM')`.as("month"),
        sql<string>`SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)`.as("income"),
        sql<string>`SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`.as("expense")
      ])
      .where("userId", "=", userId)
      .where("date", ">=", twelveMonthsAgo)
      .groupBy(sql`TO_CHAR(date, 'YYYY-MM')`)
      .orderBy("month", "asc")
      .execute(),

    // Query 2: topCategories (this calendar year)
    db
      .selectFrom("transaction as t")
      .innerJoin("category as c", "t.categoryId", "c.id")
      .select([
        "c.name",
        "c.color",
        ({ fn }) => fn.sum<string>("t.amount").as("total")
      ])
      .where("t.userId", "=", userId)
      .where("t.type", "=", "expense")
      .where(sql`EXTRACT(YEAR FROM t.date)`, "=", sql`EXTRACT(YEAR FROM NOW())`)
      .groupBy(["c.id", "c.name", "c.color"])
      .orderBy("total", "desc")
      .limit(5)
      .execute(),

    // Query 3a: Current month data
    db
      .selectFrom("transaction")
      .select([
        ({ fn }) => fn.sum<string>(sql`CASE WHEN type = 'income' THEN amount ELSE 0 END`).as("totalIncome"),
        ({ fn }) => fn.sum<string>(sql`CASE WHEN type = 'expense' THEN amount ELSE 0 END`).as("totalExpense"),
        ({ fn }) => fn.count<string>("id").as("count")
      ])
      .where("userId", "=", userId)
      .where(sql`TO_CHAR(date, 'YYYY-MM')`, "=", currentMonthStr)
      .executeTakeFirst(),

    // Query 3b: Previous month data
    db
      .selectFrom("transaction")
      .select([
        ({ fn }) => fn.sum<string>(sql`CASE WHEN type = 'income' THEN amount ELSE 0 END`).as("totalIncome"),
        ({ fn }) => fn.sum<string>(sql`CASE WHEN type = 'expense' THEN amount ELSE 0 END`).as("totalExpense"),
        ({ fn }) => fn.count<string>("id").as("count")
      ])
      .where("userId", "=", userId)
      .where(sql`TO_CHAR(date, 'YYYY-MM')`, "=", previousMonthStr)
      .executeTakeFirst(),

    // Query 4: Biggest transactions (current month, top 5 expenses)
    db
      .selectFrom("transaction as t")
      .innerJoin("category as c", "t.categoryId", "c.id")
      .innerJoin("financialAccount as fa", "t.accountId", "fa.id")
      .selectAll("t")
      .select([
        "c.name as categoryName",
        "c.color as categoryColor",
        "fa.name as accountName"
      ])
      .where("t.userId", "=", userId)
      .where("t.type", "=", "expense")
      .where(sql`TO_CHAR(t.date, 'YYYY-MM')`, "=", currentMonthStr)
      .orderBy("t.amount", "desc")
      .limit(5)
      .execute()
  ]);

  const monthlyTrend = monthlyTrendRes.map(row => ({
    month: row.month,
    income: Number(row.income ?? 0),
    expense: Number(row.expense ?? 0),
  }));

  const topCategories = topCategoriesRes.map(row => ({
    name: row.name,
    color: row.color,
    total: Number(row.total ?? 0),
  }));

  const curr = {
    month: currentMonthStr,
    totalIncome: Number(currentMonthData?.totalIncome ?? 0),
    totalExpense: Number(currentMonthData?.totalExpense ?? 0),
    netSavings: Number(currentMonthData?.totalIncome ?? 0) - Number(currentMonthData?.totalExpense ?? 0),
    count: Number(currentMonthData?.count ?? 0),
  };

  const prev = {
    month: previousMonthStr,
    totalIncome: Number(previousMonthData?.totalIncome ?? 0),
    totalExpense: Number(previousMonthData?.totalExpense ?? 0),
    netSavings: Number(previousMonthData?.totalIncome ?? 0) - Number(previousMonthData?.totalExpense ?? 0),
    count: Number(previousMonthData?.count ?? 0),
  };

  const incomeChange = prev.totalIncome > 0 
    ? ((curr.totalIncome - prev.totalIncome) / prev.totalIncome) * 100 
    : (curr.totalIncome > 0 ? 100 : 0);

  const expenseChange = prev.totalExpense > 0 
    ? ((curr.totalExpense - prev.totalExpense) / prev.totalExpense) * 100 
    : (curr.totalExpense > 0 ? 100 : 0);

  const monthComparison = {
    current: curr,
    previous: prev,
    incomeChange,
    expenseChange,
  };

  return {
    monthlyTrend,
    topCategories,
    monthComparison,
    biggestTransactions: biggestTransactions.map(t => ({
      ...t,
      amount: Number(t.amount)
    })),
  };
}
