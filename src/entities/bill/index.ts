export {
  useBillNotificationsQuery,
  useBillsQuery,
  useCreateBillMutation,
  useDeleteBillMutation,
  useMarkBillPaidMutation,
  useUpdateBillMutation,
} from "./api/billQueries";
export type { Bill, BillNotification } from "./api/billQueries";
export {
  billInputSchema,
  type BillInput,
  type BillUpdateInput,
} from "./lib/billSchema";
