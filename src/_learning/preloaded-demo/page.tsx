// src/app/preloaded-demo/page.tsx
import { Card } from "@/shared/ui";
import { PreloadedStateDemo } from "@/components/PreloadedStateDemo";

// ✅ Server Component перевіряє стан
async function getPageData() {
  // Симуляція читання DB
  await new Promise((r) => setTimeout(r, 100));
  return { serverTime: new Date().toISOString() };
}

export default async function PreloadedDemoPage() {
  const { serverTime } = await getPageData();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">🌊 Preloaded State</h1>
        <p className="text-gray-500 text-sm mt-1">
          Server передає auth дані у Redux Store через preloadedState
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          <span className="font-bold">Серверний час render:</span>{" "}
          {new Date(serverTime).toLocaleTimeString("uk")}
        </p>
        <p className="text-xs text-blue-500 mt-1">
          Цей текст видно у View Source (SSR)
        </p>
      </Card>

      {/*
        PreloadedStateDemo — Client Component
        Читає Redux store який був ініціалізований
        серверними даними у layout.tsx
      */}
      <PreloadedStateDemo />
    </div>
  );
}
