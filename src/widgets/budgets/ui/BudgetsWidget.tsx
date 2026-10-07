"use client";

import { useState } from "react";
import {
  useBudgetsQuery,
  useDeleteBudgetMutation,
} from "@/entities/budget/api/budgetQueries";
import { BudgetProgressCard } from "@/shared/ui/BudgetProgressCard";
import { AddBudgetForm } from "@/features/add-budget/ui/AddBudgetForm";
import { Button, Card, EmptyState, Skeleton } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BudgetsWidget() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: budgets, isLoading } = useBudgetsQuery(currentMonth);
  const deleteMutation = useDeleteBudgetMutation();

  const formatMonth = (m: string) => {
    const [y, mon] = m.split("-").map(Number);
    const d = new Date(y, mon - 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const goToPrevMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const d = new Date(y, m - 2);
    setCurrentMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const goToNextMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const d = new Date(y, m);
    setCurrentMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const formatMoney = (val: number) =>
    val.toLocaleString("uk-UA", { style: "currency", currency: "UAH" });

  const totalLimit = budgets?.reduce((acc, b) => acc + b.limitAmount, 0) || 0;
  const totalSpent = budgets?.reduce((acc, b) => acc + b.spentAmount, 0) || 0;
  const onTrackCount = budgets?.filter((b) => b.status === "ok").length || 0;

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteMutation.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-card p-1 shadow-sm">
            <button
              onClick={goToPrevMonth}
              className="rounded-lg p-2 hover:bg-muted text-gray-02 hover:text-foreground transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="w-32 text-center font-medium text-foreground">
              {formatMonth(currentMonth)}
            </span>
            <button
              onClick={goToNextMonth}
              className="rounded-lg p-2 hover:bg-muted text-gray-02 hover:text-foreground transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <Button onClick={() => setAddOpen(true)}>+ Add Budget</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-02">Total budgeted</p>
          <p className="mt-2 text-2xl font-bold">{formatMoney(totalLimit)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-02">Total spent</p>
          <p className="mt-2 text-2xl font-bold">{formatMoney(totalSpent)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-02">Budgets on track</p>
          <p className="mt-2 text-2xl font-bold">
            {onTrackCount}{" "}
            <span className="text-sm text-gray-02">
              / {budgets?.length || 0}
            </span>
          </p>
        </Card>
      </div>

      {/* Grid of Budgets */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : !budgets || budgets.length === 0 ? (
        <>
          <EmptyState
            title="No budgets found"
            description={`You haven't set any budgets for ${formatMonth(currentMonth)}.`}
          />
          <Button onClick={() => setAddOpen(true)} className="mt-4">
            Create your first budget
          </Button>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetProgressCard
              key={b.id}
              categoryName={b.categoryName}
              categoryColor={b.categoryColor}
              limitAmount={b.limitAmount}
              spentAmount={b.spentAmount}
              percentage={b.percentage}
              remaining={b.remaining}
              status={b.status}
              onDelete={() => setDeleteTarget(b.id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
          </DialogHeader>
          <AddBudgetForm onSuccess={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
