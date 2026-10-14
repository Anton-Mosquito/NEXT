"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBillMutation } from "@/entities/bill";
import { Button } from "@/shared/ui";

interface DeleteBillDialogProps {
  billId: string;
  billTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBillDialog({
  billId,
  billTitle,
  open,
  onOpenChange,
}: DeleteBillDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const deleteBill = useDeleteBillMutation();

  const handleDelete = async () => {
    setError(null);

    try {
      await deleteBill.mutateAsync(billId);
      onOpenChange(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete bill.",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete bill?</AlertDialogTitle>
          <AlertDialogDescription>
            Delete “{billTitle}”? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteBill.isPending}
          >
            {deleteBill.isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
