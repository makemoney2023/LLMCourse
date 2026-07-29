"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/progress-provider";
import type { ModuleMeta } from "@/lib/curriculum/types";
import { unlockReason } from "@/lib/progress/access";
import { cn } from "@/lib/utils";

export function ModuleList({
  modules,
  variant = "list",
}: {
  modules: ModuleMeta[];
  variant?: "list" | "grid";
}) {
  const { progress } = useProgress();

  return (
    <ol
      className={
        variant === "grid" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"
      }
    >
      {modules.map((mod) => {
        const done = progress.completedModules.includes(mod.id);
        const reason = unlockReason(progress, modules, mod.id);
        return (
          <li key={mod.id}>
            <Link
              href={`/modules/${mod.slug}`}
              className={
                variant === "grid"
                  ? "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card"
                  : "flex flex-col gap-1 rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between"
              }
              title={reason ?? undefined}
            >
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant={variant === "grid" ? "secondary" : "outline"}>
                    {variant === "grid" ? `Module ${mod.order}` : mod.order}
                  </Badge>
                  {done ? (
                    <span className="text-xs text-emerald-800">Complete</span>
                  ) : reason ? (
                    <span className="text-xs text-muted-foreground">
                      Jump ahead OK
                    </span>
                  ) : null}
                  {variant === "grid" ? (
                    <span className="text-xs text-muted-foreground">
                      {mod.durationMinutes} min
                    </span>
                  ) : null}
                </div>
                <p
                  className={
                    variant === "grid"
                      ? "font-heading text-xl tracking-tight group-hover:text-primary"
                      : "font-heading text-xl tracking-tight"
                  }
                >
                  {mod.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reason ?? mod.subtitle}
                </p>
              </div>
              {variant === "list" ? (
                <p className="text-xs text-muted-foreground sm:text-right">
                  {mod.durationMinutes} min
                  <br />
                  Workshop {mod.workshopSession}
                </p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
