import { Card } from "./Card";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2 } from "lucide-react";

interface BudgetProgressCardProps {
  categoryName: string;
  categoryColor: string | null;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
  remaining: number;
  status: "ok" | "warning" | "exceeded";
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetProgressCard({
  categoryName,
  categoryColor,
  limitAmount,
  spentAmount,
  percentage,
  remaining,
  status,
  onEdit,
  onDelete,
}: BudgetProgressCardProps) {
  const formatMoney = (val: number) =>
    val.toLocaleString("uk-UA", { style: "currency", currency: "UAH" });

  let progressColor = "bg-green-500";
  if (status === "warning") progressColor = "bg-yellow-500";
  if (status === "exceeded") progressColor = "bg-red-500";

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: categoryColor ?? "#ccc" }}
          />
          <span className="font-semibold text-foreground">{categoryName}</span>
        </div>
        <div className="flex gap-2 text-gray-02">
          {onEdit && (
            <button
              onClick={onEdit}
              className="hover:text-primary transition-colors"
              aria-label="Edit budget"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="hover:text-red-500 transition-colors"
              aria-label="Delete budget"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-02">
        <span className="font-medium text-foreground">{formatMoney(spentAmount)}</span> spent of{" "}
        {formatMoney(limitAmount)} limit
      </div>

      <div className="mb-2 flex items-center gap-4">
        <Progress 
          value={Math.min(percentage, 100)} 
          className="h-2 flex-1" 
          indicatorClassName={progressColor}
        />
        <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
      </div>

      <div className="text-right text-sm">
        {status === "exceeded" ? (
          <span className="text-red-500 font-medium">
            Over budget by {formatMoney(Math.abs(remaining))}
          </span>
        ) : (
          <span className="text-gray-02">
            {formatMoney(remaining)} remaining
          </span>
        )}
      </div>
    </Card>
  );
}
