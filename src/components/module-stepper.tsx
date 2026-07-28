"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepperItem = {
  id: string;
  title: string;
  status: "done" | "current" | "locked" | "available";
};

export function ModuleStepper({
  items,
  onSelect,
}: {
  items: StepperItem[];
  onSelect?: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Module steps"
      className="sticky top-16 z-10 -mx-1 overflow-x-auto rounded-2xl border border-border/70 bg-background/95 p-2 backdrop-blur"
    >
      <ol className="flex min-w-max gap-1">
        {items.map((item, index) => {
          const clickable = item.status !== "locked" && onSelect;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors sm:text-sm",
                  item.status === "current" &&
                    "bg-secondary font-medium text-foreground",
                  (item.status === "done" || item.status === "available") &&
                    "text-foreground/80 hover:bg-muted",
                  item.status === "locked" &&
                    "cursor-not-allowed text-muted-foreground/70",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    item.status === "done" &&
                      "border-emerald-700/40 bg-emerald-700/15 text-emerald-800",
                    item.status === "current" &&
                      "border-foreground/30 bg-background",
                    item.status === "available" && "border-border bg-background",
                    item.status === "locked" && "border-border",
                  )}
                  aria-hidden
                >
                  {item.status === "done" ? (
                    <Check className="size-3" />
                  ) : item.status === "locked" ? (
                    <Lock className="size-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{item.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
