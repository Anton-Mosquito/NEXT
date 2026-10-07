"use client";

import Image from "next/image";
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
        "flex h-26 w-56 items-center gap-8 border-t border-white/8 py-8",
        className,
      )}
    >
      <div className="flex w-47 shrink-0 items-center gap-4">
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

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[16px] font-semibold leading-6 text-white">
            {name}
          </span>
          <button
            type="button"
            onClick={onViewProfile}
            className="truncate text-left text-[12px] leading-4 text-white/70 transition-opacity hover:text-white/80"
          >
            {viewLabel}
          </button>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-5 w-1 shrink-0 flex-col gap-1 rounded-md text-white transition-colors hover:bg-white/10 focus:outline-none"
            aria-label="Open profile menu"
          >
            <span className="size-1 rounded-full bg-white" />
            <span className="size-1 rounded-full bg-white" />
            <span className="size-1 rounded-full bg-white" />
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
