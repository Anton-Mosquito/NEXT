// src/components/SsrSafetyDemo.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { Card, Badge, Button } from "@/shared/ui";
import { useAppSelector } from "@/app/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/entities/auth";

export function SsrSafetyDemo({
  requestId,
  serverTimestamp,
}: {
  requestId: string;
  serverTimestamp: string;
}) {
  const user = useAppSelector(selectCurrentUser);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const renderCountRef = useRef(0);
  const [mountCount, setMountCount] = useState(0);

  const [rehydrateCount, setRehydrateCount] = useState(0);

  useEffect(() => {
    renderCountRef.current++;
    setMountCount(renderCountRef.current);
    // only track mount count safely outside render
  }, []);

  return (
    <div className="space-y-4">
      {/* Request ізоляція */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-700 mb-3">
          🔒 Per-Request Ізоляція
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <p className="text-gray-500 mb-1">Request ID (серверний):</p>
            <p className="bg-white rounded px-2 py-1 border font-bold text-blue-600">
              {requestId}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Timestamp (серверний):</p>
            <p className="bg-white rounded px-2 py-1 border text-purple-600">
              {new Date(serverTimestamp).toLocaleTimeString("uk")}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Auth user (з Redux):</p>
            <p className="bg-white rounded px-2 py-1 border text-green-600">
              {user?.name ?? "null"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Render count:</p>
            <p className="bg-white rounded px-2 py-1 border text-amber-600">
              {mountCount}
            </p>
          </div>
        </div>
      </Card>

      {/* SSR Safety Checklist */}
      <Card>
        <h3 className="font-bold mb-3">✅ SSR Safety Checklist</h3>
        <div className="space-y-2">
          {[
            {
              check: "StoreProvider використовує useRef",
              safe: true,
              desc: "Один store per React tree mount",
            },
            {
              check: "makeStore() як функція, не singleton",
              safe: true,
              desc: "Кожен виклик = новий store",
            },
            {
              check: "preloadedState з сервера",
              safe: true,
              desc: "Синхронна ініціалізація",
            },
            {
              check: "Немає глобального store на сервері",
              safe: true,
              desc: "Server Components не мають store",
            },
            {
              check: "localStorage тільки у useEffect",
              safe: true,
              desc: "Не виконується під час SSR",
            },
          ].map(({ check, safe, desc }) => (
            <div key={check} className="flex items-start gap-2">
              <span className={safe ? "text-green-500" : "text-red-500"}>
                {safe ? "✅" : "❌"}
              </span>
              <div>
                <p className="text-sm font-medium">{check}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Антипатерни */}
      <Card className="bg-red-50 border-red-200">
        <h3 className="font-bold text-red-700 mb-3">
          ❌ Антипатерни (ніколи не роби так)
        </h3>
        <div className="space-y-2 text-xs font-mono">
          {[
            {
              code: "export const store = makeStore()",
              desc: "Singleton — стан між запитами!",
            },
            {
              code: "useEffect(() => dispatch(init()), [])",
              desc: "Пізно — mismatch при першому render!",
            },
            {
              code: "if (typeof window === 'undefined') return null",
              desc: "Hydration mismatch — різний output!",
            },
            {
              code: "localStorage.getItem() у render",
              desc: "Crash на сервері — немає localStorage!",
            },
          ].map(({ code, desc }) => (
            <div
              key={code}
              className="bg-white rounded-lg p-2 border border-red-100"
            >
              <p className="text-red-600">{code}</p>
              <p className="text-red-400 mt-0.5"> ← {desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
