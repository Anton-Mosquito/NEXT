// src/entities/auth/model/selectors.ts
import type { RootState } from "@/_learning/store";

export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
