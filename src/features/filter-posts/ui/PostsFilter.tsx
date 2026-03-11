// src/features/filter-posts/ui/PostsFilter.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Input, Button, Badge } from "@/shared/ui";
import { debounce } from "@/shared/lib";
import { useMemo, useCallback } from "react";
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

      <select
        value={filter.userId ?? ""}
        onChange={(e) =>
          dispatch(setUserId(e.target.value ? Number(e.target.value) : null))
        }
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">Всі автори</option>
        {[1, 2, 3, 4, 5].map((id) => (
          <option key={id} value={id}>
            User #{id}
          </option>
        ))}
      </select>

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
