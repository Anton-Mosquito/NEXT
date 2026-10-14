import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { TransactionsWidget } from "@/widgets/transactions/ui/TransactionsWidget";

export const metadata: Metadata = {
  title: "Transactions | FinanceApp",
};

const transactionIdSchema = z.string().uuid().optional();
const categoryIdSchema = z.string().uuid().optional();

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    transactionId?: string | string[];
    categoryId?: string | string[];
  }>;
}) {
  const { transactionId, categoryId } = await searchParams;
  const parsedId = transactionIdSchema.safeParse(transactionId);
  const parsedCategoryId = categoryIdSchema.safeParse(categoryId);

  if (!parsedId.success || !parsedCategoryId.success) notFound();

  return (
    <TransactionsWidget
      key={`${parsedId.data ?? "all-transactions"}-${parsedCategoryId.data ?? "all-categories"}`}
      highlightedTransactionId={parsedId.data}
      initialCategoryId={parsedCategoryId.data}
    />
  );
}
