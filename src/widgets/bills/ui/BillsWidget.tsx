"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, Modal, Skeleton } from "@/shared/ui";
import { Badge } from "@/shared/ui/Badge";
import {
  useBillsQuery,
  useCreateBillMutation,
  useMarkBillPaidMutation,
  useUpdateBillMutation,
  type Bill,
  type BillInput,
  type BillUpdateInput,
} from "@/entities/bill";
import { BillForm } from "@/features/manage-bills";
import { DeleteBillDialog } from "@/features/manage-bills";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const formatAmount = (amount: string, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));

const formValuesFromBill = (bill: Bill) => ({
  vendorName: bill.vendorName,
  title: bill.title,
  description: bill.description,
  dueDate: bill.dueDate,
  lastChargeDate: bill.lastChargeDate ?? "",
  amount: Number(bill.amount),
  currency: bill.currency,
});

export function BillsWidget() {
  const { data: bills, isLoading, isError, error, refetch } = useBillsQuery();
  const createBill = useCreateBillMutation();
  const updateBill = useUpdateBillMutation();
  const markBillPaid = useMarkBillPaidMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [deletingBill, setDeletingBill] = useState<Bill | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreateForm = () => {
    setEditingBill(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = (bill: Bill) => {
    setEditingBill(bill);
    setFormError(null);
    setFormOpen(true);
  };

  const handleSaveBill = async (values: BillInput) => {
    setFormError(null);

    try {
      if (editingBill) {
        const input: BillUpdateInput = values;
        await updateBill.mutateAsync({ id: editingBill.id, input });
      } else {
        await createBill.mutateAsync(values);
      }
      setFormOpen(false);
      setEditingBill(null);
    } catch (saveError) {
      setFormError(
        saveError instanceof Error ? saveError.message : "Unable to save bill.",
      );
    }
  };

  const handleMarkPaid = async (billId: string) => {
    setActionError(null);

    try {
      await markBillPaid.mutateAsync(billId);
    } catch (paidError) {
      setActionError(
        paidError instanceof Error
          ? paidError.message
          : "Unable to update bill status.",
      );
    }
  };

  return (
    <div className="-m-4 min-h-full bg-[#F4F5F7] p-4 dark:bg-background md:-m-6 md:p-6">
      <section
        aria-labelledby="upcoming-bills-heading"
        className="flex w-full max-w-276 flex-col gap-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1
            id="upcoming-bills-heading"
            className="text-[22px] font-normal leading-8 text-[#878787] dark:text-muted-foreground"
          >
            Upcoming Bills
          </h1>
          <Button onClick={openCreateForm}>
            <Plus aria-hidden="true" />
            Add Bill
          </Button>
        </div>

        {actionError ? (
          <p className="text-sm text-destructive" role="alert">
            {actionError}
          </p>
        ) : null}

        {isLoading ? (
          <Card padding="md" className="flex flex-col gap-4">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-36 w-full" />
            ))}
          </Card>
        ) : isError ? (
          <EmptyState
            title="Unable to load bills"
            description={
              error instanceof Error ? error.message : "Please try again."
            }
            action={{ label: "Try again", onClick: () => void refetch() }}
            className="w-full"
          />
        ) : bills?.length ? (
          <Card
            padding="none"
            className="gap-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(76,103,100,0.10)] dark:bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-4 md:px-6">Due Date</TableHead>
                  <TableHead className="px-4 py-4 md:px-6">Logo</TableHead>
                  <TableHead className="min-w-64 px-4 py-4 md:px-6">
                    Item Description
                  </TableHead>
                  <TableHead className="px-4 py-4 md:px-6">
                    Last Charge
                  </TableHead>
                  <TableHead className="px-4 py-4 text-right md:px-6">
                    Amount
                  </TableHead>
                  <TableHead className="px-4 py-4 text-right md:px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => {
                  const [dueYear, dueMonth, dueDay] = bill.dueDate
                    .slice(0, 10)
                    .split("-")
                    .map(Number);
                  const dueDate = new Date(
                    Date.UTC(dueYear, dueMonth - 1, dueDay),
                  );

                  return (
                    <TableRow key={bill.id} className="align-top">
                      <TableCell className="px-4 py-5 md:px-6">
                        <div className="flex min-w-16 flex-col items-center rounded-lg bg-muted px-3 py-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              timeZone: "UTC",
                            }).format(dueDate)}
                          </span>
                          <span className="text-xl font-bold">
                            {new Intl.DateTimeFormat("en-US", {
                              day: "numeric",
                              timeZone: "UTC",
                            }).format(dueDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-5 font-semibold md:px-6">
                        {bill.vendorName}
                      </TableCell>
                      <TableCell className="min-w-64 whitespace-normal px-4 py-5 md:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{bill.title}</span>
                          {bill.status === "paid" ? (
                            <Badge variant="success">Paid</Badge>
                          ) : (
                            <Badge variant="warning">Unpaid</Badge>
                          )}
                        </div>
                        <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                          {bill.description}
                        </p>
                      </TableCell>
                      <TableCell className="px-4 py-5 text-muted-foreground md:px-6">
                        {bill.lastChargeDate
                          ? formatDate(bill.lastChargeDate)
                          : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-5 text-right font-semibold md:px-6">
                        <span className="inline-flex rounded-md border border-border px-4 py-2">
                          {formatAmount(bill.amount, bill.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-5 md:px-6">
                        <div className="flex justify-end gap-1">
                          {bill.status === "unpaid" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Mark ${bill.title} as paid`}
                              disabled={markBillPaid.isPending}
                              onClick={() => void handleMarkPaid(bill.id)}
                            >
                              <Check aria-hidden="true" />
                              <span className="sr-only">Mark as paid</span>
                            </Button>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Edit ${bill.title}`}
                            onClick={() => openEditForm(bill)}
                          >
                            <Pencil aria-hidden="true" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${bill.title}`}
                            onClick={() => setDeletingBill(bill)}
                          >
                            <Trash2 aria-hidden="true" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <EmptyState
            title="No bills found"
            description="Add a bill to keep track of upcoming payments."
            action={{ label: "Add Bill", onClick: openCreateForm }}
            className="w-full"
          />
        )}
      </section>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingBill ? "Edit Bill" : "Add Bill"}
        className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl"
      >
        <BillForm
          key={editingBill?.id ?? "new-bill"}
          initialValues={
            editingBill ? formValuesFromBill(editingBill) : undefined
          }
          onSubmit={handleSaveBill}
          onCancel={() => setFormOpen(false)}
          isPending={createBill.isPending || updateBill.isPending}
          error={formError}
        />
      </Modal>

      <DeleteBillDialog
        open={!!deletingBill}
        billId={deletingBill?.id ?? ""}
        billTitle={deletingBill?.title ?? ""}
        onOpenChange={(open) => {
          if (!open) setDeletingBill(null);
        }}
      />
    </div>
  );
}
