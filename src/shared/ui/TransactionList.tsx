import { cn } from "@/lib/utils";
import {
  Gamepad2,
  ShoppingBag,
  UtensilsCrossed,
  Clapperboard,
  Bus,
  Pizza,
  Keyboard,
} from "lucide-react";
import { TransactionItem, type TransactionItemProps } from "./TransactionItem";

export type Transaction = Omit<TransactionItemProps, "variant" | "className">;

interface TransactionListProps {
  transactions?: Transaction[];
  className?: string;
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    icon: <Gamepad2 size={20} />,
    name: "GTR 5",
    shopName: "Gadget & Gear",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$160.00",
  },
  {
    icon: <ShoppingBag size={20} />,
    name: "Polo shirt",
    shopName: "XL fashions",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$20.00",
  },
  {
    icon: <UtensilsCrossed size={20} />,
    name: "Biriyani",
    shopName: "Hajir Biriyani",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$12.00",
  },
  {
    icon: <Clapperboard size={20} />,
    name: "Movie ticket",
    shopName: "Inox",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$15.00",
  },
  {
    icon: <Bus size={20} />,
    name: "Taxi fare",
    shopName: "Uber",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$10.00",
  },
  {
    icon: <Pizza size={20} />,
    name: "Pizza",
    shopName: "Pizza Hit",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$20.00",
  },
  {
    icon: <Keyboard size={20} />,
    name: "Keyboard",
    shopName: "Gadget & Gear",
    date: "17 May, 2023",
    paymentMethod: "Credit Card",
    amount: "$30.00",
  },
];

const COLUMNS = [
  "Items",
  "Shop Name",
  "Date",
  "Payment Method",
  "Amount",
] as const;

export function TransactionList({
  transactions = DEFAULT_TRANSACTIONS,
  className,
}: TransactionListProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-bg-special bg-card",
        className,
      )}
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-bg-special">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className={cn(
                  "px-4 py-4 text-heading-md text-gray-01",
                  col === "Amount" ? "text-right" : "text-left",
                )}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <TransactionItem key={`${tx.name}-${i}`} variant="row" {...tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
