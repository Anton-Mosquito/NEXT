// src/components/PerformanceDashboard.tsx
"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Card, Badge, Button } from "@/shared/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectLikesStats,
  selectAuthSummary,
} from "@/entities/post/model/postSelectors";
import { toggleLike } from "@/features/like-post";

// ============================================================
// Лічильник рендерів
// ============================================================
const RenderCounter = memo(function RenderCounter({ name }: { name: string }) {
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono">
      <span className="text-gray-500">{name}:</span>{" "}
      <span className="font-bold text-blue-600">
        {renderCount.current} renders
      </span>
    </div>
  );
});

// ============================================================
// Компонент що підписується на певну частину store
// ============================================================
function LikesStatsSubscriber() {
  // Підписується тільки на likes через createSelector
  const stats = useAppSelector(selectLikesStats);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-medium text-green-700">
          LikesStats (createSelector)
        </p>
        <Badge variant="success">renders: {renderCount.current}</Badge>
      </div>
      <p className="text-sm">
        ❤️ {stats.total} | ✅ {stats.liked} liked
      </p>
    </div>
  );
}

function AuthSubscriber() {
  // Підписується тільки на auth через createSelector
  const summary = useAppSelector(selectAuthSummary);
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-medium text-blue-700">
          AuthSummary (createSelector)
        </p>
        <Badge variant="primary">renders: {renderCount.current}</Badge>
      </div>
      <p className="text-sm">
        {summary.isAuthenticated ? "🔓" : "🔒"} {summary.userName}
      </p>
    </div>
  );
}

// ============================================================
// Web Vitals Monitor
// ============================================================
function WebVitalsMonitor() {
  const [vitals, setVitals] = useState<Record<string, string>>({});

  useEffect(() => {
    // Симулюємо Web Vitals (в реальному проекті — next/vitals)
    const mockVitals = {
      FCP: `${(Math.random() * 500 + 200).toFixed(0)}ms`,
      LCP: `${(Math.random() * 1000 + 500).toFixed(0)}ms`,
      CLS: `${(Math.random() * 0.1).toFixed(3)}`,
      FID: `${(Math.random() * 50 + 10).toFixed(0)}ms`,
      TTFB: `${(Math.random() * 200 + 50).toFixed(0)}ms`,
    };
    setVitals(mockVitals);
  }, []);

  const getVitalColor = (name: string, value: string) => {
    const num = parseFloat(value);
    const thresholds: Record<string, [number, number]> = {
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      CLS: [0.1, 0.25],
      FID: [100, 300],
      TTFB: [800, 1800],
    };
    const [good, poor] = thresholds[name] ?? [1000, 2000];
    if (num <= good) return "text-green-600";
    if (num <= poor) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <h3 className="font-bold mb-3 text-sm">📊 Core Web Vitals (симуляція)</h3>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(vitals).map(([name, value]) => (
          <div key={name} className="text-center">
            <p className="text-xs text-gray-500">{name}</p>
            <p className={`font-bold text-sm ${getVitalColor(name, value)}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// Головний Dashboard
// ============================================================
export function PerformanceDashboard() {
  const dispatch = useAppDispatch();
  const [triggerCount, setTriggerCount] = useState(0);

  const handleToggleLike = () => {
    dispatch(toggleLike(1));
    setTriggerCount((c) => c + 1);
  };

  return (
    <div className="space-y-5">
      <WebVitalsMonitor />

      {/* Render tracking */}
      <Card>
        <h3 className="font-bold mb-3">🔄 Render Tracking</h3>
        <p className="text-xs text-gray-500 mb-3">
          Клікни кнопку та спостерігай які компоненти ре-рендеряться
        </p>

        <Button size="sm" onClick={handleToggleLike} className="mb-4">
          ❤️ Toggle Like #1 (trigger #{triggerCount})
        </Button>

        <div className="space-y-2">
          {/* ✅ Ці компоненти підписані на різні частини store через createSelector */}
          <LikesStatsSubscriber />
          <AuthSubscriber />
        </div>

        <div className="mt-3 bg-yellow-50 rounded-lg p-3 text-xs text-yellow-700">
          💡 При кліку Toggle Like: тільки LikesStatsSubscriber ре-рендериться.
          AuthSubscriber НЕ ре-рендериться (підписаний на auth, не likes). Це
          createSelector в дії!
        </div>
      </Card>

      {/* Bundle оптимізації чеклист */}
      <Card>
        <h3 className="font-bold mb-3">📦 Bundle Оптимізації</h3>
        <div className="space-y-2">
          {[
            {
              item: "Dynamic imports для важких компонентів",
              done: true,
              code: "const Heavy = dynamic(() => import('./Heavy'))",
            },
            {
              item: "Tree-shaking: named imports",
              done: true,
              code: "import { createSlice } from '@reduxjs/toolkit' ✅",
            },
            {
              item: "injectEndpoints: code splitting",
              done: true,
              code: "baseApi.injectEndpoints() у features/",
            },
            {
              item: "Аналіз bundle: npm run analyze",
              done: false,
              code: "ANALYZE=true npm run build",
            },
            {
              item: "next/dynamic для Client Components",
              done: false,
              code: "dynamic(() => import('./ClientOnly'), { ssr: false })",
            },
          ].map(({ item, done, code }) => (
            <div key={item} className="flex items-start gap-2 text-sm">
              <span className={done ? "text-green-500" : "text-gray-400"}>
                {done ? "✅" : "⬜"}
              </span>
              <div>
                <p className={done ? "text-gray-700" : "text-gray-500"}>
                  {item}
                </p>
                <p className="font-mono text-xs text-gray-400 mt-0.5">{code}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance tips */}
      <Card className="bg-purple-50 border-purple-200">
        <h3 className="font-bold text-purple-700 mb-3">
          🚀 Top Performance Tips
        </h3>
        <ol className="space-y-2 text-sm text-purple-600 list-decimal list-inside">
          <li>
            <strong>createSelector</strong> — для будь-якого derived state
          </li>
          <li>
            <strong>React.memo</strong> — для list items (PostCard, UserCard)
          </li>
          <li>
            <strong>useCallback</strong> — для handlers що передаються у memo
            компоненти
          </li>
          <li>
            <strong>selectFromResult</strong> — підписка тільки на потрібні поля
            RTK Query
          </li>
          <li>
            <strong>Server Components</strong> — для статичного контенту (0 JS)
          </li>
          <li>
            <strong>injectEndpoints</strong> — lazy loading RTK Query endpoints
          </li>
          <li>
            <strong>ANALYZE=true build</strong> — регулярний аналіз bundle
          </li>
        </ol>
      </Card>
    </div>
  );
}
