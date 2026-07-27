import { auth } from "@/shared/lib/auth";
import type { ReactNode } from "react";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";

  return (
    <DashboardLayoutClient userName={userName}>
      {children}
    </DashboardLayoutClient>
  );
}
