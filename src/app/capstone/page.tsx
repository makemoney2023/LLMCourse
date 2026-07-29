import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CapstonePackBuilder,
  type PackTemplate,
} from "@/components/capstone-pack-builder";

export const metadata: Metadata = {
  title: "Capstone pack builder",
  description:
    "Draft your BRIEF, SOURCES, and HANDOFF files in the browser and download the finished context pack.",
};

const FILES: Omit<PackTemplate, "template">[] = [
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
    fileName: "HANDOFF.md",
    label: "HANDOFF.md — the clear-the-desk note",
    hint: "Goal, done checks, locked choices, open questions. This is what a fresh chat starts from.",
  },
];

export default function CapstonePage() {
  const files: PackTemplate[] = FILES.map((file) => ({
    ...file,
    template: fs.readFileSync(
      path.join(process.cwd(), "public", "templates", file.fileName),
      "utf8",
    ),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">
        Capstone pack builder
      </h1>
      <p className="mt-2 text-muted-foreground">
        The capstone asks you to run the full loop on real work. Build the
        three files of your context pack right here, then download them.
        Module 12 walks you through what goes in each.
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
      <div className="mt-10">
        <CapstonePackBuilder files={files} />
      </div>
    </div>
  );
}
