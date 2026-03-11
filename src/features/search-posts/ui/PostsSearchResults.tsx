// src/features/search-posts/ui/PostsSearchResults.tsx
// ✅ SERVER COMPONENT — відображає результати
import { Card, Badge } from "@/shared/ui";
import type { Post } from "@/entities/post";
import Link from "next/link";

interface PostsSearchResultsProps {
  posts: Post[];
  query: string;
  page: number;
}

export function PostsSearchResults({
  posts,
  query,
  page,
}: PostsSearchResultsProps) {
  if (posts.length === 0) {
    return (
      <Card className="text-center py-10 text-gray-400">
        <p className="text-3xl mb-2">🔍</p>
        <p>Нічого не знайдено {query && `для "${query}"`}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Знайдено: {posts.length} постів
        {query && (
          <>
            {" "}
            для <Badge variant="primary">"{query}"</Badge>
          </>
        )}
      </p>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <Card hoverable>
            <div className="flex justify-between items-start">
              <h3 className="font-medium capitalize text-sm flex-1 mr-3 line-clamp-1">
                {post.title}
              </h3>
              <Badge variant="default">#{post.id}</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {post.body}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
