"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  revealed?: boolean;
  error?: string;
}

export function PasswordInput({
  className,
  revealed: controlledRevealed,
  error,
  ...props
}: PasswordInputProps) {
  const [internalRevealed, setInternalRevealed] = useState(false);
  const isRevealed = controlledRevealed ?? internalRevealed;

  return (
    <div className="relative flex w-full max-w-100 flex-col">
      <div
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 transition-colors",
          "focus-within:border-[#299D91] focus-within:shadow-[0_0_0_2px_rgba(41,157,145,0.2)]",
          error && "border-[#EF4444] focus-within:border-[#EF4444]",
          "dark:border-input dark:focus-within:border-ring",
          "has-disabled:cursor-not-allowed has-disabled:opacity-50",
          className,
        )}
      >
        <input
          type={isRevealed ? "text" : "password"}
          className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#191D23] outline-none placeholder:text-[#4B5768] dark:text-foreground dark:placeholder:text-muted-foreground"
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          aria-label={isRevealed ? "Hide password" : "Show password"}
          onClick={() => setInternalRevealed((v) => !v)}
          className="flex size-6 shrink-0 items-center justify-center text-[#999DA3] transition-colors hover:text-[#4B5768] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-foreground"
        >
          {isRevealed ? (
            <EyeOff size={24} strokeWidth={2} />
          ) : (
            <Eye size={24} strokeWidth={2} />
          )}
        </button>
      </div>
      {error && (
        <span
          role="alert"
          className="absolute left-0 top-13 text-[12px] font-normal leading-4 text-[#EF4444]"
        >
          {error}
        </span>
      )}
    </div>
  );
}
