// src/app/posts/search/page.tsx
// ✅ ПАТЕРН 3: URL State
// Server читає searchParams, Client оновлює URL

import { Suspense } from "react";
import { PostsSearchClient } from "@/features/search-posts/ui/PostsSearchClient";
import { PostsSearchResults } from "@/features/search-posts/ui/PostsSearchResults";

// ✅ Server Component читає searchParams
export default async function PostsSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; userId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const userId = params.userId ? Number(params.userId) : undefined;
  const page = params.page ? Number(params.page) : 1;

  // Серверний fetch з параметрами з URL
  const posts = await fetchPostsServer({ query, userId, page });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🔍 Пошук постів</h1>

      {/* Client Component для UI пошуку (оновлює URL) */}
      <PostsSearchClient initialQuery={query} initialUserId={userId} />

      {/* Результати — серверний render */}
      <Suspense
        key={`${query}-${userId}-${page}`}
        fallback={<SearchResultsSkeleton />}
      >
        <PostsSearchResults posts={posts} query={query} page={page} />
      </Suspense>
    </div>
  );
}

async function fetchPostsServer({
  query,
  userId,
  page = 1,
}: {
  query: string;
  userId?: number;
  page?: number;
}) {
  const params = new URLSearchParams({
    _limit: "5",
    _page: String(page),
    ...(userId && { userId: String(userId) }),
    ...(query && { q: query }),
  });

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?${params}`,
    { next: { revalidate: 30 } },
  );
  return res.json();
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-xl border p-4 h-20"
        />
      ))}
    </div>
  );
}
