// src/shared/schemas/userSchema.ts
import { z } from "zod";

// Full database row — used to validate data returned from the DB
export const dbUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
  created_at: z.coerce.date(),
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
