"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/components/progress-provider";
import { ResetProgressButton } from "@/components/reset-progress-button";
import { ProgressBackupButtons } from "@/components/progress-backup-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CommandPalette,
  type PaletteModule,
  type PaletteTerm,
} from "@/components/command-palette";
import {
  formatMinutes,
  remainingMinutes,
  type ModuleDuration,
} from "@/lib/progress/time-remaining";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/workshops", label: "Workshops" },
];

export function SiteHeader({
  moduleDurations,
  paletteModules,
  paletteTerms,
}: {
  moduleDurations: ModuleDuration[];
  paletteModules: PaletteModule[];
  paletteTerms: PaletteTerm[];
}) {
  const pathname = usePathname();
  const { progress, percent } = useProgress();
  const showProgress = pathname !== "/";
  const minutesLeft = remainingMinutes(progress, moduleDurations);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="group min-w-0">
            <p className="font-heading text-lg tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
              LLM Leverage
            </p>
            <p className="text-xs text-muted-foreground">
              The context loop course
            </p>
          </Link>
          <div className="flex items-center gap-1">
            <nav
              aria-label="Primary"
              className="flex items-center gap-1 sm:gap-2"
            >
              {links.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <CommandPalette modules={paletteModules} terms={paletteTerms} />
            <ThemeToggle />
          </div>
        </div>
        {showProgress ? (
          <div className="space-y-1.5" aria-label="Course progress">
            <div className="flex items-center gap-3">
              <Progress value={percent} className="h-1.5" />
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {Math.round(percent)}%
              </span>
              <ProgressBackupButtons />
              <ResetProgressButton />
            </div>
            <p className="text-[11px] leading-4 text-muted-foreground">
              Progress saves on this device only.
              {minutesLeft > 0
                ? ` About ${formatMinutes(minutesLeft)} of lessons left.`
                : " All modules complete."}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
