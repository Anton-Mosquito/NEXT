import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransactionItemProps {
  id: string;
  description: string | null;
  amount: number;
  type: "income" | "expense";
  date: string | Date;
  categoryName: string;
  categoryColor: string | null;
  accountName: string;
  /** "card" = standalone dark row (screenshot 1), "row" = table row (screenshot 2) */
  variant?: "card" | "row";
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TransactionItem({
  id,
  description,
  amount,
  type,
  date,
  categoryName,
  categoryColor,
  accountName,
  variant = "card",
  className,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = type === "income";
  const formattedAmount = `${isIncome ? "+" : "-"}₴${amount.toLocaleString(
    "uk-UA",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;

  const d = new Date(date);
  const formattedDate = `${String(d.getDate()).padStart(2, "0")} ${d.toLocaleString("en-US", { month: "short" })}`;

  const categoryLabel = (
    <span className="flex items-center gap-1.5">
      <span
        className="block size-2.5 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor || "#ccc" }}
      />
      <span className="truncate">{categoryName}</span>
    </span>
  );

  if (variant === "row") {
    return (
      <tr
        className={cn(
          "h-[72px] border-b border-[var(--surface-icon)] last:border-0",
          className,
        )}
      >
        {/* Category */}
        <td className="px-0 py-4 pr-4">
          <span className="text-[16px] font-semibold leading-[24px] text-foreground">
            {categoryLabel}
          </span>
        </td>
        {/* Description */}
        <td className="py-4 pr-4">
          <span className="text-[16px] font-medium leading-[24px] text-[var(--text-tertiary)]">
            {description || "—"}
          </span>
        </td>
        {/* Date */}
        <td className="py-4 pr-4">
          <span className="text-[16px] font-medium leading-[24px] text-[var(--text-tertiary)]">
            {formattedDate}
          </span>
        </td>
        {/* Account */}
        <td className="py-4 pr-4">
          <span className="text-[16px] font-medium leading-[24px] text-[var(--text-tertiary)]">
            {accountName}
          </span>
        </td>
        {/* Amount */}
        <td className="py-4 text-right">
          <span className="text-[16px] font-semibold leading-[24px] text-[var(--text-tertiary)]">
            {formattedAmount}
          </span>
        </td>
        <td className="py-4 pr-4">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(id)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Edit ${description || categoryName}`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(id)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              aria-label={`Delete ${description || categoryName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Card variant — standalone dark row (screenshot 1)
  return (
    <div
      className={cn(
        "flex h-[88px] w-full items-center gap-7 rounded-[8px] bg-card px-0 py-6",
        className,
      )}
    >
      {/* Category square (using color if possible) */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-icon)] text-[var(--text-tertiary)] text-lg font-bold"
        style={{ backgroundColor: categoryColor || "hsl(var(--secondary))" }}
      >
        {categoryName.charAt(0).toUpperCase()}
      </div>

      {/* Description + Account */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[12px] font-normal leading-[16px] text-[var(--text-placeholder)]">
          {accountName}
        </span>
        <span className="truncate text-[16px] font-semibold leading-[24px] text-card-foreground">
          {description || categoryName}
        </span>
      </div>

      {/* Amount + date */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[16px] font-semibold leading-[24px] text-[var(--text-secondary)]">
            {formattedAmount}
          </span>
          <span className="text-[12px] font-normal leading-[16px] text-[var(--text-placeholder)]">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(id)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Edit ${description || categoryName}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(id)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            aria-label={`Delete ${description || categoryName}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
