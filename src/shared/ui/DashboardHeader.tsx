import { Bell, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

interface DashboardHeaderProps {
  userName: string;
  date?: string;
  /** Unread notifications badge */
  hasNotification?: boolean;
  onNotificationClick?: () => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function DashboardHeader({
  userName,
  date,
  hasNotification = false,
  onNotificationClick,
  onSearch,
  className,
}: DashboardHeaderProps) {
  const displayDate =
    date ??
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <header
      className={cn(
        "flex items-center bg-card",
        // padding: 20px top/bottom, 24px left, 32px right
        "py-5 pl-6 pr-8 border-b border-gray-05",
        className,
      )}
    >
      {/* ── Left: greeting + date ──────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* Name: bold 24px / 28px */}
        <span className="text-2xl font-bold leading-7 text-foreground">
          Hello {userName}
        </span>

        {/* Date: ChevronsRight icon + text, gap-1 (4px) */}
        <div className="flex items-center gap-1">
          <ChevronsRight size={24} className="shrink-0 text-gray-03" />
          <span className="text-sm font-normal leading-5 text-gray-03">
            {displayDate}
          </span>
        </div>
      </div>

      {/* ── Spacer ─────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right: Bell + Search ───────────────────────────── */}
      <div className="flex items-center gap-10">
        {/* Bell with optional teal dot */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative shrink-0 text-gray-03 transition-colors hover:text-foreground focus:outline-none"
          aria-label="Notifications"
        >
          <Bell size={24} />
          {hasNotification && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary" />
          )}
        </button>

        {/* Search input — shadow: 0 26px 26px rgba(106,22,58,0.04) */}
        <SearchInput
          onChange={(e) => onSearch?.(e.target.value)}
          wrapperClassName="shadow-[0_5px_15px_rgb(0,0,0,0.25)]"
        />
      </div>
    </header>
  );
}
