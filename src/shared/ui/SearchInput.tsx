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
        "flex h-12 w-full max-w-88 items-center rounded-xl bg-white",
        "px-6 py-3 pl-8",
        "dark:bg-card",
        wrapperClassName,
      )}
    >
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "w-full flex-1 bg-transparent outline-none",
          "text-[16px] leading-6 text-[#4B5768] placeholder:text-[#9F9F9F] dark:text-foreground dark:placeholder:text-muted-foreground",
          "[&::-webkit-search-cancel-button]:appearance-none",
          "[&::-webkit-search-decoration]:appearance-none",
          className,
        )}
        {...props}
      />

      <Search
        size={24}
        className="ml-6 shrink-0 text-[#525256] dark:text-muted-foreground"
        strokeWidth={2}
      />
    </div>
  );
}
