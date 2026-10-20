import {
  findEntitledCustomer,
  sendMagicLinkEmail,
  signMagicLink,
} from "@/lib/billing/grant";
import { getBillingConfig, mailerConfig } from "@/lib/billing/config";
import { PRIVATE_NO_STORE } from "@/lib/access/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = normalizeEmail(body?.email);
  const unavailable = Response.json(
    { ok: true, delivery: "unavailable" },
    { headers: PRIVATE_NO_STORE },
  );

  if (!email || !getBillingConfig().secretKey || !mailerConfig()) {
    return unavailable;
  }

  const customer = await findEntitledCustomer(email);
  if (customer) {
    const token = signMagicLink(customer.email, customer.id);
    if (token) {
      const link = new URL("/api/access/redeem", request.url);
      link.searchParams.set("token", token);
      await sendMagicLinkEmail(customer.email, link.toString());
    }
  }

  return Response.json({ ok: true, delivery: "sent" }, { headers: PRIVATE_NO_STORE });
}
