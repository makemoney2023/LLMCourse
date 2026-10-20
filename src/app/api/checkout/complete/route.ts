import { NextResponse } from "next/server";
import { grantFromCheckoutSession } from "@/lib/billing/grant";
import {
  ACCESS_COOKIE,
  sessionCookieOptions,
} from "@/lib/billing/tokens";
import { requestIsSecure } from "@/lib/access/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  const granted = await grantFromCheckoutSession(sessionId);
  const destination = new URL(
    granted.ok ? "/access/welcome" : "/access?checkout=unpaid",
    request.url,
  );
  const response = NextResponse.redirect(destination);
  if (granted.ok) {
    response.cookies.set(
      ACCESS_COOKIE,
      granted.access.sessionToken,
      sessionCookieOptions(requestIsSecure(request)),
    );
  }
  return response;
}
