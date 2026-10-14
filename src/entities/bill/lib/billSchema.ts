import { z } from "zod";

const billFields = {
  vendorName: z.string().trim().min(1, "Vendor is required").max(80),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(500),
  dueDate: z.iso.date(),
  lastChargeDate: z
    .union([z.iso.date(), z.literal("")])
    .transform((value) => (value === "" ? null : value)),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z
    .string()
    .trim()
    .length(3, "Enter a 3-letter currency code")
    .regex(/^[A-Za-z]{3}$/, "Enter a valid 3-letter currency code")
    .transform((value) => value.toUpperCase()),
};

export const billInputSchema = z.object(billFields);

export const updateBillSchema = z.object({
  vendorName: billFields.vendorName.optional(),
  title: billFields.title.optional(),
  description: billFields.description.optional(),
  dueDate: billFields.dueDate.optional(),
  lastChargeDate: z.union([z.iso.date(), z.null()]).optional(),
  amount: billFields.amount.optional(),
  currency: billFields.currency.optional(),
});

export const billIdSchema = z.string().uuid();

export type BillInput = z.infer<typeof billInputSchema>;
export type BillUpdateInput = z.infer<typeof updateBillSchema>;
