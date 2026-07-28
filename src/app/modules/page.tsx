import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listModules } from "@/lib/curriculum/load-curriculum";

export const metadata: Metadata = {
  title: "Modules",
};

export default function ModulesPage() {
  const modules = listModules();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Modules</h1>
      <p className="mt-2 text-muted-foreground">
        Work in order. Each lesson uses plain language, then exercises and a
        short quiz.
      </p>
      <ol className="mt-8 space-y-3">
        {modules.map((mod) => (
          <li key={mod.id}>
            <Link
              href={`/modules/${mod.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{mod.order}</Badge>
                  <span className="font-heading text-xl tracking-tight">
                    {mod.title}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{mod.subtitle}</p>
              </div>
              <p className="text-xs text-muted-foreground sm:text-right">
                {mod.durationMinutes} min
                <br />
                Workshop {mod.workshopSession}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
