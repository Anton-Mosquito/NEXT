"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBudgetsWithSpending, createBudget, updateBudget, deleteBudget } from "./budgetActions";

export const budgetKeys = {
  all: ["budgets"] as const,
  byMonth: (month: string) => ["budgets", month] as const,
};

export function useBudgetsQuery(month: string) {
  return useQuery({
    queryKey: budgetKeys.byMonth(month),
    queryFn: () => getBudgetsWithSpending(month),
    staleTime: 30 * 1000, // 30s
  });
}

export function useCreateBudgetMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: { categoryId: string; amount: number; month: string }) => createBudget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { amount: number } }) => updateBudget(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useDeleteBudgetMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}
