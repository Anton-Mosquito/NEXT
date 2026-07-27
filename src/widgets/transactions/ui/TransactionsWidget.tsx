"use client";

import { useState } from "react";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { TransactionItem } from "@/shared/ui/TransactionItem";
import { TransactionsFilterBar } from "@/shared/ui/TransactionsFilterBar";
import { Button } from "@/shared/ui";
import { TransactionFormModal } from "@/features/transaction-form/ui/TransactionFormModal";
import { DeleteTransactionDialog } from "@/features/delete-transaction/ui/DeleteTransactionDialog";
import {
  useTransactionsQuery,
  type TransactionFilters,
} from "@/entities/transaction/api/transactionQueries";
import { useFinancialAccountsQuery } from "@/entities/financial-account/api/financialAccountQueries";
import { useCategoriesQuery } from "@/entities/category/api/categoryQueries";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TransactionList } from "@/shared/ui/TransactionList";

export function TransactionsWidget() {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
  });
  const [formModal, setFormModal] = useState<{
    open: boolean;
    editData?: React.ComponentProps<typeof TransactionFormModal>["editData"];
  }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
  } | null>(null);

  const { data, isLoading } = useTransactionsQuery(filters);
  const { data: accounts } = useFinancialAccountsQuery();
  const { data: categories } = useCategoriesQuery();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and manage your latest income and expense entries.
          </p>
        </div>
        <Button onClick={() => setFormModal({ open: true })}>
          + Add Transaction
        </Button>
      </div>

      <TransactionsFilterBar
        filters={filters}
        onFiltersChange={(nextFilters) =>
          setFilters({ ...nextFilters, page: 1 })
        }
        accounts={accounts ?? []}
        categories={categories ?? []}
      />

      <Card className="mt-4">
        {isLoading ? (
          <TransactionList transactions={[]} isLoading />
        ) : data?.data.length ? (
          <div className="space-y-3">
            {data.data.map((transaction) => {
              const normalizedAmount = Number(transaction.amount);
              const normalizedDate =
                transaction.date instanceof Date
                  ? transaction.date.toISOString()
                  : String(transaction.date);

              return (
                <TransactionItem
                  key={transaction.id}
                  {...transaction}
                  type={transaction.type as "income" | "expense"}
                  amount={normalizedAmount}
                  date={normalizedDate}
                  variant="card"
                  onEdit={() =>
                    setFormModal({
                      open: true,
                      editData: {
                        id: transaction.id,
                        amount: normalizedAmount,
                        type: transaction.type as "income" | "expense",
                        description: transaction.description,
                        date: normalizedDate,
                        categoryId: transaction.categoryId,
                        financialAccountId: transaction.accountId,
                      },
                    })
                  }
                  onDelete={() => setDeleteTarget({ id: transaction.id })}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters or create a new transaction."
          />
        )}
      </Card>

      {data && data.totalPages > 1 ? (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if ((filters.page ?? 1) > 1) {
                      setFilters((current) => ({
                        ...current,
                        page: (current.page ?? 1) - 1,
                      }));
                    }
                  }}
                />
              </PaginationItem>
              {Array.from(
                { length: data.totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === (filters.page ?? 1)}
                    onClick={(event) => {
                      event.preventDefault();
                      setFilters((current) => ({ ...current, page }));
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if ((filters.page ?? 1) < data.totalPages) {
                      setFilters((current) => ({
                        ...current,
                        page: (current.page ?? 1) + 1,
                      }));
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      <TransactionFormModal
        open={formModal.open}
        onOpenChange={(open) => {
          if (!open) setFormModal({ open: false });
        }}
        editData={formModal.editData}
      />

      <DeleteTransactionDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        transactionId={deleteTarget?.id ?? ""}
      />
    </div>
  );
}
