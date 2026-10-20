import {
  getBillingConfig,
  mailerConfig,
  PRODUCT_TAG,
  signingSecret,
} from "./config";
import { stripeRequest, sessionGrantsAccess, type CheckoutSession } from "./stripe";
import {
  MAGIC_TTL_SEC,
  SESSION_MAX_AGE_SEC,
  signClaims,
  verifyClaims,
  type AccessClaims,
} from "./tokens";

export type IssuedAccess = {
  email: string;
  customerId: string;
  sessionToken: string;
  recoveryCode: string;
};

function issue(email: string, customerId: string, secret: string): IssuedAccess {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  return {
    email,
    customerId,
    sessionToken: signClaims(
      { kind: "session", email, customerId, exp },
      secret,
    ),
    recoveryCode: signClaims({ kind: "code", email, customerId }, secret),
  };
}

export async function markCustomerAccess(
  secretKey: string,
  customerId: string,
  email: string,
  status: "active" | "revoked",
): Promise<boolean> {
  const result = await stripeRequest(secretKey, "POST", `/customers/${customerId}`, {
    "metadata[llm_leverage_access]": status,
    "metadata[llm_leverage_product]": PRODUCT_TAG,
    "metadata[llm_leverage_email]": email,
  });
  return result.ok;
}

export async function grantFromCheckoutSession(
  sessionId: string,
): Promise<
  | { ok: true; access: IssuedAccess }
  | { ok: false; status: number; error: string }
> {
  const config = getBillingConfig();
  const secret = signingSecret();
  if (!config.checkoutEnabled || !config.secretKey || !config.priceId || !secret) {
    return { ok: false, status: 503, error: "purchase_unavailable" };
  }
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return { ok: false, status: 400, error: "invalid_session" };
  }
  const retrieved = await stripeRequest(
    config.secretKey,
    "GET",
    `/checkout/sessions/${sessionId}?expand[]=line_items`,
  );
  if (!retrieved.ok) {
    return { ok: false, status: 402, error: "payment_required" };
  }
  const identity = sessionGrantsAccess(
    retrieved.data as CheckoutSession,
    config.priceId,
  );
  if (!identity) return { ok: false, status: 402, error: "payment_required" };
  const marked = await markCustomerAccess(
    config.secretKey,
    identity.customerId,
    identity.email,
    "active",
  );
  if (!marked) return { ok: false, status: 502, error: "customer_update_failed" };
  return { ok: true, access: issue(identity.email, identity.customerId, secret) };
}

type CustomerRecord = {
  id?: string;
  email?: string | null;
  metadata?: Record<string, string> | null;
};

function customerIsEntitled(customer: CustomerRecord, email: string): boolean {
  return (
    customer.metadata?.llm_leverage_access === "active" &&
    customer.metadata?.llm_leverage_product === PRODUCT_TAG &&
    (customer.email || customer.metadata?.llm_leverage_email || "")
      .trim()
      .toLowerCase() === email
  );
}

export async function findEntitledCustomer(
  email: string,
): Promise<{ id: string; email: string } | null> {
  const config = getBillingConfig();
  if (!config.secretKey) return null;
  const listed = await stripeRequest(
    config.secretKey,
    "GET",
    `/customers?email=${encodeURIComponent(email)}&limit=10`,
  );
  if (!listed.ok) return null;
  const rows = (listed.data.data as CustomerRecord[] | undefined) ?? [];
  for (const customer of rows) {
    if (customer.id && customerIsEntitled(customer, email)) {
      return { id: customer.id, email };
    }
  }
  return null;
}

export async function customerStillEntitled(
  customerId: string,
  email: string,
): Promise<boolean> {
  const config = getBillingConfig();
  if (!config.secretKey) return false;
  const retrieved = await stripeRequest(
    config.secretKey,
    "GET",
    `/customers/${customerId}`,
  );
  if (!retrieved.ok) return false;
  return customerIsEntitled(retrieved.data as CustomerRecord, email);
}

export async function createCheckoutUrl(
  origin: string,
): Promise<{ ok: true; url: string } | { ok: false; status: number; error: string }> {
  const config = getBillingConfig();
  if (!config.checkoutEnabled || !config.secretKey || !config.priceId) {
    return { ok: false, status: 503, error: "purchase_unavailable" };
  }
  const created = await stripeRequest(config.secretKey, "POST", "/checkout/sessions", {
    mode: "payment",
    "line_items[0][price]": config.priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/access?checkout=cancelled`,
    customer_creation: "always",
    "metadata[product]": PRODUCT_TAG,
    "payment_intent_data[metadata][product]": PRODUCT_TAG,
  });
  const url = created.data.url;
  if (!created.ok || typeof url !== "string" || !url.startsWith("https://checkout.stripe.com/")) {
    return { ok: false, status: 502, error: "checkout_failed" };
  }
  return { ok: true, url };
}

export async function redeemPresentedToken(
  token: string,
): Promise<
  | { ok: true; access: IssuedAccess }
  | { ok: false; status: number; error: string }
> {
  const config = getBillingConfig();
  const secret = signingSecret();
  if (!config.secretKey || !secret) {
    return { ok: false, status: 503, error: "purchase_unavailable" };
  }
  const claims = verifyClaims(token, secret);
  if (!claims || (claims.kind !== "code" && claims.kind !== "magic")) {
    return { ok: false, status: 401, error: "invalid_token" };
  }
  const still = await customerStillEntitled(claims.customerId, claims.email);
  if (!still) return { ok: false, status: 401, error: "invalid_token" };
  return { ok: true, access: issue(claims.email, claims.customerId, secret) };
}

export function signMagicLink(email: string, customerId: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + MAGIC_TTL_SEC;
  return signClaims({ kind: "magic", email, customerId, exp }, secret);
}

export async function sendMagicLinkEmail(
  to: string,
  link: string,
): Promise<boolean> {
  const mailer = mailerConfig();
  if (!mailer) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${mailer.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: mailer.from,
      to,
      subject: "Your LLM Leverage sign-in link",
      text: [
        "Use this link to open the LLM Leverage course. It expires in 30 minutes.",
        "",
        link,
        "",
        "If you did not ask for this, you can ignore the email.",
      ].join("\n"),
    }),
    cache: "no-store",
  });
  return response.ok;
}

export async function revokeIfCourseCharge(charge: {
  payment_intent?: unknown;
  customer?: unknown;
}): Promise<"revoked" | "ignored" | "failed"> {
  const config = getBillingConfig();
  if (!config.secretKey) return "failed";
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return "ignored";
  const paymentIntent = await stripeRequest(
    config.secretKey,
    "GET",
    `/payment_intents/${paymentIntentId}`,
  );
  if (!paymentIntent.ok) return "failed";
  const metadata = paymentIntent.data.metadata as
    | Record<string, string>
    | undefined;
  if (metadata?.product !== PRODUCT_TAG) return "ignored";
  const customerId =
    typeof paymentIntent.data.customer === "string"
      ? paymentIntent.data.customer
      : typeof charge.customer === "string"
        ? charge.customer
        : null;
  const email = (metadata.llm_leverage_email || "").trim().toLowerCase();
  if (!customerId) return "failed";
  const marked = await markCustomerAccess(
    config.secretKey,
    customerId,
    email,
    "revoked",
  );
  return marked ? "revoked" : "failed";
}

export function readSessionClaims(token: string | undefined): AccessClaims | null {
  const secret = signingSecret();
  if (!secret || !token) return null;
  const claims = verifyClaims(token, secret);
  if (!claims || claims.kind !== "session") return null;
  return claims;
}
