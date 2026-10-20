import { NextResponse } from "next/server";
import { redeemPresentedToken } from "@/lib/billing/grant";
import { ACCESS_COOKIE, sessionCookieOptions } from "@/lib/billing/tokens";
import { PRIVATE_NO_STORE } from "@/lib/access/course-files";
import { requestIsSecure } from "@/lib/access/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function tokenFrom(request: Request): Promise<string> {
  if (request.method === "GET") {
    return new URL(request.url).searchParams.get("token")?.trim() ?? "";
  }
  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  return typeof body?.token === "string" ? body.token.trim() : "";
}

export async function GET(request: Request) {
  const token = await tokenFrom(request);
  const redeemed = await redeemPresentedToken(token);
  const destination = new URL(
    redeemed.ok ? "/modules" : "/access?signin=invalid",
    request.url,
  );
  const response = NextResponse.redirect(destination);
  if (redeemed.ok) {
    response.cookies.set(
      ACCESS_COOKIE,
      redeemed.access.sessionToken,
      sessionCookieOptions(requestIsSecure(request)),
    );
  }
  return response;
}

export async function POST(request: Request) {
  const token = await tokenFrom(request);
  const redeemed = await redeemPresentedToken(token);
  if (!redeemed.ok) {
    return Response.json(
      { error: redeemed.error },
      { status: redeemed.status, headers: PRIVATE_NO_STORE },
    );
  }
  const response = NextResponse.json({ ok: true }, { headers: PRIVATE_NO_STORE });
  response.cookies.set(
    ACCESS_COOKIE,
    redeemed.access.sessionToken,
    sessionCookieOptions(requestIsSecure(request)),
  );
  return response;
}
