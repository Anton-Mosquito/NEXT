// src/app/posts/prefetched/loading.tsx
export default function PrefetchedLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2" />
      <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
      <div className="space-y-3 mt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl border p-4 h-24" />
        ))}
      </div>
    </div>
  )
}