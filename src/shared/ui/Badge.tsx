// src/shared/ui/Badge.tsx
import { cn } from "@/lib/utils";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

type ShadcnVariant = "default" | "secondary" | "destructive" | "outline";

const variantMap: Record<
  BadgeVariant,
  { variant: ShadcnVariant; className?: string }
> = {
  default: { variant: "secondary" },
  primary: { variant: "default" },
  success: {
    variant: "outline",
    className: "bg-green-100 text-green-600 border-transparent",
  },
  warning: {
    variant: "outline",
    className: "bg-yellow-100 text-yellow-700 border-transparent",
  },
  danger: { variant: "destructive" },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const { variant: shadcnVariant, className: variantClass } =
    variantMap[variant];
  return (
    <ShadcnBadge
      variant={shadcnVariant}
      className={cn(variantClass, className)}
    >
      {children}
    </ShadcnBadge>
  );
}
