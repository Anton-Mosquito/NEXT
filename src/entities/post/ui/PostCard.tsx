// src/entities/post/ui/PostCard.tsx
import { Card, Badge, Avatar } from "@/shared/ui";
import { truncate } from "@/shared/lib";
import type { PostWithMeta } from "../model/types";

interface PostCardProps {
  post: PostWithMeta;
  isSelected?: boolean;
  onClick?: () => void;
  // ✅ Slot pattern — features можуть "вставити" свої actions
  actions?: React.ReactNode;
  compact?: boolean;
}

export function PostCard({
  post,
  isSelected,
  onClick,
  actions,
  compact = false,
}: PostCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={isSelected ? "border-blue-400 ring-1 ring-blue-300" : ""}
    >
      {/* Метадані */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={`User ${post.userId}`} size="sm" />
          <Badge variant="default">User #{post.userId}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>📖 {post.readingTimeMin} хв</span>
          {!compact && <span>💬 {post.wordCount} сл.</span>}
        </div>
      </div>

      {/* Заголовок */}
      <h3 className="font-semibold text-gray-800 capitalize leading-snug mb-1.5 line-clamp-2">
        {post.title}
      </h3>

      {/* Текст */}
      {!compact && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {/* Actions slot — сюди features вставляють кнопки */}
      {actions && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          {actions}
        </div>
      )}
    </Card>
  );
}

if (process.env.NODE_ENV === "development") {
  PostCard.whyDidYouRender = true;
}
