"use client";

import { useMemo, useState } from "react";
import { Button, EmptyState, Modal } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/Skeleton";
import { CategoryItem } from "@/shared/ui/CategoryItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryForm } from "@/features/add-category/ui/AddCategoryForm";
import { DeleteCategoryDialog } from "@/features/delete-category/ui/DeleteCategoryDialog";
import { useCategoriesQuery } from "@/entities/category/api/categoryQueries";

export function CategoriesWidget() {
  const { data: categories, isLoading } = useCategoriesQuery();
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filtered = useMemo(() => {
    if (!categories) return [];
    return categories.filter((category) =>
      activeTab === "all" ? true : category.type === activeTab,
    );
  }, [activeTab, categories]);

  const isEmpty = !isLoading && filtered.length === 0;
  const skeletonItems = useMemo(
    () => Array.from({ length: 6 }, (_, index) => index),
    [],
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize your income and expense buckets.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Add Category</Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income" className="gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Income
          </TabsTrigger>
          <TabsTrigger value="expense" className="gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Expense
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {skeletonItems.map((item) => (
            <Skeleton key={item} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : null}

      {!isLoading && filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((category) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              type={category.type as "income" | "expense"}
              color={category.color}
              icon={category.icon}
              onDelete={() =>
                setDeleteTarget({ id: category.id, name: category.name })
              }
            />
          ))}
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState
          title="No categories yet"
          description="Create a category to start grouping your transactions."
          className="mt-6"
        />
      ) : null}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Category"
      >
        <AddCategoryForm onSuccess={() => setAddOpen(false)} />
      </Modal>

      <DeleteCategoryDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        categoryId={deleteTarget?.id ?? ""}
        categoryName={deleteTarget?.name ?? ""}
      />
    </div>
  );
}
