"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactionActions";
import { financialAccountKeys } from "@/entities/financial-account/api/financialAccountQueries";
import { dashboardKeys } from "@/entities/dashboard/api/dashboardQueries";

export type TransactionFilters = {
  financialAccountId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export const transactionKeys = {
  all: ["transactions"] as const,
  filtered: (filters: TransactionFilters) => ["transactions", filters] as const,
};

/**
 * Fetch a paginated and filtered list of transactions
 */
export function useTransactionsQuery(filters?: TransactionFilters) {
  const safeFilters = filters ?? {};
  return useQuery({
    queryKey: transactionKeys.filtered(safeFilters),
    queryFn: () => getTransactions(safeFilters),
  });
}

/**
 * Create a new transaction and update related data
 */
export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}

/**
 * Update an existing transaction and update related data
 */
export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: unknown }) =>
      updateTransaction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
      // We also invalidate accounts here because changing the amount
      // or type of a transaction affects the associated account's balance.
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
    },
  });
}

/**
 * Delete a transaction and update related data
 */
export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}
