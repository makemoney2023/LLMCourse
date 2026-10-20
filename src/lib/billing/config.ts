/** One-time lifetime price. Keep in sync with scripts/stripe-setup.mjs. */
export const COURSE_PRICE_CENTS = 14900;
export const COURSE_CURRENCY = "usd";
export const COURSE_PRICE_LABEL = "$149";
export const PRODUCT_TAG = "llm-leverage-course";

export type BillingConfig = {
  secretKey: string | null;
  webhookSecret: string | null;
  priceId: string | null;
  /** True only when checkout, webhook verification, and the price are all configured. */
  checkoutEnabled: boolean;
};

function nonempty(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function getBillingConfig(): BillingConfig {
  const secretKey = nonempty("STRIPE_SECRET_KEY");
  const webhookSecret = nonempty("STRIPE_WEBHOOK_SECRET");
  const priceId = nonempty("STRIPE_PRICE_ID");
  return {
    secretKey,
    webhookSecret,
    priceId,
    checkoutEnabled: Boolean(secretKey && webhookSecret && priceId),
  };
}

/**
 * Signs session cookies and access codes. Prefers a dedicated secret so rotating
 * the Stripe key does not sign everyone out. Falls back to the webhook secret,
 * which is present whenever checkout is enabled.
 */
export function signingSecret(): string | null {
  return (
    nonempty("ACCESS_TOKEN_SECRET") ??
    nonempty("STRIPE_WEBHOOK_SECRET") ??
    nonempty("STRIPE_SECRET_KEY")
  );
}

export function mailerConfig(): { apiKey: string; from: string } | null {
  const apiKey = nonempty("RESEND_API_KEY");
  const from = nonempty("EMAIL_FROM");
  if (!apiKey || !from) return null;
  return { apiKey, from };
}
