"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/entities/user/api/authActions";
import { LabeledInput, Button, Spinner, Card } from "@/shared/ui";

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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    const result = await registerUser(data);

    if (result?.error) {
      setServerError(result.error);
    } else {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: "/dashboard",
      });
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[400px] items-center justify-center px-4">
      <Card className="w-full p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Create account</h1>
        <p className="mb-6 text-sm text-gray-02">Start tracking your finances</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <LabeledInput 
              label="Full name" 
              {...register("name")} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <LabeledInput 
              label="Email" 
              type="email" 
              {...register("email")} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <LabeledInput 
              label="Password" 
              type="password" 
              {...register("password")} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <LabeledInput 
              label="Confirm password" 
              type="password" 
              {...register("confirmPassword")} 
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm">{serverError}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-02">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
