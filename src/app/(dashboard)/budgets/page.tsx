import { BudgetsWidget } from "@/widgets/budgets/ui/BudgetsWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets | FinanceApp",
};

export default function BudgetsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BudgetsWidget />
    </div>
  );
}
