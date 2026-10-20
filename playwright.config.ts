import { defineConfig, devices } from "@playwright/test";
import { E2E_ACCESS_TOKEN_SECRET } from "./e2e/session";

function webServerEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") env[key] = value;
  }
  env.ACCESS_TOKEN_SECRET = E2E_ACCESS_TOKEN_SECRET;
  delete env.STRIPE_SECRET_KEY;
  delete env.STRIPE_WEBHOOK_SECRET;
  delete env.STRIPE_PRICE_ID;
  delete env.RESEND_API_KEY;
  delete env.EMAIL_FROM;
  return env;
}

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: webServerEnv(),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
