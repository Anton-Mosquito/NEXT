// src/entities/auth/model/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, AuthState } from "./types";

const initialState: AuthState = {
  user: {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    role: "admin",
  },
  accessToken: "demo-token-123",
  refreshToken: "demo-refresh-456",
  isAuthenticated: true,
};

export const getPreloadedAuthState = (data: Partial<AuthState>): AuthState => ({
  ...initialState,
  ...data,
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setCredentials, logout, updateToken } = authSlice.actions;
