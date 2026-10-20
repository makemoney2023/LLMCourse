import type { Page } from "@playwright/test";
import { signClaims } from "../src/lib/billing/tokens";

export const E2E_ACCESS_TOKEN_SECRET = "e2e-access-token-secret";

export async function grantLifetimeAccess(page: Page) {
  const token = signClaims(
    {
      kind: "session",
      email: "learner@example.com",
      customerId: "cus_e2e",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    E2E_ACCESS_TOKEN_SECRET,
  );
  await page.context().addCookies([
    {
      name: "ll_access",
      value: token,
      url: "http://127.0.0.1:3000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
