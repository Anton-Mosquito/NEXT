// src/features/text-editor/model/editorSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface EditorContent {
  text: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  label: string; // опис зміни для history
}

interface EditorState {
  past: EditorContent[];
  present: EditorContent;
  future: EditorContent[];
  maxHistory: number;
}

const defaultContent: EditorContent = {
  text: "Почни редагувати цей текст...",
  fontSize: 16,
  isBold: false,
  isItalic: false,
  color: "#1f2937",
  label: "Початковий стан",
};

const initialState: EditorState = {
  past: [],
  present: defaultContent,
  future: [],
  maxHistory: 50,
};

// ✅ Хелпер: зберегти поточний стан у history
function pushToHistory(state: EditorState, newPresent: EditorContent) {
  state.past = [...state.past, state.present].slice(-state.maxHistory);
  state.present = newPresent;
  state.future = []; // нова зміна скасовує "redo" гілку
}

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // ✅ Оновлення тексту (кожна зміна = новий history entry)
    updateText: (state, action: PayloadAction<string>) => {
      pushToHistory(state, {
        ...state.present,
        text: action.payload,
        label: `Текст змінено`,
      });
    },

    updateFontSize: (state, action: PayloadAction<number>) => {
      pushToHistory(state, {
        ...state.present,
        fontSize: action.payload,
        label: `Розмір: ${action.payload}px`,
      });
    },

    toggleBold: (state) => {
      pushToHistory(state, {
        ...state.present,
        isBold: !state.present.isBold,
        label: state.present.isBold ? "Прибрано Bold" : "Додано Bold",
      });
    },

    toggleItalic: (state) => {
      pushToHistory(state, {
        ...state.present,
        isItalic: !state.present.isItalic,
        label: state.present.isItalic ? "Прибрано Italic" : "Додано Italic",
      });
    },

    updateColor: (state, action: PayloadAction<string>) => {
      pushToHistory(state, {
        ...state.present,
        color: action.payload,
        label: `Колір: ${action.payload}`,
      });
    },

    // ✅ UNDO
    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      state.future = [state.present, ...state.future];
      state.present = previous;
      state.past = state.past.slice(0, -1);
    },

    // ✅ REDO
    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future[0];
      state.past = [...state.past, state.present];
      state.present = next;
      state.future = state.future.slice(1);
    },

    // ✅ Jump до конкретного стану в history
    jumpToHistory: (state, action: PayloadAction<number>) => {
      const targetIdx = action.payload;
      const allStates = [...state.past, state.present, ...state.future];

      if (targetIdx < 0 || targetIdx >= allStates.length) return;

      state.past = allStates.slice(0, targetIdx);
      state.present = allStates[targetIdx];
      state.future = allStates.slice(targetIdx + 1);
    },

    clearHistory: (state) => {
      state.past = [];
      state.future = [];
    },

    resetEditor: () => initialState,
  },
});

export const {
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
} = editorSlice.actions;

// Selectors
export const selectEditorPresent = (state: RootState) => state.editor.present;
export const selectCanUndo = (state: RootState) => state.editor.past.length > 0;
export const selectCanRedo = (state: RootState) =>
  state.editor.future.length > 0;
export const selectEditorHistory = (state: RootState) => ({
  past: state.editor.past,
  present: state.editor.present,
  future: state.editor.future,
});
