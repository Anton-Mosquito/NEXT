import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecentTransactionsCard } from "./OverviewSections";

const transactions = [
  {
    id: "income-1",
    amount: "1250",
    type: "income",
    date: new Date("2026-01-12T00:00:00.000Z"),
    description: "Monthly salary",
    categoryName: "Salary",
    categoryColor: "#299d91",
    categoryIcon: null,
    accountName: "Main account",
  },
  {
    id: "expense-1",
    amount: "42.5",
    type: "expense",
    date: new Date("2026-01-11T00:00:00.000Z"),
    description: "Groceries",
    categoryName: "Food",
    categoryColor: "#e73d1c",
    categoryIcon: null,
    accountName: "Main account",
  },
] satisfies Parameters<typeof RecentTransactionsCard>[0]["transactions"];

describe("RecentTransactionsCard", () => {
  it("shows all recent transactions by default and filters by selected type", async () => {
    const user = userEvent.setup();

    render(
      <RecentTransactionsCard
        transactions={transactions}
        isLoading={false}
        hasError={false}
      />,
    );

    expect(screen.getByText("Monthly salary")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Revenue" }));

    expect(screen.getByText("Monthly salary")).toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revenue" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Expenses" }));

    expect(screen.queryByText("Monthly salary")).not.toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("shows a useful empty state when no transactions match the filter", async () => {
    const user = userEvent.setup();

    render(
      <RecentTransactionsCard
        transactions={[]}
        isLoading={false}
        hasError={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Expenses" }));

    expect(screen.getByText("No expenses yet.")).toBeInTheDocument();
  });
});
