import { Card, Skeleton } from "@/shared/ui";
import { cn } from "@/lib/utils";

interface MonthData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  count: number;
}

interface MonthComparison {
  current: MonthData;
  previous: MonthData;
  incomeChange: number;
  expenseChange: number;
}

interface MonthComparisonWidgetProps {
  data?: MonthComparison;
  isLoading?: boolean;
}

export function MonthComparisonWidget({ data, isLoading }: MonthComparisonWidgetProps) {
  const formatMoney = (val: number) =>
    val.toLocaleString("uk-UA", { style: "currency", currency: "UAH", maximumFractionDigits: 0 });

  const formatMonth = (m: string) => {
    if (!m) return "";
    const [y, mon] = m.split("-").map(Number);
    const d = new Date(y, mon - 1);
    return d.toLocaleString("en-US", { month: "long" });
  };

  const renderChange = (percent: number, invertColors = false) => {
    const isPositive = percent > 0;
    const isNegative = percent < 0;
    
    // For income: positive is green, negative is red.
    // For expense: positive (more expense) is red, negative (less expense) is green.
    let isGood = isPositive;
    if (invertColors) {
      isGood = isNegative;
    }

    let color = "text-gray-500";
    if (isPositive || isNegative) {
      color = isGood ? "text-green-500" : "text-red-500";
    }

    const sign = isPositive ? "+" : "";
    const arrow = isPositive ? "▲" : isNegative ? "▼" : "";
    
    return (
      <span className={cn("text-xs font-semibold ml-2", color)}>
        ({sign}{percent.toFixed(1)}% {arrow})
      </span>
    );
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <h2 className="mb-6 text-lg font-bold text-foreground">Month-over-Month</h2>

      {isLoading || !data ? (
        <div className="space-y-4 flex-1">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <div className="flex-1">
          <div className="grid grid-cols-3 text-sm mb-4 border-b pb-2">
            <div className="font-medium text-gray-02">Metric</div>
            <div className="font-semibold text-foreground text-right">{formatMonth(data.current.month)}</div>
            <div className="font-medium text-gray-02 text-right">{formatMonth(data.previous.month)}</div>
          </div>

          <div className="grid grid-cols-3 text-sm items-center py-3 border-b">
            <div className="font-medium text-gray-02">Income</div>
            <div className="font-bold text-foreground text-right">
              {formatMoney(data.current.totalIncome)}
              {renderChange(data.incomeChange)}
            </div>
            <div className="text-gray-02 text-right">{formatMoney(data.previous.totalIncome)}</div>
          </div>

          <div className="grid grid-cols-3 text-sm items-center py-3 border-b">
            <div className="font-medium text-gray-02">Expense</div>
            <div className="font-bold text-foreground text-right">
              {formatMoney(data.current.totalExpense)}
              {renderChange(data.expenseChange, true)}
            </div>
            <div className="text-gray-02 text-right">{formatMoney(data.previous.totalExpense)}</div>
          </div>

          <div className="grid grid-cols-3 text-sm items-center py-3">
            <div className="font-medium text-gray-02">Savings</div>
            <div className="font-bold text-primary text-right">
              {formatMoney(data.current.netSavings)}
            </div>
            <div className="text-gray-02 text-right">{formatMoney(data.previous.netSavings)}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
