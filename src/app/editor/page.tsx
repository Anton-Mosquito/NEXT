// src/app/editor/page.tsx
import { TextEditor } from "@/features/text-editor";

export default function EditorPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">↩️ Undo/Redo Editor</h1>
      <p className="text-gray-500 text-sm mb-5">
        Past/Present/Future паттерн. Ctrl+Z / Ctrl+Y / Click на history.
      </p>
      <TextEditor />
    </div>
  );
}
