import Link from "next/link";
import type { Metadata } from "next";
import { CheckpointBanner } from "@/components/checkpoint-banner";
import { RoleTrackPicker } from "@/components/role-track-picker";
import { listSandboxes } from "@/lib/curriculum/load-sandboxes";

export const metadata: Metadata = {
  title: "Resources",
};

export default function ResourcesPage() {
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
        <h2 className="font-heading text-2xl">Download templates</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a className="text-primary underline underline-offset-2" href="/templates/BRIEF.md" download>
              BRIEF.md — one-page project summary
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/templates/SOURCES.md" download>
              SOURCES.md — links, dates, why they matter
            </a>
          </li>
          <li>
            <a className="text-primary underline underline-offset-2" href="/templates/HANDOFF.md" download>
              HANDOFF.md — clear-the-desk note
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl">Try-it sandboxes</h2>
        <ul className="space-y-2">
          {sandboxes.map((s) => (
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
