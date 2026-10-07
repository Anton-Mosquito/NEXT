"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { registerUser } from "@/entities/user/api/authActions";
import {
  LabeledInput,
  PasswordInput,
  Button,
  Spinner,
  Card,
} from "@/shared/ui";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
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
    const result = await registerUser({
      ...data,
      confirmPassword: data.password,
    });

    if (result?.error) {
      setServerError(result.error);
    } else {
      const { email, password } = data;

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center overflow-x-hidden bg-[#F4F5F7] px-6 pb-10 pt-20 sm:pt-40 dark:bg-background">
      <Card
        className="w-full max-w-100 rounded-none border-0 bg-transparent p-0 shadow-none ring-0 outline-none"
        padding="none"
      >
        <div className="flex flex-col gap-16">
          <Link
            href="/"
            aria-label="FINEbank.IO home"
            className="self-center font-logo text-[32px] font-medium leading-8 tracking-[2.56px] text-[#299D91] sm:text-[40px] sm:tracking-[3.2px]"
          >
            <h1>
              <span className="font-extrabold">FINE</span>bank.
              <span className="font-extrabold">IO</span>
            </h1>
          </Link>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <h2 className="text-center text-[16px] font-semibold leading-6 text-[#299D91]">
              Create an account
            </h2>

            <div className="flex flex-col gap-6">
              <LabeledInput
                label="Name"
                placeholder="Alex Grey (example)"
                error={errors.name?.message}
                wrapperClassName="h-20"
                {...register("name")}
                className="h-12 rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 text-[16px] font-normal leading-5.5 text-[#191D23] placeholder:text-[#4B5768] focus:border-[#299D91] focus:bg-transparent focus:shadow-[0_0_0_2px_rgba(41,157,145,0.2)] dark:border-input dark:text-foreground dark:placeholder:text-muted-foreground"
              />
              <LabeledInput
                label="Email Address"
                type="email"
                placeholder="hello@example.com"
                error={errors.email?.message}
                wrapperClassName="h-20"
                {...register("email")}
                className="h-12 rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 text-[16px] font-normal leading-5.5 text-[#191D23] placeholder:text-[#4B5768] focus:border-[#299D91] focus:bg-transparent focus:shadow-[0_0_0_2px_rgba(41,157,145,0.2)] dark:border-input dark:text-foreground dark:placeholder:text-muted-foreground"
              />
              <div className="relative flex h-20 flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[16px] font-medium leading-6 text-[#191D23] dark:text-foreground"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>
            </div>

            <p className="text-[12px] font-normal leading-4.5 text-[#999DA3] dark:text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#299D91]">
                terms of service
              </Link>
              .
            </p>

            {serverError && (
              <p
                role="alert"
                className="-mt-4 text-[12px] font-normal leading-4 text-[#EF4444]"
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
              {isSubmitting ? <Spinner /> : "Sign up"}
            </Button>

            <div className="relative flex h-9 items-center justify-center">
              <span className="absolute h-px w-full bg-[rgba(75,87,104,0.25)] dark:bg-border" />
              <span className="relative bg-[#F4F5F7] px-2 text-[14px] font-normal leading-5 text-[#999DA3] dark:bg-background dark:text-muted-foreground">
                or sign up with
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="figma-2xl"
              className="w-full gap-4 bg-[#E4E7EB] px-17.25 font-normal text-[#4B5768] hover:bg-[#D0D5DD] dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-muted"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <Image
                src="/icons/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="size-6"
              />
              Continue with Google
            </Button>
          </form>
        </div>

        <p className="mt-10 w-full text-center text-[14px] font-normal leading-5 text-[#999DA3] dark:text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#299D91] underline hover:text-[#238B80]"
          >
            Sign in here
          </Link>
        </p>
      </Card>
    </div>
  );
}
