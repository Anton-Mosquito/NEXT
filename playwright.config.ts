import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration.
 * Unit/integration tests live in src/__tests__ (Vitest).
 * Browser-level E2E tests live in e2e/ (Playwright).
 */
export default defineConfig({
  testDir: "./e2e",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 2 : undefined,

  /* Reporter */
  reporter: process.env.CI ? "github" : "html",

  use: {
    /* Base URL for all page.goto('/') calls */
    baseURL: "http://127.0.0.1:3000",

    /* Collect trace only on first retry — helps diagnose CI failures */
    trace: "on-first-retry",
  },

  /* Browsers to test against */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /**
   * Build and start the Next.js server before running tests.
   * reuseExistingServer lets you run `npm run dev` locally without rebuilding
   * every time; CI always starts fresh.
   */
  webServer: {
    // In CI the build runs as a separate workflow step (with DB env vars).
    // Here we only start the pre-built server to avoid double-building and OOM.
    command: process.env.CI
      ? "NODE_OPTIONS=--max-old-space-size=8192 npm run start"
      : "npm run build && NODE_OPTIONS=--max-old-space-size=8192 npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    env: {
      // Prevent next-server from OOMing on memory-constrained CI runners
      NODE_OPTIONS: "--max-old-space-size=8192",
      // Auth.js production safety: trust localhost host in E2E / CI
      AUTH_TRUST_HOST: "true",
      AUTH_URL: "http://localhost:3000",
      AUTH_SECRET:
        process.env.AUTH_SECRET ??
        "e2e_dummy_secret_for_local_test_only_123456",
      DATABASE_URL:
        process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/db",
      GOOGLE_CLIENT_ID:
        process.env.GOOGLE_CLIENT_ID ?? "e2e_dummy_google_client_id",
      GOOGLE_CLIENT_SECRET:
        process.env.GOOGLE_CLIENT_SECRET ?? "e2e_dummy_google_client_secret",
      NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
