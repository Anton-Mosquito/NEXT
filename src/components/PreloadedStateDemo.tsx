// src/components/PreloadedStateDemo.tsx
"use client";

import { useAppSelector } from "@/app/store";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
} from "@/entities/auth";
import { Card, Badge } from "@/shared/ui";
import { useState, useEffect } from "react";

export function PreloadedStateDemo() {
  const user = useAppSelector(selectCurrentUser);
  const isAuth = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectAccessToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-4">
      {/* Статус hydration */}
      <div
        className={`rounded-xl p-4 border ${
          mounted
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{mounted ? "✅" : "⏳"}</span>
          <p className="font-bold">
            {mounted
              ? "Hydration завершено"
              : "Server render (ще не гідровано)"}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          mounted = {String(mounted)} (false на сервері, true після useEffect)
        </p>
      </div>

      {/* Redux стан */}
      <Card>
        <h3 className="font-bold mb-3">🏪 Redux Store (preloaded з сервера)</h3>
        <div className="space-y-2 font-mono text-xs">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-400 mb-1"> auth slice</p>
            <p>
              <span className="text-purple-600">isAuthenticated</span>:{" "}
              <span className="text-green-600">{String(isAuth)}</span>
            </p>
            <p>
              <span className="text-purple-600">user.name</span>:{" "}
              <span className="text-amber-600">&quot;{user?.name}&quot;</span>
            </p>
            <p>
              <span className="text-purple-600">user.role</span>:{" "}
              <span className="text-amber-600">&quot;{user?.role}&quot;</span>
            </p>
            <p>
              <span className="text-purple-600">accessToken</span>:{" "}
              <span className="text-amber-600 break-all">
                "{token?.slice(0, 30)}..."
              </span>
            </p>
          </div>
        </div>
      </Card>

      {/* Пояснення потоку */}
      <Card>
        <h3 className="font-bold mb-3">🔄 Потік даних</h3>
        <ol className="space-y-2 text-sm">
          {[
            {
              step: "1. layout.tsx (Server)",
              desc: "getServerAuthContext() → читає cookies/JWT",
              color: "bg-green-100 text-green-700",
            },
            {
              step: "2. buildPreloadedState()",
              desc: "Серіалізує auth дані у preloadedState об'єкт",
              color: "bg-blue-100 text-blue-700",
            },
            {
              step: "3. StoreProvider",
              desc: "makeStore(preloadedState) → store з серверними даними",
              color: "bg-purple-100 text-purple-700",
            },
            {
              step: "4. Server Render",
              desc: "HTML з правильним auth станом (user.name видно у HTML)",
              color: "bg-yellow-100 text-yellow-700",
            },
            {
              step: "5. Client Hydration",
              desc: "React порівнює HTML → збіг! ✅ Нуль mismatch!",
              color: "bg-green-100 text-green-700",
            },
          ].map(({ step, desc, color }) => (
            <li key={step} className="flex items-start gap-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${color} shrink-0`}
              >
                {step}
              </span>
              <span className="text-gray-600 text-xs pt-1">{desc}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
