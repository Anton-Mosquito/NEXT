"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./transactionActions";
import { financialAccountKeys } from "@/entities/financial-account/api/financialAccountQueries";
import { dashboardKeys } from "@/entities/dashboard/api/dashboardQueries";

export const transactionKeys = {
  all: ["transactions"] as const,
  infiniteAll: ["infinite-transactions"] as const,
  search: (search: string) => ["transaction-search", search] as const,
  list: (filters: TransactionFilters) =>
    ["transactions", { ...filters }] as const,
  infiniteList: (filters: Omit<TransactionFilters, "page">) =>
    ["infinite-transactions", { ...filters }] as const,
};

export type TransactionFilters = {
  financialAccountId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  id?: string;
  page?: number;
  limit?: number;
};

export type TransactionListData = Awaited<ReturnType<typeof getTransactions>>;

export function useTransactionsQuery(filters: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => getTransactions(filters),
    placeholderData: keepPreviousData,
  });
}

export function useTransactionSearchQuery(search: string) {
  return useQuery({
    queryKey: transactionKeys.search(search),
    queryFn: () => getTransactions({ search, page: 1, limit: 6 }),
    enabled: search.length >= 2,
    staleTime: 30_000,
  });
}

export function useInfiniteTransactionsQuery(
  filters: Omit<TransactionFilters, "page">,
) {
  return useInfiniteQuery({
    queryKey: transactionKeys.infiniteList(filters),
    queryFn: ({ pageParam }) =>
      getTransactions({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  type CreateTransactionInput = {
    financialAccountId: string;
    categoryId: string;
    amount: number;
    type: "income" | "expense";
    description?: string;
    date: string;
  };

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousData = queryClient.getQueriesData<TransactionListData>({
        queryKey: transactionKeys.all,
      });

      const optimisticTransaction = {
        id: crypto.randomUUID(),
        userId: "",
        accountId: input.financialAccountId,
        categoryId: input.categoryId,
        amount: String(input.amount),
        type: input.type,
        date: new Date(input.date),
        description: input.description ?? null,
        createdAt: new Date(),
        categoryName: input.categoryId,
        categoryColor: null,
        accountName: input.financialAccountId,
      };

      queryClient.setQueriesData<TransactionListData>(
        { queryKey: transactionKeys.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [optimisticTransaction, ...old.data],
            total: old.total + 1,
          };
        },
      );

      return { previousData };
    },
    onError: (_err, _input, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.infiniteAll });
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: unknown }) =>
      updateTransaction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.infiniteAll });
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: transactionKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: transactionKeys.all,
      });

      previousData.forEach(([queryKey]) => {
        queryClient.setQueryData<TransactionListData>(queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((tx) => tx.id !== deletedId),
            total: old.total - 1,
          };
        });
      });

      return { previousData };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.infiniteAll });
      queryClient.invalidateQueries({ queryKey: financialAccountKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}
