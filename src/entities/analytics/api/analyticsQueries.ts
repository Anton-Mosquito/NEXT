"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "./analyticsActions";

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
