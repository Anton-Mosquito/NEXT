import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ExpenseItem {
  label: string;
  amount: string;
  date: string;
}

interface ExpenseCardProps {
  /** Lucide icon or any ReactNode rendered inside the icon square */
  icon: ReactNode;
  category: string;
  totalAmount: string;
  /** e.g. "15%" */
  changePercent: string;
  /** up = spending increased (red arrow), down = decreased (green arrow) */
  trend: "up" | "down";
  items: ExpenseItem[];
  className?: string;
}

export function ExpenseCard({
  icon,
  category,
  totalAmount,
  changePercent,
  trend,
  items,
  className,
}: ExpenseCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor = trend === "up" ? "text-destructive" : "text-success";

  return (
    <div className={cn("overflow-hidden rounded-2xl shadow-sm", className)}>
      {/* ── Header ── gray surface */}
      <div className="bg-gray-05 px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Icon square */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-04 text-gray-02">
            {icon}
          </div>

          {/* Category + total */}
          <div className="flex flex-col">
            <span className="text-body-md text-gray-02">{category}</span>
            <span className="text-display-sm text-foreground">{totalAmount}</span>
          </div>

          {/* Trend — pushed to right */}
          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-display-sm text-foreground">{changePercent}</span>
              <TrendIcon size={18} className={trendColor} strokeWidth={2.5} />
            </div>
            <span className="text-body-sm text-gray-02">Compare to last month</span>
          </div>
        </div>
      </div>

      {/* ── Items list ── white surface */}
      <div className="bg-card">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`}>
            {i > 0 && <div className="mx-4 border-t border-border" />}
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-heading-md text-foreground">{item.label}</span>
              <div className="text-right">
                <p className="text-heading-md text-foreground">{item.amount}</p>
                <p className="text-body-sm text-gray-02">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
