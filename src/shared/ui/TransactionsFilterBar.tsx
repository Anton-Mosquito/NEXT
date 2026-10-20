"use client";

import { useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/shared/ui/Button";
import type { TransactionFilters } from "@/entities/transaction/api/transactionQueries";

interface TransactionsFilterBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}

interface FilterFormValues {
  type: "all" | "income" | "expense";
  financialAccountId: string;
  categoryId: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export function TransactionsFilterBar({
  filters,
  onFiltersChange,
  accounts,
  categories,
}: TransactionsFilterBarProps) {
  const { control, watch, reset } = useForm<FilterFormValues>({
    defaultValues: {
      type: filters.type ? filters.type : "all",
      financialAccountId: filters.financialAccountId ?? "all",
      categoryId: filters.categoryId ?? "all",
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : null,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : null,
    },
  });

  const values = watch();

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.financialAccountId ||
      filters.categoryId ||
      filters.type ||
      filters.dateFrom ||
      filters.dateTo,
    );
  }, [filters]);

  const updateFilters = (next: Partial<FilterFormValues>) => {
    const nextFilters: TransactionFilters = {
      ...filters,
      type: next.type && next.type !== "all" ? next.type : undefined,
      financialAccountId:
        next.financialAccountId && next.financialAccountId !== "all"
          ? next.financialAccountId
          : undefined,
      categoryId:
        next.categoryId && next.categoryId !== "all"
          ? next.categoryId
          : undefined,
      dateFrom: next.dateFrom
        ? next.dateFrom.toISOString().slice(0, 10)
        : undefined,
      dateTo: next.dateTo ? next.dateTo.toISOString().slice(0, 10) : undefined,
    };

    onFiltersChange(nextFilters);
  };

  const renderDateButton = (value: Date | null, placeholder: string) => {
    return value
      ? value.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : placeholder;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-background/70 p-3">
      <div className="min-w-45 flex-1">
        <Tabs
          value={values.type}
          onValueChange={(value) =>
            updateFilters({
              ...values,
              type: value as FilterFormValues["type"],
            })
          }
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="min-w-45 flex-1">
        <Select
          value={values.financialAccountId}
          onValueChange={(value) =>
            updateFilters({ ...values, financialAccountId: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-45 flex-1">
        <Select
          value={values.categoryId}
          onValueChange={(value) =>
            updateFilters({ ...values, categoryId: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-50 flex-1">
        <Controller
          control={control}
          name="dateFrom"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {renderDateButton(field.value ?? null, "From")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ?? undefined}
                  onSelect={(date) => {
                    field.onChange(date ?? null);
                    updateFilters({ ...values, dateFrom: date ?? null });
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      <div className="min-w-50 flex-1">
        <Controller
          control={control}
          name="dateTo"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {renderDateButton(field.value ?? null, "To")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ?? undefined}
                  onSelect={(date) => {
                    field.onChange(date ?? null);
                    updateFilters({ ...values, dateTo: date ?? null });
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

      {hasActiveFilters ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset({
              type: "all",
              financialAccountId: "all",
              categoryId: "all",
              dateFrom: null,
              dateTo: null,
            });
            onFiltersChange({
              ...filters,
              type: undefined,
              financialAccountId: undefined,
              categoryId: undefined,
              dateFrom: undefined,
              dateTo: undefined,
              page: 1,
            });
          }}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
