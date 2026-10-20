import { createCheckoutUrl } from "@/lib/billing/grant";
import { PRIVATE_NO_STORE } from "@/lib/access/course-files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const created = await createCheckoutUrl(origin);
  if (!created.ok) {
    const status = created.error === "purchase_unavailable" ? 503 : 502;
    return Response.json(
      { error: created.error },
      { status, headers: PRIVATE_NO_STORE },
    );
  }
  return Response.json({ url: created.url }, { headers: PRIVATE_NO_STORE });
}
