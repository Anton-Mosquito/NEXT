"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinancialAccountsQuery } from "@/entities/financial-account";
import { useInfiniteTransactionsQuery } from "@/entities/transaction";
import { DeleteAccountDialog } from "@/features/delete-account";
import { EditAccountForm } from "@/features/edit-account";
import { Button, Card, EmptyState, Modal, Skeleton } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccountDetailsWidgetProps {
  accountId: string;
}

const pageSize = 4;
const accountTypeLabels: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  savings: "Savings",
  crypto: "Crypto",
};

const formatBalance = (balance: number, currency: string) =>
  `${balance.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;

const formatTransactionDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

export function AccountDetailsWidget({ accountId }: AccountDetailsWidgetProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const {
    data: accounts,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsErrorValue,
    refetch: refetchAccounts,
  } = useFinancialAccountsQuery();
  const account = accounts?.find((item) => item.id === accountId);
  const {
    data: transactionPage,
    isLoading: transactionsLoading,
    isFetchingNextPage: transactionsFetching,
    isFetchNextPageError: nextPageError,
    isError: transactionsError,
    error: transactionsErrorValue,
    fetchNextPage,
    hasNextPage,
    refetch: refetchTransactions,
  } = useInfiniteTransactionsQuery({
    financialAccountId: accountId,
    limit: pageSize,
  });
  const transactions =
    transactionPage?.pages.flatMap(
      (transactionGroup) => transactionGroup.data,
    ) ?? [];

  if (accountsLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (accountsError) {
    return (
      <EmptyState
        title="Unable to load account"
        description={
          accountsErrorValue instanceof Error
            ? accountsErrorValue.message
            : "Please try again."
        }
        action={{ label: "Try again", onClick: () => void refetchAccounts() }}
        className="w-full"
      />
    );
  }

  if (!account) {
    return (
      <EmptyState
        title="Account not found"
        description="This account may have been removed or is no longer available."
        action={{
          label: "Back to accounts",
          onClick: () => router.push("/accounts"),
        }}
        className="w-full"
      />
    );
  }

  return (
    <div className="-m-4 min-h-full bg-[#F4F5F7] p-4 dark:bg-background md:-m-6 md:p-6">
      <section className="flex w-full max-w-276 flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-normal leading-8 text-[#878787] dark:text-muted-foreground">
            Account Details
          </h1>
        </div>

        <Card
          padding="lg"
          className="gap-6 rounded-lg bg-white shadow-[0_2px_12px_rgba(76,103,100,0.10)] dark:bg-card"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#9F9F9F] dark:text-muted-foreground">
                Account Name
              </dt>
              <dd className="text-base font-semibold text-[#191919] dark:text-foreground">
                {account.name}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#9F9F9F] dark:text-muted-foreground">
                Account Type
              </dt>
              <dd className="text-base font-semibold text-[#191919] dark:text-foreground">
                {accountTypeLabels[account.type] ?? account.type}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-[#9F9F9F] dark:text-muted-foreground">
                Balance
              </dt>
              <dd className="text-base font-semibold text-[#191919] dark:text-foreground">
                {formatBalance(Number(account.balance), account.currency)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="ghost" onClick={() => setDeleteOpen(true)}>
              Remove
            </Button>
            <Button onClick={() => setEditOpen(true)}>Edit Details</Button>
          </div>
        </Card>

        <section
          aria-labelledby="transactions-heading"
          className="flex flex-col gap-4"
        >
          <h2
            id="transactions-heading"
            className="text-xl font-semibold text-[#878787] dark:text-muted-foreground"
          >
            Transactions History
          </h2>

          <Card
            padding="none"
            className="gap-0 rounded-lg bg-white shadow-[0_2px_12px_rgba(76,103,100,0.10)] dark:bg-card"
          >
            {transactionsLoading ? (
              <div
                className="flex flex-col gap-4 p-6"
                aria-label="Loading transactions"
              >
                {Array.from({ length: pageSize }, (_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : transactionsError && transactions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <p className="text-sm text-destructive" role="alert">
                  {transactionsErrorValue instanceof Error
                    ? transactionsErrorValue.message
                    : "Unable to load transactions."}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => void refetchTransactions()}
                >
                  Try again
                </Button>
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Transactions linked to this account will appear here."
                className="w-full border-0 shadow-none"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 py-4 md:px-6">Date</TableHead>
                    <TableHead className="px-4 py-4 md:px-6">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-4 md:px-6">Type</TableHead>
                    <TableHead className="px-4 py-4 md:px-6">
                      Description
                    </TableHead>
                    <TableHead className="px-4 py-4 text-right md:px-6">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="px-4 py-4 md:px-6">
                        {formatTransactionDate(new Date(transaction.date))}
                      </TableCell>
                      <TableCell className="px-4 py-4 md:px-6">
                        {transaction.categoryName}
                      </TableCell>
                      <TableCell className="px-4 py-4 capitalize md:px-6">
                        {transaction.type}
                      </TableCell>
                      <TableCell className="max-w-56 truncate px-4 py-4 md:px-6">
                        {transaction.description || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right font-medium md:px-6">
                        {formatBalance(
                          Number(transaction.amount),
                          account.currency,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {transactions.length > 0 && hasNextPage ? (
              <div className="flex flex-col items-center gap-3 border-t border-border p-5">
                {nextPageError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {transactionsErrorValue instanceof Error
                      ? transactionsErrorValue.message
                      : "Unable to load more transactions."}
                  </p>
                ) : null}
                <Button
                  onClick={() => void fetchNextPage()}
                  disabled={transactionsFetching}
                >
                  {transactionsFetching
                    ? "Loading..."
                    : nextPageError
                      ? "Try again"
                      : "Load More"}
                </Button>
              </div>
            ) : null}
          </Card>
        </section>
      </section>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Account Details"
      >
        <EditAccountForm
          accountId={account.id}
          name={account.name}
          currency={account.currency}
          onSuccess={() => setEditOpen(false)}
        />
      </Modal>

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        accountId={account.id}
        accountName={account.name}
        onSuccess={() => router.push("/accounts")}
      />
    </div>
  );
}
