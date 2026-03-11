// src/shared/ui/Skeleton.tsx
import { cn } from "@/shared/lib";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded", className)} />;
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      {[...Array(lines - 1)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 2 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonList({
  count = 3,
  lines,
}: {
  count?: number;
  lines?: number;
}) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}
