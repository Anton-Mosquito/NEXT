// src/__mocks__/server.ts
import { setupServer } from "msw/node";
import { postHandlers } from "./handlers/postHandlers";
import { userHandlers } from "./handlers/userHandlers";

// ✅ Єдиний MSW сервер для всіх тестів
export const server = setupServer(...postHandlers, ...userHandlers);
