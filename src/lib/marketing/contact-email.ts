/** Public contact inbox for rollout inquiries. Set via env — never hardcode a personal address. */
export function getContactEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw ? raw : null;
}
