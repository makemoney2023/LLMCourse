#!/usr/bin/env node
/**
 * Idempotent Stripe setup for the LLM Leverage course.
 *
 * Creates (or finds):
 *   - Product  id "llm_leverage_course"                 "LLM Leverage course"
 *   - Price    lookup_key "llm_leverage_course_14900_usd"   $149.00 USD, one time
 *
 * Prints the price id to set as STRIPE_PRICE_ID. Never prints the secret key.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_… node scripts/stripe-setup.mjs
 *   STRIPE_SECRET_KEY=sk_live_… STRIPE_ALLOW_LIVE=1 node scripts/stripe-setup.mjs
 *
 * Amount and product tag must match src/lib/billing/config.ts
 * (COURSE_PRICE_CENTS = 14900, PRODUCT_TAG = llm-leverage-course).
 */

const API = "https://api.stripe.com/v1";
const PRODUCT_ID = "llm_leverage_course";
const PRODUCT_TAG = "llm-leverage-course";
const PRICE_CENTS = 14900;
const CURRENCY = "usd";
const LOOKUP_KEY = `llm_leverage_course_${PRICE_CENTS}_${CURRENCY}`;

const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";

function fail(message) {
  console.error(`stripe-setup: ${message}`);
  process.exit(1);
}

if (!key) fail("set STRIPE_SECRET_KEY.");
if (!/^(sk|rk)_(test|live)_/.test(key)) {
  fail("STRIPE_SECRET_KEY must be a Stripe secret or restricted key.");
}
if (key.includes("_live_") && process.env.STRIPE_ALLOW_LIVE !== "1") {
  fail("refusing a live key without STRIPE_ALLOW_LIVE=1.");
}

async function stripe(method, path, form, idempotencyKey) {
  const headers = { authorization: `Bearer ${key}` };
  let body;
  if (form) {
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(form).toString();
  }
  if (idempotencyKey) headers["idempotency-key"] = idempotencyKey;
  const response = await fetch(`${API}${path}`, { method, headers, body });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function ensureProduct() {
  const got = await stripe("GET", `/products/${PRODUCT_ID}`);
  if (got.status === 200) return got.data.id;
  if (got.status !== 404) {
    fail(`product lookup failed (${got.status}): ${got.data?.error?.message ?? "unknown"}`);
  }
  const made = await stripe(
    "POST",
    "/products",
    {
      id: PRODUCT_ID,
      name: "LLM Leverage course",
      description: "Lifetime access to the LLM Leverage course.",
      "metadata[product]": PRODUCT_TAG,
    },
    `product-${PRODUCT_ID}`,
  );
  if (made.status !== 200) {
    fail(`product create failed (${made.status}): ${made.data?.error?.message ?? "unknown"}`);
  }
  return made.data.id;
}

async function ensurePrice(productId) {
  const found = await stripe(
    "GET",
    `/prices?active=true&lookup_keys[]=${encodeURIComponent(LOOKUP_KEY)}&limit=1`,
  );
  if (found.status !== 200) {
    fail(`price lookup failed (${found.status}): ${found.data?.error?.message ?? "unknown"}`);
  }
  const existing = found.data.data?.[0];
  if (existing) {
    if (
      existing.unit_amount !== PRICE_CENTS ||
      existing.currency !== CURRENCY ||
      existing.product !== productId ||
      existing.type !== "one_time"
    ) {
      fail(`price ${LOOKUP_KEY} exists but does not match $149 USD one-time. Fix it in the Stripe dashboard.`);
    }
    return existing.id;
  }
  const made = await stripe(
    "POST",
    "/prices",
    {
      product: productId,
      unit_amount: String(PRICE_CENTS),
      currency: CURRENCY,
      lookup_key: LOOKUP_KEY,
      "metadata[product]": PRODUCT_TAG,
    },
    `price-${LOOKUP_KEY}`,
  );
  if (made.status !== 200) {
    fail(`price create failed (${made.status}): ${made.data?.error?.message ?? "unknown"}`);
  }
  return made.data.id;
}

const productId = await ensureProduct();
const priceId = await ensurePrice(productId);

console.log(`mode=${key.includes("_live_") ? "live" : "test"}`);
console.log(`STRIPE_PRODUCT_ID=${productId}`);
console.log(`STRIPE_PRICE_ID=${priceId}`);
