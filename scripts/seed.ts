// scripts/seed.ts
// Database seed script for the Expense Tracker.
//
// Creates 1 user → 3 financial accounts → 8 categories → 100 transactions.
// All data is scoped to a single seed user so FK constraints are respected.
//
// IMPORTANT: This script creates its own Pool + Kysely instance directly
// (instead of importing from shared/lib/kysely.ts) to bypass the
// `server-only` guard, which throws when imported outside of Next.js RSC.
//
// Usage:
//   npm run db:seed
//   npx tsx --env-file=.env.local scripts/seed.ts

import { Kysely, PostgresDialect, CamelCasePlugin, sql } from "kysely";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import type { Database } from "../src/shared/types/database";

// ── DB Connection ─────────────────────────────────────────────────────────────
// Mirrors the pattern in src/shared/lib/kysely-migrate.ts exactly.

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌  DATABASE_URL environment variable is not set");
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Pick a random element from an array. */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Return a random number between min and max (inclusive), rounded to 2 dp. */
function randAmount(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// ── Category definitions ──────────────────────────────────────────────────────
// Defined statically so we can attach realistic amount ranges.

interface CategoryDef {
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
}

const CATEGORY_DEFS: CategoryDef[] = [
  // ── Expense categories ───────────────────────────────────────────────────
  {
    name: "Groceries",
    type: "expense",
    color: "#4ade80",
    icon: "ShoppingCart",
    minAmount: 200,
    maxAmount: 2500,
  },
  {
    name: "Transport",
    type: "expense",
    color: "#60a5fa",
    icon: "Car",
    minAmount: 50,
    maxAmount: 500,
  },
  {
    name: "Entertainment",
    type: "expense",
    color: "#f472b6",
    icon: "Gamepad2",
    minAmount: 100,
    maxAmount: 3000,
  },
  {
    name: "Utilities",
    type: "expense",
    color: "#fb923c",
    icon: "Zap",
    minAmount: 500,
    maxAmount: 3000,
  },
  {
    name: "Restaurants",
    type: "expense",
    color: "#e879f9",
    icon: "UtensilsCrossed",
    minAmount: 150,
    maxAmount: 1500,
  },
  {
    name: "Health",
    type: "expense",
    color: "#f87171",
    icon: "HeartPulse",
    minAmount: 200,
    maxAmount: 5000,
  },
  // ── Income categories ────────────────────────────────────────────────────
  {
    name: "Salary",
    type: "income",
    color: "#34d399",
    icon: "Briefcase",
    minAmount: 25000,
    maxAmount: 45000,
  },
  {
    name: "Freelance",
    type: "income",
    color: "#a78bfa",
    icon: "Laptop",
    minAmount: 5000,
    maxAmount: 15000,
  },
];

// ── Description generators ────────────────────────────────────────────────────
// Return a realistic description string for a given category.

function makeDescription(categoryName: string): string {
  switch (categoryName) {
    case "Groceries":
      return faker.helpers.arrayElement([
        `${faker.company.name()} supermarket`,
        `Weekly groceries at ${faker.location.city()} market`,
        `${faker.commerce.productName()} & essentials`,
      ]);
    case "Transport":
      return faker.helpers.arrayElement([
        `Uber ride to ${faker.location.city()}`,
        `Monthly transit pass`,
        `Fuel top-up at ${faker.company.name()}`,
        `Train ticket — ${faker.location.city()} → ${faker.location.city()}`,
      ]);
    case "Entertainment":
      return faker.helpers.arrayElement([
        `${faker.music.songName()} concert tickets`,
        `Netflix / Spotify subscription`,
        `Cinema — ${faker.lorem.words(3)}`,
        `Steam game purchase`,
      ]);
    case "Utilities":
      return faker.helpers.arrayElement([
        `Electricity bill — ${faker.date.month()}`,
        `Internet & phone plan`,
        `Gas bill — ${faker.date.month()}`,
        `Water and sewage payment`,
      ]);
    case "Restaurants":
      return faker.helpers.arrayElement([
        `Lunch at ${faker.company.name()}`,
        `Dinner — ${faker.location.city()} bistro`,
        `Coffee & pastry — ${faker.company.name()}`,
        `Team lunch outing`,
      ]);
    case "Health":
      return faker.helpers.arrayElement([
        `Pharmacy — ${faker.commerce.productName()}`,
        `Doctor visit — ${faker.person.jobTitle()} specialist`,
        `Gym membership — ${faker.date.month()}`,
        `Dental check-up`,
      ]);
    case "Salary":
      return faker.helpers.arrayElement([
        `Monthly salary — ${faker.date.month()}`,
        `Salary deposit from ${faker.company.name()}`,
      ]);
    case "Freelance":
      return faker.helpers.arrayElement([
        `Freelance project — ${faker.company.buzzPhrase()}`,
        `Client payment — ${faker.company.name()}`,
        `Design contract — ${faker.lorem.words(2)}`,
      ]);
    default:
      return faker.lorem.sentence();
  }
}

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n🌱  Starting database seed...\n");

  // ── Step 1: Clear existing expense tracker data ──────────────────────────
  // We only clear the three expense tracker tables, NOT Auth.js tables.
  // TRUNCATE in dependency order: transaction first, then its parents.
  console.log("🗑   Clearing existing expense tracker data...");
  await sql`TRUNCATE TABLE transaction, financial_account, category RESTART IDENTITY CASCADE`.execute(
    db,
  );
  console.log("    ✓ transaction, financial_account, category cleared\n");

  // ── Step 2: Create seed user ─────────────────────────────────────────────
  console.log("👤  Creating seed user...");

  const seedEmail = "seed.user@expensetracker.dev";
  const seedName = "Alex Seedman";

  // Use INSERT … ON CONFLICT DO UPDATE so re-running the seed always refreshes
  // the user row and returns the existing id if the email already exists.
  const userResult = await db
    .insertInto("user")
    .values({
      id: sql<string>`gen_random_uuid()::text`,
      name: seedName,
      email: seedEmail,
      emailVerified: null,
      image: faker.image.avatar(),
    })
    .onConflict((oc) => oc.column("email").doUpdateSet({ name: seedName }))
    .returning("id")
    .executeTakeFirstOrThrow();

  const userId = userResult.id;
  console.log(`    ✓ User "${seedName}" <${seedEmail}>\n`);

  // ── Step 3: Create financial accounts ────────────────────────────────────
  console.log("🏦  Creating 3 financial accounts...");

  const accountDefs = [
    { name: "Main Card", type: "card" as const, balance: 14_850.0 },
    { name: "Cash", type: "cash" as const, balance: 3_200.0 },
    { name: "Savings", type: "crypto" as const, balance: 51_000.0 },
  ];

  const accounts = await db
    .insertInto("financialAccount")
    .values(
      accountDefs.map((a) => ({
        id: sql<string>`gen_random_uuid()::text`,
        userId,
        name: a.name,
        type: a.type,
        balance: a.balance,
        currency: "UAH",
      })),
    )
    .returning(["id", "name", "type"])
    .execute();

  accounts.forEach((a) =>
    console.log(`    ✓ ${a.name} (${a.type}) — id: ${a.id}`),
  );
  console.log();

  // ── Step 4: Create categories ─────────────────────────────────────────────
  console.log("🏷   Creating 8 categories...");

  const categoryRows = await db
    .insertInto("category")
    .values(
      CATEGORY_DEFS.map((c) => ({
        id: sql<string>`gen_random_uuid()::text`,
        name: c.name,
        type: c.type,
        color: c.color,
        icon: c.icon,
      })),
    )
    .returning(["id", "name", "type"])
    .execute();

  categoryRows.forEach((c) =>
    console.log(`    ✓ ${c.name} (${c.type}) — id: ${c.id}`),
  );
  console.log();

  // Merge DB rows with the amount ranges from CATEGORY_DEFS for use below.
  const categoriesWithRanges = categoryRows.map((row) => {
    const def = CATEGORY_DEFS.find((d) => d.name === row.name)!;
    return { ...row, minAmount: def.minAmount, maxAmount: def.maxAmount };
  });

  const incomeCategories = categoriesWithRanges.filter(
    (c) => c.type === "income",
  );
  const expenseCategories = categoriesWithRanges.filter(
    (c) => c.type === "expense",
  );

  // ── Step 5: Generate 100 transactions ────────────────────────────────────
  console.log("💸  Generating 100 transactions over the last 90 days...");

  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // We want a realistic ratio: ~20% income, ~80% expense.
  const TRANSACTION_COUNT = 100;
  const INCOME_COUNT = 20;

  const transactionValues = Array.from(
    { length: TRANSACTION_COUNT },
    (_, i) => {
      const isIncome = i < INCOME_COUNT;
      const category = isIncome
        ? pick(incomeCategories)
        : pick(expenseCategories);
      const account = pick(accounts);
      const amount = randAmount(category.minAmount, category.maxAmount);
      const date = faker.date.between({ from: ninetyDaysAgo, to: now });

      return {
        id: sql<string>`gen_random_uuid()::text`,
        userId,
        accountId: account.id,
        categoryId: category.id,
        amount,
        type: category.type,
        date,
        description: makeDescription(category.name),
      };
    },
  );

  // Insert in a single batch for performance.
  await db.insertInto("transaction").values(transactionValues).execute();

  const incomeTxns = transactionValues.filter(
    (t) => t.type === "income",
  ).length;
  const expenseTxns = transactionValues.filter(
    (t) => t.type === "expense",
  ).length;

  console.log(`    ✓ ${TRANSACTION_COUNT} transactions inserted`);
  console.log(`      — ${incomeTxns} income`);
  console.log(`      — ${expenseTxns} expense\n`);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log("✅  Seeding complete!\n");
  console.log("    Summary:");
  console.log(`      Users            : 1`);
  console.log(`      Financial accounts: ${accounts.length}`);
  console.log(`      Categories       : ${categoryRows.length}`);
  console.log(`      Transactions     : ${TRANSACTION_COUNT}\n`);
}

// ── Entry point ───────────────────────────────────────────────────────────────

seed()
  .catch((err) => {
    console.error("\n❌  Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
