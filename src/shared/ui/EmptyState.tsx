import { cn } from "@/shared/lib";
import { Card } from "./Card";
import { Button } from "./Button";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: EmptyStateAction;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here",
  description,
  icon,
  action,
  size = "md",
  className,
  children,
}: EmptyStateProps) {
  const padding = size === "sm" ? "p-4" : size === "lg" ? "p-8" : "p-6";

  const renderDefaultIcon = () => (
    <svg
      className="w-14 h-14 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13s1.5-2 4-2 4 2 4 2"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Card className={cn("flex flex-col items-center justify-center text-center gap-3", padding, className)}>
      <div role="img" aria-hidden className="text-gray-400">
        {icon ?? renderDefaultIcon()}
      </div>

      {title && <div className="font-medium text-gray-800">{title}</div>}

      {description && <div className="text-sm text-gray-500 max-w-md">{description}</div>}

      {children}

      {action ? (
        action.href ? (
          <a
            href={action.href}
            className={cn(
              "inline-flex items-center justify-center mt-2",
              action.variant === "secondary"
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : action.variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600"
                : action.variant === "ghost"
                ? "bg-transparent text-gray-600 hover:bg-gray-100"
                : "bg-blue-500 text-white hover:bg-blue-600",
              action.size === "sm" ? "px-3 py-1.5 text-xs rounded-lg" : action.size === "lg" ? "px-6 py-3 text-base rounded-xl" : "px-4 py-2 text-sm rounded-lg",
            )}
          >
            {action.label}
          </a>
        ) : (
          <Button onClick={action.onClick} variant={action.variant ?? "primary"} size={action.size ?? "md"} className="mt-2">
            {action.label}
          </Button>
        )
      ) : null}
    </Card>
  );
}
