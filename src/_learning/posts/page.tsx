// src/app/posts/page.tsx
// ✅ SERVER COMPONENT — читає дані напряму
import { Suspense } from "react";
import { PostFeed } from "@/widgets/post-feed";
import { Card, SkeletonList } from "@/shared/ui";

// Metadata — тільки в Server Components
export const metadata = {
  title: "Пости | FSD App",
  description: "Всі пости нашого застосунку",
};

// ✅ Server Component може бути async
async function getPostsStats() {
  // Симуляція запиту до БД/API (на сервері!)
  await new Promise((r) => setTimeout(r, 2000));
  return { total: 100, today: 5, trending: 12 };
}

export default async function PostsPage() {
  // ✅ Серверний fetch — не потребує useEffect!
  const stats = await getPostsStats();

  return (
    <div className="space-y-6">
      {/* Статистика — рендериться на сервері, 0 JS */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Всього постів", value: stats.total, icon: "📝" },
          { label: "Сьогодні", value: stats.today, icon: "🆕" },
          { label: "Trending", value: stats.trending, icon: "🔥" },
        ].map(({ label, value, icon }) => (
          <Card key={label} padding="md">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </Card>
        ))}
      </div>

      {/* 
        PostFeed — CLIENT COMPONENT
        Сервер рендерить його SHELL (HTML структуру)
        Клієнт додає інтерактивність (фільтри, лайки, форму)
      */}
      <Suspense fallback={<SkeletonList count={3} />}>
        <PostFeed />
      </Suspense>
    </div>
  );
}
