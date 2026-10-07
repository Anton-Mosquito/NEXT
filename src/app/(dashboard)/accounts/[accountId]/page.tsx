import { z } from "zod";
import { notFound } from "next/navigation";
import { AccountDetailsWidget } from "@/widgets/account-details";

interface AccountDetailsPageProps {
  params: Promise<{ accountId: string }>;
}

export default async function AccountDetailsPage({
  params,
}: AccountDetailsPageProps) {
  const { accountId } = await params;
  const parsedAccountId = z.string().min(1).safeParse(accountId);

  if (!parsedAccountId.success) {
    notFound();
  }

  return <AccountDetailsWidget accountId={parsedAccountId.data} />;
}
