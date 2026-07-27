import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-body-md text-gray-02">{title}</span>
        <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
          {icon}
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-tight text-foreground">
            {value}
          </span>
          {(subtitle || trend !== undefined) && (
            <div className="flex items-center gap-2 mt-1">
              {trend !== undefined && (
                <span
                  className={cn(
                    "text-sm font-medium flex items-center",
                    trend >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
                </span>
              )}
              {subtitle && <span className="text-body-sm text-gray-02">{subtitle}</span>}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
