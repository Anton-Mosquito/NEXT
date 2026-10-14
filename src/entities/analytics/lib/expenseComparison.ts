import { z } from "zod";

export const expenseComparisonPeriodSchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

export type ExpenseComparisonPeriod = z.infer<
  typeof expenseComparisonPeriodSchema
>;

export type ExpenseComparisonBucket = {
  label: string;
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
};

export type ExpenseComparisonConfig = {
  queryStart: Date;
  queryEnd: Date;
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
  currentLabel: string;
  previousLabel: string;
  comparisonLabel: string;
  chartBuckets: ExpenseComparisonBucket[];
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const addMonths = (date: Date, months: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

const startOfWeek = (date: Date) =>
  addDays(date, -((date.getUTCDay() + 6) % 7));

const startOfMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const startOfYear = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

const formatDateRange = (start: Date, end: Date) =>
  `${formatMonth(start)} – ${formatMonth(addDays(end, -1))}`;

function getMonthlyBuckets(currentMonth: Date): ExpenseComparisonBucket[] {
  return Array.from({ length: 12 }, (_, index) => {
    const currentStart = addMonths(currentMonth, index - 11);
    const currentEnd = addMonths(currentStart, 1);
    const previousStart = addMonths(currentStart, -12);

    return {
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC",
      }).format(currentStart),
      currentStart,
      currentEnd,
      previousStart,
      previousEnd: addMonths(previousStart, 1),
    };
  });
}

function getWeeklyBuckets(
  currentMonth: Date,
  previousMonth: Date,
): ExpenseComparisonBucket[] {
  const currentMonthEnd = addMonths(currentMonth, 1);
  const previousMonthEnd = addMonths(previousMonth, 1);
  const currentWeeks: Array<{ start: Date; end: Date }> = [];
  const previousWeeks: Array<{ start: Date; end: Date }> = [];

  for (
    let weekStart = startOfWeek(currentMonth);
    weekStart < currentMonthEnd;
    weekStart = addDays(weekStart, 7)
  ) {
    currentWeeks.push({
      start: new Date(Math.max(weekStart.getTime(), currentMonth.getTime())),
      end: new Date(
        Math.min(addDays(weekStart, 7).getTime(), currentMonthEnd.getTime()),
      ),
    });
  }

  for (
    let weekStart = startOfWeek(previousMonth);
    weekStart < previousMonthEnd;
    weekStart = addDays(weekStart, 7)
  ) {
    previousWeeks.push({
      start: new Date(Math.max(weekStart.getTime(), previousMonth.getTime())),
      end: new Date(
        Math.min(addDays(weekStart, 7).getTime(), previousMonthEnd.getTime()),
      ),
    });
  }

  return currentWeeks.map((currentWeek, index) => {
    const previousWeek = previousWeeks[index];

    return {
      label: `Week ${index + 1}`,
      currentStart: currentWeek.start,
      currentEnd: currentWeek.end,
      previousStart: previousWeek?.start ?? previousMonthEnd,
      previousEnd: previousWeek?.end ?? previousMonthEnd,
    };
  });
}

export function createExpenseComparisonConfig(
  period: ExpenseComparisonPeriod,
  referenceDate = new Date(),
): ExpenseComparisonConfig {
  const today = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );

  if (period === "daily") {
    const currentStart = startOfWeek(today);
    const currentEnd = addDays(currentStart, 7);
    const previousStart = addDays(currentStart, -7);
    const chartBuckets = Array.from({ length: 7 }, (_, index) => {
      const currentDay = addDays(currentStart, index);
      const previousDay = addDays(previousStart, index);

      return {
        label: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }).format(currentDay),
        currentStart: currentDay,
        currentEnd: addDays(currentDay, 1),
        previousStart: previousDay,
        previousEnd: addDays(previousDay, 1),
      };
    });

    return {
      queryStart: previousStart,
      queryEnd: currentEnd,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd: currentStart,
      currentLabel: "This week",
      previousLabel: "Last week",
      comparisonLabel: "Compare to last week",
      chartBuckets,
    };
  }

  if (period === "weekly") {
    const currentStart = startOfMonth(today);
    const currentEnd = addMonths(currentStart, 1);
    const previousStart = addMonths(currentStart, -1);
    const previousEnd = currentStart;

    return {
      queryStart: previousStart,
      queryEnd: currentEnd,
      currentStart,
      currentEnd,
      previousStart,
      previousEnd,
      currentLabel: formatMonth(currentStart),
      previousLabel: formatMonth(previousStart),
      comparisonLabel: "Compare to last month",
      chartBuckets: getWeeklyBuckets(currentStart, previousStart),
    };
  }

  if (period === "monthly") {
    const currentMonth = startOfMonth(today);
    const currentStart = addMonths(currentMonth, -11);
    const currentEnd = addMonths(currentMonth, 1);
    const previousStart = addMonths(currentStart, -12);
    const previousEnd = addMonths(currentEnd, -12);
    const categoryPreviousStart = addMonths(currentMonth, -12);

    return {
      queryStart: previousStart,
      queryEnd: currentEnd,
      currentStart: currentMonth,
      currentEnd: addMonths(currentMonth, 1),
      previousStart: categoryPreviousStart,
      previousEnd: addMonths(categoryPreviousStart, 1),
      currentLabel: formatDateRange(currentStart, currentEnd),
      previousLabel: formatDateRange(previousStart, previousEnd),
      comparisonLabel: "Compare to same month last year",
      chartBuckets: getMonthlyBuckets(currentMonth),
    };
  }

  const currentStart = startOfYear(today);
  const currentEnd = new Date(Date.UTC(today.getUTCFullYear() + 1, 0, 1));
  const previousStart = new Date(Date.UTC(today.getUTCFullYear() - 1, 0, 1));
  const previousEnd = currentStart;

  return {
    queryStart: previousStart,
    queryEnd: currentEnd,
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    currentLabel: String(today.getUTCFullYear()),
    previousLabel: String(today.getUTCFullYear() - 1),
    comparisonLabel: "Compare to last year",
    chartBuckets: [
      {
        label: "Annual total",
        currentStart,
        currentEnd,
        previousStart,
        previousEnd,
      },
    ],
  };
}
