"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuLogout } from "./MenuLogout";
import { SidebarProfile } from "./SidebarProfile";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarProps {
  items: SidebarNavItem[];
  activeHref?: string;
  user?: {
    name: string;
    avatarSrc?: string;
  };
  onViewProfile?: () => void;
  profileMenuItems?: { label: string; onClick?: () => void }[];
  className?: string;
}

export function Sidebar({
  items,
  activeHref,
  user = { name: "Tanzir Rahman" },
  onViewProfile,
  profileMenuItems,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-screen w-70 shrink-0 flex-col bg-[#191919]",
        "px-7 py-12",
        className,
      )}
    >
      <div className="flex w-56 justify-center text-center text-[24px] leading-8 tracking-[1.92px] text-white">
        <span className="font-logo font-extrabold">FINE</span>
        <span className="font-logo font-medium">bank.</span>
        <span className="font-logo font-extrabold">IO</span>
      </div>

      <nav
        className="mt-10 min-h-0 w-56 flex-1 space-y-4 overflow-y-auto pb-4"
        aria-label="Main navigation"
      >
        {items.map((item) => {
          const isActive = activeHref === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-12 w-56 items-center gap-3 rounded-[4px] px-4",
                "text-[16px] leading-6 transition-colors",
                isActive
                  ? "bg-[#299D91] font-semibold text-white"
                  : "font-normal text-white/70 hover:bg-white/10",
              )}
            >
              <Icon size={24} className="shrink-0" strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex w-56 flex-col gap-11">
        <MenuLogout />
        <SidebarProfile
          name={user.name}
          avatarSrc={user.avatarSrc}
          onViewProfile={onViewProfile}
          menuItems={profileMenuItems}
        />
      </div>
    </aside>
  );
}
