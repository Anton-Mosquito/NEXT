// src/components/StoreInitDemo.tsx
"use client";

import { useCallback } from "react";
import { Card, Badge } from "@/shared/ui";
import { StoreInitializer } from "@/app/store/StoreInitializer";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectCurrentPost,
  selectCurrentPostHydrated,
  clearCurrentPost,
} from "@/entities/post";
import { initializePost } from "@/entities/post/model/currentPostSlice";
import type { PostWithMeta } from "@/entities/post";
import type { AppDispatch } from "@/app/store";

interface StoreInitDemoProps {
  serverPost: PostWithMeta;
}

export function StoreInitDemo({ serverPost }: StoreInitDemoProps) {
  const dispatch = useAppDispatch();
  const currentPost = useAppSelector(selectCurrentPost);
  const isHydrated = useAppSelector(selectCurrentPostHydrated);

  const handleInitialize = useCallback(
    (d: AppDispatch) => {
      d(initializePost(serverPost));
    },
    [serverPost],
  );

  return (
    <div className="space-y-4">
      {/* ✅ StoreInitializer — dispatch під час render */}
      <StoreInitializer onInitialize={handleInitialize} />

      {/* Статус */}
      <div className="flex gap-2">
        <Badge variant={isHydrated ? "success" : "warning"}>
          {isHydrated ? "✅ Hydrated" : "⏳ Pending"}
        </Badge>
        <Badge variant="primary">
          currentPost: {currentPost ? `#${currentPost.id}` : "null"}
        </Badge>
      </div>

      {/* Порівняння підходів */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <Card className="bg-red-50 border-red-200" padding="sm">
          <p className="font-bold text-red-700 mb-2">❌ useEffect (пізно)</p>
          <pre className="text-red-600 text-xs leading-relaxed">{`// Виконується ПІСЛЯ render
useEffect(() => {
  dispatch(setPost(data))
  // Перший render:
  // store.post = null
  // → mismatch!
}, [])`}</pre>
        </Card>

        <Card className="bg-green-50 border-green-200" padding="sm">
          <p className="font-bold text-green-700 mb-2">✅ StoreInitializer</p>
          <pre className="text-green-600 text-xs leading-relaxed">{`// Виконується ПІД ЧАС render
if (!ref.current) {
  dispatch(setPost(data))
  // Перший render:
  // store.post = {id:1}
  // → збіг! ✅
}`}</pre>
        </Card>
      </div>

      {/* Поточний стан store */}
      {currentPost && (
        <Card>
          <p className="font-bold mb-2 text-sm">
            🏪 Redux store.currentPost (ініціалізований з сервера):
          </p>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs space-y-1">
            <p>
              <span className="text-purple-600">id:</span>{" "}
              <span className="text-green-600">{currentPost.id}</span>
            </p>
            <p>
              <span className="text-purple-600">title:</span>{" "}
              <span className="text-amber-600">
                "{currentPost.title.slice(0, 40)}..."
              </span>
            </p>
            <p>
              <span className="text-purple-600">readingTimeMin:</span>{" "}
              <span className="text-green-600">
                {currentPost.readingTimeMin}
              </span>
            </p>
            <p>
              <span className="text-purple-600">isHydrated:</span>{" "}
              <span className="text-green-600">{String(isHydrated)}</span>
            </p>
          </div>
          <button
            onClick={() => dispatch(clearCurrentPost())}
            className="mt-3 text-xs text-red-500 hover:underline"
          >
            Очистити store →
          </button>
        </Card>
      )}
    </div>
  );
}
