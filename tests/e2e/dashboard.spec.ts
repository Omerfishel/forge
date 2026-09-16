import { test, expect } from "@playwright/test";
import { go, readStore, seedStore, trackErrors } from "./helpers";

test.describe("Today dashboard", () => {
  test("shows the phase, pace and the first unblocked items of the primary path", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/today", "page-dashboard");
    await expect(page.getByTestId("pace-banner")).toContainText(/Right on pace|ahead|behind/);
    await expect(page.getByTestId("today-stats")).toBeVisible();
    await expect(page.getByTestId("week-list")).toBeVisible();
    // Karpathy is the first item of Phase 1 and has no content prerequisites.
    await expect(page.getByTestId("week-item-t1-karpathy-zth")).toBeVisible();
    await expect(page.getByTestId("queue-lesson")).toContainText("Neural Networks");
    // HF LLM course requires Karpathy → blocked.
    await page.getByTestId("blocked-toggle-h").click();
    await expect(page.getByTestId("blocked-list")).toContainText("Hugging Face LLM Course");
    expect(errors).toEqual([]);
  });

  test("completing a week item updates the header, streak and glance; it persists across reload", async ({ page }) => {
    await go(page, "/today", "page-dashboard");
    await page.getByTestId("week-done-t1-karpathy-zth").check();
    await expect(page.getByTestId("toast").filter({ hasText: "Done." })).toBeVisible();
    await expect(page.getByTestId("toast").filter({ hasText: "Achievement unlocked" })).toBeVisible();
    await expect(page.getByTestId("ov-meta")).toContainText(/^1\//);
    await expect(page.getByTestId("glance-today")).toHaveText("1");
    await expect(page.getByTestId("glance-streak")).toContainText("1");
    // The dependent course is now unblocked and enters the week list.
    await expect(page.getByTestId("week-item-t1-hf-llm-course")).toBeVisible();
    await page.reload();
    await expect(page.getByTestId("ov-meta")).toContainText(/^1\//);
    const store = await readStore(page);
    expect((store.progress as Record<string, { status: string }>)["t1-karpathy-zth"].status).toBe("done");
  });

  test("logging the queued drill removes it from the queue and counts as activity", async ({ page }) => {
    await go(page, "/today", "page-dashboard");
    const drill = page.getByTestId("queue-drill");
    await expect(drill).toContainText("Paper of the week");
    await page.getByTestId("queue-drill-log").click();
    await expect(page.getByTestId("toast").last()).toContainText("Logged");
    await expect(drill).not.toContainText("Paper of the week");
    await expect(page.getByTestId("glance-today")).toHaveText("1");
  });

  test("focus attaches an item to the Pomodoro; milestones can be ticked", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await go(page, "/today", "page-dashboard");
    await page.getByTestId("week-focus-t1-karpathy-zth").click();
    await expect(page.getByTestId("pomodoro")).toContainText("Neural Networks");
    await page.getByTestId("milestone-m-primary-1").check();
    await expect(page.getByTestId("milestone-row-m-primary-1")).toHaveClass(/done/);
  });

  test("switching the active path changes the week list", async ({ page }) => {
    await seedStore(page, { settings: { activePathId: "path-variant-c" } });
    await go(page, "/today", "page-dashboard");
    await expect(page.getByTestId("week-item-t5-founding-sales")).toBeVisible();
    await expect(page.getByTestId("week-item-t1-karpathy-zth")).toHaveCount(0);
  });
});
