import { defineConfig, devices } from "@playwright/test";

// PW_BASE_URL lets a developer/agent point the suite at an already-running dev
// server (e.g. `npx vite --port 5201`), skipping the build+preview webServer.
const external = process.env.PW_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  workers: 2,
  timeout: 30_000,
  reporter: [["list"]],
  use: {
    baseURL: external ?? "http://localhost:4173",
    trace: "retain-on-failure",
    viewport: { width: 1400, height: 900 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: external
    ? undefined
    : {
        command: "npm run build && npm run preview",
        url: "http://localhost:4173",
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
