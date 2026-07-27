"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTransactionMutation } from "@/entities/transaction/api/transactionQueries";

interface DeleteTransactionDialogProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({
  transactionId,
  open,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const deleteTransaction = useDeleteTransactionMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);

    try {
      await deleteTransaction.mutateAsync(transactionId);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete transaction",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the transaction and adjust the account balance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteTransaction.isPending}
          >
            {deleteTransaction.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
