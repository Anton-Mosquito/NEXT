// src/app/cross-tab/page.tsx
import { CrossTabDemo } from "@/components/CrossTabDemo";

export default function CrossTabPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">🔄 Cross-Tab Sync</h1>
      <p className="text-gray-500 text-sm mb-5">
        BroadcastChannel синхронізує Redux дії між вкладками
      </p>
      <CrossTabDemo />
    </div>
  );
}
