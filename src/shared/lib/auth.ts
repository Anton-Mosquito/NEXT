// src/shared/lib/auth.ts
// Auth.js v5 (next-auth@beta) configuration for the Expense Tracker.
//
// Architecture decisions:
//   - Adapter:  @auth/kysely-adapter — stores users, sessions, and OAuth
//               accounts directly in our PostgreSQL database via Kysely.
//   - Provider: Google OAuth — users sign in with their Google account.
//   - Strategy: "database" sessions (default when an adapter is supplied),
//               meaning session tokens are stored in the `session` table
//               instead of being encoded into a JWT.
//
// Exports: { auth, handlers, signIn, signOut }
//   - auth        — call in Server Components / Server Actions to get the session
//   - handlers    — { GET, POST } for the [...nextauth] API route
//   - signIn      — programmatic sign-in (Server Actions / Client Components)
//   - signOut     — programmatic sign-out

import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { KyselyAdapter } from "@auth/kysely-adapter";
import { db } from "./kysely";

// ---------------------------------------------------------------------------
// Environment variable validation
// Auth.js reads AUTH_SECRET automatically; we guard the OAuth keys here.
// ---------------------------------------------------------------------------
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_ID");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_SECRET");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // -------------------------------------------------------------------------
  // Database adapter — all session and user data goes into PostgreSQL.
  // The KyselyAdapter expects the same Kysely instance we use for queries.
  // -------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: KyselyAdapter(db as any),

  // -------------------------------------------------------------------------
  // OAuth Providers
  // -------------------------------------------------------------------------
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // -------------------------------------------------------------------------
  // Session — use the database strategy (default with an adapter).
  // The session token is stored in the `session` table; no JWT is issued.
  // -------------------------------------------------------------------------
  session: {
    strategy: "database",
  },

  // -------------------------------------------------------------------------
  // Callbacks — extend the session object exposed to the app.
  // By default Auth.js only exposes { name, email, image }.
  // We add `id` so components can identify the current user in the DB.
  // -------------------------------------------------------------------------
  callbacks: {
    session({ session, user }) {
      // `user` is the DB row from the `user` table.
      // Attach the user's id to the session so the client can reference it.
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // -------------------------------------------------------------------------
  // Pages — override default Auth.js UI paths if custom pages are added later.
  // For now we use the built-in Auth.js sign-in page.
  // -------------------------------------------------------------------------
  // pages: {
  //   signIn: "/login",
  // },
});
