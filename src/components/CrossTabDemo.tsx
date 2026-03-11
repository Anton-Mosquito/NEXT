// src/components/CrossTabDemo.tsx
"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toggleLike, selectPostLikes } from "@/features/like-post";
import { Card, Button, Badge } from "@/shared/ui";

export function CrossTabDemo() {
  const dispatch = useAppDispatch();
  const [tabId] = useState(() =>
    Math.random().toString(36).slice(2, 7).toUpperCase(),
  );
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [broadcastSupported] = useState(
    () => typeof window !== "undefined" && "BroadcastChannel" in window,
  );

  // Відстежуємо лайки для кількох постів
  const post1Likes = useAppSelector(selectPostLikes(1));
  const post2Likes = useAppSelector(selectPostLikes(2));
  const post3Likes = useAppSelector(selectPostLikes(3));

  // Логуємо зміни для демонстрації
  useEffect(() => {
    setSyncLog((prev) =>
      [
        `[${new Date().toLocaleTimeString()}] Tab ${tabId}: Like P1=${post1Likes.count}`,
        ...prev,
      ].slice(0, 5),
    );
  }, [post1Likes.count, tabId]);

  return (
    <div className="space-y-4">
      {/* Tab Info */}
      <Card className="bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-purple-700">
              🪟 Ця вкладка:{" "}
              <code className="bg-purple-100 px-1 rounded">{tabId}</code>
            </p>
            <p className="text-xs text-purple-500 mt-1">
              BroadcastChannel:{" "}
              <span
                className={
                  broadcastSupported ? "text-green-600" : "text-red-500"
                }
              >
                {broadcastSupported
                  ? "✅ підтримується"
                  : "❌ не підтримується"}
              </span>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => window.open(window.location.href, "_blank")}
          >
            🪟 Відкрити другу вкладку
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200 text-sm text-blue-700">
        <p className="font-bold mb-2">📋 Як тестувати:</p>
        <ol className="space-y-1 text-xs">
          <li>1. Натисни "Відкрити другу вкладку"</li>
          <li>2. Поставив лайк у першій вкладці</li>
          <li>3. Спостерігай: лічильник оновлюється у ДРУГІЙ вкладці!</li>
          <li>4. BroadcastChannel відправляє action між вкладками</li>
        </ol>
      </Card>

      {/* Posts with likes */}
      <div className="space-y-2">
        {[
          { id: 1, title: "Redux Toolkit Tips", likes: post1Likes },
          { id: 2, title: "Next.js Server Components", likes: post2Likes },
          { id: 3, title: "RTK Query Advanced", likes: post3Likes },
        ].map(({ id, title, likes }) => (
          <Card key={id} padding="sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{title}</p>
              <button
                onClick={() => dispatch(toggleLike(id))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  likes.isLiked
                    ? "bg-red-100 text-red-500 hover:bg-red-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {likes.isLiked ? "❤️" : "🤍"} {likes.count}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sync log */}
      <Card padding="sm">
        <p className="text-xs font-bold mb-2">📡 Sync Log (ця вкладка)</p>
        <div className="space-y-1 font-mono">
          {syncLog.map((entry, i) => (
            <p key={i} className="text-xs text-gray-500">
              {entry}
            </p>
          ))}
          {syncLog.length === 0 && (
            <p className="text-xs text-gray-400">
              Натисни лайк щоб побачити log...
            </p>
          )}
        </div>
      </Card>

      {/* How it works */}
      <Card>
        <p className="text-xs font-bold mb-2">🔧 Як це працює:</p>
        <div className="font-mono text-xs text-gray-600 space-y-1">
          <p>Вкладка 1: dispatch(toggleLike(1))</p>
          <p className="text-gray-400">↓ crossTabMiddleware перехоплює</p>
          <p>channel.postMessage({"{ action: toggleLike(1) }"})</p>
          <p className="text-gray-400">↓ BroadcastChannel</p>
          <p>Вкладка 2: channel.onmessage → dispatch(toggleLike(1))</p>
          <p>✅ Обидві вкладки мають синхронний стан!</p>
        </div>
      </Card>
    </div>
  );
}
