// src/app/posts/streaming/page.tsx
// ✅ Streaming + Suspense

import { Suspense } from "react";
import { Card, Skeleton, SkeletonCard } from "@/shared/ui";
import { ReduxStreamingClient } from "@/components/ReduxStreamingClient";

// Симуляція різних швидкостей завантаження
async function fetchFastData() {
  await new Promise((r) => setTimeout(r, 100));
  return { type: "fast", value: "Швидкі дані (100мс)", timestamp: Date.now() };
}

async function fetchMediumData() {
  await new Promise((r) => setTimeout(r, 800));
  return {
    type: "medium",
    value: "Середні дані (800мс)",
    timestamp: Date.now(),
  };
}

async function fetchSlowData() {
  await new Promise((r) => setTimeout(r, 2000));
  return {
    type: "slow",
    value: "Повільні дані (2000мс)",
    timestamp: Date.now(),
  };
}

// Кожен компонент — окрема Suspense boundary
async function FastSection() {
  const data = await fetchFastData();
  return (
    <Card className="bg-green-50 border-green-200">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="font-bold text-green-700">Секція 1: {data.value}</p>
          <p className="text-xs text-green-500">
            Завантажено о {new Date(data.timestamp).toLocaleTimeString("uk")}
          </p>
        </div>
      </div>
    </Card>
  );
}

async function MediumSection() {
  const data = await fetchMediumData();
  return (
    <Card className="bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔄</span>
        <div>
          <p className="font-bold text-blue-700">Секція 2: {data.value}</p>
          <p className="text-xs text-blue-500">
            Завантажено о {new Date(data.timestamp).toLocaleTimeString("uk")}
          </p>
        </div>
      </div>
    </Card>
  );
}

async function SlowSection() {
  const data = await fetchSlowData();
  return (
    <Card className="bg-orange-50 border-orange-200">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🐌</span>
        <div>
          <p className="font-bold text-orange-700">Секція 3: {data.value}</p>
          <p className="text-xs text-orange-500">
            Завантажено о {new Date(data.timestamp).toLocaleTimeString("uk")}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Skeleton компоненти
function SectionSkeleton({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

export default function StreamingPage() {
  // ✅ Цей рядок виконується МИТТЄВО — без await
  const pageLoadTime = new Date().toLocaleTimeString("uk");

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Shell: рендериться МИТТЄВО */}
      <div>
        <h1 className="text-2xl font-bold">🌊 Streaming + Suspense</h1>
        <p className="text-gray-500 text-sm mt-1">
          Сторінка відкрилась о {pageLoadTime}. Секції з'являються по мірі
          завантаження.
        </p>
      </div>

      {/* Інструкція */}
      <Card className="bg-purple-50 border-purple-200">
        <p className="text-sm text-purple-700 font-medium mb-2">
          👀 Що спостерігати:
        </p>
        <ul className="text-xs text-purple-600 space-y-1">
          <li>1. Відкрий DevTools → Network → Disable Cache</li>
          <li>2. Перезавантаж сторінку (Ctrl+R)</li>
          <li>3. Спостерігай як секції з'являються одна за одною!</li>
          <li>4. Skeleton → реальний контент при готовності</li>
        </ul>
      </Card>

      {/* 
        Три Suspense boundaries = три потоки
        Next.js стрімить кожну секцію окремо!
      */}

      {/* Секція 1 — швидка (100мс) */}
      <Suspense fallback={<SectionSkeleton label="~100мс" />}>
        <FastSection />
      </Suspense>

      {/* Секція 2 — середня (800мс) */}
      <Suspense fallback={<SectionSkeleton label="~800мс" />}>
        <MediumSection />
      </Suspense>

      {/* Секція 3 — повільна (2000мс) */}
      <Suspense fallback={<SectionSkeleton label="~2000мс" />}>
        <SlowSection />
      </Suspense>

      {/* Redux + Streaming: Client Component в Suspense */}
      <div className="border-t pt-4">
        <h2 className="font-bold mb-3">🔗 Redux + Streaming</h2>
        <Suspense fallback={<SkeletonCard lines={3} />}>
          <ReduxStreamingSection />
        </Suspense>
      </div>
    </div>
  );
}

// ✅ Окремий async Server Component що передає дані у Client Component
async function ReduxStreamingSection() {
  // Затримка для демонстрації
  await new Promise((r) => setTimeout(r, 1200));

  const posts = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=3",
  ).then((r) => r.json());

  // Передаємо серверні дані у Client Component
  return <ReduxStreamingClient initialPosts={posts} />;
}
