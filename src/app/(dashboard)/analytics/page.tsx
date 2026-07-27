import { AnalyticsWidget } from "@/widgets/analytics/ui/AnalyticsWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | FinanceApp",
};

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AnalyticsWidget />
    </div>
  );
}
