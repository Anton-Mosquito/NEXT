// src/features/realtime/model/realtimeSlice.ts
import {
  createSlice,
  createSelector,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  RealtimeState,
  ConnectionStatus,
  LivePost,
  LiveNotification,
} from "./types";
import type { RootState } from "@/app/store";

const initialState: RealtimeState = {
  status: "disconnected",
  livePosts: [],
  notifications: [],
  unreadCount: 0,
  connectedAt: null,
  messagesReceived: 0,
  error: null,
};

export const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.status = action.payload;
      if (action.payload === "connected") {
        state.connectedAt = Date.now();
        state.error = null;
      }
      if (action.payload === "disconnected") {
        state.connectedAt = null;
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = "error";
    },

    receivePost: (state, action: PayloadAction<LivePost>) => {
      const post = action.payload;
      state.messagesReceived++;

      if (post.type === "delete") {
        state.livePosts = state.livePosts.filter((p) => p.id !== post.id);
      } else if (post.type === "update") {
        const idx = state.livePosts.findIndex((p) => p.id === post.id);
        if (idx !== -1) state.livePosts[idx] = post;
      } else {
        // 'new' — додаємо на початок, max 20 постів
        state.livePosts = [post, ...state.livePosts].slice(0, 20);
      }
    },

    receiveNotification: (state, action: PayloadAction<LiveNotification>) => {
      state.notifications = [action.payload, ...state.notifications].slice(
        0,
        50,
      );
      state.unreadCount++;
      state.messagesReceived++;
    },

    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      state.unreadCount = 0;
    },

    clearLivePosts: (state) => {
      state.livePosts = [];
    },
  },
});

export const {
  setStatus,
  setError,
  receivePost,
  receiveNotification,
  markAllRead,
  clearLivePosts,
} = realtimeSlice.actions;

// Selectors
export const selectRealtimeStatus = (state: RootState) => state.realtime.status;
export const selectLivePosts = (state: RootState) => state.realtime.livePosts;
export const selectNotifications = (state: RootState) =>
  state.realtime.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.realtime.unreadCount;
export const selectRealtimeStats = createSelector(
  (state: RootState) => state.realtime.status,
  (state: RootState) => state.realtime.connectedAt,
  (state: RootState) => state.realtime.messagesReceived,
  (state: RootState) => state.realtime.error,
  (status, connectedAt, messagesReceived, error) => ({
    status,
    connectedAt,
    messagesReceived,
    error,
  }),
);
