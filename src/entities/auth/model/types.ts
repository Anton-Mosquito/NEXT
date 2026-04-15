// src/entities/auth/model/types.ts
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
