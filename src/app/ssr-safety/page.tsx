// src/app/ssr-safety/page.tsx
import { Card } from "@/shared/ui";
import { SsrSafetyDemo } from "@/components/SsrSafetyDemo";
import { randomUUID } from "crypto";

// ✅ Кожен запит має унікальний ID (доводить ізоляцію)
function generateRequestId() {
  // У Node.js crypto.randomUUID доступний без імпорту
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

export default async function SsrSafetyPage() {
  // ✅ Унікальний для кожного HTTP запиту
  const requestId = generateRequestId();
  const serverTimestamp = new Date().toISOString();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">🔒 SSR Безпека</h1>
        <p className="text-gray-500 text-sm mt-1">
          Per-request store ізоляція та антипатерни
        </p>
      </div>

      <Card className="bg-green-50 border-green-200">
        <p className="text-sm text-green-700">
          <strong>Request ID:</strong> {requestId}
        </p>
        <p className="text-xs text-green-500 mt-1">
          Кожне оновлення сторінки = новий ID = новий store instance
        </p>
      </Card>

      <SsrSafetyDemo requestId={requestId} serverTimestamp={serverTimestamp} />
    </div>
  );
}
