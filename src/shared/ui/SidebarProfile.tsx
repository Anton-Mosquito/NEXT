"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SidebarProfileMenuItem {
  label: string;
  onClick?: () => void;
}

interface SidebarProfileProps {
  name: string;
  avatarSrc?: string;
  /** Label under the name — defaults to "View profile" */
  viewLabel?: string;
  /** Dropdown menu items */
  menuItems?: SidebarProfileMenuItem[];
  onViewProfile?: () => void;
  className?: string;
}

export function SidebarProfile({
  name,
  avatarSrc,
  viewLabel = "View profile",
  menuItems,
  onViewProfile,
  className,
}: SidebarProfileProps) {
  return (
    <div
      className={cn(
        // py-8 = 32px top/bottom, no horizontal padding (sidebar provides it)
        "flex items-center py-8",
        className
      )}
    >
      {/* Avatar + name block — 188px wide, gap-4 (16px) */}
      <div className="flex w-47 shrink-0 items-center gap-4">
        {/* Avatar 32px circle */}
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-secondary">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name}
              width={32}
              height={32}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs font-semibold text-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text stack */}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-heading-md text-white">{name}</span>
          <button
            type="button"
            onClick={onViewProfile}
            className="truncate text-left text-body-sm text-white/50 transition-opacity hover:text-white/80"
          >
            {viewLabel}
          </button>
        </div>
      </div>

      {/* 32px spacer between name block and icon */}
      <div className="w-8 shrink-0" />

      {/* Three-dot menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="shrink-0 rounded-md p-1 text-white transition-colors hover:bg-white/10 focus:outline-none"
            aria-label="Open profile menu"
          >
            <MoreVertical size={20} />
          </button>
        </DropdownMenuTrigger>

        {menuItems && menuItems.length > 0 && (
          <DropdownMenuContent align="end" side="bottom">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.label} onClick={item.onClick}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
