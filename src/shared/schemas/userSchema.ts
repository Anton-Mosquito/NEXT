// src/shared/schemas/userSchema.ts
import { z } from "zod";

// Full database row — used to validate data returned from the DB.
// Reflects the updated `user` table schema (Auth.js-compatible).
export const dbUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).nullable(),
  email: z.email(),
  emailVerified: z.coerce.date().nullable().optional(),
  image: z.string().url().nullable().optional(),
  createdAt: z.coerce.date().optional(),
});

// Form / POST body — used to validate incoming create requests
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.email("Please enter a valid email address"),
});

export type DbUser = z.infer<typeof dbUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
