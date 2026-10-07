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
        "box-border flex h-[88px] w-full items-center justify-between border-b border-[#E8E8E8] bg-white px-6 py-5 pr-8 dark:border-border dark:bg-background",
        className,
      )}
    >
      <div className="flex items-center gap-[24px]">
        <span className="text-[24px] font-bold leading-[28px] text-[#9F9F9F] dark:text-muted-foreground">
          Hello {userName}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ChevronsRight
          size={24}
          className="shrink-0 text-[#9F9F9F] dark:text-muted-foreground"
          strokeWidth={2}
        />
        <span className="whitespace-nowrap text-[14px] font-normal leading-5 text-[#9F9F9F] dark:text-muted-foreground">
          {displayDate}
        </span>
      </div>

      <div className="flex h-12 w-[416px] items-center gap-10">
        <button
          type="button"
          onClick={onNotificationClick}
          className="relative flex size-6 shrink-0 items-center justify-center text-[#666666] focus:outline-none dark:text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell size={24} strokeWidth={2} />
          {hasNotification && (
            <span className="absolute right-[1px] top-[1px] size-[7px] rounded-full bg-[#299D91]" />
          )}
        </button>

        <SearchInput
          onChange={(e) => onSearch?.(e.target.value)}
          wrapperClassName="shadow-none"
          className="text-[16px] leading-6"
        />
      </div>
    </header>
  );
}
