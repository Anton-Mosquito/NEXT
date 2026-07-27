"use client";

import { useMemo, useState } from "react";
import { AccountCard, Button, EmptyState, Modal } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/Skeleton";
import { AddAccountForm } from "@/features/add-account/ui/AddAccountForm";
import { DeleteAccountDialog } from "@/features/delete-account/ui/DeleteAccountDialog";
import { useFinancialAccountsQuery } from "@/entities/financial-account/api/financialAccountQueries";

export function AccountsWidget() {
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
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Accounts
          </h1>
          <p className="text-sm text-gray-02">
            Manage your cash, cards, and savings in one place.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Add Account</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skeletonCards.map((item) => (
            <Skeleton key={item} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : null}

      {!isLoading && accounts && accounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              id={account.id}
              name={account.name}
              type={account.type as "cash" | "card" | "savings" | "crypto"}
              balance={Number(account.balance)}
              currency={account.currency}
              onDelete={() =>
                setDeleteTarget({ id: account.id, name: account.name })
              }
              onClick={() => undefined}
            />
          ))}
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState
          title="No accounts yet"
          description="Create your first account to start tracking balances."
          className="mt-6"
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
    </div>
  );
}
