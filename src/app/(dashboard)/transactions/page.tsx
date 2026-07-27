import type { Metadata } from "next";
import { TransactionsWidget } from "@/widgets/transactions/ui/TransactionsWidget";

export const metadata: Metadata = {
  title: "Transactions | FinanceApp",
};

export default function TransactionsPage() {
  return <TransactionsWidget />;
}
