// src/entities/auth/index.ts
export type { AuthUser, AuthState } from './model/types'
export { authSlice, setCredentials, logout, updateToken, getPreloadedAuthState } from './model/authSlice'
export { selectAuth, selectCurrentUser, selectIsAuthenticated, selectAccessToken } from './model/selectors'