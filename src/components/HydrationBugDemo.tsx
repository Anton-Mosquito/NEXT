// src/components/HydrationBugDemo.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, Badge } from "@/shared/ui";

// ============================================================
// ❌ ПОГАНО: Hydration mismatch через browser-only значення
// ============================================================
function BuggyDateComponent() {
  // ❌ new Date() на сервері та клієнті дають різні значення!
  const time = new Date().toLocaleTimeString("uk");

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="text-xs font-mono text-red-600">❌ Час без fix: {time}</p>
      <p className="text-xs text-red-400 mt-1">
        Сервер і клієнт рендерять різний час → mismatch!
      </p>
    </div>
  );
}

// ============================================================
// ✅ ДОБРЕ: Виправлений варіант через useEffect
// ============================================================
function FixedDateComponent() {
  // ✅ На сервері: null (не рендеримо час)
  // На клієнті: useEffect встановлює реальний час ПІСЛЯ hydration
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Виконується ТІЛЬКИ на клієнті, після hydration
    setTime(new Date().toLocaleTimeString("uk"));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("uk"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <p className="text-xs font-mono text-green-600">
        ✅ Час з fix:{" "}
        {time ?? (
          <span className="text-gray-400 animate-pulse">завантаження...</span>
        )}
      </p>
      <p className="text-xs text-green-400 mt-1">
        Сервер рендерить null → клієнт оновлює через useEffect
      </p>
    </div>
  );
}

// ============================================================
// ❌ ПОГАНО: localStorage під час SSR
// ============================================================
function BuggyLocalStorageComponent() {
  // ❌ localStorage не існує на сервері!
  // Це викине помилку: "localStorage is not defined"
  // const theme = localStorage.getItem('theme') // ← НІКОЛИ ТАК!

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="text-xs font-mono text-red-600">
        ❌ localStorage при SSR → ReferenceError
      </p>
      <pre className="text-xs text-red-400 mt-1 bg-red-100 p-2 rounded">
        {`// ❌ НІКОЛИ:
const theme = localStorage.getItem('theme')

// ✅ ПРАВИЛЬНО:
const [theme, setTheme] = useState(null)
useEffect(() => {
  setTheme(localStorage.getItem('theme'))
}, [])`}
      </pre>
    </div>
  );
}

// ============================================================
// ✅ ДОБРЕ: suppressHydrationWarning для справді динамічного
// ============================================================
function SuppressedHydrationComponent() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <p className="text-xs font-mono text-green-600">
        ✅ suppressHydrationWarning для навмисно різного контенту:
      </p>
      <pre className="text-xs text-green-500 mt-1 bg-green-100 p-2 rounded">
        {`<time
  suppressHydrationWarning
  dateTime={new Date().toISOString()}
>
  {new Date().toLocaleTimeString()}
</time>`}
      </pre>
      <time
        suppressHydrationWarning
        dateTime={new Date().toISOString()}
        className="text-xs text-green-700 font-mono"
      >
        {new Date().toLocaleTimeString("uk")}
      </time>
    </div>
  );
}

// ============================================================
// ❌ Redux Hydration Mismatch симуляція
// ============================================================
function ReduxHydrationMismatch() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-2">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-xs font-bold text-red-700 mb-2">
          ❌ Проблема: Server store ≠ Client store
        </p>
        <pre className="text-xs text-red-600 bg-red-100 p-2 rounded overflow-x-auto">
          {`// Server Component рендерить:
// store.posts = []  (порожній, ще не завантажено)
// <p>0 постів</p>

// Client гідратується:
// store.posts = [10 постів] (з localStorage/cookie)
// <p>10 постів</p>

// React бачить різницю → MISMATCH! ❌`}
        </pre>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs font-bold text-green-700 mb-2">
          ✅ Рішення: Preloaded State (Вправа 2!)
        </p>
        <pre className="text-xs text-green-600 bg-green-100 p-2 rounded overflow-x-auto">
          {`// 1. Server отримує дані
const posts = await fetchPosts()

// 2. Серіалізує у preloadedState
const preloadedState = { posts: { data: posts } }

// 3. Передає у StoreProvider
<StoreProvider preloadedState={preloadedState}>

// 4. Store ініціалізується з серверними даними
// Server render: store.posts = [10 постів]
// Client render: store.posts = [10 постів]
// Збіг! ✅`}
        </pre>
      </div>
    </div>
  );
}

export default function HydrationBugDemo() {
  return (
    <div className="space-y-4">
      <BuggyDateComponent />
      <FixedDateComponent />
      <BuggyLocalStorageComponent />
      <SuppressedHydrationComponent />
      <ReduxHydrationMismatch />
    </div>
  );
}
