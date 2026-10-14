"use server";

import { auth } from "@/shared/lib/auth";
import { db } from "@/shared/lib/kysely";
import {
  billIdSchema,
  billInputSchema,
  updateBillSchema,
} from "../lib/billSchema";

const demoDescription =
  "For advanced security and more flexible controls, the Professional plan helps you scale design processes company-wide.";

const demoBills = [
  {
    vendorName: "Figma",
    title: "Figma - Yearly Plan",
    description: demoDescription,
    dueDate: "2023-05-15",
    lastChargeDate: "2022-05-14",
    amount: 150,
    currency: "USD",
  },
  {
    vendorName: "Adobe",
    title: "Adobe Inc - Yearly Plan",
    description: demoDescription,
    dueDate: "2023-06-16",
    lastChargeDate: "2022-06-17",
    amount: 559,
    currency: "USD",
  },
] satisfies Array<{
  vendorName: string;
  title: string;
  description: string;
  dueDate: string;
  lastChargeDate: string;
  amount: number;
  currency: string;
}>;

async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

function toDateOnly(value: Date | string): string;
function toDateOnly(value: Date | string | null): string | null;
function toDateOnly(value: Date | string | null): string | null {
  if (value === null) return null;
  if (typeof value === "string") return value.slice(0, 10);

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function seedDemoBills(userId: string) {
  await db.transaction().execute(async (trx) => {
    const user = await trx
      .selectFrom("user")
      .select("billsSeeded")
      .where("id", "=", userId)
      .forUpdate()
      .executeTakeFirst();

    if (!user) throw new Error("User not found");
    if (user.billsSeeded) return;

    await trx
      .insertInto("bill")
      .values(
        demoBills.map((bill) => ({
          userId,
          ...bill,
          status: "unpaid" as const,
          paidAt: null,
        })),
      )
      .execute();

    await trx
      .updateTable("user")
      .set({ billsSeeded: true })
      .where("id", "=", userId)
      .execute();
  });
}

export async function getBills() {
  const userId = await getAuthenticatedUserId();
  await seedDemoBills(userId);

  const bills = await db
    .selectFrom("bill")
    .selectAll()
    .where("userId", "=", userId)
    .orderBy("dueDate", "asc")
    .orderBy("createdAt", "desc")
    .execute();

  return bills.map((bill) => ({
    ...bill,
    dueDate: toDateOnly(bill.dueDate),
    lastChargeDate: toDateOnly(bill.lastChargeDate),
  }));
}

export async function getBillNotifications() {
  const userId = await getAuthenticatedUserId();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const reminderEndDate = new Date(today);
  reminderEndDate.setUTCDate(reminderEndDate.getUTCDate() + 7);

  const bills = await db
    .selectFrom("bill")
    .select(["id", "vendorName", "title", "dueDate", "amount", "currency"])
    .where("userId", "=", userId)
    .where("status", "=", "unpaid")
    .where("dueDate", "<=", reminderEndDate)
    .orderBy("dueDate", "asc")
    .execute();

  return bills.map((bill) => ({
    ...bill,
    dueDate: toDateOnly(bill.dueDate),
  }));
}

export async function createBill(input: unknown) {
  const userId = await getAuthenticatedUserId();
  const parsed = billInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const { lastChargeDate, ...bill } = parsed.data;

  return db
    .insertInto("bill")
    .values({
      userId,
      ...bill,
      lastChargeDate,
      status: "unpaid",
      paidAt: null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateBill(id: string, input: unknown) {
  const userId = await getAuthenticatedUserId();
  const parsedId = billIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error(`Validation failed: ${parsedId.error.message}`);
  }
  const parsed = updateBillSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`);
  }

  const bill = await db
    .updateTable("bill")
    .set({ ...parsed.data, updatedAt: new Date() })
    .where("id", "=", parsedId.data)
    .where("userId", "=", userId)
    .returningAll()
    .executeTakeFirst();

  if (!bill) throw new Error("Bill not found");
  return bill;
}

export async function markBillPaid(id: string) {
  const userId = await getAuthenticatedUserId();
  const parsedId = billIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error(`Validation failed: ${parsedId.error.message}`);
  }

  const bill = await db
    .updateTable("bill")
    .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
    .where("id", "=", parsedId.data)
    .where("userId", "=", userId)
    .returningAll()
    .executeTakeFirst();

  if (!bill) throw new Error("Bill not found");
  return bill;
}

export async function deleteBill(id: string) {
  const userId = await getAuthenticatedUserId();
  const parsedId = billIdSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error(`Validation failed: ${parsedId.error.message}`);
  }

  const result = await db
    .deleteFrom("bill")
    .where("id", "=", parsedId.data)
    .where("userId", "=", userId)
    .executeTakeFirst();

  if (Number(result.numDeletedRows) === 0) throw new Error("Bill not found");
  return { success: true };
}
