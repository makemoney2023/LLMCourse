import { describe, expect, it } from "vitest";
import type { GlossaryTerm } from "./glossary";
import { linkGlossaryTerms } from "./link-glossary";

const terms: GlossaryTerm[] = [
  {
    id: "context-window",
    term: "context window",
    aliases: ["context windows"],
    shortDefinition: "Desk for one session.",
    longDefinition: "Longer desk explanation.",
    relatedModules: [],
  },
  {
    id: "playbook",
    term: "playbook",
    aliases: ["recipe card"],
    shortDefinition: "A recipe card for one job.",
    longDefinition: "Longer playbook explanation.",
    relatedModules: [],
  },
  {
    id: "mcp",
    term: "MCP",
    aliases: ["Model Context Protocol"],
    shortDefinition: "Shared app menu.",
    longDefinition: "Longer MCP explanation.",
    relatedModules: [],
  },
];

describe("linkGlossaryTerms", () => {
  it("links the first occurrence and preserves casing", () => {
    const html = "<p>The Context Window is limited. Another context window later.</p>";
    const out = linkGlossaryTerms(html, terms);
    expect(out).toContain(
      'href="/glossary#context-window"',
    );
    expect(out).toContain(">Context Window</a>");
    expect(out.match(/glossary#context-window/g)?.length).toBe(1);
    expect(out).toContain("Another context window later");
  });

  it("skips text inside links, code, pre, and headings", () => {
    const html = [
      "<h2>context window title</h2>",
      "<p>See <a href='/x'>context window</a> and <code>context window</code>.</p>",
      "<pre>context window</pre>",
      "<p>Real context window here.</p>",
    ].join("");
    const out = linkGlossaryTerms(html, terms);
    expect(out).toContain("<h2>context window title</h2>");
    expect(out).toContain("<code>context window</code>");
    expect(out).toContain("<pre>context window</pre>");
    expect(out.match(/class="glossary-term"/g)?.length).toBe(1);
    expect(out).toContain(">context window</a> here.");
  });

  it("prefers the longest matching phrase when overlapping", () => {
    const html = "<p>Use Model Context Protocol today.</p>";
    const out = linkGlossaryTerms(html, terms);
    expect(out).toContain('data-glossary-id="mcp"');
    expect(out).toContain(">Model Context Protocol</a>");
  });

  it("emits tip and id data attributes", () => {
    const html = "<p>Write a playbook next.</p>";
    const out = linkGlossaryTerms(html, terms);
    expect(out).toContain('data-glossary-id="playbook"');
    expect(out).toContain('data-glossary-tip="A recipe card for one job."');
    expect(out).toContain('class="glossary-term"');
  });

  it("links recipe card alias to playbook", () => {
    const html = "<p>Open the recipe card when needed.</p>";
    const out = linkGlossaryTerms(html, terms);
    expect(out).toContain('data-glossary-id="playbook"');
    expect(out).toContain(">recipe card</a>");
  });
});
