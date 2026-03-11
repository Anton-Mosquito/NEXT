// src/entities/auth/model/__tests__/selectors.test.ts
import {
  selectAuth,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
} from "../selectors";
import type { RootState } from "@/app/store";

// ✅ Mock partial RootState для тестів selectors
const createMockState = (
  overrides?: Partial<RootState["auth"]>,
): Pick<RootState, "auth"> => ({
  auth: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    ...overrides,
  },
});

describe("auth selectors", () => {
  describe("selectCurrentUser", () => {
    it("повертає null якщо не авторизований", () => {
      const state = createMockState();
      expect(selectCurrentUser(state as RootState)).toBeNull();
    });

    it("повертає user об'єкт", () => {
      const user = {
        id: 1,
        name: "Alice",
        email: "alice@test.com",
        role: "admin" as const,
      };
      const state = createMockState({ user });
      expect(selectCurrentUser(state as RootState)).toEqual(user);
    });
  });

  describe("selectIsAuthenticated", () => {
    it("повертає false якщо не авторизований", () => {
      const state = createMockState({ isAuthenticated: false });
      expect(selectIsAuthenticated(state as RootState)).toBe(false);
    });

    it("повертає true якщо авторизований", () => {
      const state = createMockState({ isAuthenticated: true });
      expect(selectIsAuthenticated(state as RootState)).toBe(true);
    });
  });

  describe("selectAccessToken", () => {
    it("повертає null якщо немає токена", () => {
      const state = createMockState({ accessToken: null });
      expect(selectAccessToken(state as RootState)).toBeNull();
    });

    it("повертає токен рядок", () => {
      const state = createMockState({ accessToken: "test-token-123" });
      expect(selectAccessToken(state as RootState)).toBe("test-token-123");
    });
  });

  describe("selectAuth", () => {
    it("повертає весь auth стан", () => {
      const authState = {
        user: {
          id: 1,
          name: "Bob",
          email: "bob@test.com",
          role: "user" as const,
        },
        accessToken: "token",
        refreshToken: "refresh",
        isAuthenticated: true,
      };
      const state = createMockState(authState);
      expect(selectAuth(state as RootState)).toEqual(authState);
    });
  });
});
