/**
 * Canonical site origin for metadata, sitemaps, and share links.
 * Set NEXT_PUBLIC_SITE_URL in production; Vercel previews fall back to
 * VERCEL_URL, and local dev to localhost.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
