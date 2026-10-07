"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button, Spinner } from "@/shared/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError("Something went wrong");
        }
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F4F5F7] px-4 py-10 dark:bg-background">
      <div className="flex w-full max-w-100 flex-col gap-10">
        <div className="flex flex-col gap-16">
          <header className="self-center font-logo text-[40px] font-medium leading-8 tracking-[3.2px] text-[#299D91]">
            <span className="font-extrabold">FINE</span>bank.
            <span className="font-extrabold">IO</span>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[16px] font-medium leading-6 text-[#191D23] dark:text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="johndoe@email.com"
                autoComplete="email"
                required
                aria-invalid={Boolean(error)}
                className="h-12 w-full rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 text-[16px] leading-5.5 text-[#4B5768] outline-none transition-colors placeholder:text-[#4B5768] focus:border-[#4B5768] dark:border-input dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex h-6 items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[16px] font-medium leading-6 text-[#191D23] dark:text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-medium leading-4 text-[#299D91] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex h-12 w-full items-center gap-3 rounded-[8px] border border-[#D0D5DD] bg-transparent px-4 py-3 transition-colors focus-within:border-[#4B5768] dark:border-input dark:focus-within:border-ring">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  aria-invalid={Boolean(error)}
                  className="min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#4B5768] outline-none placeholder:text-[#999DA3] dark:text-foreground"
                />
                <button
                  type="button"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  className="flex size-6 shrink-0 items-center justify-center text-[#999DA3] transition-colors hover:text-[#4B5768] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-foreground"
                >
                  {isPasswordVisible ? (
                    <EyeOff size={24} strokeWidth={2} />
                  ) : (
                    <Eye size={24} strokeWidth={2} />
                  )}
                </button>
              </div>
              {error && (
                <p
                  className="text-sm leading-5 text-[#EF4444] dark:text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-4">
              <label className="flex items-center gap-4 text-[16px] font-light leading-6 text-[#191D23] dark:text-foreground">
                <input
                  defaultChecked
                  type="checkbox"
                  className="size-5 appearance-none rounded-xs border border-[#D0D5DD] bg-transparent checked:border-[#299D91] checked:bg-[#299D91] checked:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 15 11%22%3E%3Cpath d=%22m1 5 4 4L14 1%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat dark:border-input"
                />
                Keep me signed in
              </label>
              <Button
                type="submit"
                size="figma-2xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : "Login"}
              </Button>
            </div>

            <div className="relative flex h-9 items-center justify-center">
              <span className="absolute h-px w-85.5 bg-[rgba(75,87,104,0.25)] dark:bg-border" />
              <span className="relative bg-[#F4F5F7] p-2 text-[14px] font-normal leading-5 text-[#999DA3] dark:bg-background dark:text-muted-foreground">
                or sign in with
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

        <Link
          href="/register"
          className="w-full text-center text-[16px] font-semibold leading-6 text-[#299D91] hover:underline"
        >
          Create an account
        </Link>
      </div>
    </section>
  );
}
