"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/shared/ui";
import { Skeleton } from "@/shared/ui";

interface TopCategory {
  name: string;
  color: string | null;
  total: number;
}

interface TopCategoriesChartProps {
  data: TopCategory[];
  isLoading?: boolean;
}

export function TopCategoriesChart({ data, isLoading }: TopCategoriesChartProps) {
  const formatTooltip = (value: number) => {
    return value.toLocaleString("uk-UA", { style: "currency", currency: "UAH" });
  };

  const formatXAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `₴${(tickItem / 1000).toFixed(0)}k`;
    }
    return `₴${tickItem}`;
  };

  return (
    <Card className="p-6 h-full">
      <h2 className="mb-6 text-lg font-bold text-foreground">
        Top Spending Categories (This Year)
      </h2>
      
      {isLoading ? (
        <div className="h-[250px] w-full">
          <Skeleton className="size-full" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex h-[250px] items-center justify-center text-sm text-gray-02">
          No spending data available.
        </div>
      ) : (
        <div className="h-[250px] w-full text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tickFormatter={formatXAxis} axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 13 }}
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value !== "number") return "";
                  return new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH" }).format(value);
                }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color ?? "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
