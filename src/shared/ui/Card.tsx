// src/shared/ui/Card.tsx
import { cn } from "@/shared/lib";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  hoverable?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  className,
  padding = "md",
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        paddingStyles[padding],
        hoverable &&
          "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}
