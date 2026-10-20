import { createHmac } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isDemoFile, isTemplateName } from "@/lib/access/course-files";
import { canReadModule, canReadSandbox } from "@/lib/access/policy";
import { getBillingConfig, PRODUCT_TAG } from "@/lib/billing/config";
import { grantFromCheckoutSession } from "@/lib/billing/grant";
import { encodeStripeForm, sessionGrantsAccess } from "@/lib/billing/stripe";
import { verifyStripeSignature } from "@/lib/billing/stripe-signature";
import { signClaims, verifyClaims } from "@/lib/billing/tokens";

const SECRET = "test-signing-secret";

describe("course access policy", () => {
  it("keeps the overview surfaces free and locks the rest", () => {
    expect(canReadModule("mental-model", false)).toBe(true);
    expect(canReadModule("deep-research", false)).toBe(false);
    expect(canReadModule("capstone-lab", false)).toBe(false);
    expect(canReadModule("deep-research", true)).toBe(true);
    expect(canReadSandbox("module-mental-model", false)).toBe(true);
    expect(canReadSandbox("module-deep-research", false)).toBe(false);
    expect(canReadSandbox("session-01", false)).toBe(false);
    expect(canReadSandbox("session-01", true)).toBe(true);
  });
});

describe("billing config fails closed", () => {
  const keys = [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
  ] as const;
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

  afterEach(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  it("stays disabled until every Stripe secret is set", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_PRICE_ID;
    expect(getBillingConfig().checkoutEnabled).toBe(false);

    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_PRICE_ID = "price_x";
    expect(getBillingConfig().checkoutEnabled).toBe(false);

    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    expect(getBillingConfig().checkoutEnabled).toBe(true);
  });
});

describe("Stripe webhook signature", () => {
  it("accepts a fresh v1 signature and rejects tampering", () => {
    const payload = JSON.stringify({ id: "evt_1" });
    const timestamp = "1700000000";
    const signature = createHmac("sha256", SECRET)
      .update(`${timestamp}.${payload}`)
      .digest("hex");
    const header = `t=${timestamp},v1=${signature}`;
    expect(
      verifyStripeSignature(payload, header, SECRET, 1700000000 * 1000),
    ).toBe(true);
    expect(
      verifyStripeSignature(payload + " ", header, SECRET, 1700000000 * 1000),
    ).toBe(false);
    expect(
      verifyStripeSignature(payload, header, SECRET, 1700000000 * 1000 + 301_000),
    ).toBe(false);
    expect(verifyStripeSignature(payload, null, SECRET)).toBe(false);
  });
});

describe("access tokens", () => {
  it("round-trips session, code, and magic claims and rejects tampering", () => {
    const session = signClaims(
      {
        kind: "session",
        email: "buyer@example.com",
        customerId: "cus_123",
        exp: 4_000_000_000,
      },
      SECRET,
    );
    expect(verifyClaims(session, SECRET, 1_700_000_000_000)?.kind).toBe("session");
    expect(verifyClaims(session, "other", 1_700_000_000_000)).toBeNull();
    expect(verifyClaims(`${session}x`, SECRET, 1_700_000_000_000)).toBeNull();

    const magic = signClaims(
      {
        kind: "magic",
        email: "buyer@example.com",
        customerId: "cus_123",
        exp: 1_700_000_100,
      },
      SECRET,
    );
    expect(verifyClaims(magic, SECRET, 1_700_000_200_000)).toBeNull();

    const code = signClaims(
      { kind: "code", email: "buyer@example.com", customerId: "cus_123" },
      SECRET,
    );
    expect(verifyClaims(code, SECRET)?.email).toBe("buyer@example.com");
  });
});

describe("checkout session grant rules", () => {
  const priceId = "price_course";
  const paid = {
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    currency: "usd",
    amount_total: 14900,
    metadata: { product: PRODUCT_TAG },
    customer: "cus_123",
    customer_details: { email: "Buyer@Example.com" },
    line_items: { data: [{ price: { id: priceId } }] },
  };

  it("accepts a $149 USD one-time payment for this product only", () => {
    expect(sessionGrantsAccess(paid, priceId)).toEqual({
      email: "buyer@example.com",
      customerId: "cus_123",
    });
    expect(sessionGrantsAccess({ ...paid, amount_total: 14999 }, priceId)).toBeNull();
    expect(sessionGrantsAccess({ ...paid, payment_status: "unpaid" }, priceId)).toBeNull();
    expect(
      sessionGrantsAccess(
        { ...paid, metadata: { product: "something-else" } },
        priceId,
      ),
    ).toBeNull();
    expect(
      sessionGrantsAccess(
        { ...paid, line_items: { data: [{ price: { id: "price_other" } }] } },
        priceId,
      ),
    ).toBeNull();
  });

  it("leaves the Checkout placeholder unencoded", () => {
    const body = encodeStripeForm({
      success_url: "https://course.example/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}",
    });
    expect(new URLSearchParams(body).get("success_url")).toContain(
      "{CHECKOUT_SESSION_ID}",
    );
  });
});

describe("grantFromCheckoutSession", () => {
  const previous = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  };

  afterEach(() => {
    vi.unstubAllGlobals();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("does not grant when Stripe is not configured", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_PRICE_ID;
    delete process.env.ACCESS_TOKEN_SECRET;
    const result = await grantFromCheckoutSession("cs_test_123");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(503);
  });

  it("grants only after Stripe confirms the paid session", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    process.env.STRIPE_PRICE_ID = "price_course";
    process.env.ACCESS_TOKEN_SECRET = SECRET;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (String(url).includes("/checkout/sessions/")) {
        return new Response(
          JSON.stringify({
            mode: "payment",
            status: "complete",
            payment_status: "paid",
            currency: "usd",
            amount_total: 14900,
            metadata: { product: PRODUCT_TAG },
            customer: "cus_123",
            customer_details: { email: "buyer@example.com" },
            line_items: { data: [{ price: { id: "price_course" } }] },
          }),
          { status: 200 },
        );
      }
      expect(init?.method).toBe("POST");
      expect(String(init?.body)).toContain(
        "metadata%5Bllm_leverage_access%5D=active",
      );
      return new Response(JSON.stringify({ id: "cus_123" }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await grantFromCheckoutSession("cs_test_paid");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(verifyClaims(result.access.sessionToken, SECRET)?.kind).toBe("session");
      expect(verifyClaims(result.access.recoveryCode, SECRET)?.kind).toBe("code");
    }
  });
});

describe("paid files stay off the public web root", () => {
  it("rejects path tricks and missing public copies", () => {
    expect(isTemplateName("BRIEF.md")).toBe(true);
    expect(isTemplateName("../BRIEF.md")).toBe(false);
    expect(isTemplateName("BRIEF.md/../../package.json")).toBe(false);
    expect(isDemoFile("tools-and-mcp", "before.svg")).toBe(true);
    expect(isDemoFile("../tools-and-mcp", "before.svg")).toBe(false);
    expect(existsSync(join(process.cwd(), "public", "templates"))).toBe(false);
    expect(existsSync(join(process.cwd(), "public", "course", "demos"))).toBe(false);
  });

  it("checks access before loading module, workshop, and exercise bodies", () => {
    const modulePage = readFileSync(
      join(process.cwd(), "src/app/modules/[slug]/page.tsx"),
      "utf8",
    );
    expect(modulePage.indexOf("if (!canReadModule")).toBeGreaterThan(-1);
    expect(modulePage.indexOf("if (!canReadModule")).toBeLessThan(
      modulePage.indexOf("const content = loadModuleContent"),
    );
    const workshopPage = readFileSync(
      join(process.cwd(), "src/app/workshops/[id]/page.tsx"),
      "utf8",
    );
    expect(workshopPage.indexOf("getCourseAccess")).toBeLessThan(
      workshopPage.indexOf("getWorkshopDeck(id)"),
    );
    const reviewPage = readFileSync(
      join(process.cwd(), "src/app/review/page.tsx"),
      "utf8",
    );
    expect(reviewPage.indexOf("getCourseAccess")).toBeLessThan(
      reviewPage.indexOf("loadModuleContent"),
    );
  });

  it("does not import lesson loaders into client components", () => {
    const root = join(process.cwd(), "src");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith(".tsx") || full.endsWith(".ts")) files.push(full);
      }
    };
    walk(root);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
      if (!source.startsWith('"use client"') && !source.startsWith("'use client'")) {
        continue;
      }
      expect(source, file).not.toContain("loadModuleContent");
      expect(source, file).not.toContain("getWorkshopDeck");
      expect(source, file).not.toContain("STRIPE_SECRET_KEY");
      expect(source, file).not.toContain("readTemplate");
    }
  });
});
