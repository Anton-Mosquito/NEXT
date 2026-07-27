"use server";

import { db } from "@/shared/lib/kysely";
import { auth, signOut } from "@/shared/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export async function updateProfile(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { name } = parsed.data;

  const updatedUser = await db
    .updateTable("user")
    .set({ name })
    .where("id", "=", session.user.id)
    .returningAll()
    .executeTakeFirst();

  return updatedUser;
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.deleteFrom("user").where("id", "=", session.user.id).execute();

  await signOut({ redirectTo: "/" });
}
