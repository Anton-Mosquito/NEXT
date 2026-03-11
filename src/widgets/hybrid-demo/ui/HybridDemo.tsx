// src/widgets/hybrid-demo/ui/HybridDemo.tsx
"use client";

import { useState } from "react";
import { Card, Badge, Button } from "@/shared/ui";
import { LikeButton } from "@/features/like-post";
import { useAppSelector } from "@/app/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/entities/auth";
import type { Post } from "@/entities/post";
import Link from "next/link";

interface HybridDemoProps {
  initialPosts: Post[];
}

export function HybridDemo({ initialPosts }: HybridDemoProps) {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // ✅ Redux стан доступний після hydration
  const user = useAppSelector(selectCurrentUser);
  const isAuth = useAppSelector(selectIsAuthenticated);

  return (
    <div className="space-y-3">
      {/* Auth стан з Redux */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm">
        <span className={isAuth ? "text-green-600" : "text-red-500"}>
          {isAuth ? "🔓" : "🔒"}
        </span>
        <span className="text-gray-600">
          {isAuth
            ? `Redux Auth: ${user?.name} (${user?.role})`
            : "Не авторизовано"}
        </span>
        <Badge variant="primary" className="ml-auto">
          Client State
        </Badge>
      </div>

      {/* Пости (серверні дані + клієнтська інтерактивність) */}
      {initialPosts.map((post) => (
        <Card
          key={post.id}
          className={`transition-all ${
            highlightedId === post.id ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() =>
            setHighlightedId(highlightedId === post.id ? null : post.id)
          }
          hoverable
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm capitalize line-clamp-1 flex-1 mr-3">
              {post.title}
            </h3>
            <div className="flex items-center gap-1">
              <Badge variant="default">Server data</Badge>
              <Badge variant="primary">#{post.id}</Badge>
            </div>
          </div>

          {highlightedId === post.id && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {post.body}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {/* ✅ LikeButton — Client Feature з Redux */}
            <LikeButton postId={post.id} />
            <Link
              href={`/posts/${post.id}`}
              className="text-xs text-blue-500 hover:underline ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              Читати →
            </Link>
          </div>
        </Card>
      ))}

      {/* Підсумок патерну */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-700 mb-1">
          ✅ Цей widget демонструє Hybrid паттерн:
        </p>
        <p>
          🖥️ <strong>initialPosts</strong> — отримані на сервері (0 клієнтських
          запитів)
        </p>
        <p>
          💻 <strong>useState</strong> — клієнтський стан для highlight
        </p>
        <p>
          🔴 <strong>LikeButton</strong> — Redux dispatch для лайків
        </p>
        <p>
          👤 <strong>selectCurrentUser</strong> — Redux auth стан
        </p>
      </div>
    </div>
  );
}
