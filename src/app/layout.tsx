// src/app/layout.tsx — ОНОВЛЕНА ВЕРСІЯ З PRELOADED STATE
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { SessionProvider } from "@/app/providers/SessionProvider";
import { Header } from "@/widgets/header";
import { WhydrInit } from "@/app/WhydrInit";
import { buildPreloadedState } from "@/_learning/store/preloadState";
import type { AuthUser } from "@/entities/auth";
import { makeStore } from "@/_learning/store/makeStore";
import { postApi } from "@/entities/post";
import { auth } from "@/shared/lib/auth";

import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Finance App",
  description: "Feature-Sliced Design with Next.js + Redux Toolkit",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = makeStore();

  // Prefetch the first page of posts into the RTK Query cache so the initial
  // render is served from the server without a loading state.
  const filter = { page: 1, limit: 10 };
  await store.dispatch(postApi.endpoints.getPosts.initiate(filter));

  // ✅ Real Auth.js session — replaces the demo cookie-based approach.
  // `auth()` reads the session from the database via the KyselyAdapter.
  const session = await auth();

  // Bridge Auth.js session into the Redux preloaded state for backward
  // compatibility with existing components that consume the Redux auth slice.
  const authContext: {
    user: AuthUser | null;
    accessToken: null;
    refreshToken: null;
  } = {
    user: session?.user
      ? {
          id: session.user.id ?? "",
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          role: "user" as const,
          image: session.user.image ?? null,
        }
      : null,
    accessToken: null,
    refreshToken: null,
  };

  const preloadedState = buildPreloadedState({
    ...authContext,
    apiState: store.getState().api,
  });

  return (
    <html
      lang="uk"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {/*
              SessionProvider passes the initial server session to next-auth/react
              hooks (useSession) so the client hydrates without a loading flash.
            */}
            <SessionProvider session={session}>
              {/*
                StoreProvider initialises Redux with server-side auth state.
                Preloaded state prevents hydration mismatch on the client.
              */}
              <StoreProvider preloadedState={preloadedState}>
                <WhydrInit />
                <main className="grid h-screen m-auto">{children}</main>
                <Toaster />
              </StoreProvider>
            </SessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
