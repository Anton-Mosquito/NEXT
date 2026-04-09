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
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <ShadcnInput
        id={inputId}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
