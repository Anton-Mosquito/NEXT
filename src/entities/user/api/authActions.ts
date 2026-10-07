"use server";

import { createHash, randomBytes } from "node:crypto";
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
  } catch {
    return { error: "Something went wrong during registration" };
  }
}

const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

const passwordResetSchema = z
  .object({
    token: z.string().min(32),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const passwordResetResponse = {
  success: true,
  message: "If an account exists for this email, a reset link has been sent.",
};

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(input: unknown) {
  const parsed = passwordResetRequestSchema.safeParse(input);

  if (!parsed.success) return passwordResetResponse;

  const email = parsed.data.email.trim().toLowerCase();
  const user = await db
    .selectFrom("user")
    .select("email")
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user) return passwordResetResponse;

  const identifier = `password-reset:${email}`;
  const rawToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await db
    .deleteFrom("verificationToken")
    .where("identifier", "=", identifier)
    .execute();

  await db
    .insertInto("verificationToken")
    .values({
      identifier,
      token: hashResetToken(rawToken),
      expires,
    })
    .execute();

  const appUrl =
    process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  console.info(`[password-reset] ${appUrl}/reset-password/${rawToken}`);

  return passwordResetResponse;
}

export async function resetPassword(input: unknown) {
  const parsed = passwordResetSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid reset request",
    };
  }

  const tokenRecord = await db
    .selectFrom("verificationToken")
    .select(["identifier", "expires"])
    .where("token", "=", hashResetToken(parsed.data.token))
    .where("expires", ">", new Date())
    .executeTakeFirst();

  if (!tokenRecord || !tokenRecord.identifier.startsWith("password-reset:")) {
    return { error: "This password reset link is invalid or expired" };
  }

  const email = tokenRecord.identifier.slice("password-reset:".length);
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.transaction().execute(async (transaction) => {
    await transaction
      .updateTable("user")
      .set({ passwordHash })
      .where("email", "=", email)
      .execute();

    await transaction
      .deleteFrom("verificationToken")
      .where("identifier", "=", tokenRecord.identifier)
      .where("token", "=", hashResetToken(parsed.data.token))
      .execute();
  });

  return { success: true };
}
