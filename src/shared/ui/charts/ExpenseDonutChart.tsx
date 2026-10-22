"use client";

import { Card } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface ExpenseDonutChartProps {
  data: Array<{
    name: string;
    total: number;
    color: string | null;
    percentage: number;
  }>;
  isLoading?: boolean;
}

export function ExpenseDonutChart({
  data,
  isLoading = false,
}: ExpenseDonutChartProps) {
  if (isLoading) {
    return (
      <Card className="rounded-lg border-0 bg-card p-6 shadow-[0_20px_25px_rgba(76,103,100,0.10)]">
        <h3 className="mb-4 text-base font-semibold leading-6 text-foreground">
          Expenses by Category
        </h3>
        <Skeleton className="h-50 w-full rounded-full" />
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    color: item.color ?? "#6b7280",
  }));

  return (
    <Card className="rounded-lg border-0 bg-card p-6 shadow-[0_20px_25px_rgba(76,103,100,0.10)]">
      <h3 className="mb-4 text-base font-semibold leading-6 text-foreground">
        Expenses by Category
      </h3>
      {chartData.length === 0 ? (
        <div className="flex h-55 items-center justify-center rounded-full border border-dashed border-gray-300 text-sm text-gray-02">
          No expenses this month
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-55 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {chartData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-02">{entry.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {Math.round(entry.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
