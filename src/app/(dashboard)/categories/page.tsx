import type { Metadata } from "next";
import { CategoriesWidget } from "@/widgets/categories/ui/CategoriesWidget";

export const metadata: Metadata = {
  title: "Categories | FinanceApp",
};

export default function CategoriesPage() {
  return <CategoriesWidget />;
}
