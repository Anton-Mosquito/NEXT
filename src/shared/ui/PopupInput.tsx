"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "./LabeledInput";
import { cn } from "@/lib/utils";

interface PopupInputField {
  /** Field label shown above the input */
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}

interface PopupInputProps {
  open: boolean;
  onClose: () => void;
  /** Submit button label, defaults to "Save" */
  submitLabel?: string;
  fields: PopupInputField[];
  onSubmit?: (values: Record<string, string>) => void;
  className?: string;
}

export function PopupInput({
  open,
  onClose,
  submitLabel = "Save",
  fields,
  onSubmit,
  className,
}: PopupInputProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.label, f.defaultValue ?? ""])),
  );

  function handleSubmit() {
    onSubmit?.(values);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={cn(
          // Figma: 488×392, large radius, generous padding, no ring
          "w-full max-w-122 rounded-3xl p-8 gap-0 ring-0",
          className,
        )}
      >
        {/* visually hidden title for a11y */}
        <DialogTitle className="sr-only">
          {fields.map((f) => f.label).join(" / ")}
        </DialogTitle>

        <div className="flex flex-col gap-6">
          {fields.map((field) => (
            <LabeledInput
              key={field.label}
              label={field.label}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              value={values[field.label]}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  [field.label]: e.target.value,
                }))
              }
            />
          ))}

          <Button
            size="figma-2xl"
            className="mt-2 w-full"
            onClick={handleSubmit}
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
