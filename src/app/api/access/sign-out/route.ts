import { NextResponse } from "next/server";
import { ACCESS_COOKIE, sessionCookieOptions } from "@/lib/billing/tokens";
import { requestIsSecure } from "@/lib/access/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/access", request.url));
  response.cookies.set(ACCESS_COOKIE, "", {
    ...sessionCookieOptions(requestIsSecure(request)),
    maxAge: 0,
  });
  return response;
}
