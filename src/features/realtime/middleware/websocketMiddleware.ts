// src/features/realtime/middleware/websocketMiddleware.ts
import type { Middleware } from "@reduxjs/toolkit";
import {
  setStatus,
  setError,
  receivePost,
  receiveNotification,
} from "../model/realtimeSlice";
import {
  WS_ACTIONS,
  type LivePost,
  type LiveNotification,
} from "../model/types";

// ✅ WebSocket Middleware
// Управляє lifecycle WebSocket з'єднання
// Перехоплює WS_ACTIONS та відповідає на серверні events
export const createWebSocketMiddleware = (wsUrl?: string): Middleware => {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let reconnectAttempts = 0;
  const messageQueue: string[] = [];
  const MAX_RECONNECT = 5;
  const RECONNECT_DELAY = 2000;
  const HEARTBEAT_INTERVAL = 30_000;

  function flushQueue() {
    while (
      messageQueue.length > 0 &&
      socket &&
      (socket as any).readyState === 1
    ) {
      const msg = messageQueue.shift()!;
      (socket as any).send(msg);
      console.log("📬 WS queue flushed:", msg);
    }
  }

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatTimer = setInterval(() => {
      if (socket && (socket as any).readyState === 1) {
        (socket as any).send(JSON.stringify({ type: "ping" }));
      }
    }, HEARTBEAT_INTERVAL);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  // ✅ Симулятор WebSocket (оскільки у нас немає реального WS сервера)
  // В реальному проекті замінити на: new WebSocket(wsUrl)
  function createMockWebSocket(dispatch: Function): MockWebSocket {
    const mock = new MockWebSocket(dispatch);
    return mock;
  }

  return (store) => (next) => (action: any) => {
    const { dispatch } = store;

    switch (action.type) {
      // ✅ Команда підключитися
      case WS_ACTIONS.CONNECT: {
        if (socket) return; // вже підключено

        dispatch(setStatus("connecting"));

        try {
          // В production: socket = new WebSocket(wsUrl ?? 'wss://api.example.com/ws')
          // Для демо — використовуємо мок
          socket = createMockWebSocket(dispatch) as any;
          (socket as any).onopen = () => {
            dispatch(setStatus("connected"));
            reconnectAttempts = 0;
            startHeartbeat();
            flushQueue();
          };
          (socket as any).onclose = () => {
            stopHeartbeat();
            socket = null;
            dispatch(setStatus("disconnected"));

            // Автоматичний reconnect з exponential backoff
            if (reconnectAttempts < MAX_RECONNECT) {
              const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
              reconnectAttempts++;
              console.log(
                `🔄 WS reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT} in ${delay}ms`,
              );
              reconnectTimer = setTimeout(() => {
                dispatch({ type: WS_ACTIONS.CONNECT });
              }, delay);
            }
          };
          (socket as any).onerror = (error: any) => {
            dispatch(setError("WebSocket connection error"));
          };
        } catch (err) {
          dispatch(setError("Failed to create WebSocket"));
        }
        break;
      }

      // ✅ Команда відключитися
      case WS_ACTIONS.DISCONNECT: {
        stopHeartbeat();
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        reconnectAttempts = MAX_RECONNECT; // Зупиняємо reconnect
        if (socket) {
          (socket as any).close();
          socket = null;
        }
        dispatch(setStatus("disconnected"));
        break;
      }

      // ✅ Відправити повідомлення через WS
      case WS_ACTIONS.SEND: {
        const payload = JSON.stringify(action.payload);
        if (socket && (socket as any).readyState === 1) {
          (socket as any).send(payload);
        } else {
          // З'єднання відсутнє — зберігаємо в чергу
          messageQueue.push(payload);
          console.log(
            `📥 WS queued (${messageQueue.length} pending):`,
            payload,
          );
        }
        break;
      }

      default:
        return next(action);
    }
  };
};

// ============================================================
// MockWebSocket — симулятор для демо (замінити на реальний WS)
// ============================================================
class MockWebSocket {
  private dispatch: Function;
  private interval: ReturnType<typeof setInterval> | null = null;
  public readyState = 0;
  public onopen: (() => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: ((e: any) => void) | null = null;

  private authors = ["Alice", "Bob", "Carol", "Dave", "Eve"];
  private topics = [
    "Next.js Server Components",
    "Redux Toolkit tips",
    "RTK Query caching",
    "TypeScript advanced types",
    "React performance",
    "FSD архітектура",
    "WebSockets у production",
  ];
  private notifMessages = [
    "Новий коментар до вашого поста",
    "Хтось лайкнув вашу відповідь",
    "Згадка у дискусії",
    "5 нових підписників",
    "Пост trending!",
  ];

  constructor(dispatch: Function) {
    this.dispatch = dispatch;
    // Симуляція async connect
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
      this.startSimulation();
    }, 500);
  }

  private startSimulation() {
    let messageCount = 0;

    this.interval = setInterval(() => {
      messageCount++;
      const rand = Math.random();

      if (rand < 0.5) {
        // 50% → новий live post
        const post: LivePost = {
          id: `live-${Date.now()}`,
          author: this.authors[Math.floor(Math.random() * this.authors.length)],
          content: this.topics[Math.floor(Math.random() * this.topics.length)],
          timestamp: Date.now(),
          type: "new",
        };
        this.dispatch(receivePost(post));
      } else if (rand < 0.8) {
        // 30% → нотифікація
        const notif: LiveNotification = {
          id: `notif-${Date.now()}`,
          message:
            this.notifMessages[
              Math.floor(Math.random() * this.notifMessages.length)
            ],
          type: ["info", "success", "warning"][
            Math.floor(Math.random() * 3)
          ] as any,
          timestamp: Date.now(),
          read: false,
        };
        this.dispatch(receiveNotification(notif));
      }
      // 20% → тишина (реалістичніше)
    }, 2000);
  }

  send(data: string) {
    const parsed = JSON.parse(data);
    if (parsed?.type === "ping") {
      console.log("💓 WS heartbeat: ping");
    } else {
      console.log("📤 WS send:", data);
    }
  }

  close() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.readyState = 3;
    this.onclose?.();
  }
}
