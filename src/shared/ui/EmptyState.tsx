import { cn } from "@/lib/utils";
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
  const paddingClass = size === "sm" ? "p-4" : size === "lg" ? "p-8" : "p-6";

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
    <Card padding="none" className={cn("flex flex-col items-center justify-center text-center gap-3", paddingClass, className)}>
      <div role="img" aria-hidden className="text-gray-400">
        {icon ?? renderDefaultIcon()}
      </div>

      {title && <div className="font-medium text-gray-800">{title}</div>}

      {description && <div className="text-sm text-gray-500 max-w-md">{description}</div>}

      {children}

      {action ? (
        <Button
          asChild={!!action.href}
          onClick={action.onClick}
          variant={action.variant ?? "primary"}
          size={action.size ?? "md"}
          className="mt-2"
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      ) : null}
    </Card>
  );
}
