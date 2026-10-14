import type { Metadata } from "next";
import { ExpensesWidget } from "@/widgets/expenses/ui/ExpensesWidget";

export const metadata: Metadata = {
  title: "Expenses | FinanceApp",
};

export default function ExpensesPage() {
  return <ExpensesWidget />;
}
