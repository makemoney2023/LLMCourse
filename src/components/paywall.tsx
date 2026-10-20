import Link from "next/link";
import { PurchaseActions } from "@/components/purchase-actions";

export function Paywall({
  kicker = "Lifetime access",
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-[var(--ui-r-card)] border border-border bg-card p-8 shadow-[var(--shadow-raised)]">
        <p className="kicker text-primary">{kicker}</p>
        <h1 className="mt-3 font-heading text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          This part of the course is locked. The overview, the module list,
          Module 1, and the glossary are free. Modules 2–12, workshop decks,
          templates, exercises, sandboxes, and certificates come with lifetime
          access.
        </p>
        <div className="mt-6">
          <PurchaseActions />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/access" className="text-primary underline underline-offset-2">
            Already purchased? Sign in
          </Link>
          {" · "}
          <Link
            href="/modules/mental-model"
            className="text-primary underline underline-offset-2"
          >
            Preview Module 1
          </Link>
        </p>
      </div>
    </div>
  );
}
