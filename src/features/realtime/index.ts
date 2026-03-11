// src/features/realtime/index.ts
export {
  realtimeSlice,
  setStatus,
  setError,
  receivePost,
  receiveNotification,
  markAllRead,
  clearLivePosts,
  selectRealtimeStatus,
  selectLivePosts,
  selectNotifications,
  selectUnreadCount,
  selectRealtimeStats,
} from "./model/realtimeSlice";
export { createWebSocketMiddleware } from "./middleware/websocketMiddleware";
export { WS_ACTIONS } from "./model/types";
export type {
  LivePost,
  LiveNotification,
  ConnectionStatus,
} from "./model/types";
