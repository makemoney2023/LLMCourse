import { COURSE_CURRENCY, COURSE_PRICE_CENTS, PRODUCT_TAG } from "./config";

export type CheckoutSession = {
  id?: string;
  mode?: string;
  status?: string;
  payment_status?: string;
  currency?: string;
  amount_total?: number | null;
  metadata?: Record<string, string> | null;
  customer?: string | { id?: string } | null;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  line_items?: {
    data?: Array<{ price?: string | { id?: string } | null }>;
  } | null;
};

export type GrantIdentity = { email: string; customerId: string };

function priceIdOf(
  price: string | { id?: string } | null | undefined,
): string | null {
  if (typeof price === "string") return price;
  if (price && typeof price.id === "string") return price.id;
  return null;
}

/** A Checkout Session grants access only when every paid-course check holds. */
export function sessionGrantsAccess(
  session: CheckoutSession,
  expectedPriceId: string,
): GrantIdentity | null {
  if (session.mode !== "payment") return null;
  if (session.status !== "complete") return null;
  if (session.payment_status !== "paid") return null;
  if (session.currency !== COURSE_CURRENCY) return null;
  if (session.amount_total !== COURSE_PRICE_CENTS) return null;
  if (session.metadata?.product !== PRODUCT_TAG) return null;
  const price = priceIdOf(session.line_items?.data?.[0]?.price);
  if (!price || price !== expectedPriceId) return null;
  const email = (session.customer_details?.email || session.customer_email || "")
    .trim()
    .toLowerCase();
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || "";
  if (!email.includes("@") || !customerId.startsWith("cus_")) return null;
  return { email, customerId };
}

export function encodeStripeForm(fields: Record<string, string>): string {
  return new URLSearchParams(fields).toString();
}

type StripeResult = { ok: boolean; status: number; data: Record<string, unknown> };

export async function stripeRequest(
  secretKey: string,
  method: "GET" | "POST",
  path: string,
  form?: Record<string, string>,
): Promise<StripeResult> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${secretKey}`,
  };
  let body: string | undefined;
  if (form) {
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = encodeStripeForm(form);
  }
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  return { ok: response.ok, status: response.status, data };
}
