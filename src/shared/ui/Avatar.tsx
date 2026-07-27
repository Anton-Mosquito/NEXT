import { cn } from "@/lib/utils";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  name: string;
  src?: string | null;
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

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const colorIndex = (name || "U").charCodeAt(0) % colors.length;
  return (
    <ShadcnAvatar
      className={cn(
        sizeStyles[size],
        "after:hidden", // remove Radix border overlay
        className,
      )}
    >
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback
        className={cn(
          "bg-linear-to-br text-white font-bold",
          colors[colorIndex],
        )}
      >
        {(name || "U").charAt(0).toUpperCase()}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
