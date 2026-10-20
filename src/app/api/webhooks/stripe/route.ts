import { getBillingConfig } from "@/lib/billing/config";
import { grantFromCheckoutSession, revokeIfCourseCharge } from "@/lib/billing/grant";
import { verifyStripeSignature } from "@/lib/billing/stripe-signature";
import { PRIVATE_NO_STORE } from "@/lib/access/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRANT_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export async function POST(request: Request) {
  const config = getBillingConfig();
  if (!config.secretKey || !config.webhookSecret || !config.priceId) {
    return Response.json(
      { error: "purchase_unavailable" },
      { status: 503, headers: PRIVATE_NO_STORE },
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!verifyStripeSignature(payload, signature, config.webhookSecret)) {
    return Response.json(
      { error: "invalid_signature" },
      { status: 400, headers: PRIVATE_NO_STORE },
    );
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return Response.json(
      { error: "invalid_payload" },
      { status: 400, headers: PRIVATE_NO_STORE },
    );
  }

  if (event.type && GRANT_EVENTS.has(event.type)) {
    const sessionId = event.data?.object?.id;
    if (typeof sessionId !== "string") {
      return Response.json({ received: true, ignored: true }, { headers: PRIVATE_NO_STORE });
    }
    const granted = await grantFromCheckoutSession(sessionId);
    if (!granted.ok && granted.error === "payment_required") {
      return Response.json({ received: true, ignored: true }, { headers: PRIVATE_NO_STORE });
    }
    if (!granted.ok) {
      return Response.json(
        { error: granted.error },
        { status: granted.status, headers: PRIVATE_NO_STORE },
      );
    }
    return Response.json({ received: true }, { headers: PRIVATE_NO_STORE });
  }

  if (event.type === "charge.refunded") {
    const outcome = await revokeIfCourseCharge(event.data?.object ?? {});
    if (outcome === "failed") {
      return Response.json(
        { error: "revoke_failed" },
        { status: 502, headers: PRIVATE_NO_STORE },
      );
    }
    return Response.json({ received: true }, { headers: PRIVATE_NO_STORE });
  }

  return Response.json({ received: true, ignored: true }, { headers: PRIVATE_NO_STORE });
}
