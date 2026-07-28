"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TipState = {
  tip: string;
  href: string;
  top: number;
  left: number;
};

type Props = {
  html: string;
  className?: string;
};

/**
 * Renders learner HTML and shows a short glossary tip on hover/focus.
 * Click still follows the link to /glossary#id.
 */
export function GlossaryProse({ html, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tipId = useId();
  const [active, setActive] = useState<TipState | null>(null);
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

  const showFor = useCallback((el: HTMLAnchorElement) => {
    clearHide();
    const tip = el.getAttribute("data-glossary-tip") ?? "";
    const href = el.getAttribute("href") ?? "/glossary";
    const rect = el.getBoundingClientRect();
    setActive({
      tip,
      href,
      top: rect.bottom + 8,
      left: Math.min(
        Math.max(12, rect.left),
        window.innerWidth - 280,
      ),
    });
    el.setAttribute("aria-describedby", tipId);
  }, [tipId]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        "a.glossary-term",
      ) as HTMLAnchorElement | null;
      if (!target || !root.contains(target)) return;
      showFor(target);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest(
        "a.glossary-term",
      ) as HTMLAnchorElement | null;
      if (!target || !root.contains(target)) return;
      showFor(target);
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

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      clearHide();
    };
  }, [hide, showFor, tipId]);

  return (
    <>
      <div
        ref={rootRef}
        className={cn("prose-course", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {active ? (
        <div
          id={tipId}
          role="tooltip"
          className="fixed z-50 max-w-xs rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-none"
          style={{ top: active.top, left: active.left }}
          onPointerEnter={clearHide}
          onPointerLeave={hide}
        >
          <p>{active.tip}</p>
          <Link
            href={active.href}
            className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-2"
          >
            Open full glossary
          </Link>
        </div>
      ) : null}
    </>
  );
}
