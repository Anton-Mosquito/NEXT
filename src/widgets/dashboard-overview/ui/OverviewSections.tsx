"use client";

import type { Bill } from "@/entities/bill/api/billQueries";
import type { getDashboardSummary } from "@/entities/dashboard/api/dashboardActions";
import type { getFinancialAccounts } from "@/entities/financial-account/api/financialAccountActions";
import type { getSavingsGoalOverview } from "@/entities/goal/api/goalActions";
import { Card } from "@/shared/ui";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bus,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  Goal,
  Home,
  Pencil,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type FinancialAccount = Awaited<
  ReturnType<typeof getFinancialAccounts>
>[number];
type SavingsGoal = Awaited<ReturnType<typeof getSavingsGoalOverview>>;
type DashboardTransaction = Awaited<
  ReturnType<typeof getDashboardSummary>
>["recentTransactions"][number];

const cardSurface =
  "rounded-lg border-0 bg-card shadow-[0_20px_25px_rgba(76,103,100,0.10)]";
const sectionHeading =
  "text-[22px] font-normal leading-8 text-muted-foreground";
const transactionIcons: Record<string, LucideIcon> = {
  entertainment: Gamepad2,
  gamepad: Gamepad2,
  food: Utensils,
  groceries: ShoppingCart,
  home: Home,
  housing: Home,
  shopping: ShoppingBag,
  transport: Bus,
  transportation: Bus,
};

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <div className="flex h-8 items-center justify-between gap-2">
        <h2 className={sectionHeading}>{title}</h2>
        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-2 text-xs font-medium leading-4 text-muted-foreground hover:text-primary"
          >
            View All <ChevronRight aria-hidden="true" size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function CardLoading({ label }: { label: string }) {
  return (
    <div
      aria-label={`Loading ${label.toLowerCase()}`}
      className={`${cardSurface} h-[232px] animate-pulse bg-muted`}
    />
  );
}

function CardError({ label }: { label: string }) {
  return (
    <div
      role="alert"
      className={`${cardSurface} flex h-[232px] items-center justify-center p-6 text-center text-sm text-muted-foreground`}
    >
      Unable to load {label.toLowerCase()}.
    </div>
  );
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const parsed =
    date instanceof Date
      ? date
      : /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? new Date(`${date}T00:00:00Z`)
        : new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(parsed);
}

export function TotalBalanceCard({
  accounts,
  totalBalance,
  isLoading,
  hasError,
}: {
  accounts: FinancialAccount[];
  totalBalance: number;
  isLoading: boolean;
  hasError: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectedAccount =
    selectedIndex >= 0 ? accounts[selectedIndex] : undefined;
  const accountCount = accounts.length + 1;

  return (
    <Section title="Total Balance">
      {isLoading ? (
        <CardLoading label="Total balance" />
      ) : hasError ? (
        <CardError label="Total balance" />
      ) : (
        <Card className={`${cardSurface} flex h-[232px] flex-col px-6 py-5`}>
          <div className="flex h-11 items-center justify-between border-b border-border pb-3">
            <p className="text-[22px] font-extrabold leading-8 text-foreground">
              {formatCurrency(totalBalance, "UAH")}
            </p>
            <p className="text-sm font-medium leading-5 text-secondary-foreground">
              All Accounts
            </p>
          </div>

          <div className="mt-3 flex h-24 items-center justify-between gap-3 rounded bg-primary p-4">
            <div className="flex min-w-0 flex-col">
              <p className="text-sm font-medium leading-5 text-white/70 dark:text-primary-foreground/70">
                {selectedAccount?.type
                  ? `${selectedAccount.type[0].toUpperCase()}${selectedAccount.type.slice(1)} Account`
                  : "All Accounts"}
              </p>
              <p className="truncate text-base font-bold leading-6 text-white dark:text-primary-foreground">
                {selectedAccount?.name ?? "Credit Card"}
              </p>
              <p className="text-sm font-medium leading-5 text-white/70 dark:text-primary-foreground/70">
                **** **** **** 2598
              </p>
            </div>
            <div className="flex h-full shrink-0 flex-col items-end justify-between">
              <div
                aria-label="Mastercard"
                className="flex items-center"
                role="img"
              >
                <span className="size-5 rounded-full bg-[#EB001B]" />
                <span className="-ml-2 size-5 rounded-full bg-[#F79E1B]/90" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold leading-6 text-white dark:text-primary-foreground">
                  {formatCurrency(
                    Number(selectedAccount?.balance ?? totalBalance),
                    selectedAccount?.currency ?? "UAH",
                  )}
                </p>
                <Link
                  href="/accounts"
                  aria-label="View accounts"
                  className="flex size-6 items-center justify-center rounded-full bg-white text-primary hover:bg-white/90"
                >
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-auto flex h-5 items-center justify-between">
            <button
              type="button"
              aria-label="Previous account"
              disabled={selectedIndex <= -1}
              onClick={() =>
                setSelectedIndex((index) => (index < 0 ? -1 : index - 1))
              }
              className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/50"
            >
              <ChevronLeft aria-hidden="true" size={16} />
              Previous
            </button>
            <div
              aria-label="Account selection"
              className="flex items-center gap-2"
            >
              {Array.from({ length: Math.min(accountCount, 3) }, (_, index) => (
                <span
                  key={index}
                  aria-current={
                    (selectedIndex < 0 ? 0 : selectedIndex + 1) === index
                      ? "step"
                      : undefined
                  }
                  className={`size-2 rounded-full ${
                    (selectedIndex < 0 ? 0 : selectedIndex + 1) === index
                      ? "bg-primary"
                      : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next account"
              disabled={
                accounts.length === 0 || selectedIndex >= accounts.length - 1
              }
              onClick={() => setSelectedIndex((index) => index + 1)}
              className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-foreground hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground/50"
            >
              Next
              <ChevronRight aria-hidden="true" size={16} />
            </button>
          </div>
          <span aria-live="polite" className="sr-only">
            {selectedIndex < 0
              ? "Showing all accounts"
              : `Account ${selectedIndex + 1} of ${accounts.length}`}
          </span>
        </Card>
      )}
    </Section>
  );
}

export function GoalsCard({
  goal,
  isLoading,
  hasError,
}: {
  goal: SavingsGoal | undefined;
  isLoading: boolean;
  hasError: boolean;
}) {
  const target = goal?.monthlyTarget ?? 0;
  const currentSavings = goal?.currentSavings ?? 0;
  const progress =
    target > 0 ? Math.max(0, Math.min(currentSavings / target, 1)) : 0;

  return (
    <Section title="Goals">
      {isLoading ? (
        <CardLoading label="Goals" />
      ) : hasError ? (
        <CardError label="Goals" />
      ) : (
        <Card className={`${cardSurface} h-[232px] px-6 py-5`}>
          {target > 0 ? (
            <div className="flex h-full flex-col gap-3">
              <div className="flex h-11 items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <p className="text-[22px] font-extrabold leading-8 text-foreground">
                    {formatCurrency(target, "UAH")}
                  </p>
                  <Link
                    href="/goals"
                    aria-label="Edit savings goal"
                    className="flex size-8 items-center justify-center rounded bg-muted text-secondary-foreground hover:text-primary"
                  >
                    <Pencil aria-hidden="true" size={16} />
                  </Link>
                </div>
                <p className="text-sm font-medium leading-5 text-secondary-foreground">
                  {goal?.currentPeriod ?? "This month"}
                </p>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col justify-center gap-6">
                  <div className="flex items-start gap-1">
                    <Award
                      aria-hidden="true"
                      className="mt-1 shrink-0 fill-secondary-foreground text-secondary-foreground"
                      size={24}
                    />
                    <div className="min-w-0">
                      <p className="text-xs leading-4 text-muted-foreground">
                        Target Achieved
                      </p>
                      <p className="truncate text-base font-bold leading-6 text-foreground">
                        {formatCurrency(currentSavings, "UAH")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-1">
                    <Goal
                      aria-hidden="true"
                      className="mt-1 shrink-0 fill-secondary-foreground text-secondary-foreground"
                      size={24}
                    />
                    <div className="min-w-0">
                      <p className="text-xs leading-4 text-muted-foreground">
                        This month Target
                      </p>
                      <p className="truncate text-base font-bold leading-6 text-foreground">
                        {formatCurrency(target, "UAH")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex h-[124px] w-[144px] shrink-0 flex-col items-center gap-[14px]">
                  <div className="relative h-[94px] w-[144px] shrink-0">
                    <svg
                      role="progressbar"
                      aria-label="Monthly savings goal progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress * 100)}
                      viewBox="0 0 144 76"
                      className="h-[70px] w-full"
                    >
                      <path
                        d="M 8 68 A 64 64 0 0 1 136 68"
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 8 68 A 64 64 0 0 1 136 68"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(Math.PI * 64 * progress).toFixed(2)} ${Math.PI * 64}`}
                      />
                    </svg>
                    <p className="absolute inset-x-0 top-[32px] text-center text-base font-semibold leading-6 text-foreground">
                      {Math.round(progress * 100)}%
                    </p>
                    <div className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-between text-xs font-medium leading-4 text-muted-foreground">
                      <span>{formatCurrency(0, "UAH")}</span>
                      <span className="text-base font-semibold leading-6 text-foreground">
                        {formatCompactCurrency(currentSavings, "UAH")}
                      </span>
                      <span>{formatCompactCurrency(target, "UAH")}</span>
                    </div>
                  </div>
                  <p className="text-center text-xs font-medium leading-4 text-foreground">
                    Target vs Achievement
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <CircleDollarSign
                aria-hidden="true"
                className="text-primary"
                size={32}
              />
              <p className="font-semibold text-foreground">No savings target</p>
              <p className="text-sm text-muted-foreground">
                Set a monthly goal to track your progress.
              </p>
              <Link
                href="/goals"
                className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Set a goal <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          )}
        </Card>
      )}
    </Section>
  );
}

export function UpcomingBillCard({
  bills,
  isLoading,
  hasError,
}: {
  bills: Bill[];
  isLoading: boolean;
  hasError: boolean;
}) {
  const todayDate = new Date().toISOString().slice(0, 10);
  const upcomingBills = bills
    .filter((bill) => bill.status === "unpaid")
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
    .slice(0, 2);

  return (
    <Section title="Upcoming Bill" href="/bills">
      {isLoading ? (
        <CardLoading label="Upcoming bill" />
      ) : hasError ? (
        <CardError label="Upcoming bill" />
      ) : (
        <Card className={`${cardSurface} h-[232px] px-6 py-5`}>
          {upcomingBills.length > 0 ? (
            <ul className="flex h-full flex-col justify-center">
              {upcomingBills.map((bill, index) => {
                const isOverdue = bill.dueDate.slice(0, 10) < todayDate;

                return (
                  <li
                    key={bill.id}
                    className={`flex min-w-0 items-center justify-between gap-3 py-3 ${
                      index === 0 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-[66px] w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg bg-muted px-2">
                        <span className="text-xs font-medium leading-4 text-muted-foreground">
                          {formatDate(bill.dueDate, { month: "short" })}
                        </span>
                        <span className="text-[22px] font-extrabold leading-8 text-foreground">
                          {formatDate(bill.dueDate, { day: "2-digit" })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1">
                          <p className="truncate text-base font-bold leading-6 text-secondary-foreground">
                            {bill.title}
                          </p>
                          {isOverdue && (
                            <span className="shrink-0 rounded bg-destructive/10 px-1.5 text-[10px] font-semibold leading-4 text-destructive">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs leading-4 text-muted-foreground">
                          {bill.lastChargeDate
                            ? `Last Charge - ${formatDate(bill.lastChargeDate, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}`
                            : bill.vendorName}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 rounded-lg border border-border px-3 py-2 text-base font-bold leading-6 text-secondary-foreground">
                      {formatCurrency(Number(bill.amount), bill.currency)}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="font-semibold text-foreground">No upcoming bills</p>
              <p className="text-sm text-muted-foreground">
                Your unpaid bills will appear here.
              </p>
            </div>
          )}
        </Card>
      )}
    </Section>
  );
}

type TransactionFilter = "all" | "income" | "expense";

const filterOptions: Array<{ label: string; value: TransactionFilter }> = [
  { label: "All", value: "all" },
  { label: "Revenue", value: "income" },
  { label: "Expenses", value: "expense" },
];

function transactionDate(date: string | Date) {
  return formatDate(date, { day: "2-digit", month: "short", year: "numeric" });
}

function transactionCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RecentTransactionsCard({
  transactions,
  isLoading,
  hasError,
}: {
  transactions: DashboardTransaction[];
  isLoading: boolean;
  hasError: boolean;
}) {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const visibleTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => filter === "all" || transaction.type === filter,
      ),
    [filter, transactions],
  );

  return (
    <Section title="Recent Transactions" href="/transactions">
      <Card className={`${cardSurface} min-h-[542px] px-6 pb-[34px] pt-4`}>
        <div className="flex items-center justify-between gap-2">
          <div
            aria-label="Transaction type"
            className="flex h-10 min-w-0 items-center gap-5"
          >
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={`flex h-10 items-center border-b-2 px-2 text-base font-bold leading-6 transition-colors ${
                  filter === option.value
                    ? "border-primary text-primary"
                    : "border-transparent text-secondary-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 w-[303px] max-w-full">
          {isLoading ? (
            <div
              aria-label="Loading recent transactions"
              className="h-[440px] animate-pulse rounded bg-muted"
            />
          ) : hasError ? (
            <p
              role="alert"
              className="py-12 text-center text-sm text-destructive"
            >
              Unable to load recent transactions.
            </p>
          ) : visibleTransactions.length > 0 ? (
            <ul className="flex flex-col">
              {visibleTransactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                const category = transaction.categoryName.toLowerCase();
                const Icon =
                  transactionIcons[
                    transaction.categoryIcon?.toLowerCase() ?? ""
                  ] ??
                  transactionIcons[category] ??
                  (isIncome ? ArrowDownLeft : ArrowUpRight);
                return (
                  <li
                    key={transaction.id}
                    className="flex h-[88px] items-center gap-3 border-b border-border last:border-0"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold leading-6 text-foreground">
                        {transaction.description || transaction.categoryName}
                      </p>
                      <p className="truncate text-xs leading-4 text-muted-foreground">
                        {transaction.categoryName} · {transaction.accountName}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-semibold leading-6 text-secondary-foreground">
                        {isIncome ? "+" : "-"}
                        {transactionCurrency(Number(transaction.amount))}
                      </p>
                      <p className="text-xs leading-4 text-muted-foreground">
                        {transactionDate(transaction.date)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {filter === "all"
                ? "No recent transactions yet."
                : `No ${filter === "income" ? "revenue" : "expenses"} yet.`}
            </p>
          )}
        </div>
      </Card>
    </Section>
  );
}
