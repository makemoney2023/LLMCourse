import { cookies } from "next/headers";
import { readSessionClaims } from "@/lib/billing/grant";
import { ACCESS_COOKIE } from "@/lib/billing/tokens";

export type CourseAccess = {
  entitled: boolean;
  email: string | null;
  customerId: string | null;
};

export async function getCourseAccess(): Promise<CourseAccess> {
  const jar = await cookies();
  const claims = readSessionClaims(jar.get(ACCESS_COOKIE)?.value);
  if (!claims || claims.kind !== "session") {
    return { entitled: false, email: null, customerId: null };
  }
  return {
    entitled: true,
    email: claims.email,
    customerId: claims.customerId,
  };
}

export function requestIsSecure(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}
