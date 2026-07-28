"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { ModuleMeta } from "@/lib/curriculum/types";
import { useProgress } from "@/components/progress-provider";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ModuleNav({
  modules,
  currentSlug,
}: {
  modules: ModuleMeta[];
  currentSlug?: string;
}) {
  const { progress } = useProgress();

  return (
    <aside
      className="hidden w-64 shrink-0 lg:block"
      aria-label="Module navigation"
    >
      <ScrollArea className="h-[calc(100vh-8rem)] pr-3">
        <ol className="space-y-1">
          {modules.map((mod) => {
            const done = progress.completedModules.includes(mod.id);
            const active = mod.slug === currentSlug;
            return (
              <li key={mod.id}>
                <Link
                  href={`/modules/${mod.slug}`}
                  className={cn(
                    "flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      done
                        ? "border-emerald-700/40 bg-emerald-700/15 text-emerald-800"
                        : "border-border",
                    )}
                    aria-hidden
                  >
                    {done ? <Check className="size-3" /> : mod.order}
                  </span>
                  <span>
                    <span className="block font-medium text-foreground/90">
                      {mod.title}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {mod.durationMinutes} min · Workshop {mod.workshopSession}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </ScrollArea>
    </aside>
  );
}
