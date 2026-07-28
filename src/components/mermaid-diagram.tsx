"use client";

import { useEffect, useId, useState } from "react";

export function MermaidDiagram({
  chart,
  className,
}: {
  chart: string;
  className?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily: "var(--font-body), sans-serif",
        });
        const { svg: rendered } = await mermaid.render(
          `mermaid-${reactId}`,
          chart,
        );
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre
        className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
        role="img"
        aria-label="Diagram source (render failed)"
      >
        {chart}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground"
        aria-busy="true"
      >
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className={className ?? "overflow-x-auto rounded-lg border border-border bg-card/60 p-4 [&_svg]:mx-auto"}
      role="img"
      aria-label="Module diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
