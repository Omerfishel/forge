import { test, expect } from "@playwright/test";
import { go, readStore, trackErrors } from "./helpers";

test.describe("Projects", () => {
  test("kanban shows nine projects in the backlog; arrows move cards and persist", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/projects", "page-projects");
    await expect(page.getByTestId("kanban-col-todo").locator(".kcard")).toHaveCount(9);
    await page.getByTestId("kcard-move-p-eval-harness-in_progress").click();
    await expect(page.getByTestId("kanban-col-in_progress").getByTestId("kcard-p-eval-harness")).toBeVisible();
    await expect(page.getByTestId("toast").last()).toContainText("In progress");
    await page.reload();
    await expect(page.getByTestId("kanban-col-in_progress").getByTestId("kcard-p-eval-harness")).toBeVisible();
    await page.getByTestId("kcard-move-p-eval-harness-done").click();
    await expect(page.getByTestId("projects-stats")).toContainText("1/9");
    expect(errors).toEqual([]);
  });

  test("drag and drop moves a card between columns", async ({ page }) => {
    await go(page, "/projects", "page-projects");
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await page.getByTestId("kcard-p-fullstack-ai").dispatchEvent("dragstart", { dataTransfer });
    await page.getByTestId("kanban-col-in_progress").dispatchEvent("dragover", { dataTransfer });
    await expect(page.getByTestId("kanban-col-in_progress")).toHaveClass(/over/);
    await page.getByTestId("kanban-col-in_progress").dispatchEvent("drop", { dataTransfer });
    await expect(page.getByTestId("kanban-col-in_progress").getByTestId("kcard-p-fullstack-ai")).toBeVisible();
  });

  test("the detail modal opens from a deep link, tracks steps, hours and publish links", async ({ page }) => {
    await page.goto("/#/projects?open=p-secure-mcp-agent");
    await expect(page.getByTestId("proj-modal")).toBeVisible();
    await expect(page.getByTestId("proj-modal")).toContainText("Build an agent with MCP tools");
    await page.getByTestId("proj-step-0").check();
    await page.getByTestId("proj-step-1").check();
    await expect(page.getByTestId("proj-modal")).toContainText("Steps · 2/");
    await page.getByTestId("proj-hours").fill("3");
    await page.getByTestId("proj-hours-add").click();
    await expect(page.getByTestId("toast").last()).toContainText("3h");
    await page.getByTestId("proj-link-label").fill("repo");
    await page.getByTestId("proj-link-url").fill("not a url");
    await expect(page.getByTestId("proj-link-add")).toBeDisabled();
    await page.getByTestId("proj-link-url").fill("https://github.com/omer/secure-mcp-agent");
    await page.getByTestId("proj-link-add").click();
    await expect(page.getByTestId("proj-modal")).toContainText("↗ repo");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("proj-modal")).toHaveCount(0);
    await expect(page).not.toHaveURL(/open=/);
    // steps auto-derive the status → the card moved to In progress
    await expect(page.getByTestId("kanban-col-in_progress").getByTestId("kcard-p-secure-mcp-agent")).toContainText("2/");
    const store = await readStore(page);
    const p = (store.progress as Record<string, { criteriaDone: number[]; hoursLogged: number; links: { label: string }[] }>)["p-secure-mcp-agent"];
    expect(p.criteriaDone).toEqual([0, 1]);
    expect(p.hoursLogged).toBe(3);
    expect(p.links[0].label).toBe("repo");
  });
});

test.describe("Drills", () => {
  test("lists phase-1 habits, logs/undoes, backfills a date, and shows workouts with scripts", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/drills", "page-drills");
    await expect(page.getByTestId("drill-row-d-paper-week")).toContainText("Due now");
    await page.getByTestId("drill-log-d-paper-week").click();
    await expect(page.getByTestId("drill-row-d-paper-week")).toContainText("Done this period");
    await expect(page.getByTestId("drill-streak-d-paper-week")).toContainText("1");
    await expect(page.getByTestId("drills-stats")).toContainText("Logged this week");
    await page.getByTestId("drill-undo-d-paper-week").click();
    await expect(page.getByTestId("drill-row-d-paper-week")).toContainText("Due now");
    await page.getByTestId("drill-date-d-sysdesign-week").fill("2026-01-05");
    await page.getByTestId("drill-log-date-d-sysdesign-week").click();
    await expect(page.getByTestId("toast").last()).toContainText("Logged for");
    const store = await readStore(page);
    expect((store.drillLog as Record<string, string[]>)["d-sysdesign-week"]).toEqual(["2026-01-05"]);
    await page.getByTestId("drills-phase").getByRole("tab", { name: "All" }).click();
    await expect(page.getByTestId("drill-row-d-cold-outreach-day")).toBeVisible();
    await page.getByTestId("drills-phase").getByRole("tab", { name: "Phase 2" }).click();
    await expect(page.getByTestId("drill-row-d-cold-outreach-day")).toHaveCount(0);
    await page.getByTestId("workout-expand-d-workout-pitch").click();
    await expect(page.getByTestId("workout-script-d-workout-pitch")).toBeVisible();
    await page.getByTestId("workout-log-d-workout-pitch").click();
    await expect(page.getByTestId("workout-d-workout-pitch")).toContainText("1 sessions");
    await expect(page.getByTestId("workout-log-d-workout-pitch")).toBeDisabled();
    await expect(page.getByTestId("heatmap")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
