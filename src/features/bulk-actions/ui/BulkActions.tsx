// src/features/bulk-actions/ui/BulkActions.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectBulkItems,
  selectBulkStats,
  toggleSelect,
  selectAll,
  setItemsPending,
  applyPartialArchive,
  clearErrors,
  resetItems,
  batchArchive,
} from "../model/bulkSlice";
import { Card, Button, Badge } from "@/shared/ui";

export function BulkActions() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBulkItems);
  const stats = useAppSelector(selectBulkStats);

  const selectedIds = items
    .filter((i) => i.selected && i.status === "active")
    .map((i) => i.id);

  const handleBatchArchive = async () => {
    if (selectedIds.length === 0) return;

    // 1️⃣ Optimistic: миттєво ставимо pending
    dispatch(setItemsPending(selectedIds));

    // 2️⃣ Виконуємо batch операцію
    const result = await dispatch(batchArchive(selectedIds)).unwrap();

    // 3️⃣ Partial rollback: архівуємо succeeded, rollback failed
    dispatch(applyPartialArchive(result));
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          {
            label: "Active",
            value: stats.active,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Selected",
            value: stats.selected,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Archived",
            value: stats.archived,
            color: "bg-gray-100 text-gray-600",
          },
          {
            label: "Errors",
            value: stats.failed,
            color: "bg-red-100 text-red-600",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-lg p-2 ${color}`}>
            <p className="font-bold text-lg">{value}</p>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={items.length > 0 && items.every((i) => i.selected)}
            onChange={() => dispatch(selectAll())}
            className="w-4 h-4 accent-blue-500"
          />
          Вибрати всі
        </label>

        <Button
          size="sm"
          onClick={handleBatchArchive}
          disabled={selectedIds.length === 0 || stats.pending > 0}
          isLoading={stats.pending > 0}
          className="ml-auto"
        >
          📦 Archive ({selectedIds.length})
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => dispatch(clearErrors())}
        >
          Скинути помилки
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => dispatch(resetItems())}
        >
          Reset
        </Button>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              item.hasError
                ? "border-red-300 bg-red-50"
                : item.isPending
                  ? "border-yellow-300 bg-yellow-50 opacity-70"
                  : item.status === "archived"
                    ? "border-gray-200 bg-gray-50 opacity-50"
                    : item.selected
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => dispatch(toggleSelect(item.id))}
              disabled={item.status !== "active" || item.isPending}
              className="w-4 h-4 accent-blue-500 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {item.isPending && (
                  <span className="text-xs text-yellow-600 flex items-center gap-1">
                    <span className="w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
                    pending
                  </span>
                )}
                {item.hasError && (
                  <span className="text-xs text-red-600">❌ rolled back</span>
                )}
                {item.status === "archived" && (
                  <span className="text-xs text-gray-500">📦 archived</span>
                )}
                {!item.isPending &&
                  !item.hasError &&
                  item.status === "active" && (
                    <span className="text-xs text-green-600">✓ active</span>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Operation log */}
      {stats.log.length > 0 && (
        <Card padding="sm">
          <p className="text-xs font-bold mb-2">📋 Operation Log</p>
          <div className="space-y-1 max-h-32 overflow-y-auto font-mono">
            {stats.log.map((entry, i) => (
              <p key={i} className="text-xs text-gray-600">
                {entry}
              </p>
            ))}
          </div>
        </Card>
      )}

      <Card className="bg-orange-50 border-orange-200 text-xs text-orange-700">
        <p className="font-bold mb-1">⚡ Паттерн Partial Optimistic Update:</p>
        <p>Кожен 3й елемент "провалюється" (симуляція).</p>
        <p>Succeeded → archived ✅ | Failed → rollback до active ❌</p>
        <p className="mt-1">
          Весь batch виконується паралельно через Promise.allSettled
        </p>
      </Card>
    </div>
  );
}
