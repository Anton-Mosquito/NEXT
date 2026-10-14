"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "./SearchInput";

export interface DashboardSearchResult {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
}

export interface DashboardBillNotification {
  id: string;
  vendorName: string;
  title: string;
  dueDate: string;
  amount: string;
  isOverdue: boolean;
  isRead: boolean;
}

interface DashboardHeaderProps {
  userName: string;
  showGreeting?: boolean;
  date?: string;
  searchValue?: string;
  searchResults?: DashboardSearchResult[];
  isSearchLoading?: boolean;
  searchError?: string;
  notifications?: DashboardBillNotification[];
  isNotificationLoading?: boolean;
  notificationError?: string;
  onNotificationClick?: () => void;
  onSearch?: (value: string) => void;
  onTransactionSelect?: (id: string) => void;
  onNotificationSelect?: (id: string) => void;
  onMarkNotificationsRead?: () => void;
  className?: string;
}

export function DashboardHeader({
  userName,
  showGreeting = true,
  date,
  searchValue = "",
  searchResults = [],
  isSearchLoading = false,
  searchError,
  notifications = [],
  isNotificationLoading = false,
  notificationError,
  onNotificationClick,
  onSearch,
  onTransactionSelect,
  onNotificationSelect,
  onMarkNotificationsRead,
  className,
}: DashboardHeaderProps) {
  const [activePanel, setActivePanel] = useState<
    "search" | "notifications" | null
  >(null);
  const utilityRef = useRef<HTMLDivElement>(null);
  const displayDate =
    date ??
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useEffect(() => {
    if (!activePanel) return;

    const closePanel = (event: PointerEvent) => {
      if (
        !(event.target instanceof Node) ||
        !utilityRef.current?.contains(event.target)
      ) {
        setActivePanel(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePanel(null);
    };

    document.addEventListener("pointerdown", closePanel);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closePanel);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePanel]);

  const formatDueDate = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  };

  return (
    <header
      className={cn(
        "mx-auto box-border flex h-22 w-full max-w-290 items-center justify-between border-b border-[#E8E8E8] bg-transparent px-6 py-5 pr-8 dark:border-border",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {showGreeting ? (
          <span className="whitespace-nowrap text-[24px] font-bold leading-7 text-[#191919] dark:text-foreground">
            Hello {userName}
          </span>
        ) : null}

        <div className="flex shrink-0 items-center gap-1">
          <ChevronsRight
            size={24}
            className="text-[#9F9F9F] dark:text-muted-foreground"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap text-[14px] font-normal leading-5 text-[#9F9F9F] dark:text-muted-foreground">
            {displayDate}
          </span>
        </div>
      </div>

      <div
        ref={utilityRef}
        className="flex h-12 w-104 shrink-0 items-center gap-10"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setActivePanel((current) =>
                current === "notifications" ? null : "notifications",
              );
              onNotificationClick?.();
            }}
            className="relative flex size-6 shrink-0 items-center justify-center rounded-sm text-[#666666] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:text-muted-foreground"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={activePanel === "notifications"}
            aria-controls="dashboard-notifications"
          >
            <Bell size={24} strokeWidth={2} />
            {unreadCount > 0 && !isNotificationLoading ? (
              <span
                aria-hidden="true"
                className="absolute right-px top-px size-1.75 rounded-full bg-[#299D91]"
              />
            ) : null}
          </button>

          {activePanel === "notifications" ? (
            <section
              id="dashboard-notifications"
              aria-label="Bill notifications"
              className="absolute right-0 top-full z-50 mt-3 w-90 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-semibold">Bill reminders</h2>
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={onMarkNotificationsRead}
                    className="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Mark all read
                  </button>
                ) : null}
              </div>

              {notificationError ? (
                <p className="text-sm text-destructive" role="alert">
                  {notificationError}
                </p>
              ) : isNotificationLoading ? (
                <p className="text-sm text-muted-foreground" role="status">
                  Loading bill reminders…
                </p>
              ) : notifications.length ? (
                <ul className="max-h-80 space-y-2 overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onNotificationSelect?.(notification.id);
                          setActivePanel(null);
                        }}
                        className={cn(
                          "w-full rounded-lg p-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          notification.isRead && "opacity-65",
                        )}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium">
                            {notification.vendorName}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 text-xs font-medium",
                              notification.isOverdue
                                ? "text-destructive"
                                : "text-muted-foreground",
                            )}
                          >
                            {notification.isOverdue
                              ? "Overdue"
                              : formatDueDate(notification.dueDate)}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">
                          {notification.title} · {notification.amount}
                        </span>
                        {!notification.isRead ? (
                          <span className="sr-only">Unread</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming unpaid bills.
                </p>
              )}
            </section>
          ) : null}
        </div>

        <div className="relative min-w-0 flex-1">
          <SearchInput
            aria-label="Search transactions"
            aria-expanded={activePanel === "search"}
            aria-controls="dashboard-search-results"
            value={searchValue}
            onFocus={() => setActivePanel("search")}
            onChange={(event) => {
              onSearch?.(event.target.value);
              setActivePanel("search");
            }}
            wrapperClassName="w-[352px] max-w-full shadow-[0_26px_26px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-primary/30"
            className="text-[16px] leading-6"
          />

          {activePanel === "search" ? (
            <section
              id="dashboard-search-results"
              aria-label="Transaction search results"
              className="absolute right-0 top-full z-50 mt-3 w-88 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
            >
              {searchValue.trim().length < 2 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  Type at least 2 characters to search transactions.
                </p>
              ) : searchError ? (
                <p className="px-3 py-2 text-sm text-destructive" role="alert">
                  {searchError}
                </p>
              ) : isSearchLoading ? (
                <p
                  className="px-3 py-2 text-sm text-muted-foreground"
                  role="status"
                >
                  Searching transactions…
                </p>
              ) : searchResults.length ? (
                <ul className="max-h-80 overflow-y-auto">
                  {searchResults.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onTransactionSelect?.(result.id);
                          setActivePanel(null);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium">
                            {result.title}
                          </span>
                          <span className="shrink-0 text-sm font-semibold">
                            {result.amount}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {result.subtitle} · {result.date}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  No matching transactions.
                </p>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </header>
  );
}
