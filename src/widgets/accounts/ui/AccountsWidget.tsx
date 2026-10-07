"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountCard, Button, EmptyState, Modal } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/Skeleton";
import { AddAccountForm } from "@/features/add-account/ui/AddAccountForm";
import { DeleteAccountDialog } from "@/features/delete-account/ui/DeleteAccountDialog";
import { useFinancialAccountsQuery } from "@/entities/financial-account/api/financialAccountQueries";

const accountPresentation = [
  {
    institution: "Master Card",
    accountNumber: "3388 4556 8860 8***",
    media: "mastercard",
  },
  {
    institution: "AB Bank Ltd",
    accountNumber: "693 456 69 9****",
    media: "visa",
  },
  {
    institution: "Brac Bank Ltd.",
    accountNumber: "133 456 886 8****",
    media: undefined,
  },
  {
    institution: "AB Bank Ltd",
    accountNumber: "698 456 866 2****",
    media: undefined,
  },
  {
    institution: "City Bank Ltd.",
    accountNumber: "363 456 896 6****",
    media: undefined,
  },
] as const;

export function AccountsWidget() {
  const router = useRouter();
  const { data: accounts, isLoading } = useFinancialAccountsQuery();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isEmpty = !isLoading && (!accounts || accounts.length === 0);

  const skeletonCards = useMemo(
    () => Array.from({ length: 3 }, (_, index) => index),
    [],
  );

  return (
    <div className="-m-4 min-h-full bg-[#F4F5F7] p-4 pt-4 dark:bg-background md:-m-6 md:p-6 md:pt-4">
      <section
        aria-labelledby="balances-heading"
        className="flex w-full max-w-276 flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <h1
            id="balances-heading"
            className="h-8 w-23.5 text-[22px] font-normal leading-8 text-[#878787] dark:text-muted-foreground"
          >
            Balances
          </h1>
          <p className="text-sm text-gray-02 dark:text-muted-foreground">
            Manage your cash, cards, and savings in one place.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[repeat(3,352px)] xl:gap-x-6 xl:gap-y-8">
            {[...skeletonCards, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                className="h-72 w-full max-w-88 rounded-[8px]"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[repeat(3,352px)] xl:gap-x-6 xl:gap-y-8">
            {accounts.slice(0, 5).map((account, index) => (
              <AccountCard
                key={account.id}
                id={account.id}
                name={account.name}
                type={account.type as "cash" | "card" | "savings" | "crypto"}
                balance={Number(account.balance)}
                currency={account.currency}
                institution={accountPresentation[index]?.institution}
                accountNumber={accountPresentation[index]?.accountNumber}
                media={accountPresentation[index]?.media}
                onDelete={() =>
                  setDeleteTarget({ id: account.id, name: account.name })
                }
                onClick={() => router.push(`/accounts/${account.id}`)}
              />
            ))}
            <div className="flex h-72 w-full max-w-88 flex-col items-center justify-center gap-1 rounded-[8px] bg-white shadow-[0_2px_12px_rgba(76,103,100,0.10)] dark:bg-card">
              <Button
                className="h-12 w-52 px-8"
                onClick={() => setAddOpen(true)}
              >
                Add accounts
              </Button>
              <Button
                variant="ghost"
                className="h-12 w-52 justify-start px-6 text-[#9F9F9F] dark:text-muted-foreground"
                onClick={() => setAddOpen(true)}
              >
                Edit Accounts
              </Button>
            </div>
          </div>
        ) : null}

        {isEmpty ? (
          <EmptyState
            title="No accounts yet"
            description="Create your first account to start tracking balances."
            action={{ label: "Add accounts", onClick: () => setAddOpen(true) }}
            className="mt-6 w-full"
          />
        ) : null}

        <Modal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          title="Add Account"
        >
          <AddAccountForm onSuccess={() => setAddOpen(false)} />
        </Modal>

        <DeleteAccountDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          accountId={deleteTarget?.id ?? ""}
          accountName={deleteTarget?.name ?? ""}
        />
      </section>
    </div>
  );
}
