// src/features/auth-form/ui/UserAuthButton.tsx
// Authentication button rendered in the site header.
//
// - Unauthenticated: shows a "Sign In with Google" button.
// - Loading:         shows a skeleton placeholder to avoid layout shift.
// - Authenticated:   shows the user's avatar + name and a "Sign Out" button.
//
// Uses next-auth/react hooks so this is a Client Component.
// signIn / signOut are called as client-side functions (they internally POST
// to the /api/auth/* routes handled by route.ts).

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Skeleton } from "@/shared/ui";

export function UserAuthButton() {
  const { data: session, status } = useSession();

  // Show a skeleton while the session is being fetched to prevent layout shift.
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Button size="sm" variant="primary" onClick={() => signIn("google")}>
        Sign In
      </Button>
    );
  }

  const { name, image } = session.user ?? {};

  return (
    <div className="flex items-center gap-3">
      {/* User identity */}
      <div className="flex items-center gap-2">
        {/* Use the OAuth profile picture when available, otherwise fall back
            to the initials-based Avatar component. */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name ?? "User avatar"}
            className="size-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Avatar name={name ?? "User"} size="sm" />
        )}
        <span className="hidden sm:block text-xs font-medium text-gray-700">
          {name}
        </span>
      </div>

      {/* Sign-out action */}
      <Button size="sm" variant="ghost" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
