// src/features/search-posts/ui/PostsSearchClient.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/shared/ui";
import { debounce } from "@/shared/lib";
import { useMemo } from "react";

interface PostsSearchClientProps {
  initialQuery: string;
  initialUserId?: number;
}

export function PostsSearchClient({
  initialQuery,
  initialUserId,
}: PostsSearchClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Оновлюємо URL при зміні пошуку
  const updateSearch = useMemo(
    () =>
      debounce((q: unknown, userId: unknown) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q as string);
        if (userId) params.set("userId", String(userId));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }, 400),
    [router, pathname],
  );

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="🔍 Пошук..."
          defaultValue={initialQuery}
          onChange={(e) => updateSearch(e.target.value, initialUserId)}
        />
      </div>
      <select
        defaultValue={initialUserId ?? ""}
        onChange={(e) =>
          updateSearch(initialQuery, e.target.value || undefined)
        }
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Всі автори</option>
        {[1, 2, 3, 4, 5].map((id) => (
          <option key={id} value={id}>
            User #{id}
          </option>
        ))}
      </select>
    </div>
  );
}
