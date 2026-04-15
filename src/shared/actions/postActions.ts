// src/shared/actions/postActions.ts
"use server";

// ✅ 'use server' — весь файл = server actions
// Ці функції виконуються на СЕРВЕРІ, незалежно де викликаються

import { revalidatePath, revalidateTag } from "next/cache";

export interface CreatePostInput {
  title: string;
  body: string;
  userId: number;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ✅ Server Action: Створення поста
export async function createPostAction(
  input: CreatePostInput,
): Promise<ActionResult<{ id: number; title: string }>> {
  try {
    // Валідація на сервері (безпечно!)
    if (input.title.trim().length < 3) {
      return { success: false, error: "Заголовок занадто короткий" };
    }
    if (input.body.trim().length < 10) {
      return { success: false, error: "Текст занадто короткий" };
    }

    // Симуляція затримки мережі / DB запиту
    await new Promise((r) => setTimeout(r, 500));

    // В реальному проекті: await db.posts.create(input)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return { success: false, error: `API помилка: ${response.status}` };
    }

    const post = await response.json();

    // ✅ Інвалідуємо Next.js кеш після мутації
    revalidatePath("/posts");
    revalidateTag("posts", "default");

    return {
      success: true,
      data: { id: post.id, title: post.title },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Невідома помилка",
    };
  }
}

// ✅ Server Action: Видалення поста
export async function deletePostAction(postId: number): Promise<ActionResult> {
  try {
    await new Promise((r) => setTimeout(r, 300));

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      return { success: false, error: "Не вдалось видалити пост" };
    }

    // Інвалідуємо кеш
    revalidatePath("/posts");
    revalidateTag("posts", "default");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Помилка видалення",
    };
  }
}

// ✅ Server Action: Batch операція
export async function bulkDeletePostsAction(
  postIds: number[],
): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    // Паралельне видалення
    const results = await Promise.allSettled(
      postIds.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
          method: "DELETE",
        }),
      ),
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    revalidatePath("/posts");

    return {
      success: true,
      data: { deletedCount: successCount },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Batch видалення провалилось",
    };
  }
}
