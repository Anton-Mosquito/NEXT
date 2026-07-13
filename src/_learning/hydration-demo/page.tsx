// src/app/hydration-demo/page.tsx
import { Card } from "@/shared/ui";
import HydrationBugDemo from "@/components/HydrationBugDemo";

export default function HydrationDemoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">💧 Hydration — Типові Помилки</h1>
        <p className="text-gray-500 text-sm mt-1">
          Вивчаємо що ламає hydration і як це виправити
        </p>
      </div>

      <Card>
        <h2 className="font-bold text-lg mb-1">
          🔍 Що таке Hydration Mismatch?
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Hydration — процес коли React клієнт &quot;оживляє&quot; серверний
          HTML. Mismatch виникає коли серверний HTML ≠ клієнтський render. React
          або ігнорує (warning) або повністю перерендерює (performance hit).
        </p>
      </Card>

      <HydrationBugDemo />
    </div>
  );
}
