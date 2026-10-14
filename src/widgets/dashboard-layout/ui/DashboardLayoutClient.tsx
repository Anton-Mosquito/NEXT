"use client";

import { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader, Sidebar, type SidebarNavItem } from "@/shared/ui";
import { useBillNotificationsQuery } from "@/entities/bill";
import { useTransactionSearchQuery } from "@/entities/transaction";
import { useReadBillNotifications } from "@/features/bill-notifications";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutGrid,
  Receipt,
  Settings,
  Tag,
  Target,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const dashboardNavItems: SidebarNavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Balances", icon: Wallet, href: "/balances" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Accounts", icon: Wallet, href: "/accounts" },
  { label: "Categories", icon: Tag, href: "/categories" },
  { label: "Bills", icon: Receipt, href: "/bills" },
  { label: "Expenses", icon: TrendingDown, href: "/expenses" },
  { label: "Budgets", icon: Target, href: "/budgets" },
  { label: "Goals", icon: Target, href: "/goals" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function DashboardLayoutClient({
  children,
  userName,
  userId,
}: {
  children: ReactNode;
  userName: string;
  userId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeHref = pathname.startsWith("/accounts/") ? "/accounts" : pathname;
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue.trim());
  const {
    data: searchData,
    isFetching: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useTransactionSearchQuery(deferredSearch);
  const {
    data: bills,
    isLoading: areBillsLoading,
    isError: areBillsError,
    error: billsError,
  } = useBillNotificationsQuery();
  const readBillNotifications = useReadBillNotifications(userId);

  const today = new Date().toISOString().slice(0, 10);
  const notificationBills = (bills ?? []).map((bill) => ({
    id: bill.id,
    vendorName: bill.vendorName,
    title: bill.title,
    dueDate: bill.dueDate.slice(0, 10),
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: bill.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(bill.amount)),
    isOverdue: bill.dueDate.slice(0, 10) < today,
    isRead: readBillNotifications.readIds.includes(bill.id),
  }));
  const unreadNotificationIds = notificationBills
    .filter((bill) => !bill.isRead)
    .map((bill) => bill.id);

  const searchResults = (searchData?.data ?? []).map((transaction) => {
    const amount = Number(transaction.amount);
    const date =
      transaction.date instanceof Date
        ? transaction.date
        : new Date(transaction.date);

    return {
      id: transaction.id,
      title: transaction.description || transaction.categoryName,
      subtitle: `${transaction.categoryName} · ${transaction.accountName}`,
      amount: `${transaction.type === "income" ? "+" : "−"}₴${amount.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      date: Number.isNaN(date.getTime())
        ? "Date unavailable"
        : new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(date),
    };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar
          items={dashboardNavItems}
          activeHref={activeHref}
          user={{ name: userName }}
          className="border-sidebar-border"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        <DashboardHeader
          userName={userName}
          showGreeting={pathname !== "/expenses"}
          searchValue={searchValue}
          searchResults={searchResults}
          isSearchLoading={isSearchLoading && deferredSearch.length >= 2}
          searchError={
            isSearchError
              ? searchError instanceof Error
                ? searchError.message
                : "Unable to search transactions."
              : undefined
          }
          notifications={notificationBills}
          isNotificationLoading={
            areBillsLoading || !readBillNotifications.isLoaded
          }
          notificationError={
            readBillNotifications.error ??
            (areBillsError
              ? billsError instanceof Error
                ? billsError.message
                : "Unable to load bill reminders."
              : undefined)
          }
          onSearch={setSearchValue}
          onTransactionSelect={(id) => {
            setSearchValue("");
            router.push(
              `/transactions?transactionId=${encodeURIComponent(id)}`,
            );
          }}
          onNotificationSelect={(id) => {
            readBillNotifications.markRead([id]);
            router.push("/bills");
          }}
          onMarkNotificationsRead={() =>
            readBillNotifications.markRead(unreadNotificationIds)
          }
          className="sticky top-0 z-10"
        />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
