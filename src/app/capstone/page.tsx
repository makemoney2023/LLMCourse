import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import { CapstoneFlow } from "@/components/capstone-flow";
import type { PackTemplate } from "@/components/capstone-pack-builder";

export const metadata: Metadata = {
  title: "Capstone pack builder",
  description:
    "Scope your capstone, draft the full eight-piece context pack in the browser, run it, and write the look-back.",
};

const PACK_FILES: Omit<PackTemplate, "template">[] = [
  {
    fileName: "BRIEF.md",
    label: "BRIEF.md — the one-page summary",
    hint: "What the project is, done-when checks, and hard limits. Write it so a stranger could take over.",
  },
  {
    fileName: "SOURCES.md",
    label: "SOURCES.md — where the facts came from",
    hint: "Links with dates and why each one matters. No source, no claim.",
  },
  {
    fileName: "WALL_RULES.md",
    label: "WALL_RULES.md — standing instructions",
    hint: "Under ten lines. Rules, not facts — facts live in BRIEF and SOURCES.",
  },
  {
    fileName: "PLAYBOOK.md",
    label: "PLAYBOOK.md — the recipe card",
    hint: "Trigger, steps, and done-when checks for this one kind of job.",
  },
  {
    fileName: "TOOLS.md",
    label: "TOOLS.md — the allow list",
    hint: "What is allowed for this job, and what never happens without a person.",
  },
  {
    fileName: "OWNERSHIP.md",
    label: "OWNERSHIP.md — who maintains what",
    hint: "Pack owner, merge owner, final approval, and a revisit date.",
  },
  {
    fileName: "HANDOFF.md",
    label: "HANDOFF.md — the clear-the-desk note",
    hint: "Goal, done checks, locked choices, open questions. A fresh chat starts from this.",
  },
  {
    fileName: "VERIFY.md",
    label: "VERIFY.md — the pre-ship checklist",
    hint: "The checks you run before anything leaves your desk.",
  },
];

const LOOKBACK_FILE: Omit<PackTemplate, "template"> = {
  fileName: "LOOKBACK.md",
  label: "LOOKBACK.md — write this after the run",
  hint: "One metric vs the old habit, which loop stop failed first, and the default you keep.",
};

function readTemplate(fileName: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), "public", "templates", fileName),
    "utf8",
  );
}

export default function CapstonePage() {
  const packFiles: PackTemplate[] = PACK_FILES.map((file) => ({
    ...file,
    template: readTemplate(file.fileName),
  }));
  const lookbackFile: PackTemplate = {
    ...LOOKBACK_FILE,
    template: readTemplate(LOOKBACK_FILE.fileName),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-heading text-4xl tracking-tight">
          Capstone pack builder
        </h1>
        <p className="mt-2 text-muted-foreground">
          Run one real job through the whole loop. Scope it, build the
          eight-piece pack, check readiness, run with a timer, then write the
          look-back. Drafts save on this device as you type.
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/modules/capstone-lab"
            className="text-primary underline underline-offset-2"
          >
            Open Module 12: Capstone lab
          </Link>
          {" · "}
          <Link
            href="/gallery"
            className="text-primary underline underline-offset-2"
          >
            See finished examples in the gallery
          </Link>
        </p>
      </div>

      <CapstoneFlow packFiles={packFiles} lookbackFile={lookbackFile} />
    </div>
  );
}
