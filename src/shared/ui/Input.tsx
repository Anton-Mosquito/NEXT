// src/shared/ui/Input.tsx
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex w-full max-w-[400px] flex-col gap-2">
      {label && (
        <Label
          htmlFor={inputId}
          className="text-[16px] font-medium text-[#525256]"
        >
          {label}
        </Label>
      )}
      <ShadcnInput
        id={inputId}
        aria-invalid={!!error}
        className={[
          "h-12 w-full rounded-[8px] border border-[#D0D5DD] bg-white px-4 py-3",
          "text-[16px] leading-[24px] text-[#4B5768] placeholder:text-[#999DA3]",
          "outline-none transition-colors focus-visible:border-[#4B5768] focus-visible:ring-0",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
