"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  error?: string;
}

export function LabeledInput({
  label,
  wrapperClassName,
  error,
  className,
  id,
  ...props
}: LabeledInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={cn("relative flex w-full flex-col gap-2", wrapperClassName)}
    >
      <label htmlFor={inputId} className="text-heading-md text-gray-02">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          // Dark filled surface, no border, large radius
          "w-full rounded-2xl bg-secondary px-4 py-3",
          // Typography
          "text-display-sm text-gray-02 placeholder:text-gray-02",
          // Interaction
          "outline-none transition-colors",
          "focus:bg-muted",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[#EF4444] focus:border-[#EF4444]",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && (
        <span
          role="alert"
          className="absolute top-[84px] text-[12px] font-normal leading-4 text-[#EF4444]"
        >
          {error}
        </span>
      )}
    </div>
  );
}
