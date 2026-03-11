// src/features/like-post/ui/LikeButton.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { toggleLike, selectPostLikes } from "../model/likeSlice";

interface LikeButtonProps {
  postId: number;
  size?: "sm" | "md";
}

export function LikeButton({ postId, size = "sm" }: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const { count, isLiked } = useAppSelector(selectPostLikes(postId));

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        dispatch(toggleLike(postId));
      }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        isLiked
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200",
      )}
    >
      {isLiked ? "❤️" : "🤍"} {count}
    </button>
  );
}
