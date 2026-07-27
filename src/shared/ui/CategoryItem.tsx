import { Trash2 } from "lucide-react";
import { Badge } from "./Badge";

interface CategoryItemProps {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string | null;
  icon: string | null;
  onDelete?: (id: string, name: string) => void;
}

export function CategoryItem({
  id,
  name,
  type,
  color,
  icon,
  onDelete,
}: CategoryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color ?? "#6b7280" }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          {icon ? <span className="text-sm">{icon}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={type === "income" ? "success" : "danger"}>
          {type === "income" ? "Income" : "Expense"}
        </Badge>
        <button
          type="button"
          onClick={() => onDelete?.(id, name)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          aria-label={`Delete ${name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
