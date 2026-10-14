"use server";

import { db } from "@/shared/lib/kysely";
import { auth } from "@/shared/lib/auth";
import { sql } from "kysely";
import {
  createExpenseComparisonConfig,
  expenseComparisonPeriodSchema,
} from "../lib/expenseComparison";

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

  const [
    monthlyTrendRes,
    topCategoriesRes,
    currentMonthData,
    previousMonthData,
    biggestTransactions,
  ] = await Promise.all([
    // Query 1: monthlyTrend (last 12 months)
    db
      .selectFrom("transaction")
      .select([
        sql<string>`TO_CHAR(date, 'YYYY-MM')`.as("month"),
        sql<string>`SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)`.as(
          "income",
        ),
        sql<string>`SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)`.as(
          "expense",
        ),
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
        ({ fn }) => fn.sum<string>("t.amount").as("total"),
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
        ({ fn }) =>
          fn
            .sum<string>(sql`CASE WHEN type = 'income' THEN amount ELSE 0 END`)
            .as("totalIncome"),
        ({ fn }) =>
          fn
            .sum<string>(sql`CASE WHEN type = 'expense' THEN amount ELSE 0 END`)
            .as("totalExpense"),
        ({ fn }) => fn.count<string>("id").as("count"),
      ])
      .where("userId", "=", userId)
      .where(sql`TO_CHAR(date, 'YYYY-MM')`, "=", currentMonthStr)
      .executeTakeFirst(),

    // Query 3b: Previous month data
    db
      .selectFrom("transaction")
      .select([
        ({ fn }) =>
          fn
            .sum<string>(sql`CASE WHEN type = 'income' THEN amount ELSE 0 END`)
            .as("totalIncome"),
        ({ fn }) =>
          fn
            .sum<string>(sql`CASE WHEN type = 'expense' THEN amount ELSE 0 END`)
            .as("totalExpense"),
        ({ fn }) => fn.count<string>("id").as("count"),
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
        "fa.name as accountName",
      ])
      .where("t.userId", "=", userId)
      .where("t.type", "=", "expense")
      .where(sql`TO_CHAR(t.date, 'YYYY-MM')`, "=", currentMonthStr)
      .orderBy("t.amount", "desc")
      .limit(5)
      .execute(),
  ]);

  const monthlyTrend = monthlyTrendRes.map((row) => ({
    month: row.month,
    income: Number(row.income ?? 0),
    expense: Number(row.expense ?? 0),
  }));

  const topCategories = topCategoriesRes.map((row) => ({
    name: row.name,
    color: row.color,
    total: Number(row.total ?? 0),
  }));

  const curr = {
    month: currentMonthStr,
    totalIncome: Number(currentMonthData?.totalIncome ?? 0),
    totalExpense: Number(currentMonthData?.totalExpense ?? 0),
    netSavings:
      Number(currentMonthData?.totalIncome ?? 0) -
      Number(currentMonthData?.totalExpense ?? 0),
    count: Number(currentMonthData?.count ?? 0),
  };

  const prev = {
    month: previousMonthStr,
    totalIncome: Number(previousMonthData?.totalIncome ?? 0),
    totalExpense: Number(previousMonthData?.totalExpense ?? 0),
    netSavings:
      Number(previousMonthData?.totalIncome ?? 0) -
      Number(previousMonthData?.totalExpense ?? 0),
    count: Number(previousMonthData?.count ?? 0),
  };

  const incomeChange =
    prev.totalIncome > 0
      ? ((curr.totalIncome - prev.totalIncome) / prev.totalIncome) * 100
      : curr.totalIncome > 0
        ? 100
        : 0;

  const expenseChange =
    prev.totalExpense > 0
      ? ((curr.totalExpense - prev.totalExpense) / prev.totalExpense) * 100
      : curr.totalExpense > 0
        ? 100
        : 0;

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
    biggestTransactions: biggestTransactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
  };
}

export async function getExpensesOverview(periodInput: unknown = "monthly") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  const period = expenseComparisonPeriodSchema.parse(periodInput);
  const comparison = createExpenseComparisonConfig(period);

  const rankedRecentTransactions = db
    .selectFrom("transaction as t")
    .innerJoin("category as c", "t.categoryId", "c.id")
    .select([
      "t.id",
      "t.categoryId",
      "t.description",
      "t.amount",
      "t.date",
      sql<number>`ROW_NUMBER() OVER (PARTITION BY t.category_id ORDER BY t.date DESC, t.created_at DESC)`.as(
        "rowNumber",
      ),
    ])
    .where("t.userId", "=", userId)
    .where("t.type", "=", "expense")
    .where("t.date", ">=", comparison.currentStart)
    .where("t.date", "<", comparison.currentEnd);

  const [categoryRows, recentRows] = await Promise.all([
    db
      .selectFrom("transaction as t")
      .innerJoin("category as c", "t.categoryId", "c.id")
      .select([
        "t.categoryId",
        "c.name as categoryName",
        "c.color as categoryColor",
        "c.icon as categoryIcon",
        sql<string>`TO_CHAR(t.date, 'YYYY-MM-DD')`.as("day"),
        ({ fn }) => fn.sum<string>("t.amount").as("total"),
      ])
      .where("t.userId", "=", userId)
      .where("t.type", "=", "expense")
      .where("t.date", ">=", comparison.queryStart)
      .where("t.date", "<", comparison.queryEnd)
      .groupBy([
        "t.categoryId",
        "c.name",
        "c.color",
        "c.icon",
        sql`TO_CHAR(t.date, 'YYYY-MM-DD')`,
      ])
      .execute(),
    db
      .selectFrom(rankedRecentTransactions.as("ranked"))
      .selectAll()
      .where("ranked.rowNumber", "<=", 2)
      .orderBy("ranked.date", "desc")
      .execute(),
  ]);

  const dailyTotals = new Map<string, number>();
  const categoryTotals = new Map<
    string,
    {
      id: string;
      name: string;
      color: string | null;
      icon: string | null;
      total: number;
      previousTotal: number;
    }
  >();

  for (const row of categoryRows) {
    const amount = Number(row.total ?? 0);
    dailyTotals.set(row.day, (dailyTotals.get(row.day) ?? 0) + amount);
    const category = categoryTotals.get(row.categoryId) ?? {
      id: row.categoryId,
      name: row.categoryName,
      color: row.categoryColor,
      icon: row.categoryIcon,
      total: 0,
      previousTotal: 0,
    };

    if (
      row.day >= formatDayKey(comparison.currentStart) &&
      row.day < formatDayKey(comparison.currentEnd)
    ) {
      category.total += amount;
    }
    if (
      row.day >= formatDayKey(comparison.previousStart) &&
      row.day < formatDayKey(comparison.previousEnd)
    ) {
      category.previousTotal += amount;
    }
    categoryTotals.set(row.categoryId, category);
  }

  const monthlyComparison = comparison.chartBuckets.map((bucket) => ({
    label: bucket.label,
    current: sumByRange(dailyTotals, bucket.currentStart, bucket.currentEnd),
    previous: sumByRange(dailyTotals, bucket.previousStart, bucket.previousEnd),
  }));

  const transactionsByCategory = new Map<
    string,
    Array<(typeof recentRows)[number]>
  >();
  for (const transaction of recentRows) {
    const categoryTransactions =
      transactionsByCategory.get(transaction.categoryId) ?? [];
    categoryTransactions.push(transaction);
    transactionsByCategory.set(transaction.categoryId, categoryTransactions);
  }

  const categories = [...categoryTotals.values()]
    .map((category) => ({
      ...category,
      transactions: (transactionsByCategory.get(category.id) ?? []).map(
        (transaction) => ({
          id: transaction.id,
          description: transaction.description,
          amount: Number(transaction.amount),
          date:
            transaction.date instanceof Date
              ? transaction.date.toISOString()
              : String(transaction.date),
        }),
      ),
    }))
    .sort(
      (first, second) =>
        second.total - first.total || first.name.localeCompare(second.name),
    );

  return {
    monthlyComparison,
    currentPeriod: comparison.currentLabel,
    previousPeriod: comparison.previousLabel,
    comparisonLabel: comparison.comparisonLabel,
    categories,
  };
}

function formatDayKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function sumByRange(totals: Map<string, number>, start: Date, end: Date) {
  const startKey = formatDayKey(start);
  const endKey = formatDayKey(end);
  let total = 0;

  for (const [day, amount] of totals) {
    if (day >= startKey && day < endKey) total += amount;
  }

  return total;
}
