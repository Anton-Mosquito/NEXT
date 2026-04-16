import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Boundaries plugin: enforce layer imports by folder
  // Provide React version explicitly so eslint-plugin-react never calls
  // context.getFilename() (removed in ESLint 10) during auto-detection.
  {
    settings: {
      react: { version: "19" },
    },
  },
  {
    plugins: { boundaries: boundariesPlugin },
    settings: {
      "boundaries/elements": [
        { type: "shared", pattern: "shared/*" },
        { type: "entities", pattern: "entities/*" },
        { type: "features", pattern: "features/*" },
        { type: "widgets", pattern: "widgets/*" },
        { type: "pages", pattern: "app/*" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: { type: "shared" },
              allow: { to: { type: "shared" } },
            },
            {
              from: { type: "entities" },
              allow: { to: { type: "shared" } },
            },
            {
              from: { type: "features" },
              allow: { to: { type: ["entities", "shared"] } },
            },
            {
              from: { type: "widgets" },
              allow: { to: { type: ["features", "entities", "shared"] } },
            },
            {
              from: { type: "pages" },
              allow: {
                to: {
                  type: ["pages", "widgets", "features", "entities", "shared"],
                },
              },
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent skills — third-party build artifacts, not project source
    ".agents/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
