// src/shared/services/userService.ts
// Service layer — all database business logic lives here.
// API routes are thin controllers that delegate to this service.
//
// SECURITY: Every query uses parameterized placeholders ($1, $2, ...).
// User-supplied values are NEVER interpolated into SQL strings.

import { query } from "@shared/lib/db";
import type { DbUser, CreateUserInput } from "@shared/schemas";

export const UserService = {
  /**
   * Fetch all users, newest first.
   */
  async getAllUsers(): Promise<DbUser[]> {
    const result = await query<DbUser>(
      "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC",
    );
    return result.rows;
  },

  /**
   * Fetch a single user by primary key.
   * Returns null when no row is found (instead of throwing).
   */
  async getUserById(id: number): Promise<DbUser | null> {
    const result = await query<DbUser>(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] ?? null;
  },

  /**
   * Insert a new user and return the created row.
   * The RETURNING clause avoids a second round-trip to the database.
   */
  async createUser(data: CreateUserInput): Promise<DbUser> {
    const result = await query<DbUser>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [data.name, data.email],
    );
    return result.rows[0];
  },

  /**
   * Delete a user by primary key.
   * Returns true when a row was deleted, false when not found.
   */
  async deleteUser(id: number): Promise<boolean> {
    const result = await query(
      "DELETE FROM users WHERE id = $1",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
