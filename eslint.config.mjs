import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundariesPlugin from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Boundaries plugin: enforce layer imports by folder
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
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "shared", disallow: ["entities", "features", "widgets", "pages"], allow: ["shared"] },
            { from: "entities", disallow: ["features", "widgets", "pages"], allow: ["shared"] },
            { from: "features", disallow: ["widgets", "pages"], allow: ['entities', 'shared'] },
            { from: "widgets", disallow: ["pages"], allow: ['features', 'entities', 'shared'] },
            { from: "pages", disallow: [], allow: ['app','widgets', 'features', 'entities', 'shared'] },
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
  ]),
]);

export default eslintConfig;
