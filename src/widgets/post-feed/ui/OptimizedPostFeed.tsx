// src/widgets/post-feed/ui/OptimizedPostFeed.tsx
"use client";
import { SkeletonList } from "@/shared/ui";

// ✅ Демонстрація оптимізацій для production

import { memo, useMemo, useCallback, useState } from "react";
import { useGetPostsQuery } from "@/entities/post";
import { LikeButton } from "@/features/like-post";
import { Card, Badge } from "@/shared/ui";
import { useAppSelector } from "@/app/store";
import {
  selectPostsQueryArgs,
  selectLikesStats,
} from "@/entities/post/model/postSelectors";
import type { PostWithMeta } from "@/entities/post";

// ============================================================
// ✅ React.memo: ре-рендериться тільки якщо post змінився
// ============================================================
const OptimizedPostCard = memo(function OptimizedPostCard({
  post,
  onSelect,
}: {
  post: PostWithMeta;
  onSelect: (id: number) => void;
}) {
  console.log(`🔄 PostCard #${post.id} рендериться`);

  // useCallback всередині memo — стабільний callback
  const handleClick = useCallback(() => {
    onSelect(post.id);
  }, [post.id, onSelect]);

  return (
    <Card hoverable onClick={handleClick}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm capitalize line-clamp-1 flex-1 mr-3">
          {post.title}
        </h3>
        <Badge variant="default">#{post.id}</Badge>
      </div>
      <div className="mt-2 pt-2 border-t flex items-center gap-2">
        <LikeButton postId={post.id} />
        <span className="text-xs text-gray-400 ml-auto">
          {post.readingTimeMin} хв
        </span>
      </div>
    </Card>
  );
});

// ============================================================
// ✅ Статистика — окремий компонент з мемоізованим selector
// ============================================================
const LikesStatsBar = memo(function LikesStatsBar() {
  // ✅ createSelector — перераховується тільки при зміні likes
  const stats = useAppSelector(selectLikesStats);

  return (
    <div className="flex gap-3 text-xs text-gray-500">
      <span>❤️ Всього лайків: {stats.total}</span>
      <span>✅ Liked: {stats.liked}</span>
    </div>
  );
});

// ============================================================
// Головний компонент
// ============================================================
export function OptimizedPostFeed() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ Мемоізований selector → query args
  const queryArgs = useAppSelector(selectPostsQueryArgs);

  // ✅ RTK Query з мемоізованими аргументами
  const { data: posts, isLoading } = useGetPostsQuery(queryArgs);

  // ✅ useCallback: стабільна функція між рендерами
  const handleSelect = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  // ✅ useMemo: відфільтрований список без зайвих обчислень
  const filteredPosts = useMemo(
    () => posts?.filter((p) => p.wordCount > 5) ?? [],
    [posts],
  );

  if (isLoading) {
    return <SkeletonList count={3} />;
  }

  return (
    <div className="space-y-3">
      <LikesStatsBar />

      {filteredPosts.map((post) => (
        <OptimizedPostCard key={post.id} post={post} onSelect={handleSelect} />
      ))}

      {selectedId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
          Вибраний пост: #{selectedId}
        </div>
      )}
    </div>
  );
}

if (process.env.NODE_ENV === "development") {
  OptimizedPostFeed.whyDidYouRender = true;
  OptimizedPostCard.whyDidYouRender = true;
  LikesStatsBar.whyDidYouRender = true;
}
