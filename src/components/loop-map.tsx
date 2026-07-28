"use client";

import { useState } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { cn } from "@/lib/utils";

const NODES = [
  {
    id: "intent",
    label: "Your goal",
    detail: "What you want and what “done” means. This starts every turn.",
  },
  {
    id: "standing",
    label: "Wall rules",
    detail: "Standing instructions, always-on rules, recipe cards, and app lists.",
  },
  {
    id: "window",
    label: "Desk space",
    detail:
      "The context window: rules, chat, lookups, and tool results share limited space.",
  },
  {
    id: "model",
    label: "Helper thinking",
    detail: "The helper plans, answers, or opens an allowed app.",
  },
  {
    id: "tools",
    label: "Apps & lookup",
    detail: "Tools and retrieval bring fresh evidence onto the desk.",
  },
  {
    id: "observe",
    label: "Results back",
    detail: "Tool results return to the desk as new working papers.",
  },
  {
    id: "memory",
    label: "Sticky notes",
    detail: "Summaries and memory notes that help next time.",
  },
  {
    id: "verify",
    label: "Check your work",
    detail: "Checklists and approvals that close the quality loop.",
  },
] as const;

const LOOP_CHART = `flowchart LR
  intent[UserIntent_and_Spec]
  standing[StandingContext]
  window[ContextWindow]
  model[ModelReasoning]
  tools[Tools_MCP_Retrieval]
  observe[ToolResults_and_Observation]
  memory[Memory_and_Compaction]
  verify[HumanVerify]

  intent --> window
  standing --> window
  memory --> window
  window --> model
  model --> tools
  tools --> observe
  observe --> window
  model --> verify
  verify --> intent
  observe --> memory`;

export function LoopMap() {
  const [active, setActive] = useState<(typeof NODES)[number]["id"]>("window");
  const activeNode = NODES.find((n) => n.id === active) ?? NODES[2];

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <MermaidDiagram chart={LOOP_CHART} />
      <div
        className="flex flex-wrap gap-2"
        role="listbox"
        aria-label="Loop nodes"
        aria-activedescendant={`loop-node-${active}`}
      >
        {NODES.map((node) => (
          <button
            key={node.id}
            id={`loop-node-${node.id}`}
            type="button"
            role="option"
            aria-selected={active === node.id}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-all sm:text-sm",
              active === node.id
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card/70 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
            onClick={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
          >
            {node.label}
          </button>
        ))}
      </div>
      <div
        className="rounded-xl border border-border/70 bg-card/60 p-4 transition-colors"
        aria-live="polite"
      >
        <p className="font-heading text-lg tracking-tight">{activeNode.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{activeNode.detail}</p>
      </div>
    </div>
  );
}
