import { test, expect } from "@playwright/test";
import { go, readStore, trackErrors } from "./helpers";

test.describe("Review (spaced repetition)", () => {
  test("a session reveals with Space, grades with keys and buttons, and schedules cards", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/review", "page-review");
    await expect(page.getByTestId("srs-stats")).toContainText("New");
    await page.getByTestId("deck-chip-system-design").click();
    await expect(page.getByTestId("srs-card")).toBeVisible();
    await expect(page.getByTestId("srs-progress")).toContainText("Card 1 of");
    await expect(page.getByTestId("srs-back")).toHaveCount(0);
    await page.keyboard.press("Space");
    await expect(page.getByTestId("srs-back")).toBeVisible();
    await page.keyboard.press("3");
    await expect(page.getByTestId("srs-progress")).toContainText("Card 2 of");
    await page.getByTestId("srs-show").click();
    await page.getByTestId("srs-grade-0").click(); // again → re-queued
    await expect(page.getByTestId("srs-progress")).toContainText("again");
    await page.getByTestId("srs-show").click();
    await page.getByTestId("srs-grade-2").click();
    const store = await readStore(page);
    const graded = Object.values(store.srs as Record<string, { reps: number; due: string }>);
    expect(graded.length).toBe(3);
    expect(graded.some((g) => g.reps >= 1)).toBe(true);
    await expect(page.getByTestId("srs-stats")).toContainText("Reviewed today");
    expect(errors).toEqual([]);
  });

  test("deck browser lists cards and the deck choice persists", async ({ page }) => {
    await go(page, "/review", "page-review");
    await page.getByTestId("deck-chip-nhi").click();
    await page.getByTestId("srs-browse").click();
    await expect(page.getByTestId("srs-table")).toBeVisible();
    await expect(page.getByTestId("srs-table").locator("tbody tr").first()).toContainText("new");
    await page.reload();
    await expect(page.getByTestId("deck-chip-nhi")).toHaveAttribute("aria-pressed", "true");
  });

  test("with max new = 0 and nothing due the empty state offers study-ahead", async ({ page }) => {
    await go(page, "/review", "page-review");
    await page.getByTestId("srs-max-new").fill("0");
    await expect(page.getByTestId("srs-empty")).toBeVisible();
    await page.getByTestId("srs-ahead").click();
    await expect(page.getByTestId("srs-empty")).toContainText("Nothing to study ahead");
  });
});

test.describe("Reading", () => {
  test("logs a paper with a summary, which counts the weekly drill and creates a note", async ({ page }) => {
    await go(page, "/reading", "page-reading");
    await expect(page.getByTestId("paper-tracker")).toContainText("Due this week");
    await page.getByTestId("paper-log-open").click();
    await expect(page.getByTestId("paper-save")).toBeDisabled();
    await page.getByTestId("paper-title").fill("PentestGPT");
    await page.getByTestId("paper-url").fill("https://arxiv.org/abs/2308.06782");
    await page.getByTestId("paper-summary").fill("An LLM-driven penetration testing framework with a task tree.");
    await page.getByTestId("paper-save").click();
    await expect(page.getByTestId("paper-tracker")).toContainText("Done this week");
    await expect(page.getByTestId("page-reading")).toContainText("PentestGPT");
    const store = await readStore(page);
    expect((store.drillLog as Record<string, string[]>)["d-paper-week"]).toHaveLength(1);
    const note = (store.notes as { title: string; tags: string[]; body: string }[])[0];
    expect(note.title).toBe("PentestGPT");
    expect(note.tags).toContain("paper");
    expect(note.body).toContain("arxiv.org");
    const id = (store.notes as { id: string }[])[0].id;
    await page.getByTestId(`paper-edit-${id}`).click();
    await page.getByTestId(`paper-edit-title-${id}`).fill("PentestGPT (USENIX 2024)");
    await page.getByTestId(`paper-edit-save-${id}`).click();
    await expect(page.getByTestId(`paper-note-${id}`)).toContainText("USENIX 2024");
    await page.getByTestId(`paper-delete-${id}`).click();
    await page.getByTestId("confirm-yes").click();
    await expect(page.getByTestId(`paper-note-${id}`)).toHaveCount(0);
  });

  test("reading queue filters by type and hides done", async ({ page }) => {
    await go(page, "/reading", "page-reading");
    await page.getByTestId("reading-filter-framework").click();
    await expect(page.getByTestId("reading-row-t7-owasp-llm")).toBeVisible();
    await expect(page.getByTestId("reading-row-t7-simon-willison")).toHaveCount(0);
    await page.getByTestId("reading-done-t7-owasp-llm").check();
    await page.getByTestId("reading-hide-done").check();
    await expect(page.getByTestId("reading-row-t7-owasp-llm")).toHaveCount(0);
  });
});

test.describe("Notes", () => {
  test("create, preview, link, filter, edit, delete and export", async ({ page }) => {
    const errors = trackErrors(page);
    await go(page, "/notes", "page-notes");
    await expect(page.getByTestId("notes-export")).toBeDisabled();
    await page.getByTestId("notes-new").click();
    await page.getByTestId("note-title").fill("Agent authz idea");
    await page.getByTestId("note-body").fill("Use **SPIFFE** SVIDs per tool.\n\n- scope tokens\n- audit calls");
    await expect(page.getByTestId("note-preview").locator("b")).toHaveText("SPIFFE");
    await page.getByTestId("note-tags").fill("idea, nhi");
    await page.getByTestId("note-link").selectOption("resource:t7-spiffe");
    await page.getByTestId("note-save").click();
    await expect(page.getByTestId("toast").last()).toContainText("Note saved");
    const store = await readStore(page);
    const n = (store.notes as { id: string; tags: string[]; resourceId?: string }[])[0];
    expect(n.tags).toEqual(["idea", "nhi"]);
    expect(n.resourceId).toBe("t7-spiffe");
    await expect(page.getByTestId(`note-card-${n.id}`)).toContainText("SPIFFE");
    await page.getByTestId("notes-tag-nhi").click();
    await expect(page.getByTestId("notes-count")).toContainText("1 of 1");
    await page.getByTestId("notes-link-filter").selectOption("project");
    await expect(page.getByTestId("notes-count")).toContainText("0 of 1");
    await page.getByTestId("notes-link-filter").selectOption("all");
    await page.getByTestId(`note-edit-${n.id}`).click();
    await page.getByTestId("note-title").fill("Agent authz idea v2");
    await page.getByTestId("note-save").click();
    await expect(page.getByTestId(`note-card-${n.id}`)).toContainText("v2");
    const download = page.waitForEvent("download");
    await page.getByTestId("notes-export").click();
    expect((await download).suggestedFilename()).toBe("forge-notes.md");
    await page.getByTestId(`note-delete-${n.id}`).click();
    await page.getByTestId("confirm-yes").click();
    await expect(page.getByTestId(`note-card-${n.id}`)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
