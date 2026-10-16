import { buildSavingsProgress } from "../savingsProgress";

describe("buildSavingsProgress", () => {
  it("returns cumulative daily net savings for matching month-to-date days", () => {
    const dailyNet = new Map([
      ["2026-10-01", 100],
      ["2026-10-02", -25],
      ["2026-09-01", 40],
      ["2026-09-02", 60],
    ]);

    const result = buildSavingsProgress(
      dailyNet,
      new Date("2026-10-02T12:00:00.000Z"),
    );

    expect(result).toEqual({
      currentTotal: 75,
      points: [
        { day: "01", current: 100, previous: 40 },
        { day: "02", current: 75, previous: 100 },
      ],
    });
  });

  it("clamps the matching comparison day when the previous month is shorter", () => {
    const dailyNet = new Map([
      ["2026-03-31", 200],
      ["2026-02-28", 50],
      ["2026-02-27", 20],
    ]);
    dailyNet.set("2026-02-01", 5);

    const result = buildSavingsProgress(
      dailyNet,
      new Date("2026-03-31T12:00:00.000Z"),
    );

    expect(result.currentTotal).toBe(200);
    expect(result.points).toHaveLength(31);
    expect(result.points[30]).toEqual({
      day: "31",
      current: 200,
      previous: 75,
    });
  });
});
