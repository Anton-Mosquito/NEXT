// src/app/posts/[id]/loading.tsx
// ✅ Автоматичний Suspense fallback для цього route
export default function PostDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-3 bg-gray-200 rounded ${i === 4 ? "w-1/2" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
