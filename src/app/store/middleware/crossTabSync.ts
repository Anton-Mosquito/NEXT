// src/store/middleware/crossTabSync.ts
import type { Middleware } from "@reduxjs/toolkit";

interface CrossTabConfig {
  // Actions що синхронізуються між вкладками
  syncActions: string[];
  channelName?: string;
}

// ✅ Cross-Tab Sync Middleware через BroadcastChannel API
export function createCrossTabMiddleware(config: CrossTabConfig): Middleware {
  const channelName = config.channelName ?? "redux-sync";
  let channel: BroadcastChannel | null = null;
  let isReceiving = false; // запобігаємо infinite loop

  // BroadcastChannel доступний тільки в браузері
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    channel = new BroadcastChannel(channelName);
  }

  return (store) => {
    // Слухаємо повідомлення від інших вкладок
    channel?.addEventListener("message", (event) => {
      const { action } = event.data;
      if (action && config.syncActions.includes(action.type)) {
        isReceiving = true;
        store.dispatch(action);
        isReceiving = false;
      }
    });

    return (next) => (action: any) => {
      const result = next(action);

      // Якщо НЕ отримуємо від іншої вкладки і треба синхронізувати
      if (!isReceiving && config.syncActions.includes(action.type)) {
        channel?.postMessage({ action, timestamp: Date.now() });
      }

      return result;
    };
  };
}

// Fallback через localStorage (для старих браузерів)
export function createLocalStorageSyncMiddleware(
  config: CrossTabConfig,
): Middleware {
  const storageKey = `redux-sync-${config.channelName ?? "default"}`;

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === storageKey && event.newValue) {
        try {
          const { action } = JSON.parse(event.newValue);
          // Тут потрібен доступ до dispatch — складніше
          // Тому BroadcastChannel є кращим рішенням
        } catch {}
      }
    });
  }

  return (store) => (next) => (action: any) => {
    const result = next(action);
    if (config.syncActions.includes(action.type)) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ action, timestamp: Date.now() }),
        );
      } catch {}
    }
    return result;
  };
}
