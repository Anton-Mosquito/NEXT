"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface SettingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
}

export function SettingInput({
  label,
  wrapperClassName,
  className,
  id,
  ...props
}: SettingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      {/* gap-2 = 8px between label and input */}
      <label
        htmlFor={inputId}
        className="text-body-md text-secondary-foreground"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-2xl bg-secondary px-6 py-6",
          "text-display-sm text-foreground placeholder:text-gray-03",
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
