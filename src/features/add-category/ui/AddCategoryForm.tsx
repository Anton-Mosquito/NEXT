"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateCategoryMutation } from "@/entities/category/api/categoryQueries";
import { Button, Input } from "@/shared/ui";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z.enum(["income", "expense"]),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default("#6b7280"),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddCategoryFormProps {
  onSuccess: () => void;
}

export function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createCategory = useCreateCategoryMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      type: "income",
      color: "#6b7280",
      icon: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    try {
      await createCategory.mutateAsync(values);
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create category",
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        label="Category name"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <ToggleGroup
          type="single"
          value={form.getValues("type")}
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

      <label className="flex items-center gap-2">
        <span className="text-sm font-medium">Color</span>
        <input
          type="color"
          {...form.register("color")}
          className="h-10 w-10 cursor-pointer rounded border-0"
        />
      </label>

      <Input
        label="Icon (emoji)"
        placeholder="e.g. 🍔"
        {...form.register("icon")}
        error={form.formState.errors.icon?.message}
      />

      {submitError ? (
        <p className="text-sm text-destructive">{submitError}</p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={createCategory.isPending}>
          {createCategory.isPending ? "Creating..." : "Create category"}
        </Button>
      </div>
    </form>
  );
}
