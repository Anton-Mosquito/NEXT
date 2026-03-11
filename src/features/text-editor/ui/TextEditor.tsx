// src/features/text-editor/ui/TextEditor.tsx
"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectEditorPresent,
  selectCanUndo,
  selectCanRedo,
  selectEditorHistory,
  updateText,
  updateFontSize,
  toggleBold,
  toggleItalic,
  updateColor,
  undo,
  redo,
  jumpToHistory,
  clearHistory,
  resetEditor,
} from "../model/editorSlice";
import { Card, Button, Badge } from "@/shared/ui";

const COLORS = [
  "#1f2937",
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
];

function Toolbar() {
  const dispatch = useAppDispatch();
  const { isBold, isItalic, fontSize, color } =
    useAppSelector(selectEditorPresent);
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border">
      {/* Undo/Redo */}
      <div className="flex gap-1">
        <button
          onClick={() => dispatch(undo())}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold transition-colors"
        >
          ↩️
        </button>
        <button
          onClick={() => dispatch(redo())}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold transition-colors"
        >
          ↪️
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Bold / Italic */}
      <div className="flex gap-1">
        <button
          onClick={() => dispatch(toggleBold())}
          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-colors ${
            isBold ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          B
        </button>
        <button
          onClick={() => dispatch(toggleItalic())}
          className={`px-3 py-1.5 rounded-lg italic text-sm transition-colors ${
            isItalic ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          I
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Font size */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(updateFontSize(Math.max(10, fontSize - 2)))}
          className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-bold"
        >
          A-
        </button>
        <span className="text-xs text-gray-500 w-10 text-center">
          {fontSize}px
        </span>
        <button
          onClick={() => dispatch(updateFontSize(Math.min(48, fontSize + 2)))}
          className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-bold"
        >
          A+
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Colors */}
      <div className="flex gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => dispatch(updateColor(c))}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              color === c ? "border-gray-800 scale-125" : "border-gray-200"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <button
        onClick={() => dispatch(resetEditor())}
        className="ml-auto text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
      >
        🔄 Reset
      </button>
    </div>
  );
}

function HistoryPanel() {
  const dispatch = useAppDispatch();
  const { past, present, future } = useAppSelector(selectEditorHistory);

  const allStates = [...past, present, ...future];
  const currentIdx = past.length;

  return (
    <Card padding="sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-bold text-gray-700">
          📚 History ({allStates.length} записів)
        </p>
        <button
          onClick={() => dispatch(clearHistory())}
          className="text-xs text-gray-400 hover:text-red-500"
        >
          Очистити
        </button>
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1">
        {allStates.map((state, idx) => {
          const isCurrent = idx === currentIdx;
          const isPast = idx < currentIdx;
          return (
            <button
              key={idx}
              onClick={() => dispatch(jumpToHistory(idx))}
              className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2 transition-colors ${
                isCurrent
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : isPast
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-gray-50 italic"
              }`}
            >
              <span className="text-gray-300">
                {isCurrent ? "▶" : isPast ? "○" : "◇"}
              </span>
              <span className="truncate">{state.label}</span>
              {isCurrent && (
                <Badge variant="primary" className="ml-auto shrink-0">
                  зараз
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function TextEditor() {
  const dispatch = useAppDispatch();
  const present = useAppSelector(selectEditorPresent);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          dispatch(undo());
        }
        if (e.key === "z" && e.shiftKey) {
          e.preventDefault();
          dispatch(redo());
        }
        if (e.key === "y") {
          e.preventDefault();
          dispatch(redo());
        }
      }
    },
    [dispatch],
  );

  return (
    <div className="space-y-3" onKeyDown={handleKeyDown}>
      <Toolbar />

      <textarea
        value={present.text}
        onChange={(e) => dispatch(updateText(e.target.value))}
        rows={6}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 resize-none transition-colors"
        style={{
          fontSize: `${present.fontSize}px`,
          fontWeight: present.isBold ? "bold" : "normal",
          fontStyle: present.isItalic ? "italic" : "normal",
          color: present.color,
        }}
      />

      <HistoryPanel />
    </div>
  );
}
