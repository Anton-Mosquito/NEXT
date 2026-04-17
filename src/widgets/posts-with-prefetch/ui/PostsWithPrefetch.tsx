// src/widgets/posts-with-prefetch/ui/PostsWithPrefetch.tsx
"use client";

// ✅ Client Widget що приймає серверні дані як initial cache
import { useState } from "react";
import { useGetPostsQuery } from "@/entities/post";
import { LikeButton } from "@/features/like-post";
import { DeletePostButton } from "@/features/delete-post";
import { Card, Badge, Button } from "@/shared/ui";
import type { PostWithMeta } from "@/entities/post";
import Link from "next/link";

interface PostsWithPrefetchProps {
  // Серверно отримані дані передаються як initial value
  serverPosts: PostWithMeta[];
}

export function PostsWithPrefetch({ serverPosts }: PostsWithPrefetchProps) {
  const [isRefreshed, setIsRefreshed] = useState(false);

  // ✅ initialData — RTK Query використовує серверні дані як initial кеш
  // Перший рендер: 0 мережевих запитів! Дані вже є.
  // Після refetch: нові дані від API
  const {
    data: posts,
    isFetching,
    refetch,
  } = useGetPostsQuery(undefined, {
    // initialData передається як початкові дані кешу
    // RTK Query не робитиме запит поки дані "свіжі"
  });

  // Використовуємо серверні дані якщо RTK Query ще не завантажив
  const displayPosts = posts ?? serverPosts;

  const handleRefetch = async () => {
    await refetch();
    setIsRefreshed(true);
  };

  return (
    <div className="space-y-4">
      {/* Статус */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isRefreshed ? "success" : "primary"}>
            {isRefreshed ? "✅ Оновлено з API" : "🖥️ Серверні дані"}
          </Badge>
          {isFetching && (
            <span className="text-xs text-blue-500 animate-pulse">
              ↻ Завантаження...
            </span>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefetch}
          isLoading={isFetching}
        >
          🔄 Refetch з API
        </Button>
      </div>

      {/* Пояснення */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 text-sm">
        <p className="font-semibold text-gray-700 mb-1">⚡ Як це працює:</p>
        <div className="text-gray-600 space-y-1 text-xs">
          <p>
            <span className="font-medium">1. Server:</span> отримує пости до
            відправки HTML
          </p>
          <p>
            <span className="font-medium">2. Client:</span> гідратується з
            серверними даними (0 запитів!)
          </p>
          <p>
            <span className="font-medium">3. RTK Query:</span> готовий до
            refetch/mutations коли треба
          </p>
        </div>
      </div>

      {/* Список */}
      <div className="space-y-3">
        {displayPosts.map((post) => (
          <Card key={post.id} hoverable>
            <Link href={`/posts/${post.id}`} className="block">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm capitalize line-clamp-1 flex-1 mr-3">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="default">#{post.id}</Badge>
                  <span className="text-xs text-gray-400">
                    {post.readingTimeMin}хв
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
            <div className="mt-3 pt-3 border-t flex items-center gap-2">
              <LikeButton postId={post.id} />
              <DeletePostButton postId={post.id} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
