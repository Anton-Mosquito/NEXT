// src/app/api/auth/[...nextauth]/route.ts
// Auth.js v5 catch-all API route.
//
// Auth.js uses this single endpoint to handle all OAuth flows:
//   GET  /api/auth/signin          — renders the sign-in page
//   GET  /api/auth/signout         — renders the sign-out page
//   GET  /api/auth/callback/:provider — OAuth redirect callback
//   GET  /api/auth/session         — returns the current session as JSON
//   POST /api/auth/signin/:provider — initiates a provider sign-in
//   POST /api/auth/signout          — clears the session cookie

import { handlers } from "@/shared/lib/auth";

export const { GET, POST } = handlers;
