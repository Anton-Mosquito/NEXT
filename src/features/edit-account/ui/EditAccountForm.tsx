"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateFinancialAccountMutation } from "@/entities/financial-account";
import { Button, Input, Spinner } from "@/shared/ui";
import {
  editAccountSchema,
  type EditAccountFormValues,
} from "../lib/editAccountSchema";

interface EditAccountFormProps {
  accountId: string;
  name: string;
  currency: string;
  onSuccess: () => void;
}

export function EditAccountForm({
  accountId,
  name,
  currency,
  onSuccess,
}: EditAccountFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateAccount = useUpdateFinancialAccountMutation();
  const form = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: { name, currency },
  });

  const onSubmit = async (values: EditAccountFormValues) => {
    setSubmitError(null);

    try {
      await updateAccount.mutateAsync({ id: accountId, input: values });
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to update account",
      );
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Input
        label="Account name"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />
      <Input
        label="Currency"
        {...form.register("currency")}
        error={form.formState.errors.currency?.message}
      />

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateAccount.isPending}>
          {updateAccount.isPending ? <Spinner /> : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
