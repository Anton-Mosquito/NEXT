// src/app/store-init-demo/page.tsx
import { Card } from "@/shared/ui";
import { StoreInitDemo } from "@/components/StoreInitDemo";
import type { PostWithMeta } from "@/entities/post";

async function fetchDemoPost(): Promise<PostWithMeta> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
    next: { revalidate: 60 },
  });
  const post = await res.json();
  const words = post.body.split(" ");
  return {
    ...post,
    excerpt: post.body.slice(0, 120) + "...",
    wordCount: words.length,
    readingTimeMin: Math.ceil(words.length / 200),
  };
}

export default async function StoreInitDemoPage() {
  // ✅ Server fetch
  const post = await fetchDemoPost();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">⚙️ StoreInitializer Паттерн</h1>
        <p className="text-gray-500 text-sm mt-1">
          Dispatch під час render — правильна ініціалізація store
        </p>
      </div>

      <Card className="bg-green-50 border-green-200">
        <p className="text-sm font-medium text-green-700 mb-1">
          🖥️ Серверний fetch:
        </p>
        <p className="text-xs text-green-600">
          Post #{post.id}: "{post.title.slice(0, 50)}..."
        </p>
        <p className="text-xs text-green-500 mt-1">
          wordCount: {post.wordCount} | readingTime: {post.readingTimeMin} хв
        </p>
      </Card>

      {/* StoreInitDemo отримує серверні дані та ініціалізує store */}
      <StoreInitDemo serverPost={post} />
    </div>
  );
}
