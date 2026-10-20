import { createHmac, timingSafeEqual } from "node:crypto";

const PREFIX = "v1";

export type SessionClaims = {
  kind: "session";
  email: string;
  customerId: string;
  exp: number;
};

export type CodeClaims = {
  kind: "code";
  email: string;
  customerId: string;
};

export type MagicClaims = {
  kind: "magic";
  email: string;
  customerId: string;
  exp: number;
};

export type AccessClaims = SessionClaims | CodeClaims | MagicClaims;

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 400;
export const MAGIC_TTL_SEC = 60 * 30;
export const ACCESS_COOKIE = "ll_access";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function isClaims(value: unknown): value is AccessClaims {
  if (!value || typeof value !== "object") return false;
  const claims = value as AccessClaims;
  if (typeof claims.email !== "string" || typeof claims.customerId !== "string") {
    return false;
  }
  if (!claims.email.includes("@") || !claims.customerId.startsWith("cus_")) {
    return false;
  }
  if (claims.kind === "code") return true;
  if (claims.kind === "session" || claims.kind === "magic") {
    return typeof claims.exp === "number";
  }
  return false;
}

export function signClaims(claims: AccessClaims, secret: string): string {
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(`${PREFIX}.${payload}`)
    .digest("base64url");
  return `${PREFIX}.${payload}.${signature}`;
}

export function verifyClaims(
  token: string,
  secret: string,
  nowMs = Date.now(),
): AccessClaims | null {
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [prefix, payload, signature] = parts;
  if (prefix !== PREFIX || !payload || !signature) return null;
  const expected = createHmac("sha256", secret)
    .update(`${prefix}.${payload}`)
    .digest("base64url");
  if (!safeEqual(signature, expected)) return null;
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!isClaims(parsed)) return null;
    if (
      (parsed.kind === "session" || parsed.kind === "magic") &&
      parsed.exp * 1000 <= nowMs
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}
