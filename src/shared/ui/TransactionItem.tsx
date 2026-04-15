import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TransactionItemProps {
  /** Lucide icon or any ReactNode */
  icon: ReactNode;
  /** Primary label — item name (bold in list, title area in card) */
  name: string;
  /** Secondary label — shop / merchant name */
  shopName?: string;
  date: string;
  amount: string;
  paymentMethod?: string;
  /** "card" = standalone dark row (screenshot 1), "row" = table row (screenshot 2) */
  variant?: "card" | "row";
  className?: string;
}

export function TransactionItem({
  icon,
  name,
  shopName,
  date,
  amount,
  paymentMethod,
  variant = "card",
  className,
}: TransactionItemProps) {
  if (variant === "row") {
    return (
      <tr className={cn("border-b border-bg-special last:border-0", className)}>
        {/* Icon */}
        <td className="py-4 px-4 pr-4">
          <span className="flex size-10 shrink-0 items-center justify-center text-gray-01 [&_svg]:size-5">
            {icon}
          </span>
        </td>
        {/* Shop Name */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">{shopName ?? name}</span>
        </td>
        {/* Date */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">{date}</span>
        </td>
        {/* Payment Method */}
        <td className="py-4 pr-4">
          <span className="text-body-md text-gray-01">{paymentMethod}</span>
        </td>
        {/* Amount */}
        <td className="py-4 text-right">
          <span className="text-body-md text-gray-01">{amount}</span>
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
      {/* Icon square */}
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-gray-02">
        {icon}
      </div>

      {/* Name + shop */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-sm text-gray-02 truncate">{name}</span>
        <span className="text-heading-md text-foreground truncate">
          {shopName ?? name}
        </span>
      </div>

      {/* Amount + date */}
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-display-sm text-foreground">{amount}</span>
        <span className="text-body-sm text-gray-02">{date}</span>
      </div>
    </div>
  );
}
