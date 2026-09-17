import { test, expect, type Page } from "@playwright/test";
import { readStore, trackErrors } from "./helpers";

const now = Date.now();
const FEED = {
  updated: new Date(now - 3600e3).toISOString(),
  count: 3, days: 2,
  sources: [{ name: "Src A", site: "https://a.example", category: "Cyber", ok: true }, { name: "Src B", site: "https://b.example", category: "AI & ML", ok: true }],
  items: [
    { id: "e1", title: "Agent identity is the new perimeter", url: "https://a.example/1", source: "Src A", category: "AI security", date: new Date(now - 2 * 3600e3).toISOString(), summary: "Why NHI matters.", score: 50, top: true },
    { id: "e2", title: "A model release", url: "https://b.example/2", source: "Src B", category: "AI & ML", date: new Date(now - 5 * 3600e3).toISOString(), summary: "", score: 20, top: false },
    { id: "e3", title: "An exploit from yesterday", url: "https://a.example/3", source: "Src A", category: "Cyber", date: new Date(now - 30 * 3600e3).toISOString(), summary: "CVE.", score: 30, top: true },
  ],
};

async function stubFeed(page: Page, body: unknown = FEED, status = 200) {
  await page.route("**/feed.json*", (route) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }));
}

test.describe("News feed", () => {
  test("shows stories, badge and radar; read/save persist across reload", async ({ page }) => {
    const errors = trackErrors(page);
    await stubFeed(page);
    await page.goto("/#/feed");
    await expect(page.getByTestId("page-feed")).toBeVisible();
    await expect(page.getByTestId("feed-top")).toContainText("Agent identity");
    await expect(page.getByTestId("feed-item-e1")).toBeVisible();
    await expect(page.getByTestId("feed-count")).toContainText("3 shown · 3 unread");
    // nav badge counts unread stories from the last 48h (e1, e2, e3 → 3)
    await expect(page.getByTestId("nav-feed").locator(".c")).toHaveText("3");
    // radar in the rail lists the unread top picks first
    await expect(page.getByTestId("radar")).toContainText("Agent identity");
    await page.getByTestId("feed-read-e1").click();
    await expect(page.getByTestId("feed-item-e1")).toHaveClass(/read/);
    await expect(page.getByTestId("nav-feed").locator(".c")).toHaveText("2");
    await page.getByTestId("feed-save-e3").click();
    await page.reload();
    await expect(page.getByTestId("feed-item-e1")).toHaveClass(/read/);
    const store = await readStore(page);
    expect((store.feed as { read: Record<string, true>; saved: Record<string, true> }).read.e1).toBe(true);
    expect((store.feed as { saved: Record<string, true> }).saved.e3).toBe(true);
    await page.getByTestId("feed-cat-saved").click();
    await expect(page.getByTestId("feed-item-e3")).toBeVisible();
    await expect(page.getByTestId("feed-item-e1")).toHaveCount(0);
    await page.getByTestId("feed-cat-ai-security").click();
    await expect(page.getByTestId("feed-item-e1")).toBeVisible();
    await expect(page.getByTestId("feed-item-e2")).toHaveCount(0);
    await page.getByTestId("feed-sources").click();
    await expect(page.getByTestId("feed-sources-list")).toContainText("Src A");
    expect(errors).toEqual([]);
  });

  test("radar ✓ marks a story read and the queue advances", async ({ page }) => {
    await stubFeed(page);
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto("/#/today");
    await expect(page.getByTestId("radar-e1")).toBeVisible();
    await page.getByTestId("radar-read-e1").click();
    await expect(page.getByTestId("radar-e1")).toHaveCount(0);
    await expect(page.getByTestId("radar-e2")).toBeVisible();
  });

  test("a missing feed shows a friendly empty state and no errors", async ({ page }) => {
    const errors = trackErrors(page);
    await stubFeed(page, {}, 404);
    await page.goto("/#/feed");
    await expect(page.getByTestId("page-feed")).toContainText("hasn't been published yet");
    await expect(page.getByTestId("radar")).toContainText("appears once it has been published");
    // the only console line allowed is the browser reporting the stubbed 404 itself
    expect(errors.filter((e) => !/404/.test(e))).toEqual([]);
  });

  test("the real built feed.json is served and renders", async ({ page }) => {
    await page.goto("/#/feed");
    await expect(page.getByTestId("page-feed")).toBeVisible();
    await expect(page.locator(".fitem").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("feed-count")).toContainText(/\d+ shown/);
  });
});
