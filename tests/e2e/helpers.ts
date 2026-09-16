import { expect, type Page } from "@playwright/test";

/** Navigate to a hash route and wait for the page container to render. */
export async function go(page: Page, route: string, pageTestId: string) {
  await page.goto(`/#${route}`);
  await expect(page.getByTestId(pageTestId)).toBeVisible();
}

/** Read the persisted store from localStorage. */
export async function readStore(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    const raw = localStorage.getItem("forge_v1");
    return raw ? JSON.parse(raw).state : {};
  });
}

/** Seed part of the persisted store before the app loads (call before goto). */
export async function seedStore(page: Page, patch: Record<string, unknown>) {
  await page.addInitScript((p) => {
    const raw = localStorage.getItem("forge_v1");
    const cur = raw ? JSON.parse(raw) : { state: {}, version: 1 };
    cur.state = { ...(cur.state ?? {}), ...p };
    localStorage.setItem("forge_v1", JSON.stringify(cur));
  }, patch);
}

export const toastText = (page: Page) => page.getByTestId("toast").last();

/** Collect page errors for the duration of a test. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return errors;
}
