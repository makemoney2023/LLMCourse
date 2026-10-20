import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signingSecret } from "@/lib/billing/config";
import { signClaims } from "@/lib/billing/tokens";
import { getCourseAccess } from "@/lib/access/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your access",
};

export default async function WelcomePage() {
  const access = await getCourseAccess();
  if (!access.entitled || !access.email || !access.customerId) {
    redirect("/access");
  }
  const secret = signingSecret();
  const recoveryCode = secret
    ? signClaims(
        { kind: "code", email: access.email, customerId: access.customerId },
        secret,
      )
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">You are in</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Lifetime access is on this browser. Save the access code below — it is
        how you sign in on another device. You can also request a sign-in link
        from the checkout email when email delivery is configured.
      </p>
      {recoveryCode ? (
        <label className="mt-8 block text-sm">
          Access code
          <textarea
            readOnly
            className="mt-2 w-full rounded-lg border border-border bg-card p-3 font-mono text-xs leading-5"
            rows={4}
            value={recoveryCode}
          />
        </label>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/modules">Continue the course</Link>
        </Button>
        <form action="/api/access/sign-out" method="post">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
