"use client";

import { StatCard } from "@/shared/ui";
import { TransactionList } from "@/shared/ui";
import { Card } from "@/shared/ui";
import { ExpenseDonutChart } from "../../../shared/ui/charts/ExpenseDonutChart";
import { IncomeExpenseBarChart } from "../../../shared/ui/charts/IncomeExpenseBarChart";
import { useDashboardSummaryQuery } from "@/entities/dashboard/api/dashboardQueries";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { TransactionItemProps } from "@/shared/ui/TransactionItem";

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function DashboardOverview() {
  const { data, isLoading } = useDashboardSummaryQuery();

  const recentTransactions: TransactionItemProps[] =
    data?.recentTransactions?.slice(0, 5).map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: Number(transaction.amount),
      type: transaction.type === "income" ? "income" : "expense",
      date: transaction.date,
      categoryName: transaction.categoryName,
      categoryColor: transaction.categoryColor,
      accountName: transaction.accountName,
      variant: "row",
    })) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard
          title="Total Balance"
          value={formatCurrency(data?.totalBalance ?? 0)}
          subtitle="All accounts"
          icon={<Wallet size={20} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(data?.currentMonthIncome ?? 0)}
          subtitle="This month"
          icon={<TrendingUp size={20} />}
          isLoading={isLoading}
        />
        <StatCard
          title="Monthly Expense"
          value={formatCurrency(data?.currentMonthExpense ?? 0)}
          subtitle="This month"
          icon={<TrendingDown size={20} />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <IncomeExpenseBarChart
          data={data?.last7DaysBalance ?? []}
          isLoading={isLoading}
        />
        <ExpenseDonutChart
          data={data?.expenseByCategory ?? []}
          isLoading={isLoading}
        />
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Transactions
          </h3>
          <span className="text-sm text-gray-02">Latest 5</span>
        </div>
        <TransactionList
          transactions={recentTransactions}
          isLoading={isLoading}
          emptyMessage="No recent transactions yet."
        />
      </Card>
    </div>
  );
}
