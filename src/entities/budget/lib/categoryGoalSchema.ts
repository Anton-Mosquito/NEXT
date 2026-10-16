import { z } from "zod";

export const categoryGoalSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .positive("Enter an amount greater than zero."),
});

export const categoryGoalSaveSchema = categoryGoalSchema.extend({
  categoryId: z.string().min(1),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must use YYYY-MM format."),
});

export type CategoryGoalInput = z.input<typeof categoryGoalSchema>;
