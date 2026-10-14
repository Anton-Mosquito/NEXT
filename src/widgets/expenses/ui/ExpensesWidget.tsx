"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bus,
  ChevronDown,
  Clapperboard,
  Home,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useExpensesOverviewQuery,
  type ExpenseComparisonPeriod,
} from "@/entities/analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, EmptyState, ExpenseCard, Skeleton } from "@/shared/ui";

const categoryIcons: Record<string, LucideIcon> = {
  housing: Home,
  home: Home,
  rent: Home,
  food: ShoppingCart,
  groceries: ShoppingCart,
  transportation: Bus,
  transport: Bus,
  entertainment: Clapperboard,
  shopping: ShoppingBag,
  others: LayoutGrid,
};

const comparisonPeriods: ExpenseComparisonPeriod[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

const periodLabels: Record<ExpenseComparisonPeriod, string> = {
  daily: "Daily Comparison",
  weekly: "Weekly Comparison",
  monthly: "Monthly Comparison",
  yearly: "Yearly Comparison",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

function ExpensesLoadingState() {
  return (
    <div className="space-y-6">
      <section aria-label="Expenses Comparison" className="space-y-4">
        <Skeleton className="h-7 w-56" />
        <Card className="space-y-6 p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </section>
      <section aria-label="Expenses Breakdown" className="space-y-4">
        <Skeleton className="h-7 w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-[238px] w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ExpensesWidget() {
  const router = useRouter();
  const [period, setPeriod] = useState<ExpenseComparisonPeriod>("monthly");
  const { data, isLoading, isError, error, refetch } =
    useExpensesOverviewQuery(period);

  if (isLoading) return <ExpensesLoadingState />;

  if (isError || !data) {
    return (
      <section aria-labelledby="expenses-heading" className="space-y-4">
        <h1
          id="expenses-heading"
          className="text-2xl font-bold text-foreground"
        >
          Expenses
        </h1>
        <EmptyState
          title="Unable to load expenses"
          description={
            error instanceof Error ? error.message : "Please try again."
          }
          action={{ label: "Try again", onClick: () => void refetch() }}
        />
      </section>
    );
  }

  const chartData = data.monthlyComparison.map((point) => ({
    ...point,
  }));

  return (
    <div className="min-h-full space-y-6 bg-[#F4F5F7] p-0 dark:bg-background">
      <section
        aria-labelledby="expenses-comparison-heading"
        className="space-y-4"
      >
        <h1
          id="expenses-comparison-heading"
          className="text-2xl font-bold text-foreground"
        >
          Expenses Comparison
        </h1>

        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-sm text-base font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Choose expenses comparison period"
                >
                  <span>{periodLabels[period]}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={period}
                  onValueChange={(value) => {
                    const nextPeriod = comparisonPeriods.find(
                      (candidate) => candidate === value,
                    );
                    if (nextPeriod) setPeriod(nextPeriod);
                  }}
                >
                  {comparisonPeriods.map((value) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                      {periodLabels[value]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              aria-label="Chart legend"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-sm bg-[#299D91]"
                />
                {data.currentPeriod}
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-sm bg-[#D9DEE5]"
                />
                {data.previousPeriod}
              </span>
            </div>
          </div>

          {chartData.every(
            (month) => month.current === 0 && month.previous === 0,
          ) ? (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No expense transactions are available for this comparison.
              </p>
            </div>
          ) : (
            <div
              role="img"
              aria-label={`${periodLabels[period]} comparing ${data.currentPeriod} with ${data.previousPeriod}`}
              className="h-[300px] w-full text-sm"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                  barCategoryGap="24%"
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#E6E9ED"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#7A8492", fontSize: 12 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#7A8492", fontSize: 12 }}
                    tickFormatter={(value: number) =>
                      currencyFormatter.format(value)
                    }
                    width={76}
                  />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === "number"
                        ? currencyFormatter.format(value)
                        : "",
                    ]}
                    labelFormatter={(label) => String(label)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E6E9ED",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                  <Bar
                    dataKey="previous"
                    name={data.previousPeriod}
                    fill="#D9DEE5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="current"
                    name={data.currentPeriod}
                    fill="#299D91"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </section>

      <section
        aria-labelledby="expenses-breakdown-heading"
        className="space-y-4"
      >
        <h2
          id="expenses-breakdown-heading"
          className="text-2xl font-bold text-foreground"
        >
          Expenses Breakdown
        </h2>

        {data.categories.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.categories.map((category) => {
              const normalizedIcon = category.icon
                ?.replace(/[^a-z]/gi, "")
                .toLowerCase();
              const Icon =
                categoryIcons[normalizedIcon ?? ""] ??
                categoryIcons[category.name.toLowerCase()] ??
                Tag;
              const trend =
                category.total >= category.previousTotal ? "up" : "down";
              const changePercent =
                category.previousTotal === 0
                  ? "New"
                  : `${Math.round(
                      (Math.abs(category.total - category.previousTotal) /
                        category.previousTotal) *
                        100,
                    )}%`;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/transactions?categoryId=${encodeURIComponent(category.id)}`,
                    )
                  }
                  aria-label={`View ${category.name} transactions`}
                  className="w-full rounded-lg text-left transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ExpenseCard
                    icon={
                      <Icon
                        size={24}
                        style={
                          category.color ? { color: category.color } : undefined
                        }
                        aria-hidden="true"
                      />
                    }
                    category={category.name}
                    totalAmount={currencyFormatter.format(category.total)}
                    changePercent={changePercent}
                    trend={trend}
                    comparisonLabel={data.comparisonLabel}
                    items={category.transactions.map((transaction) => ({
                      label: transaction.description || category.name,
                      amount: currencyFormatter.format(transaction.amount),
                      date: formatDate(transaction.date),
                    }))}
                    className="max-w-none"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No expenses this month"
            description="Expense categories will appear here after you add transactions for the current month."
            className="w-full"
          />
        )}
      </section>
    </div>
  );
}
