import { z } from "zod";

export const monthlySavingsTargetSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .positive("Enter an amount greater than zero."),
});

export type MonthlySavingsTargetInput = z.input<
  typeof monthlySavingsTargetSchema
>;
export type MonthlySavingsTarget = z.output<typeof monthlySavingsTargetSchema>;
