"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@/shared/ui";
import { Spinner } from "@/shared/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateFinancialAccountMutation } from "@/entities/financial-account/api/financialAccountQueries";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z.enum(["cash", "card", "savings", "crypto"]),
  currency: z.string().min(1, "Currency is required"),
  balance: z.coerce.number().min(0, "Balance must be 0 or greater"),
});

type FormValues = z.infer<typeof schema>;

interface AddAccountFormProps {
  onSuccess: () => void;
}

const accountTypeOptions = [
  { value: "cash", label: "💵 Cash" },
  { value: "card", label: "💳 Card" },
  { value: "savings", label: "🐷 Savings" },
  { value: "crypto", label: "₿ Crypto" },
] as const;

export function AddAccountForm({ onSuccess }: AddAccountFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createAccount = useCreateFinancialAccountMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      type: "cash",
      currency: "UAH",
      balance: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      await createAccount.mutateAsync(values);
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create account",
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        label="Account name"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium">Account type</label>
        <Select
          value={form.getValues("type")}
          onValueChange={(value) =>
            form.setValue("type", value as FormValues["type"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type?.message ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.type.message}
          </p>
        ) : null}
      </div>

      <Input
        label="Currency"
        defaultValue="UAH"
        {...form.register("currency")}
        error={form.formState.errors.currency?.message}
      />

      <Input
        label="Initial balance"
        type="number"
        min="0"
        step="0.01"
        {...form.register("balance")}
        error={form.formState.errors.balance?.message}
      />

      {submitError ? (
        <p className="text-sm text-destructive">{submitError}</p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createAccount.isPending}>
          {createAccount.isPending ? <Spinner /> : "Create account"}
        </Button>
      </div>
    </form>
  );
}
