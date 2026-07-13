"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./dashboardActions";

export const dashboardKeys = {
  summary: ["dashboard-summary"] as const,
};

/**
 * Fetch the dashboard summary combining multiple metrics
 */
export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: dashboardKeys.summary,
    queryFn: () => getDashboardSummary(),
    staleTime: 30 * 1000,
  });
}
