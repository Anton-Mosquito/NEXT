// src/features/realtime/ui/NotificationBell.tsx
"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectNotifications,
  selectUnreadCount,
  markAllRead,
  WS_ACTIONS,
} from "../index";

export function NotificationBell() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [open, setOpen] = useState(false);

  const typeColors = {
    info: "bg-blue-100 text-blue-700 border-blue-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
  };

  const typeIcons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((s) => !s);
          if (!open && unreadCount > 0) dispatch(markAllRead());
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border rounded-xl shadow-xl z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <p className="font-bold text-sm">🔔 Нотифікації</p>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">
                Немає нотифікацій
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2 p-3 border-b last:border-0 text-xs border ${
                    typeColors[n.type]
                  } ${n.read ? "opacity-60" : ""}`}
                >
                  <span>{typeIcons[n.type]}</span>
                  <div className="flex-1">
                    <p>{n.message}</p>
                    <p className="text-gray-400 mt-0.5">
                      {new Date(n.timestamp).toLocaleTimeString("uk")}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
