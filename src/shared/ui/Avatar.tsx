// src/shared/ui/Avatar.tsx
import { cn } from "@/shared/lib";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
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
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shrink-0",
        `bg-gradient-to-br ${colors[colorIndex]}`,
        sizeStyles[size],
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
