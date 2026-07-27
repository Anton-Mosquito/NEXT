import { ChevronRight, Banknote, CreditCard, PiggyBank, Bitcoin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface AccountCardProps {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'savings' | 'crypto';
  balance: number;
  currency: string;
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
  id,
  name,
  type,
  balance,
  currency,
  onClick,
  onDelete,
  className,
}: AccountCardProps) {
  const Icon = typeIcons[type];
  const label = typeLabels[type];
  
  const formattedBalance = balance.toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " " + currency;

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-2xl bg-card p-6 shadow-sm",
        className,
      )}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-heading-md text-gray-02">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-body-md text-foreground">{name}</span>
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
            <Icon size={16} />
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-4">
        {/* Balance */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-tight text-foreground">
            {formattedBalance}
          </span>
          <span className="text-body-md text-gray-02">Total amount</span>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-body-md font-medium text-primary transition-colors hover:text-primary/80"
          >
            Remove
          </button>
        ) : <div />}
        <Button
          size="figma-md"
          icon={<ChevronRight size={16} />}
          iconPosition="end"
          onClick={onClick}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
