/** Public course origin used for metadata, sitemaps, and share links. */
export const CANONICAL_SITE_URL = "https://learn.abra-ca-dabra.app";

/**
 * Prefer NEXT_PUBLIC_SITE_URL. An old Vercel preview still honors VERCEL_URL.
 * Local `next dev` stays on localhost. Everywhere else, the course is
 * https://learn.abra-ca-dabra.app.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return CANONICAL_SITE_URL;
}
