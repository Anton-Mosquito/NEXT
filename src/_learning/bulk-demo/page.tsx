// src/app/bulk-demo/page.tsx
import { BulkActions, bulkSlice } from "@/features/bulk-actions";
export default function BulkDemoPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">🎯 Bulk + Partial Rollback</h1>
      <p className="text-gray-500 text-sm mb-5">
        Batch операції з optimistic UI та частковим rollback при помилках
      </p>
      <BulkActions />
    </div>
  );
}
