"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GlossaryTermView = {
  id: string;
  term: string;
  shortDefinition: string;
  longDefinition: string;
};

type TipState = {
  tip: string;
  href: string;
  top: number;
  left: number;
};

type SheetState = {
  id: string;
  term: string;
  shortDefinition: string;
  longDefinition: string;
  href: string;
};

type Props = {
  html: string;
  className?: string;
  termsById?: Record<string, GlossaryTermView>;
};

function prefersCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Learner HTML with glossary tips (hover on fine pointers; sheet on click/tap).
 */
export function GlossaryProse({ html, className, termsById = {} }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tipId = useId();
  const [active, setActive] = useState<TipState | null>(null);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const hide = useCallback(() => {
    clearHide();
    hideTimer.current = setTimeout(() => setActive(null), 120);
  }, []);

  const openSheetFor = useCallback(
    (el: HTMLAnchorElement) => {
      const id = el.getAttribute("data-glossary-id") ?? "";
      const href = el.getAttribute("href") ?? `/glossary#${id}`;
      const tip = el.getAttribute("data-glossary-tip") ?? "";
      const termData = termsById[id];
      setActive(null);
      setSheet({
        id,
        term: termData?.term ?? el.textContent ?? id,
        shortDefinition: termData?.shortDefinition ?? tip,
        longDefinition: termData?.longDefinition ?? tip,
        href,
      });
    },
    [termsById],
  );

  const showHoverFor = useCallback(
    (el: HTMLAnchorElement) => {
      clearHide();
      // Delay hover tip so a real click isn't stolen by the floating tip.
      hideTimer.current = setTimeout(() => {
        const tip = el.getAttribute("data-glossary-tip") ?? "";
        const href = el.getAttribute("href") ?? "/glossary";
        const rect = el.getBoundingClientRect();
        setActive({
          tip,
          href,
          top: rect.bottom + 8,
          left: Math.min(Math.max(12, rect.left), window.innerWidth - 280),
        });
        el.setAttribute("aria-describedby", tipId);
      }, 320);
    },
    [tipId],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerOver = (event: PointerEvent) => {
      if (prefersCoarsePointer()) return;
      const target = (event.target as HTMLElement | null)?.closest(
        "a.glossary-term",
      ) as HTMLAnchorElement | null;
      if (!target || !root.contains(target)) return;
      showHoverFor(target);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (prefersCoarsePointer() || sheet) return;
      const target = (event.target as HTMLElement | null)?.closest(
        "a.glossary-term",
      ) as HTMLAnchorElement | null;
      if (!target || !root.contains(target)) return;
      showHoverFor(target);
    };

    const onPointerOut = (event: PointerEvent) => {
      const related = event.relatedTarget as Node | null;
      if (related && root.contains(related)) return;
      const tipEl = document.getElementById(tipId);
      if (related && tipEl?.contains(related)) return;
      hide();
    };

    const onFocusOut = (event: FocusEvent) => {
      const related = event.relatedTarget as Node | null;
      if (related && root.contains(related)) return;
      hide();
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        "a.glossary-term",
      ) as HTMLAnchorElement | null;
      if (!target || !root.contains(target)) return;
      if (event.metaKey || event.ctrlKey || event.button === 1) return;
      event.preventDefault();
      event.stopPropagation();
      openSheetFor(target);
    };

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("click", onClick, true);
    return () => {
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("click", onClick, true);
      clearHide();
    };
  }, [hide, openSheetFor, sheet, showHoverFor, tipId]);

  return (
    <>
      <div
        ref={rootRef}
        className={cn("prose-course", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {active && !sheet ? (
        <div
          id={tipId}
          role="tooltip"
          className="fixed z-50 max-w-xs rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground"
          style={{ top: active.top, left: active.left }}
          onPointerEnter={clearHide}
          onPointerLeave={hide}
        >
          <p>{active.tip}</p>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-primary underline underline-offset-2"
            onClick={() => {
              const el = rootRef.current?.querySelector(
                `a.glossary-term[href="${active.href}"]`,
              ) as HTMLAnchorElement | null;
              if (el) openSheetFor(el);
            }}
          >
            Open definition
          </button>
        </div>
      ) : null}

      {sheet ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={() => setSheet(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${tipId}-sheet-title`}
            data-testid="glossary-sheet"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-popover p-4 text-popover-foreground sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id={`${tipId}-sheet-title`}
              className="font-heading text-xl tracking-tight"
            >
              {sheet.term}
            </h2>
            <p className="mt-2 text-sm font-medium">{sheet.shortDefinition}</p>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
              {sheet.longDefinition.trim()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <Link href={sheet.href}>Open full glossary</Link>
              </Button>
              <Button type="button" variant="outline" onClick={() => setSheet(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
