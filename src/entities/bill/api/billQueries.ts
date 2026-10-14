"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBill,
  deleteBill,
  getBillNotifications,
  getBills,
  markBillPaid,
  updateBill,
} from "./billActions";
import type { BillInput, BillUpdateInput } from "../lib/billSchema";

export const billKeys = {
  all: ["bills"] as const,
  notifications: ["bill-notifications"] as const,
};

export type Bill = Awaited<ReturnType<typeof getBills>>[number];
export type BillNotification = Awaited<
  ReturnType<typeof getBillNotifications>
>[number];

export function useBillsQuery() {
  return useQuery({
    queryKey: billKeys.all,
    queryFn: getBills,
  });
}

export function useBillNotificationsQuery() {
  return useQuery({
    queryKey: billKeys.notifications,
    queryFn: getBillNotifications,
  });
}

function useInvalidateBills() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: billKeys.all }),
      queryClient.invalidateQueries({ queryKey: billKeys.notifications }),
    ]);
}

export function useCreateBillMutation() {
  const invalidateBills = useInvalidateBills();
  return useMutation({
    mutationFn: (input: BillInput) => createBill(input),
    onSuccess: invalidateBills,
  });
}

export function useUpdateBillMutation() {
  const invalidateBills = useInvalidateBills();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BillUpdateInput }) =>
      updateBill(id, input),
    onSuccess: invalidateBills,
  });
}

export function useMarkBillPaidMutation() {
  const invalidateBills = useInvalidateBills();
  return useMutation({
    mutationFn: markBillPaid,
    onSuccess: invalidateBills,
  });
}

export function useDeleteBillMutation() {
  const invalidateBills = useInvalidateBills();
  return useMutation({
    mutationFn: deleteBill,
    onSuccess: invalidateBills,
  });
}
