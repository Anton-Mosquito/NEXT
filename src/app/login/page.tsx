"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LabeledInput, Button, Spinner, Card } from "@/shared/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[400px] items-center justify-center px-4">
      <Card className="w-full p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-gray-02">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <LabeledInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-gray-02">Or continue with</span>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-02">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
