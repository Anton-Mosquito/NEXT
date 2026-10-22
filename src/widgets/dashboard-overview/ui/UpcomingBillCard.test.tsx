import { render, screen, within } from "@testing-library/react";
import { UpcomingBillCard } from "./OverviewSections";

const bills = [
  {
    id: "overdue-bill",
    userId: "user-1",
    vendorName: "Figma",
    title: "Figma yearly plan",
    description: "Design subscription",
    dueDate: "2023-05-15",
    lastChargeDate: "2022-05-14",
    amount: "150",
    currency: "USD",
    status: "unpaid",
    paidAt: null,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  },
  {
    id: "upcoming-bill",
    userId: "user-1",
    vendorName: "Utilities",
    title: "Electricity",
    description: "Monthly utility bill",
    dueDate: "2099-05-16",
    lastChargeDate: null,
    amount: "75",
    currency: "USD",
    status: "unpaid",
    paidAt: null,
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  },
  {
    id: "paid-bill",
    userId: "user-1",
    vendorName: "Internet",
    title: "Paid Internet",
    description: "Already paid",
    dueDate: "2026-05-01",
    lastChargeDate: null,
    amount: "30",
    currency: "USD",
    status: "paid",
    paidAt: new Date("2026-05-01T00:00:00.000Z"),
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  },
] satisfies Parameters<typeof UpcomingBillCard>[0]["bills"];

describe("UpcomingBillCard", () => {
  it("shows unpaid bills, including overdue ones, and excludes paid bills", () => {
    render(
      <UpcomingBillCard bills={bills} isLoading={false} hasError={false} />,
    );

    expect(screen.getByText("Figma yearly plan")).toBeInTheDocument();
    expect(screen.getByText("Electricity")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.queryByText("Paid Internet")).not.toBeInTheDocument();

    const rows = screen.getAllByRole("listitem");
    expect(within(rows[0]).getByText("Figma yearly plan")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Electricity")).toBeInTheDocument();
  });

  it("shows the empty state when there are no unpaid bills", () => {
    render(
      <UpcomingBillCard
        bills={bills.filter((bill) => bill.status === "paid")}
        isLoading={false}
        hasError={false}
      />,
    );

    expect(screen.getByText("No upcoming bills")).toBeInTheDocument();
  });
});
