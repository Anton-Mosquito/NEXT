"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSavingsGoalOverview,
  saveMonthlySavingsTarget,
} from "./goalActions";

export const savingsGoalKeys = {
  all: ["savings-goal"] as const,
  overview: () => [...savingsGoalKeys.all, "overview"] as const,
};

export function useSavingsGoalOverviewQuery() {
  return useQuery({
    queryKey: savingsGoalKeys.overview(),
    queryFn: getSavingsGoalOverview,
    staleTime: 60_000,
  });
}

export function useSaveMonthlySavingsTargetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => saveMonthlySavingsTarget({ amount }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: savingsGoalKeys.all }),
  });
}
