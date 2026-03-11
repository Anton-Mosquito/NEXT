// src/shared/lib/wdyr.ts
// Dev-only utility — initializes @welldone-software/why-did-you-render.
// Uses require() inside the guard so bundlers can tree-shake this entire
// import chain out of production builds via dead-code elimination.

export function setupWdyr(): void {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  whyDidYouRender(React, {
    // Opt-in tracking per component (ComponentName.whyDidYouRender = true)
    trackAllPureComponents: false,
    // Log when a re-render is caused by a value that changed but is equal by reference
    logOnDifferentValues: true,
    // trackHooks: true monkey-patches ALL React hooks globally, including Next.js
    // internals (Router, useActionQueue). This breaks hook-order invariants.
    trackHooks: false,
    // Collapse repeated re-render log groups
    collapseGroups: true,
  });
}
