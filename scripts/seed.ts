// scripts/seed.ts
// Comprehensive database seed for the Expense Tracker.
//
// Creates data for accounts, categories, transactions, budgets and balances
// that exercise the full dashboard experience while keeping all rows scoped
// to a single existing user.

import { randomUUID } from "crypto";
import { Kysely, PostgresDialect, CamelCasePlugin, sql } from "kysely";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import type { Database } from "../src/shared/types/database";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sslUrl = databaseUrl.replace(/sslmode=require/g, "sslmode=verify-full");
const ssl = databaseUrl.includes("sslmode=")
  ? { rejectUnauthorized: false }
  : undefined;

const pool = new Pool({ connectionString: sslUrl, ssl });

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
  plugins: [new CamelCasePlugin()],
});

const BATCH_SIZE = 50;
const TRANSACTION_TARGET = 150;

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toIsoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function money(value: number): number {
  return Number(value.toFixed(2));
}

function makeDescription(categoryName: string): string {
  switch (categoryName) {
    case "Groceries":
      return faker.helpers.arrayElement([
        `${faker.company.name()} supermarket`,
        `Weekly groceries at ${faker.location.city()} market`,
        `${faker.commerce.productName()} essentials`,
      ]);
    case "Transport":
      return faker.helpers.arrayElement([
        `Metro and tram pass`,
        `Fuel top-up at ${faker.company.name()}`,
        `Ride to ${faker.location.city()}`,
      ]);
    case "Entertainment":
      return faker.helpers.arrayElement([
        `${faker.music.songName()} tickets`,
        `Movie night with friends`,
        `Streaming and gaming subscription`,
      ]);
    case "Utilities":
      return faker.helpers.arrayElement([
        `Electricity bill`,
        `Internet and phone plan`,
        `Water and gas payment`,
      ]);
    case "Restaurants":
      return faker.helpers.arrayElement([
        `Lunch at ${faker.company.name()}`,
        `Dinner out in ${faker.location.city()}`,
        `Coffee and pastry run`,
      ]);
    case "Health":
      return faker.helpers.arrayElement([
        `Pharmacy refill`,
        `Doctor visit`,
        `Gym membership`,
      ]);
    case "Shopping":
      return faker.helpers.arrayElement([
        `Clothing and home goods`,
        `Online shopping order`,
        `New shoes and accessories`,
      ]);
    case "Education":
      return faker.helpers.arrayElement([
        `Online course payment`,
        `Books and study materials`,
        `Workshop registration`,
      ]);
    case "Subscriptions":
      return faker.helpers.arrayElement([
        `Software plan renewal`,
        `Cloud storage subscription`,
        `Music and media membership`,
      ]);
    case "Salary":
      return faker.helpers.arrayElement([
        `Monthly salary deposit`,
        `Payroll transfer from employer`,
      ]);
    case "Freelance":
      return faker.helpers.arrayElement([
        `Freelance client payment`,
        `Design contract milestone`,
        `Development project invoice`,
      ]);
    default:
      return "Transaction";
  }
}

type AccountRow = {
  id: string;
  name: string;
  type: "cash" | "card" | "savings" | "crypto";
  initialBalance: number;
};

type CategoryRow = {
  id: string;
  name: string;
  type: "income" | "expense";
};

type TransactionInput = {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  description: string | null;
};

async function seed() {
  console.log("🌱 Starting comprehensive database seed...\n");

  console.log("👤 Looking for your existing user...");
  const targetUserIds = [
    "6d33a5b7-7331-46e9-830a-8b56b608c410",
    "52174d2b-bac2-4e0b-a181-6d1e084e3ffc",
  ];

  const user = await db
    .selectFrom("user")
    .select(["id", "name", "email"])
    .where((eb) =>
      eb.or([eb("id", "=", targetUserIds[0]), eb("id", "=", targetUserIds[1])]),
    )
    .executeTakeFirst();

  if (!user) {
    console.error(
      "❌ Could not find your user in the database. Check the provided IDs and try again.",
    );
    process.exit(1);
  }

  const userId = user.id;
  console.log(`✓ Found: ${user.name ?? "your account"} <${user.email}>\n`);

  console.log("🗑 Clearing existing data...");
  await sql`TRUNCATE TABLE budget, transaction, financial_account, category RESTART IDENTITY CASCADE`.execute(
    db,
  );
  console.log("✓ Cleared\n");

  console.log("🏦 Creating 4 financial accounts...");
  const accountDefs = [
    { name: "Monobank Card", type: "card" as const, balance: 28_450.75 },
    { name: "Cash Wallet", type: "cash" as const, balance: 4_200.0 },
    { name: "Savings Jar", type: "savings" as const, balance: 85_000.0 },
    { name: "Crypto Portfolio", type: "crypto" as const, balance: 12_300.5 },
  ];

  const insertedAccounts = await db
    .insertInto("financialAccount")
    .values(
      accountDefs.map((account) => ({
        id: randomUUID(),
        userId,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: "UAH",
      })),
    )
    .returning(["id", "name", "type", "balance"])
    .execute();

  const accounts: AccountRow[] = insertedAccounts.map((account) => ({
    id: account.id,
    name: account.name,
    type: account.type as AccountRow["type"],
    initialBalance: Number(account.balance),
  }));

  accounts.forEach((account) => {
    console.log(`✓ ${account.name} (${account.type}) — id: ${account.id}`);
  });
  console.log();

  console.log("🏷 Creating 12 categories...");
  const categoryDefs = [
    { name: "Salary", type: "income" as const, color: "#22c55e", icon: "💼" },
    {
      name: "Freelance",
      type: "income" as const,
      color: "#10b981",
      icon: "💻",
    },
    {
      name: "Groceries",
      type: "expense" as const,
      color: "#ef4444",
      icon: "🛒",
    },
    {
      name: "Transport",
      type: "expense" as const,
      color: "#f97316",
      icon: "🚌",
    },
    {
      name: "Entertainment",
      type: "expense" as const,
      color: "#8b5cf6",
      icon: "🎬",
    },
    {
      name: "Utilities",
      type: "expense" as const,
      color: "#6366f1",
      icon: "💡",
    },
    {
      name: "Restaurants",
      type: "expense" as const,
      color: "#ec4899",
      icon: "🍔",
    },
    { name: "Health", type: "expense" as const, color: "#14b8a6", icon: "💊" },
    {
      name: "Shopping",
      type: "expense" as const,
      color: "#f59e0b",
      icon: "🛍️",
    },
    {
      name: "Education",
      type: "expense" as const,
      color: "#3b82f6",
      icon: "📚",
    },
    {
      name: "Subscriptions",
      type: "expense" as const,
      color: "#64748b",
      icon: "📱",
    },
    { name: "Gifts", type: "expense" as const, color: "#fb7185", icon: "🎁" },
  ];

  const insertedCategories = await db
    .insertInto("category")
    .values(
      categoryDefs.map((category) => ({
        id: randomUUID(),
        userId,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      })),
    )
    .returning(["id", "name", "type"])
    .execute();

  const categories: CategoryRow[] = insertedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type as CategoryRow["type"],
  }));

  categories.forEach((category) => {
    console.log(`✓ ${category.name} (${category.type}) — id: ${category.id}`);
  });
  console.log();

  const categoryByName = (name: string) => {
    const found = categories.find((item) => item.name === name);
    if (!found) throw new Error(`Missing category: ${name}`);
    return found;
  };

  const accountByName = (name: string) => {
    const found = accounts.find((item) => item.name === name);
    if (!found) throw new Error(`Missing account: ${name}`);
    return found;
  };

  const accountPool = accounts.filter(
    (account) => account.name !== "Savings Jar",
  );

  console.log(
    "💸 Creating transactions for budgets, analytics, and filters...",
  );
  const transactions: TransactionInput[] = [];

  const julyBudgetGroups = [
    {
      categoryName: "Groceries",
      amounts: [450, 350, 400, 300, 550, 250, 400, 450],
    },
    {
      categoryName: "Transport",
      amounts: [250, 180, 220, 190, 260, 200, 230, 240, 320, 190, 220, 260],
    },
    { categoryName: "Entertainment", amounts: [500, 300, 600, 400, 450, 550] },
  ];

  const julyBase = new Date(2026, 6, 1);
  julyBudgetGroups.forEach((group, groupIndex) => {
    group.amounts.forEach((amount, index) => {
      const day = groupIndex * 7 + index + 3;
      transactions.push({
        id: randomUUID(),
        userId,
        accountId: accountPool[(index + groupIndex) % accountPool.length].id,
        categoryId: categoryByName(group.categoryName).id,
        amount: money(amount),
        type: "expense",
        date: new Date(
          toIsoDate(
            new Date(julyBase.getFullYear(), julyBase.getMonth(), day),
          ) + "T12:00:00.000Z",
        ),
        description: `${group.categoryName} ${index + 1}`,
      });
    });
  });

  const incomeMonths = [
    new Date(2026, 4, 1),
    new Date(2026, 5, 1),
    new Date(2026, 6, 1),
  ];
  incomeMonths.forEach((date, index) => {
    transactions.push({
      id: randomUUID(),
      userId,
      accountId: accountByName("Monobank Card").id,
      categoryId: categoryByName("Salary").id,
      amount: money(37_000 + index * 2_000 + 500),
      type: "income",
      date: new Date(toIsoDate(date) + "T12:00:00.000Z"),
      description: `Salary ${date.toLocaleString("en-US", { month: "short", year: "numeric" })}`,
    });
  });

  const monthlyExpensePlans = [
    { month: "2025-08", count: 8 },
    { month: "2025-09", count: 8 },
    { month: "2025-10", count: 8 },
    { month: "2025-11", count: 8 },
    { month: "2025-12", count: 8 },
    { month: "2026-01", count: 9 },
    { month: "2026-02", count: 9 },
    { month: "2026-03", count: 8 },
    { month: "2026-04", count: 8 },
    { month: "2026-05", count: 8 },
    { month: "2026-06", count: 12 },
  ];

  const expenseCategories = [
    "Groceries",
    "Transport",
    "Entertainment",
    "Utilities",
    "Restaurants",
    "Health",
    "Shopping",
    "Education",
    "Subscriptions",
  ];

  monthlyExpensePlans.forEach((plan, planIndex) => {
    const monthDate = new Date(2025, 7 + planIndex, 1);
    const monthLabel = monthDate.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    for (let expenseIndex = 0; expenseIndex < plan.count; expenseIndex += 1) {
      const categoryName =
        expenseCategories[
          (planIndex + expenseIndex) % expenseCategories.length
        ];
      const category = categoryByName(categoryName);
      const amount = money(
        categoryName === "Groceries"
          ? 220 + expenseIndex * 45
          : categoryName === "Transport"
            ? 90 + expenseIndex * 35
            : categoryName === "Entertainment"
              ? 300 + expenseIndex * 70
              : categoryName === "Utilities"
                ? 350 + expenseIndex * 60
                : categoryName === "Restaurants"
                  ? 180 + expenseIndex * 40
                  : categoryName === "Health"
                    ? 200 + expenseIndex * 55
                    : categoryName === "Shopping"
                      ? 300 + expenseIndex * 65
                      : categoryName === "Education"
                        ? 250 + expenseIndex * 45
                        : 130 + expenseIndex * 30,
      );

      transactions.push({
        id: randomUUID(),
        userId,
        accountId:
          accountPool[(planIndex + expenseIndex) % accountPool.length].id,
        categoryId: category.id,
        amount,
        type: "expense",
        date: new Date(
          toIsoDate(
            new Date(
              monthDate.getFullYear(),
              monthDate.getMonth(),
              5 + expenseIndex * 2,
            ),
          ) + "T12:00:00.000Z",
        ),
        description: `${categoryName} ${monthLabel}`,
      });
    }
  });

  const freelanceIncomeCount = 27;
  for (
    let freelanceIndex = 0;
    freelanceIndex < freelanceIncomeCount;
    freelanceIndex += 1
  ) {
    const monthDate = new Date(
      2025,
      7 + (freelanceIndex % 11),
      2 + (freelanceIndex % 5) * 2,
    );
    transactions.push({
      id: randomUUID(),
      userId,
      accountId: accountPool[(freelanceIndex + 1) % accountPool.length].id,
      categoryId: categoryByName("Freelance").id,
      amount: money(5_000 + freelanceIndex * 300 + 400),
      type: "income",
      date: new Date(toIsoDate(monthDate) + "T12:00:00.000Z"),
      description: `Freelance ${freelanceIndex + 1}`,
    });
  }

  const julyExpenseCount = transactions.filter(
    (transaction) =>
      transaction.type === "expense" && transaction.date.getMonth() === 6,
  ).length;
  const currentMonthCount = transactions.filter(
    (transaction) => transaction.date.getMonth() === 6,
  ).length;

  console.log(
    `✓ July 2026 transactions: ${currentMonthCount} (${julyExpenseCount} expenses)`,
  );
  const monthSummary = monthlyExpensePlans.map((plan, index) => {
    const monthStart = new Date(2025, 7 + index, 1);
    return `${monthStart.toLocaleString("en-US", { month: "short", year: "numeric" })}: ${transactions.filter((transaction) => transaction.date.getMonth() === monthStart.getMonth() && transaction.date.getFullYear() === monthStart.getFullYear()).length}`;
  });

  monthSummary.forEach((line) => console.log(`✓ ${line}`));
  console.log();

  console.log("🔀 Inserting transactions in batches...");
  for (let index = 0; index < transactions.length; index += BATCH_SIZE) {
    await db
      .insertInto("transaction")
      .values(transactions.slice(index, index + BATCH_SIZE))
      .execute();
  }
  console.log(`✓ ${transactions.length} transactions inserted`);
  console.log();

  console.log("🎯 Creating budgets...");
  const budgets = [
    { categoryName: "Groceries", amount: 8000, month: "2026-07" },
    { categoryName: "Transport", amount: 3000, month: "2026-07" },
    { categoryName: "Entertainment", amount: 2000, month: "2026-07" },
    { categoryName: "Groceries", amount: 7500, month: "2026-06" },
    { categoryName: "Salary", amount: 40000, month: "2026-06" },
  ];

  await db
    .insertInto("budget")
    .values(
      budgets.map((budget) => ({
        id: randomUUID(),
        userId,
        categoryId: categoryByName(budget.categoryName).id,
        amount: budget.amount,
        month: budget.month,
      })),
    )
    .execute();

  budgets.forEach((budget) => {
    console.log(
      `✓ ${budget.categoryName} ${budget.month}: limit ₴${budget.amount}`,
    );
  });
  console.log();

  console.log("💰 Recalculating account balances...");
  const balanceMap = new Map(
    accounts.map((account) => [account.id, account.initialBalance]),
  );
  for (const transaction of transactions) {
    const delta =
      transaction.type === "income" ? transaction.amount : -transaction.amount;
    const current = balanceMap.get(transaction.accountId) ?? 0;
    balanceMap.set(transaction.accountId, money(current + delta));
  }

  for (const account of accounts) {
    const finalBalance = balanceMap.get(account.id) ?? account.initialBalance;
    await db
      .updateTable("financialAccount")
      .set({ balance: money(finalBalance) })
      .where("id", "=", account.id)
      .execute();
    console.log(
      `✓ ${account.name}: ₴${money(finalBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    );
  }
  console.log();

  console.log("✅ Seed complete!");
  console.log("Accounts:     4");
  console.log("Categories:   12");
  console.log(`Transactions: ${transactions.length}`);
  console.log("Budgets:      5");
  console.log();
  console.log("📊 Budget states for testing:");
  console.log("🟢 Groceries: ~44% (GREEN)");
  console.log("🟡 Transport: ~90% (YELLOW)");
  console.log("🔴 Entertainment: ~140% (RED)");
  console.log();
  console.log("🧪 Deletion testing:");
  console.log('✓ Account "Savings Jar" has no transactions (can delete)');
  console.log('✓ Category "Gifts" has no transactions (can delete)');
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
