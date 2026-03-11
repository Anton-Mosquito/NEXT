// src/shared/ui/Input.tsx
import { cn } from "@/shared/lib";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "border rounded-lg px-3 py-2 text-sm transition-colors",
          "focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400",
          "placeholder:text-gray-400",
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
