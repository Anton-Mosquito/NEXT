// src/app/posts/prefetched/page.tsx
// ✅ Server Component: fetch → передати у Client Widget

import { PostsWithPrefetch } from "@/widgets/posts-with-prefetch";
import { Card } from "@/shared/ui";
import type { PostWithMeta } from "@/entities/post";

// Серверна функція (не викликає RTK Query, чистий fetch)
async function fetchPostsOnServer(): Promise<PostWithMeta[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
    {
      next: {
        revalidate: 60, // ISR: оновлення кожну хвилину
        tags: ["posts"], // для on-demand revalidation
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch posts");

  const posts = await res.json();

  // Збагачуємо дані (те ж що transformResponse у RTK Query)
  return posts.map((post: any) => ({
    ...post,
    excerpt: `${post.body.slice(0, 120)}...`,
    wordCount: post.body.split(" ").length,
    readingTimeMin: Math.ceil(post.body.split(" ").length / 200),
  }));
}

export const metadata = {
  title: "Server Prefetched Posts",
};

export default async function PrefetchedPostsPage() {
  // ✅ Серверний fetch — відбувається ДО відправки HTML клієнту
  const serverPosts = await fetchPostsOnServer();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">⚡ Server Prefetch + RTK Query</h1>
        <p className="text-gray-500 text-sm mt-1">
          Дані отримані на сервері → передані у Client Widget → RTK Query може
          refetch/mutate
        </p>
      </div>

      {/* Порівняння підходів */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {[
          {
            title: "❌ Без prefetch",
            steps: [
              "HTML порожній",
              "JS завантажується",
              "RTK Query запит",
              "Render",
            ],
            color: "bg-red-50 border-red-200",
          },
          {
            title: "✅ З prefetch",
            steps: [
              "Server fetch",
              "HTML з даними",
              "Hydrate (0 запитів)",
              "Готово!",
            ],
            color: "bg-green-50 border-green-200",
          },
        ].map(({ title, steps, color }) => (
          <Card key={title} className={`border ${color}`} padding="sm">
            <p className="font-bold mb-2">{title}</p>
            {steps.map((step, i) => (
              <p key={i} className="text-gray-600">
                {i + 1}. {step}
              </p>
            ))}
          </Card>
        ))}
      </div>

      {/* Widget з серверними даними */}
      <PostsWithPrefetch serverPosts={serverPosts} />
    </div>
  );
}
