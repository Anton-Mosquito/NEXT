// src/features/create-post/ui/CreatePostForm.tsx
"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/shared/ui";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePostMutation } from "../api/createPostApi";

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const [createPost, { isLoading, isSuccess, reset }] = useCreatePostMutation();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (title.trim().length < 5) newErrors.title = "Мінімум 5 символів";
    if (body.trim().length < 10) newErrors.body = "Мінімум 10 символів";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPost({ title, body, userId: 1 }).unwrap();
      setTitle("");
      setBody("");
      setErrors({});
      onSuccess?.();
    } catch (err) {
      console.error("Create post failed:", err);
    }
  };

  if (isSuccess) {
    return (
      <Card className="text-center py-6">
        <p className="text-4xl mb-2">🎉</p>
        <p className="font-semibold text-green-700">Пост успішно створено!</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => {
            reset();
            onSuccess?.();
          }}
        >
          Створити ще один
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-bold text-lg mb-4">✍️ Новий пост</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Заголовок"
          placeholder="Введи заголовок..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Текст</label>
          <Textarea
            placeholder="Введи текст поста..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            aria-invalid={!!errors.body}
            className="resize-none"
          />
          {errors.body && (
            <p className="text-xs text-destructive">{errors.body}</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" isLoading={isLoading} fullWidth>
            🚀 Публікувати
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Скасувати
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
