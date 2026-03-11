import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/api";
import { rtkCacheMetricsMiddleware } from "@/shared/lib/rtkCacheMetrics";
import { authSlice } from "@/entities/auth";
import { likeSlice } from "@/features/like-post";
import { filterSlice } from "@/features/filter-posts";
import { currentPostSlice } from "@/entities/post/";
import { realtimeSlice, createWebSocketMiddleware } from "@/features/realtime";
import { registrationSlice } from "@/features/registration";
import { editorSlice } from "@/features/text-editor";
import { bulkSlice } from "@/features/bulk-actions";
import { createCrossTabMiddleware } from "./middleware/crossTabSync";

// ✅ Імпорт API slices
import "@/entities/post/api/postApi";
import "@/entities/user/api/userApi";
import "@/features/create-post/api/createPostApi";
import "@/features/delete-post/api/deletePostApi";

// Створюємо middleware instance один раз
const wsMiddleware = createWebSocketMiddleware();

const crossTabMiddleware = createCrossTabMiddleware({
  syncActions: [
    "likes/toggleLike",
    "realtime/markAllRead",
    // Додай будь-які дії що мають синхронізуватись
  ],
});

// 1. Створюємо rootReducer окремо, щоб витягнути з нього RootState
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  likes: likeSlice.reducer,
  postsFilter: filterSlice.reducer,
  currentPost: currentPostSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  realtime: realtimeSlice.reducer,
  registration: registrationSlice.reducer,
  editor: editorSlice.reducer,
  bulk: bulkSlice.reducer,
});

// 2. Визначаємо типи ДО створення makeStore
export type RootState = ReturnType<typeof rootReducer>;

// 3. Використовуємо Partial<RootState> замість PreloadedState
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        baseApi.middleware,
        wsMiddleware,
        ...(process.env.NODE_ENV !== "production"
          ? [rtkCacheMetricsMiddleware]
          : []
        ).concat(crossTabMiddleware),
      ),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
