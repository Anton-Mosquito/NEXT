// src/shared/ui/Skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export { Skeleton };

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        {[...Array(lines - 1)].map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3 ${i === lines - 2 ? "w-1/2" : "w-full"}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function SkeletonList({
  count = 3,
  lines,
  className,
}: {
  count?: number;
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}
