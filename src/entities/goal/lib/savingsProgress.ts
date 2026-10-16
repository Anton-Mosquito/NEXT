export type SavingsChartPoint = {
  day: string;
  current: number;
  previous: number;
};

export type SavingsProgress = {
  currentTotal: number;
  points: SavingsChartPoint[];
};

const formatDayKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

export function buildSavingsProgress(
  dailyNet: ReadonlyMap<string, number>,
  referenceDate: Date,
): SavingsProgress {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const today = referenceDate.getUTCDate();
  const previousMonthStart = new Date(Date.UTC(year, month - 1, 1));
  const previousMonthDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const points: SavingsChartPoint[] = [];
  let currentTotal = 0;
  let previousTotal = 0;

  for (let day = 1; day <= today; day += 1) {
    const currentDate = new Date(Date.UTC(year, month, day));
    const previousDate =
      day <= previousMonthDays
        ? new Date(
            Date.UTC(
              previousMonthStart.getUTCFullYear(),
              previousMonthStart.getUTCMonth(),
              day,
            ),
          )
        : null;
    currentTotal += dailyNet.get(formatDayKey(currentDate)) ?? 0;
    if (previousDate) {
      previousTotal += dailyNet.get(formatDayKey(previousDate)) ?? 0;
    }

    points.push({
      day: String(day).padStart(2, "0"),
      current: currentTotal,
      previous: previousTotal,
    });
  }

  return { currentTotal, points };
}
