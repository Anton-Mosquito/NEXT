// src/shared/ui/Button.tsx
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "figma-sm" | "figma-md" | "figma-xl" | "figma-2xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  /** Icon rendered alongside the label. Defaults to end position. */
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

const variantMap: Record<
  ButtonVariant,
  "default" | "secondary" | "destructive" | "ghost"
> = {
  primary: "default",
  secondary: "secondary",
  danger: "destructive",
  ghost: "ghost",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "sm",
  md: "default",
  lg: "lg",
  "figma-sm":  "figma-sm",
  "figma-md":  "figma-md",
  "figma-xl":  "figma-xl",
  "figma-2xl": "figma-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  asChild = false,
  icon,
  iconPosition = "end",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const content = isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {children}
    </span>
  ) : icon ? (
    <>
      {iconPosition === "start" && icon}
      {children}
      {iconPosition === "end" && icon}
    </>
  ) : (
    children
  );

  return (
    <ShadcnButton
      variant={variantMap[variant]}
      size={sizeMap[size] as Parameters<typeof ShadcnButton>[0]["size"]}
      asChild={asChild}
      className={cn(fullWidth && "w-full", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </ShadcnButton>
  );
}
