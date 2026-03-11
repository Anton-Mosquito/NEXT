// src/features/bulk-actions/model/bulkSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface BulkItem {
  id: number;
  title: string;
  status: "active" | "archived" | "deleted";
  selected: boolean;
  isPending: boolean; // optimistic: чекаємо підтвердження
  hasError: boolean;
}

interface BulkState {
  items: BulkItem[];
  pendingOperations: number;
  completedOperations: number;
  failedOperations: number;
  operationLog: string[];
}

// Генеруємо тестові дані
const generateItems = (count = 8): BulkItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Елемент #${i + 1}`,
    status: "active",
    selected: false,
    isPending: false,
    hasError: false,
  }));

const initialState: BulkState = {
  items: generateItems(),
  pendingOperations: 0,
  completedOperations: 0,
  failedOperations: 0,
  operationLog: [],
};

// ✅ Async thunk: batch archive з partial failure
export const batchArchive = createAsyncThunk(
  "bulk/batchArchive",
  async (ids: number[], { dispatch, rejectWithValue }) => {
    // Симулюємо partial failure: кожен 3й елемент "провалюється"
    const results = await Promise.allSettled(
      ids.map(async (id, idx) => {
        await new Promise((r) => setTimeout(r, 200 + idx * 100));
        if (id % 3 === 0) throw new Error(`Server error for item #${id}`);
        return id;
      }),
    );

    const succeeded = results
      .filter(
        (r): r is PromiseFulfilledResult<number> => r.status === "fulfilled",
      )
      .map((r) => r.value);

    const failed = results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((_, idx) => ids[idx]);

    return { succeeded, failed };
  },
);

export const bulkSlice = createSlice({
  name: "bulk",
  initialState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.selected = !item.selected;
    },

    selectAll: (state) => {
      const allSelected = state.items.every((i) => i.selected);
      state.items.forEach((i) => {
        i.selected = !allSelected;
      });
    },

    // ✅ Optimistic: миттєво відображаємо pending стан
    setItemsPending: (state, action: PayloadAction<number[]>) => {
      action.payload.forEach((id) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.isPending = true;
          item.hasError = false;
        }
      });
      state.pendingOperations += action.payload.length;
      state.operationLog.unshift(
        `⏳ Archiving ${action.payload.length} items...`,
      );
    },

    // ✅ Partial success: архівуємо тільки succeeded
    applyPartialArchive: (
      state,
      action: PayloadAction<{ succeeded: number[]; failed: number[] }>,
    ) => {
      const { succeeded, failed } = action.payload;

      succeeded.forEach((id) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.status = "archived";
          item.isPending = false;
          item.selected = false;
        }
      });

      failed.forEach((id) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.isPending = false;
          item.hasError = true;
          // ✅ ROLLBACK: повертаємо до active
          item.status = "active";
        }
      });

      state.completedOperations += succeeded.length;
      state.failedOperations += failed.length;
      state.pendingOperations -= succeeded.length + failed.length;

      if (succeeded.length > 0)
        state.operationLog.unshift(`✅ Archived: ${succeeded.join(", ")}`);
      if (failed.length > 0)
        state.operationLog.unshift(
          `❌ Failed (rolled back): ${failed.join(", ")}`,
        );
    },

    clearErrors: (state) => {
      state.items.forEach((i) => {
        i.hasError = false;
      });
    },

    resetItems: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(batchArchive.pending, (state, action) => {
        // Optimistic update через setItemsPending action
      })
      .addCase(batchArchive.fulfilled, (state, action) => {
        // Обробляється через applyPartialArchive
      })
      .addCase(batchArchive.rejected, (state, action) => {
        state.operationLog.unshift(`💥 Batch failed: ${action.error.message}`);
      });
  },
});

export const {
  toggleSelect,
  selectAll,
  setItemsPending,
  applyPartialArchive,
  clearErrors,
  resetItems,
} = bulkSlice.actions;

export const selectBulkItems = (state: RootState) => state.bulk.items;
export const selectBulkStats = (state: RootState) => ({
  total: state.bulk.items.length,
  selected: state.bulk.items.filter((i) => i.selected).length,
  active: state.bulk.items.filter((i) => i.status === "active").length,
  archived: state.bulk.items.filter((i) => i.status === "archived").length,
  pending: state.bulk.pendingOperations,
  completed: state.bulk.completedOperations,
  failed: state.bulk.failedOperations,
  log: state.bulk.operationLog,
});
