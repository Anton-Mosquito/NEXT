"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

// Minimal static list — extend as needed
const COUNTRY_CODES = [
  { flag: "🇺🇸", code: "+1", iso: "US" },
  { flag: "🇬🇧", code: "+44", iso: "GB" },
  { flag: "🇩🇪", code: "+49", iso: "DE" },
  { flag: "🇫🇷", code: "+33", iso: "FR" },
  { flag: "🇺🇦", code: "+380", iso: "UA" },
  { flag: "🇵🇱", code: "+48", iso: "PL" },
];

interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  defaultCountry?: string; // ISO code, e.g. "US"
}

export function PhoneInput({
  className,
  defaultCountry = "US",
  ...props
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    COUNTRY_CODES.find((c) => c.iso === defaultCountry) ?? COUNTRY_CODES[0],
  );

  return (
    <div
      className={cn(
        // Base field styling — Figma spec
        "relative flex w-full items-center rounded-[8px] border border-gray-03 bg-transparent transition-colors",
        // Active border on focus-within
        "focus-within:border-gray-02",
        "has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      {/* Country selector */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 items-center gap-1.5 px-4 py-3 text-body-md text-gray-01 focus-visible:outline-none"
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-gray-01">{selected.code}</span>
        <ChevronDown
          size={14}
          className="text-gray-02 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </button>

      {/* Vertical separator */}
      <span className="h-5 w-px shrink-0 bg-gray-03" aria-hidden />

      {/* Phone number input */}
      <input
        type="tel"
        inputMode="tel"
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-body-md text-gray-01 placeholder:text-gray-03 outline-none"
        {...props}
      />

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-[8px] border border-gray-03 bg-card shadow-md"
        >
          {COUNTRY_CODES.map((c) => (
            <li key={c.iso}>
              <button
                role="option"
                aria-selected={c.iso === selected.iso}
                type="button"
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-body-md text-gray-01 hover:bg-gray-05 aria-selected:font-medium"
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                <span className="text-gray-02">({c.iso})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
