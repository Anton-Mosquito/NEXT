import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    deps: {
      optimizer: {
        web: {
          include: ["msw"],
        },
      },
    },
  },
});
