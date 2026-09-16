import { test, expect } from "@playwright/test";
import { go, readStore, trackErrors } from "./helpers";

test.describe("Budget", () => {
  test("totals, filters and plan-to-buy", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/budget", "page-budget");
    await expect(page.getByTestId("budget-total")).toContainText("$");
    await expect(page.getByTestId("budget-planned")).toContainText("$0");
    await expect(page.getByTestId("budget-row-t1-evals-course")).toContainText("4,200");
    await expect(page.getByTestId("budget-row-t1-evals-course")).toContainText("Your AI Product Needs Evals");
    await page.getByTestId("budget-plan-t1-evals-course").check();
    await expect(page.getByTestId("budget-planned")).toContainText("4,200");
    await page.getByTestId("budget-filter-subscription").click();
    await expect(page.getByTestId("budget-row-t1-evals-course")).toHaveCount(0);
    await expect(page.getByTestId("budget-row-t3-reforge")).toBeVisible();
    await expect(page.getByTestId("budget-guidance")).toContainText("Reforge");
    expect(errors).toEqual([]);
  });
});

test.describe("Freshness", () => {
  test("groups resources and records a full check", async ({ page }) => {
    await go(page, "/freshness", "page-freshness");
    await expect(page.getByTestId("fresh-checked-at")).toHaveText("never");
    await expect(page.getByTestId("fresh-group-quarterly")).toContainText("OWASP");
    await expect(page.getByTestId("fresh-row-quarterly-t7-mitre-atlas")).toBeVisible();
    await page.getByTestId("fresh-mark-checked").click();
    await expect(page.getByTestId("fresh-checked-at")).not.toHaveText("never");
    await page.reload();
    await expect(page.getByTestId("fresh-checked-at")).not.toHaveText("never");
    await page.getByTestId("fresh-group-current-h").click();
    await expect(page.getByTestId("fresh-group-current")).not.toHaveClass(/col/);
  });
});

test.describe("Settings", () => {
  test("profile and plan settings save instantly and re-base the plan", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/settings", "page-settings");
    await page.getByTestId("set-name").fill("Omer F.");
    await page.getByTestId("set-start").fill("2025-06-02");
    await expect(page.getByTestId("topctx")).toContainText("Phase 3");
    await page.getByTestId("set-path").selectOption("path-variant-b");
    await expect(page.getByTestId("topctx")).toContainText("Autonomous offense");
    await expect(page.getByTestId("subline")).toContainText("12h/wk"); // path budget applied
    await page.getByTestId("set-hours").fill("15");
    await expect(page.getByTestId("subline")).toContainText("15h/wk");
    await page.getByTestId("set-role").selectOption("FDE");
    await page.getByTestId("set-pomo-focus").fill("50");
    await page.setViewportSize({ width: 1400, height: 900 });
    await expect(page.getByTestId("pomo-clock")).toHaveText("50:00");
    const store = await readStore(page);
    const s = store.settings as { name: string; hoursPerWeek: number; startDate: string; activePathId: string; roleFilter: string; pomo: { focus: number } };
    expect(s.name).toBe("Omer F."); expect(s.hoursPerWeek).toBe(15); expect(s.startDate).toBe("2025-06-02"); expect(s.activePathId).toBe("path-variant-b"); expect(s.roleFilter).toBe("FDE"); expect(s.pomo.focus).toBe(50);
    expect(errors).toEqual([]);
  });

  test("export → reset → import restores progress; garbage is rejected", async ({ page }) => {
    await go(page, "/library", "page-library");
    await page.getByTestId("lib-done-t1-karpathy-zth").check();
    await go(page, "/settings", "page-settings");
    const download = page.waitForEvent("download");
    await page.getByTestId("set-export").click();
    expect((await download).suggestedFilename()).toMatch(/forge-backup-.*\.json/);
    const json = await page.getByTestId("set-export-text").inputValue();
    expect(JSON.parse(json).progress["t1-karpathy-zth"].status).toBe("done");
    await page.getByTestId("set-reset").click();
    await page.getByTestId("confirm-yes").click();
    await expect(page.getByTestId("ov-meta")).toContainText(/^0\//);
    await page.getByTestId("set-import-text").fill("{not json");
    await page.getByTestId("set-import").click();
    await expect(page.getByTestId("toast").last()).toContainText("Invalid JSON");
    await page.getByTestId("set-import-text").fill(json);
    await page.getByTestId("set-import").click();
    await expect(page.getByTestId("toast").last()).toContainText("Imported");
    await expect(page.getByTestId("ov-meta")).toContainText(/^1\//);
    await page.reload();
    await expect(page.getByTestId("ov-meta")).toContainText(/^1\//);
  });
});
