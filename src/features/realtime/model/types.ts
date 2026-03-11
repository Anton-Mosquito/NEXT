// src/features/realtime/model/types.ts
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface LivePost {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  type: "new" | "update" | "delete";
}

export interface LiveNotification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
  read: boolean;
}

export interface RealtimeState {
  status: ConnectionStatus;
  livePosts: LivePost[];
  notifications: LiveNotification[];
  unreadCount: number;
  connectedAt: number | null;
  messagesReceived: number;
  error: string | null;
}

// WebSocket action types
export const WS_ACTIONS = {
  CONNECT: "ws/connect",
  DISCONNECT: "ws/disconnect",
  SEND: "ws/send",
} as const;
