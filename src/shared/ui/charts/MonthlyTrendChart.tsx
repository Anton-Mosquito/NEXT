"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/shared/ui";
import { Skeleton } from "@/shared/ui";

interface MonthlyTrendChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
  isLoading?: boolean;
}

export function MonthlyTrendChart({ data, isLoading }: MonthlyTrendChartProps) {
  // Format YYYY-MM to short month name (e.g. Jan, Feb)
  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return "";
    const [y, m] = tickItem.split("-").map(Number);
    const date = new Date(y, m - 1);
    return date.toLocaleString("en-US", { month: "short" });
  };

  // Format currency (e.g. 10000 -> ₴10k)
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `₴${(tickItem / 1000).toFixed(0)}k`;
    }
    return `₴${tickItem}`;
  };


  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-bold text-foreground">12-Month Trend</h2>
      
      {isLoading ? (
        <div className="h-[300px] w-full">
          <Skeleton className="size-full" />
        </div>
      ) : (
        <div className="h-[300px] w-full text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
                dx={-10}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value !== "number") return "";
                  return new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH" }).format(value);
                }}
                labelFormatter={(label) => {
                  const str = String(label);
                  const [year, month] = str.split("-");
                  if (!year || !month) return str;
                  return new Date(Number(year), Number(month) - 1).toLocaleString("en-US", { month: "short" });
                }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="expense" name="Expense" fill="rgba(239, 68, 68, 0.8)" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
