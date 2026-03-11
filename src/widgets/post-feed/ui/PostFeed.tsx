// src/widgets/post-feed/ui/PostFeed.tsx
"use client";

import { useState } from "react";
// ✅ Імпорти тільки з нижніх шарів
import { useGetPostsQuery, PostCard, PostSkeletonList } from "@/entities/post";
import { LikeButton } from "@/features/like-post";
import { DeletePostButton } from "@/features/delete-post";
import { CreatePostForm } from "@/features/create-post";
import { PostsFilter } from "@/features/filter-posts";
import { useAppSelector } from "@/app/store";
import { selectPostsFilter, setPage } from "@/features/filter-posts";
import { Button, Card } from "@/shared/ui";
import { useAppDispatch } from "@/app/store";

export function PostFeed() {
  const dispatch = useAppDispatch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const filter = useAppSelector(selectPostsFilter);

  const queryArg = { ...filter, userId: filter.userId ?? undefined };

  const { data: posts, isLoading, isFetching } = useGetPostsQuery(queryArg);

  return (
    <div className="space-y-4">
      {/* Фільтри */}
      <PostsFilter />

      {/* Кнопка створення */}
      <Button
        variant={showCreateForm ? "secondary" : "primary"}
        onClick={() => setShowCreateForm((s) => !s)}
      >
        {showCreateForm ? "✕ Скасувати" : "✍️ Новий пост"}
      </Button>

      {/* Форма створення */}
      {showCreateForm && (
        <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
      )}

      {/* Статус */}
      {isFetching && !isLoading && (
        <p className="text-sm text-blue-500 animate-pulse">↻ Оновлення...</p>
      )}

      {/* Список */}
      {isLoading ? (
        <PostSkeletonList count={3} />
      ) : posts?.length === 0 ? (
        <Card className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p>Нічого не знайдено</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              // ✅ Slot pattern: widget вставляє features у entity компонент
              actions={
                <>
                  <LikeButton postId={post.id} />
                  <DeletePostButton postId={post.id} />
                  <span className="ml-auto text-xs text-gray-400">
                    #{post.id}
                  </span>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Пагінація */}
      {posts && posts.length > 0 && (
        <div className="flex justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={filter.page === 1}
            onClick={() => dispatch(setPage(filter.page - 1))}
          >
            ← Назад
          </Button>
          <span className="text-sm text-gray-500 self-center">
            Сторінка {filter.page}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={(posts?.length ?? 0) < filter.limit}
            onClick={() => dispatch(setPage(filter.page + 1))}
          >
            Далі →
          </Button>
        </div>
      )}
    </div>
  );
}

if (process.env.NODE_ENV === "development") {
  PostFeed.whyDidYouRender = true;
}
