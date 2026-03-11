// src/widgets/header/ui/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logout,
} from "@/entities/auth";
import { Avatar, Button, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { ROUTES } from "@/shared/config";

const navLinks = [
  { href: "/", label: "🏠" },
  { href: "/posts", label: "📝 Пости" },
  { href: "/posts/prefetched", label: "⚡ Prefetch" },
  { href: "/posts/streaming", label: "🌊 Streaming" },
  { href: "/hybrid", label: "🏛️ Hybrid" },
  { href: "/profile", label: "👤 Профіль" },
];

export function Header() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Лого */}
        <Link href="/" className="font-bold text-blue-600 text-lg">
          🚀 FSD App
        </Link>

        {/* Навігація */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                pathname === href
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-gray-700">
                    {user.name}
                  </p>
                  <Badge variant="primary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(logout())}
              >
                Вийти
              </Button>
            </>
          ) : (
            <Button size="sm">Увійти</Button>
          )}
        </div>
      </div>
    </header>
  );
}
