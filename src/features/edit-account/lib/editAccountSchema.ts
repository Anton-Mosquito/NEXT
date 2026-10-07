import { z } from "zod";

export const editAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  currency: z.string().min(1, "Currency is required"),
});

export type EditAccountFormValues = z.infer<typeof editAccountSchema>;
