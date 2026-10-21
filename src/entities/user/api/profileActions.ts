"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/shared/lib/kysely";
import { auth, signOut } from "@/shared/lib/auth";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "@/shared/schemas/settingsSchema";

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
    .set({
      name,
      phone: parsed.data.phone,
    })
    .where("id", "=", session.user.id)
    .returning(["id"])
    .executeTakeFirst();

  if (!updatedUser) throw new Error("Profile could not be found");

  revalidatePath("/settings");
}

export async function updatePassword(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = updatePasswordSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? "Invalid password update",
    );
  }

  const user = await db
    .selectFrom("user")
    .select(["passwordHash"])
    .where("id", "=", session.user.id)
    .executeTakeFirst();

  if (!user?.passwordHash) {
    throw new Error("Password changes are unavailable for this sign-in method");
  }

  const currentPasswordIsValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );

  if (!currentPasswordIsValid) {
    throw new Error("Old password is incorrect");
  }

  const newPasswordIsCurrent = await bcrypt.compare(
    parsed.data.newPassword,
    user.passwordHash,
  );

  if (newPasswordIsCurrent) {
    throw new Error("New password must be different from the old password");
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

  const updatedUser = await db
    .updateTable("user")
    .set({ passwordHash, phone: parsed.data.phone })
    .where("id", "=", session.user.id)
    .where("passwordHash", "=", user.passwordHash)
    .returning("id")
    .executeTakeFirst();

  if (!updatedUser) {
    throw new Error("Password changed before this update. Please try again.");
  }

  revalidatePath("/settings");
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.deleteFrom("user").where("id", "=", session.user.id).execute();

  await signOut({ redirectTo: "/" });
}
