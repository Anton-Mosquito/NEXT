"use client";

import { DashboardHeader, Sidebar, type SidebarNavItem } from "@/shared/ui";
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
}: {
  children: ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const activeHref = pathname.startsWith("/accounts/") ? "/accounts" : pathname;

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
        <DashboardHeader userName={userName} className="sticky top-0 z-10" />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
