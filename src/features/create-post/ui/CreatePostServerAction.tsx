// src/features/create-post/ui/CreatePostServerAction.tsx
"use client";

import { useState, useTransition } from "react";
import { Card, Input, Button, Badge } from "@/shared/ui";
import { useAppDispatch } from "@/app/store";
import { baseApi } from "@/shared/api";
import {
  createPostAction,
  type CreatePostInput,
} from "@/shared/actions/postActions";

// ✅ ПАТТЕРН: Server Action + Redux RTK Query cache invalidation
export function CreatePostServerAction() {
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
    postId?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setResult(null);

      const input: CreatePostInput = {
        title: title.trim(),
        body: body.trim(),
        userId: 1,
      };

      // ✅ Викликаємо Server Action
      const actionResult = await createPostAction(input);

      if (actionResult.success && actionResult.data) {
        setResult({
          type: "success",
          message: `Пост "${actionResult.data.title}" створено!`,
          postId: actionResult.data.id,
        });
        setTitle("");
        setBody("");

        // ✅ Інвалідуємо RTK Query кеш після Server Action
        // Server Action вже зробив revalidatePath (Next.js кеш)
        // Але RTK Query має свій кеш — інвалідуємо вручну
        dispatch(baseApi.util.invalidateTags([{ type: "Post", id: "LIST" }]));
      } else {
        setResult({
          type: "error",
          message: actionResult.error ?? "Невідома помилка",
        });
      }
    });
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-lg">✍️ Server Action Form</h3>
        <Badge variant="primary">useTransition</Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Заголовок"
          placeholder="Мінімум 3 символи..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Текст</label>
          <textarea
            placeholder="Мінімум 10 символів..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            disabled={isPending}
            className="border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400 disabled:bg-gray-50"
          />
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || !title.trim() || !body.trim()}
          fullWidth
        >
          {isPending
            ? "⏳ Сервер обробляє..."
            : "🚀 Створити через Server Action"}
        </Button>
      </form>

      {/* Результат */}
      {result && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            result.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.type === "success" ? "✅" : "❌"} {result.message}
          {result.postId && (
            <span className="ml-2 font-mono text-xs">
              (ID: {result.postId})
            </span>
          )}
        </div>
      )}

      {/* Пояснення */}
      <div className="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-600 space-y-1">
        <p className="font-semibold mb-1">🔄 Потік виконання:</p>
        <p>1. handleSubmit → startTransition (не блокує UI)</p>
        <p>2. createPostAction() → виконується на СЕРВЕРІ</p>
        <p>3. Server: валідація + DB запит + revalidatePath()</p>
        <p>4. Client: отримує результат → dispatch invalidateTags</p>
        <p>5. RTK Query: рефетчить список постів автоматично</p>
      </div>
    </Card>
  );
}
