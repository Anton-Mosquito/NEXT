// src/entities/post/ui/PostSkeleton.tsx
import { SkeletonCard } from "@shared/ui";

export function PostSkeleton() {
  return <SkeletonCard lines={4} />;
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
