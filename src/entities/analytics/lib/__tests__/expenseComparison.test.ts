import { createExpenseComparisonConfig } from "../expenseComparison";

describe("createExpenseComparisonConfig", () => {
  const referenceDate = new Date("2026-10-13T15:30:00.000Z");

  it("compares each day of the current week with the matching day last week", () => {
    const config = createExpenseComparisonConfig("daily", referenceDate);

    expect(config.chartBuckets).toHaveLength(7);
    expect(config.chartBuckets[0]).toMatchObject({
      label: "Mon",
      currentStart: new Date("2026-10-12T00:00:00.000Z"),
      previousStart: new Date("2026-10-05T00:00:00.000Z"),
    });
    expect(config.currentLabel).toBe("This week");
    expect(config.previousLabel).toBe("Last week");
  });

  it("compares Monday-based week buckets for this month with last month", () => {
    const config = createExpenseComparisonConfig("weekly", referenceDate);

    expect(config.chartBuckets.map((bucket) => bucket.label)).toEqual([
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
    ]);
    expect(config.chartBuckets[0]).toMatchObject({
      currentStart: new Date("2026-10-01T00:00:00.000Z"),
      currentEnd: new Date("2026-10-05T00:00:00.000Z"),
      previousStart: new Date("2026-09-01T00:00:00.000Z"),
      previousEnd: new Date("2026-09-07T00:00:00.000Z"),
    });
    expect(config.comparisonLabel).toBe("Compare to last month");
  });

  it("compares the last 12 months with the matching months one year earlier", () => {
    const config = createExpenseComparisonConfig("monthly", referenceDate);

    expect(config.chartBuckets).toHaveLength(12);
    expect(config.chartBuckets[0]).toMatchObject({
      currentStart: new Date("2025-11-01T00:00:00.000Z"),
      previousStart: new Date("2024-11-01T00:00:00.000Z"),
    });
    expect(config.currentStart).toEqual(new Date("2026-10-01T00:00:00.000Z"));
    expect(config.previousStart).toEqual(new Date("2025-10-01T00:00:00.000Z"));
    expect(config.comparisonLabel).toBe("Compare to same month last year");
  });

  it("compares current-year totals with the previous year", () => {
    const config = createExpenseComparisonConfig("yearly", referenceDate);

    expect(config.chartBuckets).toHaveLength(1);
    expect(config.currentStart).toEqual(new Date("2026-01-01T00:00:00.000Z"));
    expect(config.previousStart).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    expect(config.currentLabel).toBe("2026");
    expect(config.previousLabel).toBe("2025");
  });
});
