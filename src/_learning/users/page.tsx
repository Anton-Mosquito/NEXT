// src/app/users/page.tsx
import type { Metadata } from "next";
import { CreateDbUserForm } from "@/features/create-db-user";
import { DbUserList } from "@/entities/user/ui/DbUserList";

export const metadata: Metadata = {
  title: "Users — PostgreSQL",
  description: "Manage users stored in a local PostgreSQL database",
};

export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full-stack demo: raw SQL (no ORM) · Service Layer · Zod validation ·
          TanStack Query · react-hook-form · shadcn/ui
        </p>
      </div>

      {/* Two-column layout on md+ screens */}
      <div className="grid gap-6 md:grid-cols-[380px_1fr]">
        {/* Left: create form */}
        <div>
          <CreateDbUserForm />
        </div>

        {/* Right: users table */}
        <div>
          <DbUserList />
        </div>
      </div>

      {/* Architecture callout */}
      <div className="rounded-xl border bg-card p-5 text-sm space-y-2">
        <h2 className="font-semibold">Architecture overview</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            <strong className="text-foreground">src/shared/lib/db.ts</strong> —
            pg.Pool singleton; survives Next.js HMR in dev
          </li>
          <li>
            <strong className="text-foreground">
              src/shared/lib/migrations/
            </strong>{" "}
            — plain SQL migration files (run with npm run db:migrate)
          </li>
          <li>
            <strong className="text-foreground">
              src/shared/services/userService.ts
            </strong>{" "}
            — raw SQL queries with $1/$2 parameterization
          </li>
          <li>
            <strong className="text-foreground">
              src/shared/schemas/userSchema.ts
            </strong>{" "}
            — Zod schemas for DbUser and CreateUserInput
          </li>
          <li>
            <strong className="text-foreground">src/app/api/users/</strong> —
            thin API-route controllers (validate → delegate → respond)
          </li>
          <li>
            <strong className="text-foreground">TanStack Query</strong> —
            client-side data-fetching/caching; auto-refetches after mutations
          </li>
        </ul>
      </div>
    </div>
  );
}
