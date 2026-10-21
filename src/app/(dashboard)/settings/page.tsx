import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/kysely";
import SettingsContent, { type SettingsProfile } from "./SettingsContent";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userProfile = userId
    ? await db
        .selectFrom("user")
      .select(["name", "email", "image", "phone"])
        .where("id", "=", userId)
        .executeTakeFirst()
    : undefined;

  const profile: SettingsProfile = {
    name: userProfile?.name ?? session?.user?.name ?? "",
    email: userProfile?.email ?? session?.user?.email ?? "",
    image: userProfile?.image ?? session?.user?.image ?? null,
    phone: userProfile?.phone ?? "",
  };

  return <SettingsContent profile={profile} />;
}
