"use client";

import { useForm } from "react-hook-form";
import { useCategoriesQuery } from "@/entities/category/api/categoryQueries";
import { useCreateBudgetMutation } from "@/entities/budget/api/budgetQueries";
import { Button, LabeledInput, Spinner } from "@/shared/ui";
import { useState } from "react";

interface AddBudgetFormProps {
  onSuccess: () => void;
}

export function AddBudgetForm({ onSuccess }: AddBudgetFormProps) {
  const { data: categories = [], isLoading: catsLoading } = useCategoriesQuery("expense");
  const createMutation = useCreateBudgetMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      categoryId: "",
      amount: "",
      month: (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      })(),
    }
  });

  const onSubmit = async (data: any) => {
    setServerError(null);
    try {
      await createMutation.mutateAsync({
        categoryId: data.categoryId,
        amount: Number(data.amount),
        month: data.month,
      });
      onSuccess();
    } catch (err: any) {
      setServerError(err.message || "Failed to create budget");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Category
        </label>
        <select
          {...register("categoryId", { required: "Category is required" })}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          disabled={catsLoading}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-red-500">{errors.categoryId.message as string}</p>
        )}
      </div>

      <div>
        <LabeledInput
          label="Amount Limit"
          type="number"
          step="0.01"
          {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Must be positive" } })}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-500">{errors.amount.message as string}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Month
        </label>
        <input
          type="month"
          {...register("month", { required: "Month is required" })}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
        />
        {errors.month && (
          <p className="mt-1 text-xs text-red-500">{errors.month.message as string}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting || createMutation.isPending}>
        {(isSubmitting || createMutation.isPending) ? <Spinner /> : "Create Budget"}
      </Button>
    </form>
  );
}
