"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  wrapperClassName?: string;
}

export function SearchInput({
  className,
  wrapperClassName,
  placeholder = "Search here",
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-[12px] bg-card",
        // padding: top 12 right 24 bottom 12 left 32
        "px-6 py-3 pl-8",
        wrapperClassName,
      )}
    >
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "w-full flex-1 bg-transparent outline-none",
          "text-body-lg text-foreground",
          "placeholder:text-gray-03",
          // hide browser-native clear/cancel button
          "[&::-webkit-search-cancel-button]:appearance-none",
          "[&::-webkit-search-decoration]:appearance-none",
          className,
        )}
        {...props}
      />

      {/* gap of ~170px between placeholder end and icon is natural at Figma's 352px width */}
      <Search size={24} className="ml-6 shrink-0 text-secondary-foreground" />
    </div>
  );
}
