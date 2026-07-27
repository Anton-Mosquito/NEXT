"use client";

import { useAnalyticsQuery } from "@/entities/analytics/api/analyticsQueries";
import { MonthlyTrendChart } from "@/shared/ui/charts/MonthlyTrendChart";
import { TopCategoriesChart } from "@/shared/ui/charts/TopCategoriesChart";
import { MonthComparisonWidget } from "@/shared/ui/MonthComparisonWidget";
import { Card, Skeleton } from "@/shared/ui";
import { TransactionItem } from "@/shared/ui/TransactionItem";

export function AnalyticsWidget() {
  const { data, isLoading } = useAnalyticsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      </div>

      {/* Row 1: Monthly Trend */}
      <div>
        <MonthlyTrendChart data={data?.monthlyTrend || []} isLoading={isLoading} />
      </div>

      {/* Row 2: Categories and Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopCategoriesChart data={data?.topCategories || []} isLoading={isLoading} />
        <MonthComparisonWidget data={data?.monthComparison} isLoading={isLoading} />
      </div>

      {/* Row 3: Biggest Expenses */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">Biggest Expenses This Month</h2>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[72px] w-full" />
            <Skeleton className="h-[72px] w-full" />
            <Skeleton className="h-[72px] w-full" />
          </div>
        ) : !data?.biggestTransactions || data.biggestTransactions.length === 0 ? (
          <div className="text-sm text-gray-02 text-center py-4">No expenses this month yet.</div>
        ) : (
          <div className="space-y-3">
            {data.biggestTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                id={tx.id}
                description={tx.description}
                amount={tx.amount}
                type={tx.type as "expense" | "income"}
                date={tx.date}
                categoryName={tx.categoryName}
                categoryColor={tx.categoryColor}
                accountName={tx.accountName}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
