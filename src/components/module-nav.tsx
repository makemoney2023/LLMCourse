"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ListTree } from "lucide-react";
import type { ModuleMeta } from "@/lib/curriculum/types";
import { useProgress } from "@/components/progress-provider";
import { ContinueCourseButton } from "@/components/continue-course-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { unlockReason } from "@/lib/progress/access";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function ModuleNavList({
  modules,
  currentSlug,
  onNavigate,
}: {
  modules: ModuleMeta[];
  currentSlug?: string;
  onNavigate?: () => void;
}) {
  const { progress } = useProgress();

  return (
    <ol className="space-y-1">
      {modules.map((mod) => {
        const done = progress.completedModules.includes(mod.id);
        const active = mod.slug === currentSlug;
        const reason = unlockReason(progress, modules, mod.id);
        return (
          <li key={mod.id}>
            <Link
              href={`/modules/${mod.slug}`}
              onClick={onNavigate}
              className={cn(
                "flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={reason ?? undefined}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  done
                    ? "border-emerald-700/40 bg-emerald-700/15 text-emerald-800 dark:border-emerald-300/40 dark:bg-emerald-300/15 dark:text-emerald-300"
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
  );
}

export function ModuleNav({
  modules,
  currentSlug,
  exerciseIdsByModule = {},
}: {
  modules: ModuleMeta[];
  currentSlug?: string;
  exerciseIdsByModule?: Record<string, string[]>;
}) {
  return (
    <aside
      className="hidden w-64 shrink-0 lg:block print:hidden"
      aria-label="Module navigation"
    >
      <div className="mb-3">
        <ContinueCourseButton
          modules={modules}
          exerciseIdsByModule={exerciseIdsByModule}
          label="Continue"
          className="w-full"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)] pr-3">
        <ModuleNavList modules={modules} currentSlug={currentSlug} />
      </ScrollArea>
    </aside>
  );
}

/** Slide-out module list for screens where the sidebar is hidden. */
export function MobileModuleNav({
  modules,
  currentSlug,
  exerciseIdsByModule = {},
}: {
  modules: ModuleMeta[];
  currentSlug?: string;
  exerciseIdsByModule?: Record<string, string[]>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <ListTree className="size-4" />
            All modules
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="border-b border-border/70">
            <SheetTitle>Modules</SheetTitle>
          </SheetHeader>
          <div className="px-3 pb-2">
            <ContinueCourseButton
              modules={modules}
              exerciseIdsByModule={exerciseIdsByModule}
              label="Continue"
              className="w-full"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-9rem)] px-3 pb-4">
            <ModuleNavList
              modules={modules}
              currentSlug={currentSlug}
              onNavigate={() => setOpen(false)}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
