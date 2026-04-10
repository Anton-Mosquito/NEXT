// src/app/posts/prefetched/loading.tsx
import { Skeleton, SkeletonList } from '@/shared/ui'

export default function PrefetchedLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-4">
        <SkeletonList count={5} />
      </div>
    </div>
  )
}