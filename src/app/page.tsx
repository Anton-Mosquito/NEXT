import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/shared/ui";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
      <Card className="w-full p-8 text-center shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Finance App
        </p>
        <h1 className="mb-4 text-3xl font-semibold text-foreground">
          Welcome to your expense dashboard
        </h1>
        <p className="mb-8 text-base text-gray-02">
          Sign in to view your balances, recent transactions, and spending
          trends.
        </p>
        <Link
          href="/api/auth/signin"
          className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Continue to sign in
        </Link>
      </Card>
    </div>
  );
}
