"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Extra class for the outer wrapper */
  wrapperClassName?: string;
}

export function LabeledInput({
  label,
  wrapperClassName,
  className,
  id,
  ...props
}: LabeledInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      <label htmlFor={inputId} className="text-heading-md text-gray-02">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          // Dark filled surface, no border, large radius
          "w-full rounded-2xl bg-secondary px-6 py-6",
          // Typography
          "text-display-sm text-gray-02 placeholder:text-gray-02",
          // Interaction
          "outline-none transition-colors",
          "focus:bg-muted",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}
