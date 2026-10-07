"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { requestPasswordReset } from "@/entities/user/api/authActions";
import { Button, Card, LabeledInput, Spinner } from "@/shared/ui";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    const result = await requestPasswordReset(data);
    setFormMessage(result.message);
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
              Forgot Password?
            </h2>
            <p className="max-w-100 text-[14px] font-normal leading-5 text-[#999DA3] dark:text-muted-foreground">
              Enter your email address to get the password reset link.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <LabeledInput
              label="Email Address"
              type="email"
              placeholder="hello@example.com"
              error={errors.email?.message}
              wrapperClassName="h-20"
              {...register("email")}
              className="h-12 rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 text-[16px] font-normal leading-5.5 text-[#191D23] placeholder:text-[#999DA3] focus:border-[#4B5768] focus:bg-transparent focus:shadow-none dark:border-input dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-ring"
            />

            {formMessage && (
              <p
                role="status"
                className="-mt-2 text-[12px] leading-4 text-[#999DA3] dark:text-muted-foreground"
              >
                {formMessage}
              </p>
            )}

            <Button
              type="submit"
              size="figma-2xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "Password Reset"}
            </Button>
          </form>

          <Link
            href="/login"
            className="-mt-2 text-center text-[14px] font-normal leading-5 text-[#999DA3] hover:text-[#299D91] hover:underline dark:text-muted-foreground"
          >
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
