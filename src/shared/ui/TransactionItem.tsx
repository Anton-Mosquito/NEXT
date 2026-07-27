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
  const amountColor = isIncome ? "text-green-500" : "text-red-500";

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
      <tr className={cn("border-b border-bg-special last:border-0", className)}>
        {/* Category */}
        <td className="py-4 px-4 pr-4">
          <span className="text-body-md text-gray-01">{categoryLabel}</span>
        </td>
        {/* Description */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">
            {description || "—"}
          </span>
        </td>
        {/* Date */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">{formattedDate}</span>
        </td>
        {/* Account */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">{accountName}</span>
        </td>
        {/* Amount */}
        <td className="py-4 text-right">
          <span className={cn("text-body-md font-medium", amountColor)}>
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
        "flex items-center gap-4 rounded-2xl bg-card px-4 py-5",
        className,
      )}
    >
      {/* Category square (using color if possible) */}
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-lg"
        style={{ backgroundColor: categoryColor || "hsl(var(--secondary))" }}
      >
        {categoryName.charAt(0).toUpperCase()}
      </div>

      {/* Description + Account */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm text-gray-02 truncate">
          {accountName}
        </span>
        <span className="text-heading-md text-foreground truncate">
          {description || categoryName}
        </span>
      </div>

      {/* Amount + date */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className={cn("text-display-sm", amountColor)}>
            {formattedAmount}
          </span>
          <span className="text-body-sm text-gray-02">{formattedDate}</span>
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
