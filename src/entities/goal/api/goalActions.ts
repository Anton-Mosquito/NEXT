"use server";

import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/kysely";
import { sql } from "kysely";
import { monthlySavingsTargetSchema } from "../lib/goalSchemas";
import { buildSavingsProgress } from "../lib/savingsProgress";

export async function getSavingsGoalOverview() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const currentMonthStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  );
  const previousMonthStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1),
  );
  const nextMonthStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
  );

  const [goal, dailyRows] = await Promise.all([
    db
      .selectFrom("savingsGoal")
      .select("monthlyTarget")
      .where("userId", "=", userId)
      .executeTakeFirst(),
    db
      .selectFrom("transaction")
      .select([
        sql<string>`TO_CHAR(date, 'YYYY-MM-DD')`.as("day"),
        sql<string>`SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END)`.as(
          "net",
        ),
      ])
      .where("userId", "=", userId)
      .where("date", ">=", previousMonthStart)
      .where("date", "<", nextMonthStart)
      .groupBy(sql`TO_CHAR(date, 'YYYY-MM-DD')`)
      .execute(),
  ]);

  const dailyNet = new Map(
    dailyRows.map((row) => [row.day, Number(row.net ?? 0)]),
  );
  const progress = buildSavingsProgress(dailyNet, today);

  return {
    monthlyTarget:
      goal?.monthlyTarget === undefined ? null : Number(goal.monthlyTarget),
    currentSavings: progress.currentTotal,
    chart: progress.points,
    currentPeriod: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(currentMonthStart),
    previousPeriod: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(previousMonthStart),
    periodStart: currentMonthStart.toISOString(),
    periodEnd: new Date(nextMonthStart.getTime() - 1).toISOString(),
  };
}

export async function saveMonthlySavingsTarget(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const parsed = monthlySavingsTargetSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  await db
    .insertInto("savingsGoal")
    .values({
      userId: session.user.id,
      monthlyTarget: parsed.data.amount,
    })
    .onConflict((conflict) =>
      conflict.column("userId").doUpdateSet({
        monthlyTarget: parsed.data.amount,
        updatedAt: new Date(),
      }),
    )
    .execute();

  return { success: true };
}
