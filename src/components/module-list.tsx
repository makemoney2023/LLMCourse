"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/progress-provider";
import type { ModuleMeta } from "@/lib/curriculum/types";
import { isModuleUnlocked, unlockReason } from "@/lib/progress/access";
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
        const unlocked = isModuleUnlocked(progress, modules, mod.id);
        const done = progress.completedModules.includes(mod.id);
        const reason = unlockReason(progress, modules, mod.id);
        return (
          <li key={mod.id}>
            <Link
              href={`/modules/${mod.slug}`}
              className={cn(
                variant === "grid"
                  ? "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card"
                  : "flex flex-col gap-1 rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:bg-card sm:flex-row sm:items-center sm:justify-between",
                !unlocked && "opacity-85",
              )}
              title={reason ?? undefined}
            >
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant={variant === "grid" ? "secondary" : "outline"}>
                    {variant === "grid" ? `Module ${mod.order}` : mod.order}
                  </Badge>
                  {!unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="size-3" /> Locked
                    </span>
                  ) : done ? (
                    <span className="text-xs text-emerald-800">Complete</span>
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
                  {unlocked ? mod.subtitle : reason}
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
