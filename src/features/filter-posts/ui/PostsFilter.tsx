// src/features/filter-posts/ui/PostsFilter.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Input, Button, Badge } from "@/shared/ui";
import { debounce } from "@/shared/lib";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import {
  setSearch,
  setUserId,
  resetFilters,
  selectPostsFilter,
} from "../model/filterSlice";

export function PostsFilter() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectPostsFilter);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: unknown) => dispatch(setSearch(value as string)), 400),
    [dispatch],
  );

  const isFiltered = filter.search || filter.userId;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-48">
        <Input
          placeholder="🔍 Пошук постів..."
          defaultValue={filter.search}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      <Select
        value={filter.userId != null ? String(filter.userId) : "all"}
        onValueChange={(val) =>
          dispatch(setUserId(val === "all" ? null : Number(val)))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Всі автори" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі автори</SelectItem>
          {[1, 2, 3, 4, 5].map((id) => (
            <SelectItem key={id} value={String(id)}>
              User #{id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(resetFilters())}
        >
          ✕ Скинути
        </Button>
      )}

      {isFiltered && <Badge variant="primary">Фільтр активний</Badge>}
    </div>
  );
}

if (process.env.NODE_ENV === "development") {
  PostsFilter.whyDidYouRender = true;
}
