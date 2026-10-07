import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BillingItemProps {
  month: string;
  day: string | number;
  /** Logo element (image, svg, or ReactNode) */
  logo?: ReactNode;
  serviceName: string;
  title: string;
  description: string;
  billingDate: string;
  amount: string;
  className?: string;
}

export function BillingItem({
  month,
  day,
  logo,
  serviceName,
  title,
  description,
  billingDate,
  amount,
  className,
}: BillingItemProps) {
  return (
    <div
      className={cn(
        "flex h-[162px] w-full max-w-[1046px] items-center bg-card border-b border-[var(--surface-icon)] px-0",
        className,
      )}
    >
      {/* ── Date box: w-18=72px, pt-3 pr-2 pb-3 pl-0 ────────── */}
      <div className="flex h-[82px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[8px] bg-[var(--surface-icon)]/25">
        {/* Month: Inter semi-bold 16px / 18px, gray-02 */}
        <span className="text-[16px] font-semibold leading-[18px] text-[var(--text-subtle)]">
          {month}
        </span>
        {/* Day: Inter extra-bold 22px / 32px, secondary-foreground */}
        <span className="text-[22px] font-extrabold leading-[32px] text-[var(--text-secondary)]">
          {day}
        </span>
      </div>

      {/* ── Logo + name — ml-10 (40px) from date box ──────────── */}
      <div className="ml-[122px] flex w-[120px] shrink-0 items-center gap-3">
        {logo && <div className="shrink-0">{logo}</div>}
        <span className="text-[16px] font-semibold leading-[24px] text-card-foreground">
          {serviceName}
        </span>
      </div>

      {/* ── Title + Description — ml-24 (96px), flex-1 ────────── */}
      <div className="ml-[122px] flex-1">
        {/* Title: Inter extra-bold 18px / 24px, foreground */}
        <h4 className="text-[18px] font-extrabold leading-[24px] text-card-foreground">
          {title}
        </h4>
        {/* Body: Inter regular 14px / 22px, gray-03 */}
        <p className="mt-1 text-[14px] font-normal leading-[22px] text-[var(--text-placeholder)]">
          {description}
        </p>
      </div>

      {/* ── Billing date: regular 16px / 24px, gray-03 ────────── */}
      <span className="shrink-0 text-[16px] font-normal leading-[24px] text-[var(--text-placeholder)]">
        {billingDate}
      </span>

      {/* ── Vertical separator ─────────────────────────────────── */}
      <div className="mx-8 h-8 w-px shrink-0 bg-[var(--surface-header)]" />

      {/* ── Price box: px-6 py-3 rounded-md border border-gray-05 */}
      {/* Total gap between billingDate and price ≈ 122px via mx-8 + flex natural spacing */}
      <div className="flex h-12 w-[108px] shrink-0 items-center justify-center rounded-[8px] border border-[var(--surface-header)]">
        {/* Amount: Inter extra-bold 18px / 24px, foreground */}
        <span className="text-[18px] font-extrabold leading-[24px] text-card-foreground">
          {amount}
        </span>
      </div>
    </div>
  );
}
