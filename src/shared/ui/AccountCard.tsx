import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface AccountCardProps {
  /** Card network label, e.g. "Master Card" */
  cardType?: string;
  /** Card network variant for the logo icon */
  cardNetwork?: "mastercard" | "visa";
  /** e.g. "133 456 886 8****" */
  accountNumber: string;
  /** e.g. "$25000" */
  totalAmount: string;
  onRemove?: () => void;
  onDetails?: () => void;
  className?: string;
}

function MastercardLogo() {
  return (
    <span className="relative flex items-center" aria-label="Mastercard">
      <span className="block size-8 rounded-full bg-[#EB001B]" />
      <span className="absolute left-5 block size-8 rounded-full bg-[#F79E1B] opacity-90" />
    </span>
  );
}

function VisaLogo() {
  return (
    <span className="text-lg font-extrabold italic tracking-tight text-[#1A1F71]" aria-label="Visa">
      VISA
    </span>
  );
}

export function AccountCard({
  cardType = "Master Card",
  cardNetwork = "mastercard",
  accountNumber,
  totalAmount,
  onRemove,
  onDetails,
  className,
}: AccountCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-2xl bg-card p-6 shadow-sm",
        className
      )}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-heading-md text-gray-02">Credit Card</span>
        <div className="flex items-center gap-2">
          <span className="text-body-md text-foreground">{cardType}</span>
          {cardNetwork === "mastercard" ? <MastercardLogo /> : <VisaLogo />}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-4">
        {/* Account number */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-tight tracking-wide text-foreground">
            {accountNumber}
          </span>
          <span className="text-body-md text-gray-02">Account Number</span>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-tight text-foreground">
            {totalAmount}
          </span>
          <span className="text-body-md text-gray-02">Total amount</span>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onRemove}
          className="text-body-md font-medium text-primary transition-colors hover:text-primary/80"
        >
          Remove
        </button>
        <Button
          size="figma-md"
          icon={<ChevronRight size={16} />}
          iconPosition="end"
          onClick={onDetails}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
