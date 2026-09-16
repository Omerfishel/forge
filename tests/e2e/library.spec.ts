import { test, expect } from "@playwright/test";
import { go, readStore, trackErrors } from "./helpers";

test.describe("Library", () => {
  test("lists every resource grouped by track, filters by search/chips/toggles and clears", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/library", "page-library");
    await expect(page.getByTestId("lib-count")).toContainText(/^154 of 154/);
    await expect(page.getByTestId("lib-group-T1_AI_ML")).toBeVisible();
    await page.getByTestId("lib-search").fill("karpathy");
    await expect(page.getByTestId("lib-count")).toContainText(/^1 of 154/);
    await expect(page.getByTestId("lib-row-t1-karpathy-zth")).toBeVisible();
    await page.getByTestId("lib-clear").click();
    await expect(page.getByTestId("lib-count")).toContainText(/^154 of 154/);
    await page.getByTestId("lib-chip-track-T7_DOMAIN").click();
    await expect(page.getByTestId("lib-count")).toContainText(/^\d+ of 154/);
    await expect(page.getByTestId("lib-group-T1_AI_ML")).toHaveCount(0);
    await page.getByTestId("lib-chip-cost-free").click();
    await page.getByTestId("lib-chip-prio-must_do").click();
    await expect(page.getByTestId("lib-row-t7-owasp-llm")).toBeVisible();
    await page.getByTestId("lib-layout").getByRole("tab", { name: "Flat" }).click();
    await expect(page.getByTestId("lib-group-T7_DOMAIN")).toHaveCount(0);
    await expect(page.getByTestId("lib-row-t7-owasp-llm")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("?q= presets the search from a deep link", async ({ page }) => {
    await page.goto("/#/library?q=Gandalf");
    await expect(page.getByTestId("lib-search")).toHaveValue("Gandalf");
    await expect(page.getByTestId("lib-row-t7-gandalf")).toBeVisible();
    await expect(page).not.toHaveURL(/q=/);
  });

  test("expanding a row exposes status, progress, hours and notes controls that persist", async ({ page }) => {
    await go(page, "/library", "page-library");
    await page.getByTestId("lib-search").fill("Gandalf");
    await page.getByTestId("lib-expand-t7-gandalf").click();
    await expect(page.getByTestId("lib-detail-t7-gandalf")).toContainText("Why for you");
    await page.getByTestId("lib-status-t7-gandalf").selectOption("in_progress");
    await page.getByTestId("lib-hours-t7-gandalf").fill("1.5");
    await page.getByTestId("lib-hours-add-t7-gandalf").click();
    await expect(page.getByTestId("toast").last()).toContainText("1.5h");
    await page.getByTestId("lib-note-t7-gandalf").click();
    await page.getByTestId("lib-note-text-t7-gandalf").fill("Level 4 needs a different framing.");
    await page.getByTestId("lib-note-save-t7-gandalf").click();
    await expect(page.getByTestId("toast").last()).toContainText("Note saved");
    await page.reload();
    await expect(page.getByTestId("lib-search")).toHaveValue("Gandalf");
    await expect(page.getByTestId("lib-detail-t7-gandalf")).toBeVisible();
    const store = await readStore(page);
    const p = (store.progress as Record<string, { status: string; hoursLogged: number }>)["t7-gandalf"];
    expect(p.status).toBe("in_progress");
    expect(p.hoursLogged).toBe(1.5);
    expect((store.notes as { resourceId?: string }[])[0].resourceId).toBe("t7-gandalf");
    await page.getByTestId("lib-done-t7-gandalf").check();
    await expect(page.getByTestId("lib-row-t7-gandalf")).toHaveClass(/done/);
    await page.getByTestId("lib-hide-done").check();
    await expect(page.getByTestId("lib-row-t7-gandalf")).toHaveCount(0);
  });

  test("a deep-link search is cleared when Library is opened from the nav, a typed one is kept", async ({ page }) => {
    await page.goto("/#/library?q=Gandalf");
    await expect(page.getByTestId("lib-count")).toContainText(/^1 of/);
    await page.getByTestId("nav-today").click();
    await page.getByTestId("nav-library").click();
    await expect(page.getByTestId("lib-search")).toHaveValue("");
    await expect(page.getByTestId("lib-count")).toContainText(/^154 of/);
    await page.getByTestId("lib-search").fill("owasp");
    await page.getByTestId("nav-today").click();
    await page.getByTestId("nav-library").click();
    await expect(page.getByTestId("lib-search")).toHaveValue("owasp");
  });

  test("slash focuses the search box", async ({ page }) => {
    await go(page, "/library", "page-library");
    await page.getByTestId("lib-count").click();
    await page.keyboard.press("/");
    await expect(page.getByTestId("lib-search")).toBeFocused();
  });
});
