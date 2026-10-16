"use client";

import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bus,
  Clapperboard,
  Home,
  LayoutGrid,
  Pencil,
  ShoppingBag,
  ShoppingCart,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  useCategoryGoalCardsQuery,
  useSetCategoryGoalMutation,
} from "@/entities/budget";
import {
  useSavingsGoalOverviewQuery,
  useSaveMonthlySavingsTargetMutation,
} from "@/entities/goal";
import { GoalAmountDialog } from "@/features/manage-goals";
import { Button, Card, EmptyState, GoalItem, Skeleton } from "@/shared/ui";

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

const categoryOrder = [
  "housing",
  "food",
  "transportation",
  "entertainment",
  "shopping",
  "others",
];

const moneyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  notation: "compact",
  maximumFractionDigits: 1,
});

function getCurrentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function GoalsLoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.6fr)]">
        <Skeleton className="h-[360px] w-full" />
        <Skeleton className="h-[360px] w-full" />
      </div>
      <Skeleton className="h-8 w-72" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}

function SavingsGauge({
  achieved,
  target,
}: {
  achieved: number;
  target: number | null;
}) {
  const progress =
    target && target > 0 ? Math.max(0, Math.min(1, achieved / target)) : 0;
  const circumference = Math.PI * 100;
  const needleAngle = Math.PI + progress * Math.PI;
  const needleX = 120 + 76 * Math.cos(needleAngle);
  const needleY = 110 + 76 * Math.sin(needleAngle);
  const gaugeDescription = target
    ? `${Math.round(progress * 100)} percent of the monthly savings goal`
    : "Monthly savings target not set";

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <svg
        viewBox="0 0 240 145"
        role="img"
        aria-label={gaugeDescription}
        className="w-full"
      >
        <path
          d="M 20 110 A 100 100 0 0 1 220 110"
          fill="none"
          stroke="#E6E9ED"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 20 110 A 100 100 0 0 1 220 110"
          fill="none"
          stroke="#299D91"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
        />
        <line
          x1="120"
          y1="110"
          x2={needleX}
          y2={needleY}
          stroke="#344054"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="120" cy="110" r="7" fill="#344054" />
        <text x="20" y="137" className="fill-muted-foreground text-[12px]">
          ₴0
        </text>
        <text
          x="220"
          y="137"
          textAnchor="end"
          className="fill-muted-foreground text-[12px]"
        >
          {target ? compactMoneyFormatter.format(target) : "No target"}
        </text>
        <text
          x="120"
          y="91"
          textAnchor="middle"
          className="fill-foreground text-[20px] font-semibold"
        >
          {compactMoneyFormatter.format(achieved)}
        </text>
      </svg>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Target vs Achievement
      </p>
    </div>
  );
}

function SavingsSummaryChart({
  chart,
  currentPeriod,
  previousPeriod,
}: {
  chart: Array<{ day: string; current: number; previous: number }>;
  currentPeriod: string;
  previousPeriod: string;
}) {
  const noSavingsData = chart.every(
    (point) => point.current === 0 && point.previous === 0,
  );

  return (
    <Card className="flex min-h-[360px] flex-col p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Saving Summary
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily cumulative savings for {currentPeriod}
          </p>
        </div>
        <div aria-label="Chart legend" className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-primary"
            />
            This month
          </span>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-[#D9DEE5]"
            />
            Same period last month
          </span>
        </div>
      </div>

      {noSavingsData ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Savings data will appear here when you add transactions.
          </p>
        </div>
      ) : (
        <div
          role="img"
          aria-label={`Cumulative savings for ${currentPeriod} compared with ${previousPeriod}`}
          className="min-h-[250px] flex-1"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chart}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="savingsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#299D91" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#299D91" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#E6E9ED"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#7A8492", fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#7A8492", fontSize: 11 }}
                tickFormatter={(value: number) =>
                  compactMoneyFormatter.format(value)
                }
                width={72}
              />
              <Tooltip
                labelFormatter={(label) => `Day ${label}`}
                formatter={(value, name) => [
                  typeof value === "number" ? moneyFormatter.format(value) : "",
                  name === "current" ? "This month" : "Same period last month",
                ]}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#299D91"
                strokeWidth={3}
                fill="url(#savingsArea)"
                name="current"
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#C7CDD4"
                strokeWidth={2}
                dot={false}
                name="previous"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export function GoalsWidget() {
  const currentMonth = getCurrentMonth();
  const {
    data: savings,
    isLoading: savingsLoading,
    isError: savingsError,
    error: savingsFetchError,
    refetch: refetchSavings,
  } = useSavingsGoalOverviewQuery();
  const {
    data: categoryGoals,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesFetchError,
    refetch: refetchCategories,
  } = useCategoryGoalCardsQuery(currentMonth);
  const saveSavingsTarget = useSaveMonthlySavingsTargetMutation();
  const saveCategoryTarget = useSetCategoryGoalMutation();
  const [dialog, setDialog] = useState<
    | { kind: "savings"; amount: number | null }
    | {
        kind: "category";
        categoryId: string;
        categoryName: string;
        amount: number | null;
      }
    | null
  >(null);

  const orderedCategories = useMemo(() => {
    if (!categoryGoals) return [];
    return [...categoryGoals].sort((first, second) => {
      const firstKey = first.categoryName.toLowerCase();
      const secondKey = second.categoryName.toLowerCase();
      const firstOrder = categoryOrder.indexOf(firstKey);
      const secondOrder = categoryOrder.indexOf(secondKey);

      if (firstOrder !== -1 || secondOrder !== -1) {
        return (
          (firstOrder === -1 ? Number.MAX_SAFE_INTEGER : firstOrder) -
          (secondOrder === -1 ? Number.MAX_SAFE_INTEGER : secondOrder)
        );
      }

      return firstKey.localeCompare(secondKey);
    });
  }, [categoryGoals]);

  if (savingsLoading || categoriesLoading) return <GoalsLoadingState />;

  if (savingsError || categoriesError || !savings || !categoryGoals) {
    const message = savingsFetchError ?? categoriesFetchError;
    return (
      <section aria-labelledby="goals-heading" className="flex flex-col gap-4">
        <h1 id="goals-heading" className="text-2xl font-bold text-foreground">
          Goals
        </h1>
        <EmptyState
          title="Unable to load goals"
          description={
            message instanceof Error ? message.message : "Please try again."
          }
          action={{
            label: "Try again",
            onClick: () => {
              void refetchSavings();
              void refetchCategories();
            },
          }}
        />
      </section>
    );
  }

  const target = savings.monthlyTarget;
  const monthDate = new Date(`${currentMonth}-01T00:00:00.000Z`);
  const monthEnd = new Date(
    Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth() + 1, 0),
  );
  const savingPercent =
    target && target > 0
      ? Math.max(0, Math.min(100, (savings.currentSavings / target) * 100))
      : 0;

  async function saveDialogAmount(amount: number) {
    if (dialog?.kind === "savings") {
      await saveSavingsTarget.mutateAsync(amount);
      return;
    }
    if (dialog?.kind === "category") {
      await saveCategoryTarget.mutateAsync({
        categoryId: dialog.categoryId,
        amount,
        month: currentMonth,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6 bg-[#F4F5F7] dark:bg-background">
      <h1 className="text-2xl font-bold text-foreground">Goals</h1>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.6fr)]">
        <Card className="flex min-h-[360px] flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Trophy aria-hidden="true" size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Savings Goal
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatDay(monthDate)} – {formatDay(monthEnd)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="size-8 border border-primary p-0 text-primary hover:bg-primary/10 hover:text-primary"
              aria-label="Adjust monthly savings goal"
              onClick={() =>
                setDialog({ kind: "savings", amount: savings.monthlyTarget })
              }
            >
              <Pencil />
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Trophy aria-hidden="true" className="mt-1 size-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Target Achieved</p>
                <p className="font-semibold text-foreground">
                  {moneyFormatter.format(savings.currentSavings)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Target aria-hidden="true" className="mt-1 size-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  This month Target
                </p>
                <p className="font-semibold text-foreground">
                  {target ? moneyFormatter.format(target) : "Not set"}
                </p>
              </div>
            </div>
          </div>

          <SavingsGauge achieved={savings.currentSavings} target={target} />
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <p className="text-sm text-muted-foreground">
              {target
                ? `${savingPercent.toFixed(0)}% of monthly goal`
                : "Set a target to track progress"}
            </p>
            <Button
              variant="ghost"
              icon={<Pencil />}
              className="border border-primary text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                setDialog({ kind: "savings", amount: savings.monthlyTarget })
              }
            >
              Adjust Goal
            </Button>
          </div>
        </Card>

        <SavingsSummaryChart
          chart={savings.chart}
          currentPeriod={savings.currentPeriod}
          previousPeriod={savings.previousPeriod}
        />
      </div>

      <section
        aria-labelledby="category-goals-heading"
        className="flex flex-col gap-4"
      >
        <h2
          id="category-goals-heading"
          className="text-2xl font-bold text-foreground"
        >
          Expenses Goals by Category
        </h2>

        {orderedCategories.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {orderedCategories.map((category) => {
              const normalizedIcon = category.categoryIcon
                ?.replace(/[^a-z]/gi, "")
                .toLowerCase();
              const Icon =
                categoryIcons[normalizedIcon ?? ""] ??
                categoryIcons[category.categoryName.toLowerCase()] ??
                LayoutGrid;

              return (
                <GoalItem
                  key={category.categoryId}
                  icon={
                    <Icon
                      aria-hidden="true"
                      style={
                        category.categoryColor
                          ? { color: category.categoryColor }
                          : undefined
                      }
                    />
                  }
                  category={category.categoryName}
                  amount={
                    category.goalAmount === null
                      ? "Not set"
                      : moneyFormatter.format(category.goalAmount)
                  }
                  onAdjust={() =>
                    setDialog({
                      kind: "category",
                      categoryId: category.categoryId,
                      categoryName: category.categoryName,
                      amount: category.goalAmount,
                    })
                  }
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No expense categories"
            description="Create an expense category to set a monthly goal for it."
            className="w-full"
          />
        )}
      </section>

      {dialog && (
        <GoalAmountDialog
          open
          title={
            dialog.kind === "savings"
              ? "Adjust monthly savings goal"
              : `Adjust ${dialog.categoryName} goal`
          }
          description={
            dialog.kind === "savings"
              ? "Set the amount you want to save each month."
              : `Set the monthly spending limit for ${dialog.categoryName}.`
          }
          initialAmount={dialog.amount}
          onClose={() => setDialog(null)}
          onSave={saveDialogAmount}
        />
      )}
    </div>
  );
}
