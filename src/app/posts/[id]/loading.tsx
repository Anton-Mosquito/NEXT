// src/app/posts/[id]/loading.tsx
// ✅ Автоматичний Suspense fallback для цього route
import { Skeleton, SkeletonCard } from '@/shared/ui'

export default function PostDetailLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <div className="mt-6">
        <SkeletonCard lines={5} />
      </div>
    </div>
  );
}
