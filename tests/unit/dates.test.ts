import { addDays, addDaysKey, diffDaysKey, isValidKey, lastNDays, monthIndex, parseKey, relTime, toKey, weekIndex, weekStartOf } from "@/lib/dates";

describe("dates", () => {
  it("round-trips keys", () => {
    expect(toKey(parseKey("2026-09-15"))).toBe("2026-09-15");
    expect(isValidKey("2026-02-30")).toBe(false);
    expect(isValidKey("2026-02-28")).toBe(true);
    expect(isValidKey("nope")).toBe(false);
  });
  it("adds days across month/year boundaries", () => {
    expect(addDaysKey("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysKey("2026-03-01", -1)).toBe("2026-02-28");
    expect(toKey(addDays(parseKey("2024-02-28"), 1))).toBe("2024-02-29");
  });
  it("diffs days", () => {
    expect(diffDaysKey("2026-09-15", "2026-09-01")).toBe(14);
    expect(diffDaysKey("2026-09-01", "2026-09-15")).toBe(-14);
  });
  it("finds Monday", () => {
    expect(toKey(weekStartOf(parseKey("2026-09-16")))).toBe("2026-09-14"); // Wed → Mon
    expect(toKey(weekStartOf(parseKey("2026-09-13")))).toBe("2026-09-07"); // Sun → previous Mon
    expect(toKey(weekStartOf(parseKey("2026-09-14")))).toBe("2026-09-14"); // Mon → itself
  });
  it("computes week/month index since start", () => {
    expect(weekIndex("2026-09-14", parseKey("2026-09-14"))).toBe(0);
    expect(weekIndex("2026-09-14", parseKey("2026-09-20"))).toBe(0);
    expect(weekIndex("2026-09-14", parseKey("2026-09-21"))).toBe(1);
    expect(weekIndex("2026-09-14", parseKey("2026-09-07"))).toBe(-1);
    expect(monthIndex("2026-09-14", parseKey("2026-12-20"))).toBe(3);
  });
  it("lists last n days oldest first", () => {
    expect(lastNDays(3, parseKey("2026-09-15"))).toEqual(["2026-09-13", "2026-09-14", "2026-09-15"]);
  });
  it("formats relative time", () => {
    const now = new Date("2026-09-15T12:00:00Z");
    expect(relTime("2026-09-15T11:59:50Z", now)).toBe("just now");
    expect(relTime("2026-09-15T11:30:00Z", now)).toBe("30m ago");
    expect(relTime("2026-09-15T09:00:00Z", now)).toBe("3h ago");
    expect(relTime("2026-09-10T12:00:00Z", now)).toBe("5d ago");
    expect(relTime("garbage", now)).toBe("");
  });
});
