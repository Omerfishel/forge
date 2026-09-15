import { calcStreak, drillDue, drillStreak, heatmap, periodKey, recentTotal } from "@/lib/streaks";
import { D_BI, D_DAY, D_MONTH, D_WEEK } from "./fixtures";

const NOW = "2026-09-16"; // Wednesday

describe("streaks", () => {
  it("counts consecutive active days ending today", () => {
    expect(calcStreak({ "2026-09-16": 1, "2026-09-15": 2, "2026-09-14": 1 }, NOW)).toBe(3);
  });
  it("keeps a streak alive when today is still empty but yesterday was active", () => {
    expect(calcStreak({ "2026-09-15": 1, "2026-09-14": 1 }, NOW)).toBe(2);
    expect(calcStreak({ "2026-09-14": 1 }, NOW)).toBe(0); // gap of a day breaks it
    expect(calcStreak({}, NOW)).toBe(0);
  });
  it("period keys bucket dates correctly", () => {
    expect(periodKey("daily", "2026-09-16")).toBe("2026-09-16");
    expect(periodKey("weekly", "2026-09-16")).toBe("2026-09-14");
    expect(periodKey("weekly", "2026-09-20")).toBe("2026-09-14"); // Sunday same ISO week
    expect(periodKey("weekly", "2026-09-21")).toBe("2026-09-21");
    expect(periodKey("monthly", "2026-09-03")).toBe("2026-09");
    expect(periodKey("biweekly", "2026-09-14")).toBe(periodKey("biweekly", "2026-09-27"));
    expect(periodKey("biweekly", "2026-09-14")).not.toBe(periodKey("biweekly", "2026-09-28"));
  });
  it("drillDue respects the cadence window", () => {
    expect(drillDue(D_WEEK, undefined, NOW)).toBe(true);
    expect(drillDue(D_WEEK, ["2026-09-14"], NOW)).toBe(false); // logged Monday this week
    expect(drillDue(D_WEEK, ["2026-09-13"], NOW)).toBe(true); // last week
    expect(drillDue(D_DAY, ["2026-09-15"], NOW)).toBe(true);
    expect(drillDue(D_DAY, ["2026-09-16"], NOW)).toBe(false);
    expect(drillDue(D_MONTH, ["2026-09-01"], NOW)).toBe(false);
    expect(drillDue(D_BI, ["2026-09-03"], NOW)).toBe(true);
  });
  it("drillStreak counts consecutive periods", () => {
    expect(drillStreak(D_WEEK, ["2026-09-14", "2026-09-08", "2026-08-31"], NOW)).toBe(3);
    expect(drillStreak(D_WEEK, ["2026-09-08", "2026-08-31"], NOW)).toBe(2); // current week not yet done, still alive
    expect(drillStreak(D_WEEK, ["2026-08-31"], NOW)).toBe(0); // missed last week
    expect(drillStreak(D_DAY, ["2026-09-16", "2026-09-15", "2026-09-13"], NOW)).toBe(2);
    expect(drillStreak(D_DAY, [], NOW)).toBe(0);
  });
  it("heatmap levels and recent totals", () => {
    const hm = heatmap({ "2026-09-16": 5, "2026-09-15": 1, "2026-09-14": 3 }, 7, NOW);
    expect(hm).toHaveLength(7);
    expect(hm[6]).toEqual({ key: "2026-09-16", count: 5, level: 4 });
    expect(hm[5].level).toBe(1);
    expect(hm[4].level).toBe(3);
    expect(hm[0].level).toBe(0);
    expect(recentTotal({ "2026-09-16": 5, "2026-09-15": 1, "2026-09-01": 9 }, 7, NOW)).toBe(6);
  });
});
