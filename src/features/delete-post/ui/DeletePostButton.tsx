// src/features/delete-post/ui/DeletePostButton.tsx
"use client";

import { Button } from "@/shared/ui";
import { useDeletePostMutation } from "../api/deletePostApi";

interface DeletePostButtonProps {
  postId: number;
  onDeleted?: () => void;
}

export function DeletePostButton({ postId, onDeleted }: DeletePostButtonProps) {
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const handleDelete = async () => {
    if (!confirm(`Видалити пост #${postId}?`)) return;
    try {
      await deletePost(postId).unwrap();
      onDeleted?.();
    } catch {
      alert("Помилка видалення");
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      isLoading={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
    >
      🗑️
    </Button>
  );
}
