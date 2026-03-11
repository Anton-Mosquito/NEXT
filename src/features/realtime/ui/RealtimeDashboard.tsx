// src/features/realtime/ui/RealtimeDashboard.tsx
"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectRealtimeStatus,
  selectLivePosts,
  selectRealtimeStats,
  selectUnreadCount,
  clearLivePosts,
  WS_ACTIONS,
} from "../index";
import { Card, Badge, Button } from "@/shared/ui";
import { NotificationBell } from "./NotificationBell";

const statusConfig = {
  disconnected: {
    color: "bg-gray-400",
    label: "Відключено",
    badge: "default" as const,
  },
  connecting: {
    color: "bg-yellow-400 animate-pulse",
    label: "Підключення...",
    badge: "warning" as const,
  },
  connected: {
    color: "bg-green-400",
    label: "Live",
    badge: "success" as const,
  },
  error: { color: "bg-red-400", label: "Помилка", badge: "danger" as const },
};

function ConnectionBar() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRealtimeStatus);
  const stats = useAppSelector(selectRealtimeStats);
  const unreadCount = useAppSelector(selectUnreadCount);
  const cfg = statusConfig[status];

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
          <div>
            <p className="font-bold text-sm">{cfg.label}</p>
            {stats.connectedAt && (
              <p className="text-xs text-gray-400">
                З {new Date(stats.connectedAt).toLocaleTimeString("uk")} ·{" "}
                {stats.messagesReceived} повідомлень
              </p>
            )}
            {stats.error && (
              <p className="text-xs text-red-400">{stats.error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          {status === "disconnected" || status === "error" ? (
            <Button
              size="sm"
              onClick={() => dispatch({ type: WS_ACTIONS.CONNECT })}
            >
              🔌 Підключити
            </Button>
          ) : (
            <Button
              size="sm"
              variant="danger"
              onClick={() => dispatch({ type: WS_ACTIONS.DISCONNECT })}
            >
              ⏹ Відключити
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function LivePostsFeed() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectLivePosts);
  const status = useAppSelector(selectRealtimeStatus);

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">📡 Live Feed</h3>
          {status === "connected" && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              live
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => dispatch(clearLivePosts())}
        >
          Очистити
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📡</p>
          <p className="text-sm">
            {status === "connected"
              ? "Очікуємо повідомлення..."
              : "Підключіться щоб бачити live дані"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                idx === 0
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-100"
              }`}
              style={{
                animation: idx === 0 ? "fadeIn 0.3s ease-in" : undefined,
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {post.author[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-700">
                    {post.author}
                  </p>
                  {idx === 0 && (
                    <Badge variant="primary" className="text-xs">
                      NEW
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{post.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(post.timestamp).toLocaleTimeString("uk")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function RealtimeDashboard() {
  const dispatch = useAppDispatch();

  // ✅ Auto-connect при монтуванні
  useEffect(() => {
    dispatch({ type: WS_ACTIONS.CONNECT });
    return () => {
      dispatch({ type: WS_ACTIONS.DISCONNECT });
    };
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <ConnectionBar />
      <LivePostsFeed />

      <Card className="bg-indigo-50 border-indigo-200 text-xs text-indigo-700">
        <p className="font-bold mb-1">🏗️ Архітектура WebSocket + Redux:</p>
        <div className="space-y-1">
          <p>
            1. dispatch({"{ type: WS_ACTIONS.CONNECT }"}) → middleware
            перехоплює
          </p>
          <p>2. Middleware створює WebSocket з'єднання</p>
          <p>3. WS.onmessage → dispatch(receivePost/receiveNotification)</p>
          <p>4. Reducer оновлює store → компоненти ре-рендеряться</p>
          <p>
            5. dispatch({"{ type: WS_ACTIONS.DISCONNECT }"}) → middleware
            закриває WS
          </p>
        </div>
      </Card>
    </div>
  );
}
