"use client";

import { DashboardHeader, Sidebar, type SidebarNavItem } from "@/shared/ui";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutGrid,
  Settings,
  Tag,
  Target,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const dashboardNavItems: SidebarNavItem[] = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
  { label: "Accounts", icon: Wallet, href: "/accounts" },
  { label: "Categories", icon: Tag, href: "/categories" },
  { label: "Budgets", icon: Target, href: "/budgets" },
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">
      <div className="hidden md:block">
        <Sidebar
          items={dashboardNavItems}
          activeHref={pathname}
          user={{ name: userName }}
          className="bg-[#111827]"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader userName={userName} className="sticky top-0 z-10" />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
