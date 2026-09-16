import { test, expect } from "@playwright/test";
import { go, readStore, trackErrors } from "./helpers";

test.describe("Paths", () => {
  test("shows four paths, activates a variant, and the plan follows", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/paths", "page-paths");
    for (const id of ["path-primary", "path-variant-a", "path-variant-b", "path-variant-c"]) await expect(page.getByTestId(`path-card-${id}`)).toBeVisible();
    await expect(page.getByTestId("path-card-path-primary")).toContainText("Active");
    await expect(page.getByTestId("path-phase-1")).toBeVisible();
    await expect(page.getByTestId("path-item-t1-karpathy-zth")).toContainText("Ready");
    await expect(page.getByTestId("path-item-t1-hf-llm-course")).toContainText("Blocked by");
    await page.getByTestId("path-activate-path-variant-a").click();
    await expect(page.getByTestId("toast").last()).toContainText("Active path");
    await expect(page.getByTestId("path-card-path-variant-a")).toContainText("Active");
    await expect(page.getByTestId("path-plan")).toContainText("Fast credibility");
    await expect(page.getByTestId("path-item-t1-dlai-rag")).toBeVisible();
    const store = await readStore(page);
    expect((store.settings as { activePathId: string }).activePathId).toBe("path-variant-a");
    expect(errors).toEqual([]);
  });

  test("ticking an item in the plan unblocks its dependents and logging a drill works", async ({ page }) => {
    await go(page, "/paths", "page-paths");
    await page.getByTestId("path-item-done-t1-karpathy-zth").check();
    await expect(page.getByTestId("path-item-t1-hf-llm-course")).toContainText("Ready");
    await page.getByTestId("path-item-log-d-paper-week").click();
    await expect(page.getByTestId("path-item-d-paper-week")).toContainText("Done this period");
    await expect(page.getByTestId("path-item-log-d-paper-week")).toBeDisabled();
  });

  test("phases collapse and the state persists", async ({ page }) => {
    await go(page, "/paths", "page-paths");
    await page.getByTestId("path-phase-1-h").click();
    await expect(page.getByTestId("path-phase-1")).toHaveClass(/col/);
    await page.reload();
    await expect(page.getByTestId("path-phase-1")).toHaveClass(/col/);
  });
});

test.describe("Tracks", () => {
  test("cards link to detail; role filter narrows counts", async ({ page }) => {
    await go(page, "/tracks", "page-tracks");
    await expect(page.getByTestId("track-card-T1_AI_ML")).toContainText("#1 priority");
    await page.getByTestId("role-chip-CEO").click();
    await expect(page.getByTestId("role-chip-CEO")).toHaveAttribute("aria-pressed", "true");
    const store = await readStore(page);
    expect((store.settings as { roleFilter: string }).roleFilter).toBe("CEO");
    await page.getByTestId("role-chip-all").click();
    await page.getByTestId("track-card-T7_DOMAIN").click();
    await expect(page).toHaveURL(/#\/tracks\/T7_DOMAIN/);
    await expect(page.getByTestId("track-detail")).toBeVisible();
    await expect(page.getByTestId("track-ready")).toContainText("threat-model");
    await expect(page.getByTestId("track-group-must_do")).toBeVisible();
    await expect(page.getByTestId("track-row-t7-owasp-llm")).toBeVisible();
    await expect(page.getByTestId("track-proj-p-nhi-prototype")).toBeVisible();
    await page.getByTestId("track-done-t7-owasp-llm").check();
    await expect(page.getByTestId("track-row-t7-owasp-llm")).toHaveClass(/done/);
    await page.getByTestId("track-back").click();
    await expect(page).toHaveURL(/#\/tracks$/);
    await expect(page.getByTestId("track-card-T7_DOMAIN")).toContainText("1/");
  });

  test("unknown track id shows an empty state with a way back", async ({ page }) => {
    await page.goto("/#/tracks/NOPE");
    await expect(page.getByTestId("page-tracks")).toContainText("Unknown track");
  });
});
