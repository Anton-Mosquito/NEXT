// src/app/providers/SessionProvider.tsx
// Thin wrapper around next-auth/react SessionProvider.
//
// Auth.js requires SessionProvider to be rendered in the component tree so
// that useSession() hooks work throughout the app. Because SessionProvider
// uses React context internally it must be a Client Component.
//
// We accept an initial `session` prop from the Server Component layout so
// the client hydrates with the session already available — no extra network
// round-trip needed on page load.

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Initial session value from the server — prevents a loading flash. */
  session: Session | null;
}

export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
