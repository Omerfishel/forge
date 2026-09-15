import { budgetSummary, costLines, toUsd } from "@/lib/budget";
import { bundle } from "./fixtures";

describe("budget", () => {
  it("converts currencies roughly", () => {
    expect(toUsd(100, "USD")).toBe(100);
    expect(toUsd(100, "ILS")).toBe(27);
    expect(toUsd(undefined, "USD")).toBeNull();
  });
  it("lists paid resources with free alternatives and planned flags", () => {
    const lines = costLines(bundle, { "t2-c": { itemId: "t2-c", itemType: "resource", status: "in_progress", updatedAt: "" } });
    expect(lines.map((l) => l.resource.id)).toEqual(["t1-b", "t2-c"]);
    expect(lines[0].freeAlternative?.id).toBe("t1-a");
    expect(lines[0].planned).toBe(false);
    expect(lines[1].recurring).toBe(true);
    expect(lines[1].planned).toBe(true);
  });
  it("summarises totals by cost model", () => {
    const s = budgetSummary(bundle, {});
    expect(s.totalUsd).toBe(170);
    expect(s.recurringUsd).toBe(120);
    expect(s.plannedUsd).toBe(0);
    expect(s.freeCount).toBe(2);
    expect(s.paidCount).toBe(2);
    expect(s.withFreeAlt).toBe(1);
    expect(s.byModel.one_time).toEqual({ count: 1, usd: 50 });
    expect(s.byModel.subscription).toEqual({ count: 1, usd: 120 });
  });
});
