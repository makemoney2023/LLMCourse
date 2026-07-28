"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ModuleDemo } from "@/lib/curriculum/load-demo";

export function WorkedDemo({ demo }: { demo: ModuleDemo }) {
  const [side, setSide] = useState<"before" | "after">("before");
  const src = side === "before" ? demo.beforeImage : demo.afterImage;
  const alt = side === "before" ? demo.altBefore : demo.altAfter;
  const caption = side === "before" ? demo.captionBefore : demo.captionAfter;

  return (
    <section
      aria-labelledby="worked-demo-heading"
      className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="worked-demo-heading" className="font-heading text-xl">
          {demo.title}
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={side === "before" ? "default" : "outline"}
            onClick={() => setSide("before")}
          >
            Before
          </Button>
          <Button
            type="button"
            size="sm"
            variant={side === "after" ? "default" : "outline"}
            onClick={() => setSide("after")}
          >
            After
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{caption}</p>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-auto w-full" />
      </div>
    </section>
  );
}
