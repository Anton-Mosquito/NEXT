// src/widgets/header/ui/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib";
import { NAV_LINKS } from "@/shared/constants";
import { UserAuthButton } from "@/features/auth-form";


export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Лого */}
        <Link href="/" className="font-bold text-blue-600 text-lg">
          🚀 FSD App
        </Link>

        {/* Навігація */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
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

        {/* User area — delegates to UserAuthButton for auth state rendering */}
        <UserAuthButton />
      </div>
    </header>
  );
}
