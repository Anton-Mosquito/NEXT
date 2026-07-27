"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/kysely";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await db
      .selectFrom("user")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .insertInto("user")
      .values({
        name,
        email,
        passwordHash: hashedPassword,
        emailVerified: null,
        image: null,
      })
      .execute();

    return { success: true };
  } catch (error) {
    return { error: "Something went wrong during registration" };
  }
}
