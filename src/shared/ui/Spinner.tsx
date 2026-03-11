// src/shared/ui/Spinner.tsx
import { cn } from "@/shared/lib";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin",
        className,
      )}
    />
  );
}
