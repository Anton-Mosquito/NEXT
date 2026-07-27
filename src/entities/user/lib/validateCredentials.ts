import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/shared/lib/kysely";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function validateCredentials(emailRaw: unknown, passwordRaw: unknown) {
  const parsed = loginSchema.safeParse({ email: emailRaw, password: passwordRaw });
  if (!parsed.success) {
    return null;
  }

  const { email, password } = parsed.data;

  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
