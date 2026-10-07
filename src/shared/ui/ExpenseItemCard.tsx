import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ExpenseItemCardProps {
  /** Lucide icon or any ReactNode rendered inside the icon square */
  icon: ReactNode;
  category: string;
  amount: string;
  /** e.g. "15" — rendered as "15%*" */
  changePercent: string;
  /** up = spending increased (red), down = decreased (green) */
  trend: "up" | "down";
  onClick?: () => void;
  className?: string;
}

export function ExpenseItemCard({
  icon,
  category,
  amount,
  changePercent,
  trend,
  onClick,
  className,
}: ExpenseItemCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "flex h-[74px] w-full max-w-[200px] items-center gap-4 rounded-[8px] bg-card px-4 py-2",
        onClick && "cursor-pointer transition-colors hover:bg-secondary/60",
        className,
      )}
    >
      {/* Icon box */}
      <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-icon)] text-[var(--text-subtle)] [&_svg]:size-6">
        {icon}
      </div>

      {/* Text block */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* Category */}
        <span className="text-[12px] font-medium leading-[16px] text-[var(--text-subtle)]">
          {category}
        </span>

        {/* Amount row */}
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold leading-[24px] text-card-foreground">
            {amount}
          </span>
          <ArrowRight
            className="size-4 text-[var(--text-placeholder)]"
            strokeWidth={2}
          />
        </div>

        {/* Trend row */}
        <div className="flex items-center gap-1">
          <span className="rounded-full text-[12px] font-medium leading-[16px] text-[var(--text-placeholder)]">
            {changePercent}%*
          </span>
          {trend === "up" ? (
            <ArrowUp className="size-3.5 text-destructive" />
          ) : (
            <ArrowDown className="size-3.5 text-success" />
          )}
        </div>
      </div>
    </div>
  );
}
