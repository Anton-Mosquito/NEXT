import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .max(30, "Phone number is too long")
  .regex(/^\+?[\d\s\-()]{10,15}$/, "Enter a valid phone number");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be at most 50 characters"),
  phone: phoneNumberSchema,
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please retype your new password"),
    phone: phoneNumberSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
