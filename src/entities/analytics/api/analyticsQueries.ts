"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics, getExpensesOverview } from "./analyticsActions";
import type { ExpenseComparisonPeriod } from "../lib/expenseComparison";

export const analyticsKeys = {
  all: ["analytics"] as const,
};

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: analyticsKeys.all,
    queryFn: () => getAnalytics(),
    staleTime: 60 * 1000,
  });
}

export const expensesOverviewKeys = {
  all: ["expenses-overview"] as const,
  period: (period: ExpenseComparisonPeriod) =>
    [...expensesOverviewKeys.all, period] as const,
};

export function useExpensesOverviewQuery(period: ExpenseComparisonPeriod) {
  return useQuery({
    queryKey: expensesOverviewKeys.period(period),
    queryFn: () => getExpensesOverview(period),
    staleTime: 60 * 1000,
  });
}
