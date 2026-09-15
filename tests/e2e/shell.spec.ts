import { test, expect } from "@playwright/test";

test.describe("app shell", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("redirects to /today and renders header, nav, rail and footer", async ({ page }) => {
    await expect(page).toHaveURL(/#\/today$/);
    await expect(page.getByTestId("header")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Forge · Product-CTO Track/ })).toBeVisible();
    await expect(page.getByTestId("nav")).toBeVisible();
    await expect(page.getByTestId("rail")).toBeVisible();
    await expect(page.getByTestId("foot")).toContainText(/resources/);
    await expect(page.getByTestId("ov-pct")).toHaveText(/\d+%/);
  });

  test("navigates through every nav entry without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const keys = ["today", "paths", "tracks", "library", "projects", "drills", "review", "reading", "notes", "assess", "compass", "progress", "budget", "freshness", "settings"];
    for (const k of keys) {
      await page.getByTestId(`nav-${k}`).click();
      await expect(page.getByTestId(`nav-${k}`)).toHaveClass(/sel/);
      await expect(page.getByTestId("main")).not.toBeEmpty();
    }
    expect(errors).toEqual([]);
  });

  test("theme toggle flips data-theme and persists across reload", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByTestId("btn-theme").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("rail can be hidden and shown", async ({ page }) => {
    await page.getByTestId("btn-rail").click();
    await expect(page.getByTestId("rail")).toHaveCount(0);
    await page.getByTestId("btn-rail").click();
    await expect(page.getByTestId("rail")).toBeVisible();
  });

  test("pomodoro starts, pauses, resets and skips", async ({ page }) => {
    const clock = page.getByTestId("pomo-clock");
    await expect(clock).toHaveText("25:00");
    await page.getByTestId("pomo-start").click();
    await expect(page.getByTestId("pomo-pause")).toBeVisible();
    await expect(clock).not.toHaveText("25:00", { timeout: 5000 });
    await page.getByTestId("pomo-pause").click();
    const paused = await clock.textContent();
    await page.waitForTimeout(1200);
    expect(await clock.textContent()).toBe(paused);
    await page.getByTestId("pomo-reset").click();
    await expect(clock).toHaveText("25:00");
    await page.getByTestId("pomo-skip").click();
    await expect(clock).toHaveText("05:00");
    await page.getByTestId("pomo-skip").click();
    await expect(clock).toHaveText("25:00");
  });

  test("unknown routes fall back to /today", async ({ page }) => {
    await page.goto("/#/does-not-exist");
    await expect(page).toHaveURL(/#\/today$/);
  });
});
