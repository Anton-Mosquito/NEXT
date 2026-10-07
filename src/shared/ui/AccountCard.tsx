import {
  ChevronRight,
  Banknote,
  CreditCard,
  PiggyBank,
  Bitcoin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface AccountCardProps {
  id: string;
  name: string;
  type: "cash" | "card" | "savings" | "crypto";
  balance: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  media?: "mastercard" | "visa";
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

const typeIcons = {
  cash: Banknote,
  card: CreditCard,
  savings: PiggyBank,
  crypto: Bitcoin,
};

const typeLabels = {
  cash: "Cash",
  card: "Card",
  savings: "Savings",
  crypto: "Crypto",
};

export function AccountCard({
  name,
  balance,
  type,
  currency,
  institution,
  accountNumber,
  media,
  onClick,
  onDelete,
  className,
}: AccountCardProps) {
  const Icon = typeIcons[type];
  const label = typeLabels[type];

  const formattedBalance =
    balance.toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    " " +
    currency;

  return (
    <div
      className={cn(
        "box-border flex h-[288px] w-full max-w-[352px] flex-col gap-4 rounded-[8px] bg-white p-6 shadow-[0_2px_12px_rgba(76,103,100,0.10)] dark:bg-card",
        className,
      )}
    >
      <div className="flex h-11 w-full items-center justify-between border-b border-[rgba(210,210,210,0.25)] pb-3">
        <span className="text-[16px] font-bold leading-6 text-[#878787] dark:text-muted-foreground">
          {name}
        </span>
        <div className="flex h-8 min-w-20 items-center justify-end px-2 py-2 text-right text-[12px] font-medium leading-4 text-[#666666] dark:text-muted-foreground">
          {media === "mastercard"
            ? "Master Card"
            : media === "visa"
              ? "Visa"
              : institution}
        </div>
      </div>

      <div className="flex h-[180px] w-full flex-col gap-6">
        <div className="flex h-[52px] flex-col gap-1">
          <span className="text-[14px] font-normal leading-5 text-[#9F9F9F] dark:text-muted-foreground">
            Account Number
          </span>
          <span className="text-[20px] font-semibold leading-7 text-[#191919] dark:text-foreground">
            {accountNumber ?? "Account number unavailable"}
          </span>
        </div>
        <div className="flex h-[52px] w-[125px] flex-col gap-1">
          <span className="text-[14px] font-normal leading-5 text-[#9F9F9F] dark:text-muted-foreground">
            Total amount
          </span>
          <span className="text-[20px] font-semibold leading-7 text-[#191919] dark:text-foreground">
            {formattedBalance}
          </span>
        </div>
        <div className="flex h-9 w-full items-center justify-between">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="h-6 w-[116px] text-left text-[16px] font-normal leading-6 text-[#299D91]"
            >
              Remove
            </button>
          ) : (
            <span className="h-6 w-[116px]" />
          )}
          <Button
            size="figma-md"
            icon={<ChevronRight size={16} />}
            iconPosition="end"
            onClick={onClick}
            className="h-9 w-[110px] gap-2 px-5 py-2 text-[14px] font-medium leading-5"
          >
            Details.
          </Button>
        </div>
      </div>
    </div>
  );
}
