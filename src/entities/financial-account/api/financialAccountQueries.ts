"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFinancialAccounts,
  createFinancialAccount,
  updateFinancialAccount,
  deleteFinancialAccount,
} from "./financialAccountActions";
import { transactionKeys } from "@/entities/transaction/api/transactionQueries";

export const financialAccountKeys = {
  all: ["financial-accounts"] as const,
};

/**
 * Fetch all financial accounts for the current user
 */
export function useFinancialAccountsQuery() {
  return useQuery({
    queryKey: financialAccountKeys.all,
    queryFn: () => getFinancialAccounts(),
  });
}

/**
 * Create a new financial account
 */
export function useCreateFinancialAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFinancialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
    },
  });
}

/**
 * Update an existing financial account
 */
export function useUpdateFinancialAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: unknown }) =>
      updateFinancialAccount(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
    },
  });
}

/**
 * Delete a financial account
 */
export function useDeleteFinancialAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFinancialAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
