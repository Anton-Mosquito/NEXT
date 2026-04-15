import {
  Home,
  ShoppingCart,
  Bus,
  Clapperboard,
  ShoppingBag,
  LayoutGrid,
} from "lucide-react";
import { ExpenseCard } from "./ExpenseCard";
import type { ExpenseItem } from "./ExpenseCard";
import { cn } from "@/lib/utils";

interface ExpenseCategory {
  icon: React.ReactNode;
  category: string;
  totalAmount: string;
  changePercent: string;
  trend: "up" | "down";
  items: ExpenseItem[];
}

interface ExpensesBreakdownProps {
  title?: string;
  categories?: ExpenseCategory[];
  className?: string;
}

const DEFAULT_DATE = "17 May 2023";

const defaultCategories: ExpenseCategory[] = [
  {
    icon: <Home size={24} />,
    category: "Housing",
    totalAmount: "$250.00",
    changePercent: "15%",
    trend: "up",
    items: [
      { label: "House Rent", amount: "$230.00", date: DEFAULT_DATE },
      { label: "Parking",    amount: "$20.00",  date: DEFAULT_DATE },
    ],
  },
  {
    icon: <ShoppingCart size={24} />,
    category: "Food",
    totalAmount: "$350.00",
    changePercent: "08%",
    trend: "down",
    items: [
      { label: "Grocery",         amount: "$230.00", date: DEFAULT_DATE },
      { label: "Restaurant bill", amount: "$120.00", date: DEFAULT_DATE },
    ],
  },
  {
    icon: <Bus size={24} />,
    category: "Transportation",
    totalAmount: "$50.00",
    changePercent: "12%",
    trend: "down",
    items: [
      { label: "Taxi Fare",      amount: "$30.00", date: DEFAULT_DATE },
      { label: "Metro Card bill", amount: "$20.00", date: DEFAULT_DATE },
    ],
  },
  {
    icon: <Clapperboard size={24} />,
    category: "Entertainment",
    totalAmount: "$80.00",
    changePercent: "15%",
    trend: "down",
    items: [
      { label: "Movie ticket", amount: "$30.00", date: DEFAULT_DATE },
      { label: "iTunes",       amount: "$50.00", date: DEFAULT_DATE },
    ],
  },
  {
    icon: <ShoppingBag size={24} />,
    category: "Shopping",
    totalAmount: "$420.00",
    changePercent: "25%",
    trend: "up",
    items: [
      { label: "Shirt", amount: "$230.00", date: DEFAULT_DATE },
      { label: "Jeans", amount: "$190.00", date: DEFAULT_DATE },
    ],
  },
  {
    icon: <LayoutGrid size={24} />,
    category: "Others",
    totalAmount: "$50.00",
    changePercent: "23%",
    trend: "up",
    items: [
      { label: "Donation", amount: "$30.00", date: DEFAULT_DATE },
      { label: "Gift",     amount: "$20.00", date: DEFAULT_DATE },
    ],
  },
];

export function ExpensesBreakdown({
  title = "Expenses Breakdown",
  categories = defaultCategories,
  className,
}: ExpensesBreakdownProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {title && <h2 className="text-heading-lg text-foreground">{title}</h2>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <ExpenseCard key={cat.category} {...cat} />
        ))}
      </div>
    </section>
  );
}
