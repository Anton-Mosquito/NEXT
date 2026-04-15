// src/shared/ui/Card.tsx
import { cn } from "@/lib/utils";
import { Card as ShadcnCard } from "@/components/ui/card";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  hoverable?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
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
    <ShadcnCard
      onClick={onClick}
      className={cn(
        "gap-0",
        paddingStyles[padding],
        hoverable &&
          "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all",
        className,
      )}
    >
      {children}
    </ShadcnCard>
  );
}
