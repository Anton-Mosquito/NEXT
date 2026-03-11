// src/app/performance/page.tsx
import { PerformanceDashboard } from "@/components/PerformanceDashboard";

export const metadata = {
  title: "Performance | FSD App",
};

export default function PerformancePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">📊 Performance & Optimization</h1>
        <p className="text-gray-500 text-sm mt-1">
          Мемоізація, bundle аналіз та Web Vitals моніторинг
        </p>
      </div>
      <PerformanceDashboard />
    </div>
  );
}
