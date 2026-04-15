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
  onLogout?: () => void;
  onViewProfile?: () => void;
  profileMenuItems?: { label: string; onClick?: () => void }[];
  className?: string;
}

export function Sidebar({
  items,
  activeHref,
  user = { name: "Tanzir Rahman" },
  onLogout,
  onViewProfile,
  profileMenuItems,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        // 280px wide, full height, dark card surface
        "flex h-full w-70 flex-col bg-card",
        // padding: 48px top/bottom, 28px left/right
        "px-7 py-12",
        className
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className="text-center text-2xl leading-8 tracking-[0.08em] text-white">
        <span className="font-extrabold">FINE</span>
        <span className="font-normal">bank.IO</span>
      </div>

      {/* ── Nav menu — mt-10 = 40px gap from logo ────────────── */}
      <nav className="mt-10 flex flex-col gap-4">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // gap-3 = 12px between icon and label
                "flex items-center gap-3 rounded-xl px-4 py-3",
                "text-base leading-6 text-white transition-colors",
                isActive
                  ? "bg-primary font-semibold"
                  : "font-normal hover:bg-white/10"
              )}
            >
              <Icon size={24} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Flexible spacer (≈ 228px at 1024px sidebar height) ── */}
      <div className="flex-1" />

      {/* ── Logout ───────────────────────────────────────────── */}
      <MenuLogout onClick={onLogout} />

      {/* ── Profile — mt-11 = 44px gap from logout ───────────── */}
      <div className="mt-11">
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
