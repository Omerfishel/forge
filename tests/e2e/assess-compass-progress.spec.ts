import { test, expect } from "@playwright/test";
import { go, readStore, seedStore, trackErrors } from "./helpers";

test.describe("Ready-when", () => {
  test("ticking every rubric criterion marks the track ready and unlocks the badge", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/assess", "page-assess");
    const rubric = page.getByTestId("assess-item-a-t1-rubric");
    await expect(rubric).toBeVisible();
    const boxes = rubric.locator("input[type=checkbox]");
    const n = await boxes.count();
    for (let i = 0; i < n; i++) await page.getByTestId(`assess-crit-a-t1-rubric-${i}`).check();
    await expect(rubric).toContainText("Ready ✓");
    await expect(page.getByTestId("assess-summary-T1_AI_ML")).toContainText("Ready");
    await page.reload();
    await expect(page.getByTestId("assess-summary-T1_AI_ML")).toContainText("Ready");
    await go(page, "/progress", "page-progress");
    await expect(page.getByTestId("badge-ready1")).toHaveClass(/got/);
    expect(errors).toEqual([]);
  });

  test("self-test notes save as a note; public proof links save", async ({ page }) => {
    await go(page, "/assess", "page-assess");
    await page.getByTestId("assess-notes-a-t1-selftest").fill("Attention: weighted lookup over V by softmax(QK^T/√d).");
    await page.getByTestId("assess-notes-save-a-t1-selftest").click();
    await page.getByTestId("assess-proof-label-a-t1-proof").fill("nanoGPT repo");
    await page.getByTestId("assess-proof-url-a-t1-proof").fill("https://github.com/omer/nanogpt");
    await page.getByTestId("assess-proof-save-a-t1-proof").click();
    const store = await readStore(page);
    expect((store.notes as { itemId?: string }[]).some((x) => x.itemId === "a-t1-selftest")).toBe(true);
    expect((store.progress as Record<string, { links: { label: string }[] }>)["a-t1-proof"].links[0].label).toBe("nanoGPT repo");
    await page.getByTestId("assess-proof-remove-a-t1-proof-0").click();
    await expect(page.getByTestId("assess-item-a-t1-proof")).not.toContainText("nanoGPT repo");
  });
});

test.describe("Compass", () => {
  test("every tab renders strategy content; startup filters work; tab persists", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/compass", "page-compass");
    await expect(page.getByTestId("compass-tldr")).toContainText("8200");
    for (const t of ["domains", "roles", "startups", "timeline", "skills", "money", "playbook", "caveats"]) {
      await page.getByTestId(`compass-tab-${t}`).click();
      await expect(page.getByTestId("page-compass")).not.toBeEmpty();
    }
    await page.getByTestId("compass-tab-domains").click();
    await expect(page.getByTestId("page-compass")).toContainText("Strongest fit");
    await page.getByTestId("compass-tab-startups").click();
    await expect(page.getByTestId("page-compass")).toContainText("Tenzai");
    const total = await page.getByTestId("startup-count").textContent();
    await page.getByTestId("startup-filter-watch").click();
    await expect(page.getByTestId("startup-count")).not.toHaveText(total ?? "");
    await page.getByTestId("startup-filter-all").click();
    await page.getByTestId("startup-filter-8200").click();
    await expect(page.getByTestId("page-compass")).toContainText("8200");
    await page.reload();
    await expect(page.getByTestId("compass-tab-startups")).toHaveAttribute("aria-pressed", "true");
    expect(errors).toEqual([]);
  });
});

test.describe("Progress", () => {
  test("stats, per-track bars, daily goal, achievements and activity reflect the store", async ({ page }) => {
    const errors = trackErrors(page);
    await seedStore(page, {
      progress: { "t1-karpathy-zth": { itemId: "t1-karpathy-zth", itemType: "resource", status: "done", percentComplete: 100, hoursLogged: 4, updatedAt: "2026-09-15T10:00:00.000Z" } },
      completions: { "2026-09-15": 1 },
      pomoCount: 3,
    });
    await go(page, "/progress", "page-progress");
    await expect(page.getByTestId("stat-done")).toContainText("1/");
    await expect(page.getByTestId("stat-hours")).toContainText("4h");
    await expect(page.getByTestId("stat-pomo")).toContainText("3");
    await expect(page.getByTestId("track-bar-T1_AI_ML")).toContainText("1/");
    await expect(page.getByTestId("badge-first")).toHaveClass(/got/);
    await expect(page.getByTestId("toast").last()).toContainText("Achievement unlocked");
    await expect(page.getByTestId("activity-list")).toContainText("Neural Networks");
    await expect(page.getByTestId("goal-value")).toContainText("/ 2");
    await page.getByTestId("goal-inc").click();
    await expect(page.getByTestId("goal-value")).toContainText("/ 3");
    await page.getByTestId("goal-dec").click();
    await page.getByTestId("goal-dec").click();
    await expect(page.getByTestId("goal-value")).toContainText("/ 1");
    await expect(page.getByTestId("goal-dec")).toBeDisabled();
    await expect(page.getByTestId("pace-card")).toContainText("Pace");
    expect(errors).toEqual([]);
  });
});
