"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base: 24×24, filled gray-04, rounded-md, no border
        "peer relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-04 transition-colors outline-none",
        // After-area extends tap target without shifting layout
        "after:absolute after:-inset-2",
        // Focus ring
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50",
        // Checked: swap to primary teal
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        // Invalid
        "aria-invalid:bg-destructive/20 aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        // Dark mode unchecked surface
        "dark:bg-gray-04",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-4 stroke-[2.5]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
