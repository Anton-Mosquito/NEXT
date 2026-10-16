"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  monthlySavingsTargetSchema,
  type MonthlySavingsTarget,
  type MonthlySavingsTargetInput,
} from "@/entities/goal";
import { Button } from "@/shared/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GoalAmountDialogProps {
  open: boolean;
  title: string;
  description: string;
  initialAmount: number | null;
  onClose: () => void;
  onSave: (amount: number) => Promise<void>;
}

export function GoalAmountDialog({
  open,
  title,
  description,
  initialAmount,
  onClose,
  onSave,
}: GoalAmountDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MonthlySavingsTargetInput, unknown, MonthlySavingsTarget>({
    resolver: zodResolver(monthlySavingsTargetSchema),
    defaultValues: {
      amount: initialAmount?.toString() ?? "",
    },
  });

  useEffect(() => {
    if (open) reset({ amount: initialAmount?.toString() ?? "" });
  }, [initialAmount, open, reset]);

  const submit = handleSubmit(async ({ amount }) => {
    try {
      await onSave(amount);
      onClose();
    } catch (error) {
      setError("root.server", {
        message:
          error instanceof Error ? error.message : "Unable to save this goal.",
      });
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isSubmitting) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-amount">Monthly goal amount (₴)</Label>
            <Input
              id="goal-amount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "goal-amount-error" : undefined}
              {...register("amount")}
            />
            {errors.amount && (
              <p id="goal-amount-error" className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {errors.root?.server && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.server.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
