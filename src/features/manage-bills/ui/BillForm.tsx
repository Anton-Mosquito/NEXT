"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, Input, Spinner } from "@/shared/ui";
import { billInputSchema, type BillInput } from "@/entities/bill";

type BillFormValues = z.input<typeof billInputSchema>;

interface BillFormProps {
  initialValues?: BillFormValues;
  onSubmit: (values: BillInput) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  error: string | null;
}

const defaultValues = (): BillFormValues => ({
  vendorName: "",
  title: "",
  description: "",
  dueDate: new Date().toISOString().slice(0, 10),
  lastChargeDate: "",
  amount: 0,
  currency: "USD",
});

export function BillForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  error,
}: BillFormProps) {
  const form = useForm<BillFormValues, undefined, BillInput>({
    resolver: zodResolver(billInputSchema),
    defaultValues: initialValues ?? defaultValues(),
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Vendor"
          {...form.register("vendorName")}
          error={form.formState.errors.vendorName?.message}
        />
        <Input
          label="Title"
          {...form.register("title")}
          error={form.formState.errors.title?.message}
        />
        <Input
          label="Due date"
          type="date"
          {...form.register("dueDate")}
          error={form.formState.errors.dueDate?.message}
        />
        <Input
          label="Last charge date"
          type="date"
          {...form.register("lastChargeDate")}
          error={form.formState.errors.lastChargeDate?.message}
        />
        <Input
          label="Amount"
          type="number"
          min="0.01"
          step="0.01"
          {...form.register("amount", { valueAsNumber: true })}
          error={form.formState.errors.amount?.message}
        />
        <Input
          label="Currency"
          maxLength={3}
          {...form.register("currency")}
          error={form.formState.errors.currency?.message}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="bill-description">Description</Label>
        <Textarea
          id="bill-description"
          rows={3}
          {...form.register("description")}
          aria-invalid={!!form.formState.errors.description}
        />
        {form.formState.errors.description?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : "Save Bill"}
        </Button>
      </div>
    </form>
  );
}
