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
        "flex items-center border border-bg-special rounded-2xl px-6",
        className,
      )}
    >
      {/* ── Date box: w-18=72px, pt-3 pr-2 pb-3 pl-0 ────────── */}
      <div className="flex w-18 shrink-0 flex-col items-center rounded-lg bg-secondary pt-3 pr-2 pb-3 pl-0">
        {/* Month: Inter semi-bold 16px / 18px, gray-02 */}
        <span className="text-base font-semibold leading-4.5 text-gray-02">
          {month}
        </span>
        {/* Day: Inter extra-bold 22px / 32px, secondary-foreground */}
        <span className="text-2xl font-extrabold leading-8 text-secondary-foreground">
          {day}
        </span>
      </div>

      {/* ── Logo + name — ml-10 (40px) from date box ──────────── */}
      <div className="ml-10 flex shrink-0 items-center gap-3">
        {logo && <div className="shrink-0">{logo}</div>}
        <span className="text-heading-md text-foreground">{serviceName}</span>
      </div>

      {/* ── Title + Description — ml-24 (96px), flex-1 ────────── */}
      <div className="ml-24 flex-1">
        {/* Title: Inter extra-bold 18px / 24px, foreground */}
        <h4 className="text-lg font-extrabold leading-6 text-foreground">
          {title}
        </h4>
        {/* Body: Inter regular 14px / 22px, gray-03 */}
        <p className="mt-1 text-sm font-normal leading-5.5 text-gray-03">
          {description}
        </p>
      </div>

      {/* ── Billing date: regular 16px / 24px, gray-03 ────────── */}
      <span className="shrink-0 text-base font-normal leading-6 text-gray-03">
        {billingDate}
      </span>

      {/* ── Vertical separator ─────────────────────────────────── */}
      <div className="mx-8 h-8 w-px shrink-0 bg-border" />

      {/* ── Price box: px-6 py-3 rounded-md border border-gray-05 */}
      {/* Total gap between billingDate and price ≈ 122px via mx-8 + flex natural spacing */}
      <div className="shrink-0 rounded-md border border-gray-05 px-6 py-3">
        {/* Amount: Inter extra-bold 18px / 24px, foreground */}
        <span className="text-lg font-extrabold leading-6 text-foreground">
          {amount}
        </span>
      </div>
    </div>
  );
}
