// src/shared/types/index.ts
export type ID = number | string;

export type LoadingStatus = "idle" | "pending" | "succeeded" | "failed";

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Утиліта: зробити всі поля Required крім вказаних
export type RequiredExcept<T, K extends keyof T> = Required<Omit<T, K>> &
  Pick<T, K>;
