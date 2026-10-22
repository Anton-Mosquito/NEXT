"use client";

import { useBillsQuery } from "@/entities/bill/api/billQueries";
import { useDashboardSummaryQuery } from "@/entities/dashboard/api/dashboardQueries";
import { useFinancialAccountsQuery } from "@/entities/financial-account/api/financialAccountQueries";
import { useSavingsGoalOverviewQuery } from "@/entities/goal/api/goalQueries";
import { Card } from "@/shared/ui";
import { ExpenseDonutChart } from "@/shared/ui/charts/ExpenseDonutChart";
import { IncomeExpenseBarChart } from "@/shared/ui/charts/IncomeExpenseBarChart";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  GoalsCard,
  RecentTransactionsCard,
  TotalBalanceCard,
  UpcomingBillCard,
} from "./OverviewSections";

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

function MetricCard({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <Card className="rounded-lg border-0 bg-card p-5 shadow-[0_20px_25px_rgba(76,103,100,0.10)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-sm font-medium leading-5 text-muted-foreground">
            {title}
          </h2>
          {isLoading ? (
            <div
              aria-label={`Loading ${title.toLowerCase()}`}
              className="h-8 w-36 animate-pulse rounded bg-muted"
            />
          ) : (
            <p className="text-2xl font-bold leading-8 text-foreground">
              {currencyFormatter.format(value)}
            </p>
          )}
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
      </div>
    </Card>
  );
}

export function DashboardOverview() {
  const summaryQuery = useDashboardSummaryQuery();
  const accountsQuery = useFinancialAccountsQuery();
  const goalQuery = useSavingsGoalOverviewQuery();
  const billsQuery = useBillsQuery();
  const data = summaryQuery.data;
  const isSummaryLoading = summaryQuery.isLoading;

  return (
    <div className="flex w-full max-w-[1104px] flex-col gap-8">
      <section
        aria-label="Financial overview"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        <TotalBalanceCard
          accounts={accountsQuery.data ?? []}
          totalBalance={data?.totalBalance ?? 0}
          isLoading={accountsQuery.isLoading || isSummaryLoading}
          hasError={accountsQuery.isError || summaryQuery.isError}
        />
        <GoalsCard
          goal={goalQuery.data}
          isLoading={goalQuery.isLoading}
          hasError={goalQuery.isError}
        />
        <UpcomingBillCard
          bills={billsQuery.data ?? []}
          isLoading={billsQuery.isLoading}
          hasError={billsQuery.isError}
        />
      </section>

      <section
        aria-label="Dashboard details"
        className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,352px)_minmax(0,1fr)]"
      >
        <RecentTransactionsCard
          transactions={data?.recentTransactions ?? []}
          isLoading={isSummaryLoading}
          hasError={summaryQuery.isError}
        />

        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MetricCard
              title="Monthly Income"
              value={data?.currentMonthIncome ?? 0}
              icon={<TrendingUp aria-hidden="true" size={20} />}
              isLoading={isSummaryLoading}
            />
            <MetricCard
              title="Monthly Expense"
              value={data?.currentMonthExpense ?? 0}
              icon={<TrendingDown aria-hidden="true" size={20} />}
              isLoading={isSummaryLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <IncomeExpenseBarChart
              data={data?.last7DaysBalance ?? []}
              isLoading={isSummaryLoading}
            />
            <ExpenseDonutChart
              data={data?.expenseByCategory ?? []}
              isLoading={isSummaryLoading}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
