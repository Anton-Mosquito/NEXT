import { cn } from "@/lib/utils";
import { TransactionItem, type TransactionItemProps } from "./TransactionItem";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

interface TransactionListProps {
  transactions: TransactionItemProps[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const COLUMNS = [
  "Category",
  "Description",
  "Date",
  "Account",
  "Amount",
] as const;

export function TransactionList({
  transactions,
  isLoading,
  emptyMessage = "No transactions found.",
  className,
}: TransactionListProps) {
  
  if (isLoading) {
    return (
      <div className={cn("w-full rounded-2xl border border-bg-special bg-card p-4 space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions"
        description={emptyMessage}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-bg-special bg-card",
        className,
      )}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-bg-special">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className={cn(
                  "px-4 py-4 text-heading-md text-gray-01",
                  col === "Amount" ? "text-right" : "text-left",
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} variant="row" {...tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
