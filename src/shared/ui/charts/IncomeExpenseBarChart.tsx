"use client";

import { Card } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IncomeExpenseBarChartProps {
  data: Array<{
    day: string;
    income: number;
    expense: number;
  }>;
  isLoading?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  maximumFractionDigits: 0,
});

function formatYAxis(value: number) {
  const absValue = Math.abs(value);
  if (absValue >= 1000) {
    const compactValue = absValue / 1000;
    return `₴${compactValue % 1 === 0 ? compactValue.toFixed(0) : compactValue.toFixed(1)}k`;
  }
  return `₴${absValue}`;
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString(
    "en-US",
    {
      month: "short",
    },
  )}`;
}

export function IncomeExpenseBarChart({
  data,
  isLoading = false,
}: IncomeExpenseBarChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Income vs Expenses (Last 7 Days)
        </h3>
        <Skeleton className="h-50 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Income vs Expenses (Last 7 Days)
      </h3>
      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDayLabel}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatYAxis(Number(value ?? 0))}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: unknown) => formatCurrency(Number(value ?? 0))}
              labelFormatter={(label) => formatDayLabel(String(label))}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);
}
