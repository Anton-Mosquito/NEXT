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
import { useDeleteCategoryMutation } from "@/entities/category/api/categoryQueries";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategoryMutation();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);

    try {
      await deleteCategory.mutateAsync(categoryId);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete category",
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            Delete “{categoryName}”? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
