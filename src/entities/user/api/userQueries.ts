// src/entities/user/api/userQueries.ts
// TanStack Query hooks for the DB-backed Users resource.
// These coexist with userApi.ts (RTK Query / JSONPlaceholder) and will
// gradually replace it as the project migrates fully to PostgreSQL.
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { DbUser, CreateUserInput } from "@shared/schemas";

// ─── Query keys ──────────────────────────────────────────────────────────────
// Centralise keys so invalidation never goes out of sync.
export const userQueryKeys = {
  all: ["db-users"] as const,
  byId: (id: number) => ["db-users", id] as const,
};

// ─── Fetch helpers (plain fetch, no extra lib) ────────────────────────────────

async function fetchUsers(): Promise<DbUser[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function fetchUserById(id: number): Promise<DbUser> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function createUserRequest(data: CreateUserInput): Promise<DbUser> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to create user");
  }

  return res.json();
}

async function deleteUserRequest(id: number): Promise<void> {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error("Failed to delete user");
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all users from the PostgreSQL database. */
export function useUsersQuery() {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: fetchUsers,
  });
}

/** Fetch a single user by id. */
export function useUserByIdQuery(id: number) {
  return useQuery({
    queryKey: userQueryKeys.byId(id),
    queryFn: () => fetchUserById(id),
    enabled: id > 0,
  });
}

/** Create a new user and automatically refresh the list on success. */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}

/** Delete a user and automatically refresh the list on success. */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
}
