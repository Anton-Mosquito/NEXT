// src/app/demo-patterns/page.tsx
// ✅ ПАТЕРН 2: Server рендерить контент, Client обгортає

import { Card } from "@/shared/ui";
import { InteractiveWrapper } from "@/components/InteractiveWrapper";

// Серверний компонент що отримує дані
async function ServerFetchedContent() {
  await new Promise((r) => setTimeout(r, 200)); // симуляція БД запиту

  const data = {
    title: "Серверно отримані дані",
    items: ["Елемент 1", "Елемент 2", "Елемент 3"],
    fetchedAt: new Date().toISOString(),
  };

  // ✅ Цей JSX рендериться на СЕРВЕРІ
  // Він передається як children до Client Component
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-green-700">
        ✅ Отримано на сервері о{" "}
        {new Date(data.fetchedAt).toLocaleTimeString("uk")}
      </p>
      <h2 className="text-xl font-bold">{data.title}</h2>
      <ul className="space-y-1">
        {data.items.map((item) => (
          <li key={item} className="text-gray-600 text-sm">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DemoPatternsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🔄 Server → Client Патерни</h1>

      {/* ПАТЕРН 2 */}
      <Card>
        <h2 className="font-bold mb-1 text-blue-700">
          Патерн 2: Children as Slot
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Server Component передає контент як children до Client обгортки.
          Server JSX НЕ проходить через Client bundle.
        </p>

        {/*
          InteractiveWrapper — Client Component
          ServerFetchedContent — Server Component рендериться на сервері
          і передається як children prop (вже готовий HTML!)
        */}
        <InteractiveWrapper>
          <ServerFetchedContent />
        </InteractiveWrapper>
      </Card>

      {/* ПАТЕРН 3: URL State */}
      <Card>
        <h2 className="font-bold mb-1 text-purple-700">Патерн 3: URL State</h2>
        <p className="text-xs text-gray-500 mb-3">
          Стан у search params — shareable URL, SEO-friendly
        </p>
        <UrlStateDemo />
      </Card>
    </div>
  );
}

// Client Component для URL State демо
function UrlStateDemo() {
  // ← Тут треба 'use client' якщо використовуємо hooks
  // Для простоти показуємо статично
  return (
    <div className="bg-purple-50 rounded-lg p-3 font-mono text-sm text-purple-700">
      <p>URL: /posts?page=2&userId=3&search=typescript</p>
      <p className="text-xs text-purple-500 mt-1">
        Server читає searchParams → передає в компоненти
      </p>
    </div>
  );
}
