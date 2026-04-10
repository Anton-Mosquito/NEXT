// src/app/layout.tsx — ОНОВЛЕНА ВЕРСІЯ З PRELOADED STATE
import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Header } from "@/widgets/header";
import { WhydrInit } from "@/app/WhydrInit";
import { buildPreloadedState } from "@/app/store/preloadState";
import type { AuthUser } from "@/entities/auth";
import { makeStore } from "@/app/store/makeStore";
import { postApi } from "@/entities/post";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FSD Next.js App",
  description: "Feature-Sliced Design with Next.js + Redux Toolkit",
};

// ✅ Симуляція читання auth з cookies/session
// В реальному проекті тут буде:
// import { getServerSession } from 'next-auth'
// або: cookies().get('session') + JWT decode
async function getServerAuthContext() {
  const cookieStore = await cookies();

  // Перевіряємо чи є auth cookie
  const authCookie = cookieStore.get("auth-demo");
  const isLoggedIn = authCookie?.value === "true";

  if (isLoggedIn) {
    // В реальному проекті: декодуємо JWT або читаємо з DB
    const user: AuthUser = {
      id: 1,
      name: "Server Auth User",
      email: "server@example.com",
      role: "admin",
    };
    return {
      user,
      accessToken: `server-token-${Date.now()}`,
      refreshToken: "server-refresh-token",
    };
  }

  // Для демо: завжди повертаємо demo user
  return {
    user: {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      role: "admin" as const,
    },
    accessToken: "demo-access-token",
    refreshToken: "demo-refresh-token",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const store = makeStore();

  // 2. Запускаємо запит через dispatch(initiate)
  // Вказуємо параметри (наприклад, page: 1, limit: 10), які хочемо закешувати
  const filter = { page: 1, limit: 10 };
  await store.dispatch(postApi.endpoints.getPosts.initiate(filter));

  // ✅ КЛЮЧОВИЙ МОМЕНТ: Server Component отримує auth контекст
  const authContext = await getServerAuthContext();

  // ✅ Будуємо preloaded state з серверних даних.
  // store.getState().api вже містить правильно сформований RTK Query кеш
  // з реальними ключами (серіалізовані args) та всіма обов'язковими полями.
  const preloadedState = buildPreloadedState({
    ...authContext,
    apiState: store.getState().api,
  });

  return (
    <html lang="uk" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/*
          ✅ Передаємо preloadedState у StoreProvider
          Store ініціалізується з серверним auth станом
          Клієнт гідратується БЕЗ mismatch!
        */}
        <QueryProvider>
          <StoreProvider preloadedState={preloadedState}>
            <WhydrInit />
            <Header />
            <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
