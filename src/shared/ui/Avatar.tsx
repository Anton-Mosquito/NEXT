// src/shared/ui/Avatar.tsx
import { cn } from "@/lib/utils";
import { Avatar as ShadcnAvatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
  lg: "size-12 text-base",
};

const colors = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-orange-400 to-orange-600",
];

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <ShadcnAvatar
      className={cn(
        sizeStyles[size],
        "after:hidden", // remove Radix border overlay
        className,
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-linear-to-br text-white font-bold",
          colors[colorIndex],
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
