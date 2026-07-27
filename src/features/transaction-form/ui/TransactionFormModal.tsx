"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, Input, Modal } from "@/shared/ui";
import { Spinner } from "@/shared/ui/Spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesQuery } from "@/entities/category/api/categoryQueries";
import { useFinancialAccountsQuery } from "@/entities/financial-account/api/financialAccountQueries";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/entities/transaction/api/transactionQueries";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Must be greater than 0"),
  financialAccountId: z.string().min(1, "Select an account"),
  categoryId: z.string().min(1, "Select a category"),
  description: z.string().max(200).optional(),
  date: z.date(),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: string;
    amount: number;
    type: "income" | "expense";
    description: string | null;
    date: string;
    categoryId: string;
    financialAccountId: string;
  };
}

export function TransactionFormModal({
  open,
  onOpenChange,
  editData,
}: TransactionFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createTransaction = useCreateTransactionMutation();
  const updateTransaction = useUpdateTransactionMutation();
  const { data: accounts, isLoading: accountsLoading } =
    useFinancialAccountsQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      type: editData?.type ?? "expense",
      amount: editData?.amount ?? 0,
      financialAccountId: editData?.financialAccountId ?? "",
      categoryId: editData?.categoryId ?? "",
      description: editData?.description ?? "",
      date: editData?.date ? new Date(editData.date) : new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: editData?.type ?? "expense",
        amount: editData?.amount ?? 0,
        financialAccountId: editData?.financialAccountId ?? "",
        categoryId: editData?.categoryId ?? "",
        description: editData?.description ?? "",
        date: editData?.date ? new Date(editData.date) : new Date(),
      });
      setSubmitError(null);
    }
  }, [editData, form, open]);

  const selectedTypeValue = form.watch("type");
  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesQuery(selectedTypeValue);

  const formattedDate = useMemo(() => {
    const value = form.getValues("date");
    return value
      ? value.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Pick a date";
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      if (editData) {
        await updateTransaction.mutateAsync({
          id: editData.id,
          input: {
            amount: values.amount,
            description: values.description ?? null,
            date: values.date.toISOString(),
            categoryId: values.categoryId,
          },
        });
      } else {
        await createTransaction.mutateAsync({
          financialAccountId: values.financialAccountId,
          categoryId: values.categoryId,
          amount: values.amount,
          type: values.type,
          description: values.description ?? undefined,
          date: values.date.toISOString(),
        });
      }

      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save transaction",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title={editData ? "Edit Transaction" : "Add Transaction"}
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <ToggleGroup
            type="single"
            value={selectedTypeValue}
            onValueChange={(value) =>
              form.setValue("type", value as FormValues["type"], {
                shouldValidate: true,
              })
            }
            className="w-full"
          >
            <ToggleGroupItem
              value="income"
              className="flex-1 data-[state=on]:bg-green-600 data-[state=on]:text-white"
            >
              Income
            </ToggleGroupItem>
            <ToggleGroupItem
              value="expense"
              className="flex-1 data-[state=on]:bg-red-600 data-[state=on]:text-white"
            >
              Expense
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Input
          label="Amount (₴)"
          type="number"
          step="0.01"
          {...form.register("amount")}
          error={form.formState.errors.amount?.message}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium">Account</label>
          {accountsLoading ? (
            <div className="h-10 rounded-md border border-input bg-muted/40" />
          ) : (
            <Select
              value={form.watch("financialAccountId")}
              onValueChange={(value) =>
                form.setValue("financialAccountId", value, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {form.formState.errors.financialAccountId?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.financialAccountId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          {categoriesLoading ? (
            <div className="h-10 rounded-md border border-input bg-muted/40" />
          ) : (
            <Select
              value={form.watch("categoryId")}
              onValueChange={(value) =>
                form.setValue("categoryId", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {form.formState.errors.categoryId?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {field.value
                      ? field.value.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {form.formState.errors.date?.message ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.date.message}
            </p>
          ) : null}
        </div>

        <Input
          label="Description"
          placeholder="Add a note..."
          {...form.register("description")}
          error={form.formState.errors.description?.message}
        />

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createTransaction.isPending || updateTransaction.isPending
            }
          >
            {createTransaction.isPending || updateTransaction.isPending ? (
              <Spinner />
            ) : editData ? (
              "Save changes"
            ) : (
              "Create transaction"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
