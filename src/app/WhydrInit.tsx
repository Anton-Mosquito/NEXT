// src/app/WhydrInit.tsx
// Client-only component that bootstraps why-did-you-render.
// Must be a 'use client' module so setupWdyr() runs in the browser,
// and must be called at module level (before any React renders).
"use client";

import { setupWdyr } from "@/shared/lib/wdyr";

// Module-level call — fires as soon as this JS chunk is evaluated,
// before the first render of any tracked component.
setupWdyr();

export function WhydrInit() {
  return null;
}
