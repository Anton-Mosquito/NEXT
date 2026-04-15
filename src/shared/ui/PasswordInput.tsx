"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Shows the actual password value (revealed state from screenshot) */
  revealed?: boolean;
}

export function PasswordInput({ className, revealed: controlledRevealed, ...props }: PasswordInputProps) {
  const [internalRevealed, setInternalRevealed] = useState(false);
  const isRevealed = controlledRevealed ?? internalRevealed;

  return (
    <div
      className={cn(
        // Base field styling — Figma spec
        "flex w-full items-center gap-2 rounded-[8px] border border-gray-03 bg-transparent px-4 py-3 transition-colors",
        // Focus-within simulates active border
        "focus-within:border-gray-02",
        // Disabled
        "has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className
      )}
    >
      <input
        type={isRevealed ? "text" : "password"}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-body-md text-gray-01",
          "placeholder:text-gray-03 outline-none",
        )}
        {...props}
      />
      <button
        type="button"
        aria-label={isRevealed ? "Hide password" : "Show password"}
        onClick={() => setInternalRevealed((v) => !v)}
        className="shrink-0 text-gray-02 transition-colors hover:text-gray-01 focus-visible:outline-none"
        tabIndex={-1}
      >
        {isRevealed ? <EyeOff size={24} /> : <Eye size={24} />}
      </button>
    </div>
  );
}
