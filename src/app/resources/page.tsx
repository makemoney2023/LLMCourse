import Link from "next/link";
import type { Metadata } from "next";
import { CheckpointBanner } from "@/components/checkpoint-banner";
import { Paywall } from "@/components/paywall";
import { RoleTrackPicker } from "@/components/role-track-picker";
import { getCourseAccess } from "@/lib/access/session";
import { listSandboxes } from "@/lib/curriculum/load-sandboxes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resources",
};

export default async function ResourcesPage() {
  const access = await getCourseAccess();
  if (!access.entitled) {
    return <Paywall title="Resources" kicker="Templates and practice" />;
  }
  const sandboxes = listSandboxes();

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl tracking-tight">Resources</h1>
          <p className="mt-2 text-muted-foreground">
            Templates, practice sandboxes, gallery, and glossary — in one place.
          </p>
        </div>
        <RoleTrackPicker />
      </div>

      <CheckpointBanner />

      <section className="space-y-3">
        <h2 className="font-heading text-2xl">Keep it fresh</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/review"
              className="text-primary underline underline-offset-2"
            >
              Review what you learned
            </Link>{" "}
            — a quick mixed quiz drawn from the modules you have completed.
          </li>
          <li>
            <Link
              href="/flashcards"
              className="text-primary underline underline-offset-2"
            >
              Glossary flashcards
            </Link>{" "}
            — flip cards for every term; missed cards come back around.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl">Build your context pack</h2>
        <p className="text-sm text-muted-foreground">
          <Link
            href="/capstone"
            className="text-primary underline underline-offset-2"
          >
            Capstone pack builder
          </Link>{" "}
          — draft BRIEF, SOURCES, and HANDOFF in the browser, then download
          the finished files.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl">Download templates</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/BRIEF.md" download>
              BRIEF.md — one-page project summary
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/SOURCES.md" download>
              SOURCES.md — links, dates, why they matter
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/HANDOFF.md" download>
              HANDOFF.md — clear-the-desk note
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/WALL_RULES.md" download>
              WALL_RULES.md — standing instructions
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/PLAYBOOK.md" download>
              PLAYBOOK.md — recipe card for one job
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/TOOLS.md" download>
              TOOLS.md — allow list and never-list
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/OWNERSHIP.md" download>
              OWNERSHIP.md — who maintains what
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/VERIFY.md" download>
              VERIFY.md — pre-ship checklist
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/api/templates/LOOKBACK.md" download>
              LOOKBACK.md — post-run reflection
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl">Try-it sandboxes</h2>
        <h3 className="font-heading text-lg text-muted-foreground">
          Module practice
        </h3>
        <ul className="space-y-2">
          {sandboxes
            .filter((s) => s.id.startsWith("module-"))
            .map((s) => (
              <li key={s.id}>
                <Link
                  href={`/try/${s.id}`}
                  className="text-primary underline underline-offset-2"
                >
                  {s.title}
                </Link>
                {s.subtitle ? (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {s.subtitle}
                  </span>
                ) : null}
              </li>
            ))}
        </ul>
        <h3 className="font-heading text-lg text-muted-foreground">
          Workshop practice
        </h3>
        <ul className="space-y-2">
          {sandboxes
            .filter((s) => s.id.startsWith("session-"))
            .map((s) => (
              <li key={s.id}>
                <Link
                  href={`/try/${s.id}`}
                  className="text-primary underline underline-offset-2"
                >
                  {s.title}
                </Link>
                {s.subtitle ? (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {s.subtitle}
                  </span>
                ) : null}
              </li>
            ))}
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-heading text-2xl">More</h2>
        <p>
          <Link href="/glossary" className="text-primary underline underline-offset-2">
            Glossary
          </Link>
        </p>
        <p>
          <Link href="/gallery" className="text-primary underline underline-offset-2">
            Capstone gallery
          </Link>
        </p>
      </section>
    </div>
  );
}
