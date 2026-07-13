"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "./categoryActions";

export const categoryKeys = {
  all: ["categories"] as const,
  byType: (type?: "income" | "expense") => ["categories", type] as const,
};

/**
 * Fetch categories, optionally filtered by type
 */
export function useCategoriesQuery(type?: "income" | "expense") {
  return useQuery({
    queryKey: categoryKeys.byType(type),
    queryFn: () => getCategories(type),
  });
}

/**
 * Create a new category
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * Delete a category
 */
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
