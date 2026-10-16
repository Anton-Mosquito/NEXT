import type { Metadata } from "next";
import { GoalsWidget } from "@/widgets/goals";

export const metadata: Metadata = {
  title: "Goals | FinanceApp",
};

export default function GoalsPage() {
  return <GoalsWidget />;
}
