import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import type { ReactNode } from "react";

interface GoalItemProps {
  icon: ReactNode;
  category: string;
  amount: string;
  onAdjust?: () => void;
  className?: string;
}

export function GoalItem({
  icon,
  category,
  amount,
  onAdjust,
  className,
}: GoalItemProps) {
  return (
    <div
      className={cn(
        "flex h-[104px] w-full max-w-[352px] items-center gap-4 rounded-[8px] bg-card px-6 py-7",
        className,
      )}
    >
      <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-icon)]/25 text-[var(--text-secondary)] [&_svg]:size-6">
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[16px] font-medium leading-6 text-(--text-placeholder)">
          {category}
        </span>
        <span className="text-[18px] font-extrabold leading-6 text-card-foreground">
          {amount}
        </span>
      </div>

      <button
        type="button"
        onClick={onAdjust}
        aria-label={`Adjust ${category} goal`}
        className="flex h-9 w-24.75 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#299D91] text-[14px] font-medium leading-5 text-[#299D91] transition-colors hover:bg-[#299D91]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#299D91]/40"
      >
        Adjust
        <Pencil aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}
