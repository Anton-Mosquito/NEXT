// src/components/ReduxStreamingClient.tsx
"use client";

import { useState } from "react";
import { Card, Button } from "@/shared/ui";
import { useAppSelector } from "@/app/store";
import { selectCurrentUser } from "@/entities/auth";

interface ReduxStreamingClientProps {
  initialPosts: Array<{ id: number; title: string }>;
}

export function ReduxStreamingClient({
  initialPosts,
}: ReduxStreamingClientProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // ✅ Redux стан доступний одразу після hydration!
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Card className="bg-indigo-50 border-indigo-200">
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-indigo-700">
          🎯 Redux Client — після streaming
        </p>
        {currentUser && (
          <span className="text-xs text-indigo-500">👤 {currentUser.name}</span>
        )}
      </div>

      <div className="space-y-1 mb-3">
        {initialPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedId(post.id)}
            className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
              selectedId === post.id
                ? "bg-indigo-200 text-indigo-800"
                : "text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            #{post.id}: <span className="line-clamp-1">{post.title}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-indigo-400">
        ✅ Серверні дані + Redux стан + клієнтська інтерактивність
      </p>
    </Card>
  );
}
