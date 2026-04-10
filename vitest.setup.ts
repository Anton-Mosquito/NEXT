import "whatwg-fetch";
import "@testing-library/jest-dom/vitest";
import { server } from "@/__mocks__/server";

// ✅ Старт MSW перед тестами
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// ✅ Скидаємо handlers після кожного тесту
afterEach(() => server.resetHandlers());

// ✅ Зупиняємо MSW після всіх тестів
afterAll(() => server.close());
