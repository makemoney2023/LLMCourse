import type { Metadata } from "next";
import Link from "next/link";
import { AccessSignIn } from "@/components/access-sign-in";
import { PurchaseActions } from "@/components/purchase-actions";
import { getCourseAccess } from "@/lib/access/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy or sign in",
  description: "Lifetime access to the LLM Leverage course is $149, paid once.",
};

type Props = {
  searchParams: Promise<{ checkout?: string; signin?: string }>;
};

export default async function AccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const access = await getCourseAccess();

  return (
    <div className="mx-auto grid max-w-5xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <section>
        <p className="text-sm text-muted-foreground">LLM Leverage course</p>
        <h1 className="mt-2 font-heading text-4xl tracking-tight">
          Lifetime access, $149
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          One payment. No subscription. You keep the modules, workshop decks,
          templates, exercises, and certificate. The overview, module list,
          Module 1, and glossary stay free either way.
        </p>
        {access.entitled ? (
          <p className="mt-6 text-sm">
            You are signed in.{" "}
            <Link
              href="/access/welcome"
              className="text-primary underline underline-offset-2"
            >
              Open your access code
            </Link>
            {" · "}
            <Link
              href="/modules"
              className="text-primary underline underline-offset-2"
            >
              Continue the course
            </Link>
          </p>
        ) : (
          <div className="mt-6">
            <PurchaseActions />
          </div>
        )}
        {params.checkout === "cancelled" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Checkout was cancelled. You have not been charged.
          </p>
        ) : null}
        {params.checkout === "unpaid" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            We could not confirm a paid checkout for this course.
          </p>
        ) : null}
      </section>
      <section className="rounded-xl border border-border/70 bg-card/70 p-6 sm:p-8">
        <h2 className="font-heading text-2xl tracking-tight">Sign in later</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use the email from checkout, or the access code shown after payment.
        </p>
        {params.signin === "invalid" ? (
          <p className="mt-3 text-sm text-muted-foreground">
            That sign-in link is invalid or expired.
          </p>
        ) : null}
        <div className="mt-6">
          <AccessSignIn />
        </div>
      </section>
    </div>
  );
}
