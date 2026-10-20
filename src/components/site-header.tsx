"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
import { NavIcon } from "@/components/site-nav-icons";
import {
  formatMinutes,
  remainingMinutes,
  type ModuleDuration,
} from "@/lib/progress/time-remaining";
import {
  courseLinks,
  marketingGroups,
  marketingHomeHref,
  marketingTopLinks,
} from "@/lib/marketing/site-nav";

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
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const menu = bar.querySelector<HTMLDetailsElement>(".site-nav__menu");
    const services = bar.querySelector<HTMLDetailsElement>(".site-nav__services");

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("a")) return;
      if (menu) menu.open = false;
      if (services) services.open = false;
    };
    const onMenuToggle = () => {
      document.documentElement.classList.toggle("menu-open", Boolean(menu?.open));
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (services?.open) {
        services.open = false;
        services.querySelector("summary")?.focus();
        return;
      }
      if (menu?.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };

    const syncHeight = () => {
      document.documentElement.style.setProperty("--nav-h", `${bar.offsetHeight}px`);
      const chrome = bar.parentElement;
      if (chrome) {
        document.documentElement.style.scrollPaddingTop = `${chrome.offsetHeight}px`;
      }
    };
    syncHeight();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(syncHeight);
    observer?.observe(bar);
    if (bar.parentElement) observer?.observe(bar.parentElement);

    bar.addEventListener("click", onClick);
    menu?.addEventListener("toggle", onMenuToggle);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      bar.removeEventListener("click", onClick);
      menu?.removeEventListener("toggle", onMenuToggle);
      document.removeEventListener("keydown", onKeyDown);
      observer?.disconnect();
      document.documentElement.classList.remove("menu-open");
    };
  }, []);

  return (
    <div className="site-chrome print:hidden">
      <header className="site-nav" ref={barRef}>
        <a className="site-nav__mark" href={marketingHomeHref} aria-label="Abracadabra AI home">
          abracadabra<span className="wm-dot">.</span>
        </a>
        <details className="site-nav__menu">
          <summary className="site-nav__toggle" aria-label="Menu">
            <span className="site-nav__glyph" aria-hidden="true" />
          </summary>
        </details>
        <nav className="site-nav__links" aria-label="Site">
          <details className="site-nav__services">
            <summary>Services</summary>
            <div className="site-nav__mega">
              {marketingGroups.map((group) => (
                <div
                  key={group.label}
                  className="site-nav__group"
                  role="group"
                  aria-label={group.label}
                >
                  <p className="site-nav__fn-name" aria-hidden="true">
                    {group.label}
                  </p>
                  {group.links.map((link) => (
                    <a key={link.href} className="site-nav__mega-link" href={link.href}>
                      <NavIcon name={link.icon} />
                      <span className="site-nav__text">
                        <strong>{link.title}</strong>
                        <span className="site-nav__desc">{link.description}</span>
                      </span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </details>
          {marketingTopLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={"cta" in link && link.cta ? "btn btn--primary site-nav__cta" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <div className="course-nav">
        <div className="course-nav__row">
          <p className="course-nav__kicker">This course</p>
          <nav className="course-nav__links" aria-label="Course">
            {courseLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="course-nav__tools">
            <CommandPalette modules={paletteModules} terms={paletteTerms} />
            <ThemeToggle />
          </div>
        </div>
        {showProgress ? (
          <div className="course-nav__progress" aria-label="Course progress">
            <div className="course-nav__progress-row">
              <Progress value={percent} className="h-1.5" />
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {Math.round(percent)}%
              </span>
              <ProgressBackupButtons />
              <ResetProgressButton />
            </div>
            <p>
              Progress saves on this device only.
              {minutesLeft > 0
                ? ` About ${formatMinutes(minutesLeft)} of lessons left.`
                : " All modules complete."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
