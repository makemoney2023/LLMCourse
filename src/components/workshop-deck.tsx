"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  StickyNote,
} from "lucide-react";
import type { WorkshopSession } from "@/lib/curriculum/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WorkshopDeck({ session }: { session: WorkshopSession }) {
  const slides = session.slides;
  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [presenting, setPresenting] = useState(false);

  const clamp = useCallback(
    (next: number) => Math.max(0, Math.min(slides.length - 1, next)),
    [slides.length],
  );

  const go = useCallback(
    (delta: number) => setIndex((i) => clamp(i + delta)),
    [clamp],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setIndex(slides.length - 1);
      } else if (event.key === "n" || event.key === "N") {
        setShowNotes((v) => !v);
      } else if (event.key === "f" || event.key === "F") {
        setPresenting((v) => !v);
      } else if (event.key === "Escape" && presenting) {
        setPresenting(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, presenting, slides.length]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        presenting &&
          "fixed inset-0 z-50 bg-[oklch(0.16_0.03_240)] p-4 text-[oklch(0.96_0.01_220)] sm:p-8",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3",
          presenting && "text-[oklch(0.85_0.02_220)]",
        )}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant={presenting ? "secondary" : "outline"}>
            Slide {index + 1} / {slides.length}
          </Badge>
          {slide.timing ? (
            <span className="text-muted-foreground">{slide.timing}</span>
          ) : null}
          <span className="hidden text-xs text-muted-foreground sm:inline">
            ← → space · N notes · F present
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={presenting ? "secondary" : "outline"}
            onClick={() => setShowNotes((v) => !v)}
            aria-pressed={showNotes}
          >
            <StickyNote className="size-4" />
            Notes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={presenting ? "secondary" : "outline"}
            onClick={() => setPresenting((v) => !v)}
            aria-pressed={presenting}
          >
            {presenting ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
            {presenting ? "Exit" : "Present"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => go(1)}
            disabled={index >= slides.length - 1}
            aria-label="Next slide"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "relative flex min-h-[28rem] flex-1 flex-col justify-center overflow-hidden rounded-3xl border px-8 py-10 sm:min-h-[32rem] sm:px-14 sm:py-14",
          presenting
            ? "border-white/10 bg-[radial-gradient(ellipse_at_20%_0%,oklch(0.28_0.06_210/.55),transparent_55%),oklch(0.18_0.03_240)]"
            : "border-border/70 bg-card/70 shadow-sm",
        )}
        role="group"
        aria-roledescription="slide"
        aria-label={`${slide.title}. Slide ${index + 1} of ${slides.length}`}
      >
        <SlideChrome layout={slide.layout} presenting={presenting} />
        <p
          className={cn(
            "font-heading tracking-tight",
            slide.layout === "title"
              ? "text-4xl sm:text-6xl"
              : "text-3xl sm:text-5xl",
            presenting && "text-white",
          )}
        >
          {slide.title}
        </p>
        {slide.subtitle ? (
          <p
            className={cn(
              "mt-3 text-lg sm:text-xl",
              presenting ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {slide.subtitle}
          </p>
        ) : null}
        {slide.body ? (
          <p
            className={cn(
              "mt-6 max-w-3xl text-base leading-relaxed sm:text-lg",
              presenting ? "text-white/85" : "text-foreground/85",
            )}
          >
            {slide.body}
          </p>
        ) : null}
        {slide.bullets && slide.bullets.length > 0 ? (
          <ul
            className={cn(
              "mt-8 max-w-3xl space-y-3 text-lg sm:text-xl",
              presenting ? "text-white/90" : "text-foreground/90",
            )}
          >
            {slide.bullets.map((bullet, i) => {
              const text = slideText(bullet);
              return (
                <li key={`${slide.id}-b-${i}`} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-2 size-2 shrink-0 rounded-full",
                      presenting ? "bg-teal-300" : "bg-primary",
                    )}
                    aria-hidden
                  />
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
        {slide.steps && slide.steps.length > 0 ? (
          <ol
            className={cn(
              "mt-8 max-w-3xl list-decimal space-y-3 pl-6 text-lg sm:text-xl",
              presenting ? "text-white/90" : "text-foreground/90",
            )}
          >
            {slide.steps.map((step, i) => (
              <li key={`${slide.id}-s-${i}`} className="pl-1">
                {slideText(step)}
              </li>
            ))}
          </ol>
        ) : null}
        <p
          className={cn(
            "pointer-events-none absolute bottom-4 right-6 font-heading text-sm tracking-wide",
            presenting ? "text-white/35" : "text-muted-foreground/50",
          )}
        >
          {session.subtitle || `Session ${session.order}`}
        </p>
      </div>

      {showNotes && slide.notes ? (
        <aside
          className={cn(
            "max-h-[40vh] overflow-y-auto rounded-2xl border p-4 text-sm",
            presenting
              ? "border-white/15 bg-black/30 text-white/85"
              : "border-amber-700/20 bg-amber-50/80 text-foreground/90",
          )}
          aria-label="Facilitator notes"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            Facilitator notes
          </p>
          <div className="space-y-2 leading-relaxed whitespace-pre-wrap">
            {slide.notes}
          </div>
        </aside>
      ) : null}

      <nav aria-label="Slide thumbnails" className="flex gap-1.5 overflow-x-auto pb-1">
        {slides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 min-w-8 flex-1 rounded-full transition-colors",
              i === index
                ? presenting
                  ? "bg-teal-300"
                  : "bg-primary"
                : presenting
                  ? "bg-white/20 hover:bg-white/35"
                  : "bg-border hover:bg-foreground/30",
            )}
            aria-label={`Go to slide ${i + 1}: ${item.title}`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </nav>
    </div>
  );
}

/** YAML may parse `key: value` list items as objects — never render those raw. */
function slideText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => (v == null || v === true ? k : `${k}: ${String(v)}`))
      .join("; ");
  }
  return String(value);
}

function SlideChrome({
  layout,
  presenting,
}: {
  layout: string;
  presenting: boolean;
}) {
  const labels: Record<string, string> = {
    title: "Title",
    section: "Section",
    bullets: "Key points",
    steps: "Demo steps",
    activity: "Activity",
    discussion: "Discussion",
    takeaway: "Takeaway",
  };
  return (
    <p
      className={cn(
        "mb-4 text-xs font-semibold uppercase tracking-[0.18em]",
        presenting ? "text-teal-200/80" : "text-primary/80",
      )}
    >
      {labels[layout] ?? layout}
    </p>
  );
}
