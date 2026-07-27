import DashboardLayout from "../../widgets/dashboard-layout/ui/DashboardLayout";
import type { ReactNode } from "react";

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
