// src/app/hybrid/page.tsx
// ✅ ФІНАЛЬНА HYBRID сторінка

import { Suspense } from "react";
import { Card } from "@/shared/ui";
import { HybridDemo } from "@/widgets/hybrid-demo";

// Серверні дані — різна "вага"
async function fetchCriticalData() {
  // Критичні дані — блокуємо render (важливо для SEO)
  await new Promise((r) => setTimeout(r, 50));
  return {
    pageTitle: "Гібридна Архітектура",
    description: "Server + Client — найкраще з обох світів",
    stats: { posts: 100, users: 10, comments: 500 },
  };
}

async function fetchSecondaryData() {
  // Другорядні дані — стрімимо
  await new Promise((r) => setTimeout(r, 600));
  const posts = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3",
    { next: { revalidate: 60 } },
  ).then((r) => r.json());
  return posts;
}

export const metadata = { title: "Hybrid Architecture | FSD App" };

export default async function HybridPage() {
  // ✅ Критичні дані — await (блокує але швидко)
  const critical = await fetchCriticalData();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Секція 1: Server-only (SEO critical) */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{critical.pageTitle}</h1>
        <p className="text-blue-100">{critical.description}</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Object.entries(critical.stats).map(([key, value]) => (
            <div key={key} className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-blue-100 capitalize">{key}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Секція 2: Architecture Diagram */}
      <Card>
        <h2 className="font-bold text-lg mb-4">🏗️ Архітектурна Схема</h2>
        <div className="space-y-2 text-sm">
          {[
            {
              layer: "Server (RSC)",
              what: "fetch, SEO metadata, static content",
              color: "bg-green-100 text-green-700 border-green-200",
              icon: "🖥️",
            },
            {
              layer: "Suspense Boundary",
              what: "Streaming, skeleton fallback",
              color: "bg-yellow-100 text-yellow-700 border-yellow-200",
              icon: "⏳",
            },
            {
              layer: "Client (Redux)",
              what: "Інтерактивність, реактивний стан, mutations",
              color: "bg-blue-100 text-blue-700 border-blue-200",
              icon: "💻",
            },
            {
              layer: "RTK Query Cache",
              what: "Синхронізація Server/Client даних",
              color: "bg-purple-100 text-purple-700 border-purple-200",
              icon: "🔄",
            },
          ].map(({ layer, what, color, icon }) => (
            <div
              key={layer}
              className={`flex items-center gap-3 p-3 rounded-lg border ${color}`}
            >
              <span className="text-xl">{icon}</span>
              <div>
                <p className="font-semibold">{layer}</p>
                <p className="text-xs opacity-80">{what}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Секція 3: Стрімінг другорядних даних */}
      <div>
        <h2 className="font-bold text-lg mb-3">🌊 Streaming + Redux Client</h2>
        <Suspense
          fallback={
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-xl border p-4 h-20"
                />
              ))}
            </div>
          }
        >
          {/* Async Server Component → передає у Client Widget */}
          <HybridDataLoader />
        </Suspense>
      </div>

      {/* Секція 4: Decision Matrix */}
      <Card>
        <h2 className="font-bold text-lg mb-4">🎯 Коли що використовувати</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 text-gray-600 w-1/3">Завдання</th>
                <th className="pb-2 text-gray-600 w-1/3">Підхід</th>
                <th className="pb-2 text-gray-600">Чому</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {[
                ["SEO контент", "Server Component", "HTML у відповіді сервера"],
                ["Дані з БД", "Server Component async", "Немає JS на клієнті"],
                ["Auth токен", "Server + cookies()", "Безпека, не в bundle"],
                ["Кнопки/форми", "Client Component", "Event handlers"],
                ["Redux dispatch", "Client Component", "useDispatch хук"],
                ["RTK Query", "Client Component", "useQuery хук"],
                ["Realtime", "Client + polling", "Тільки клієнт"],
                ["Список з фільтром", "URL State + Server", "Shareable URL"],
              ].map(([task, approach, why]) => (
                <tr key={task}>
                  <td className="py-2 font-medium text-gray-700">{task}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        approach.includes("Server")
                          ? "bg-green-100 text-green-700"
                          : approach.includes("Client")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {approach}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Async Server Component → завантажує дані → передає у HybridDemo
async function HybridDataLoader() {
  const posts = await fetchSecondaryData();
  return <HybridDemo initialPosts={posts} />;
}
