import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ExpenseItem {
  label: string;
  amount: string;
  date: string;
}

export interface ExpenseCardProps {
  /** Lucide icon or any ReactNode rendered inside the icon square */
  icon: ReactNode;
  category: string;
  totalAmount: string;
  /** e.g. "15%" */
  changePercent: string;
  /** up = spending increased (red arrow), down = decreased (green arrow) */
  trend: "up" | "down";
  items: ExpenseItem[];
  comparisonLabel?: string;
  className?: string;
}

export function ExpenseCard({
  icon,
  category,
  totalAmount,
  changePercent,
  trend,
  items,
  comparisonLabel = "Compare to last month",
  className,
}: ExpenseCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor = trend === "up" ? "text-destructive" : "text-success";

  return (
    <div
      className={cn(
        "w-full max-w-[352px] overflow-hidden rounded-[8px] bg-card",
        className,
      )}
    >
      {/* ── Header ── gray surface */}
      <div className="h-[78px] bg-[var(--surface-header)] px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Icon square */}
          <div className="flex h-[46px] w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-icon)] text-[var(--text-subtle)]">
            {icon}
          </div>

          {/* Category + total */}
          <div className="flex flex-col">
            <span className="text-[16px] font-medium leading-[24px] text-[var(--text-tertiary)]">
              {category}
            </span>
            <span className="text-[18px] font-extrabold leading-[24px] text-card-foreground">
              {totalAmount}
            </span>
          </div>

          {/* Trend — pushed to right */}
          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-semibold leading-[18px] text-[var(--text-tertiary)]">
                {changePercent}
              </span>
              <TrendIcon size={18} className={trendColor} strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-light leading-[12px] text-[var(--text-tertiary)]">
              {comparisonLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Items list ── white surface */}
      <div className="bg-card">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`}>
            {i > 0 && <div className="mx-4 border-t border-border" />}
            <div className="flex h-20 items-center justify-between border-b border-[var(--surface-icon)] px-4 py-4 last:border-b-0">
              <span className="text-[16px] font-semibold leading-[24px] text-[var(--text-secondary)]">
                {item.label}
              </span>
              <div className="text-right">
                <p className="text-[16px] font-semibold leading-[24px] text-[var(--text-secondary)]">
                  {item.amount}
                </p>
                <p className="text-[12px] font-normal leading-[16px] text-[var(--text-placeholder)]">
                  {item.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
