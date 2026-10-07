"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { resetPassword } from "@/entities/user/api/authActions";
import { Button, Card, PasswordInput, Spinner } from "@/shared/ui";

const resetPasswordSchema = z
  .object({
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

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null);
    const result = await resetPassword({ ...data, token: params.token });

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push("/login?reset=success");
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center overflow-hidden bg-[#F4F5F7] px-6 pb-10 pt-20 dark:bg-background sm:pt-40">
      <Card
        className="w-full max-w-100 rounded-none border-0 bg-transparent p-0 shadow-none ring-0 outline-none"
        padding="none"
      >
        <div className="flex flex-col items-center gap-16">
          <Link
            href="/"
            aria-label="FINEbank.IO home"
            className="font-logo text-[32px] font-medium leading-8 tracking-[2.56px] text-[#299D91] sm:text-[40px] sm:tracking-[3.2px]"
          >
            <h1>
              <span className="font-extrabold">FINE</span>bank.
              <span className="font-extrabold">IO</span>
            </h1>
          </Link>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h2 className="text-[20px] font-semibold leading-7 text-[#191D23] dark:text-foreground">
              Create a new password
            </h2>
            <p className="text-[14px] leading-5 text-[#999DA3] dark:text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <div className="relative flex h-20 flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[16px] font-medium leading-6 text-[#191D23] dark:text-foreground"
              >
                New password
              </label>
              <PasswordInput
                id="password"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
            <div className="relative flex h-20 flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-[16px] font-medium leading-6 text-[#191D23] dark:text-foreground"
              >
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>
            {serverError && (
              <p
                role="alert"
                className="-mt-2 text-[12px] leading-4 text-[#E73D1C]"
              >
                {serverError}
              </p>
            )}
            <Button
              type="submit"
              size="figma-2xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Save password"}
            </Button>
          </form>

          <Link
            href="/login"
            className="-mt-2 text-center text-[14px] leading-5 text-[#999DA3] hover:text-[#299D91] hover:underline dark:text-muted-foreground"
          >
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
