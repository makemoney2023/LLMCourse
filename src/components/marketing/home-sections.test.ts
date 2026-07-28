import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const marketingDir = join(process.cwd(), "src/components/marketing");
const appDir = join(process.cwd(), "src/app");

function source(file: string) {
  return readFileSync(join(marketingDir, file), "utf8");
}

function appSource(file: string) {
  return readFileSync(join(appDir, file), "utf8");
}

function normalizedSource(file: string) {
  return source(file).replace(/\s+/g, " ");
}

describe("marketing home section contracts", () => {
  it("keeps the hero copy, motion, and CTA destinations exact", () => {
    const hero = source("home-hero.tsx");

    expect(hero).toContain("export function HomeHero");
    expect(hero).toContain("LLM Leverage");
    expect(hero).toContain("Train teams to get reliable AI output—not longer prompts.");
    expect(hero).toContain("animate-in fade-in slide-in-from-bottom-2");
    expect(hero).toContain('href="/modules/mental-model"');
    expect(hero).toContain('href="#rollout"');
    expect(hero).toContain('href="#contact"');
  });

  it("includes the approved narrative and inventory copy", () => {
    expect(source("home-problem.tsx")).toContain(
      "Tool access isn’t the same as capability.",
    );
    expect(source("home-outcomes.tsx")).toContain(
      "Measurable completion (sequenced modules, quizzes, checkpoints, certificates)",
    );
    expect(normalizedSource("home-included.tsx")).toContain(
      "12 modules · 4 workshop decks · static sandboxes · templates · glossary · capstone gallery.",
    );
  });

  it("embeds the loop map and exposes rollout and contact anchors", () => {
    const howItWorks = source("home-how-it-works.tsx");
    const rollout = source("home-rollout.tsx");
    const contact = source("home-contact.tsx");

    expect(howItWorks).toContain(
      'import { LoopMap } from "@/components/loop-map";',
    );
    expect(howItWorks).toContain("<LoopMap />");
    expect(rollout).toContain('id="rollout"');
    expect(contact).toContain('id="contact"');
    expect(contact).toContain('type="button"');
    expect(contact).toContain("disabled");
    expect(contact).toContain(
      "Email coming soon — reach us at [your address].",
    );
  });

  it("provides rollout and footer destinations", () => {
    const rollout = source("home-rollout.tsx");
    const footer = source("home-footer.tsx");

    for (const href of ["/workshops", "/modules", "/resources"]) {
      expect(rollout).toContain(`href="${href}"`);
    }
    for (const href of ["/modules/mental-model", "/workshops", "#contact"]) {
      expect(footer).toContain(`href: "${href}"`);
    }
  });

  it("keeps marketing sections on home and learner controls on modules", () => {
    const home = appSource("page.tsx");
    const modules = appSource("modules/page.tsx");
    const sectionNames = [
      "HomeHero",
      "HomeProblem",
      "HomeOutcomes",
      "HomeIncluded",
      "HomeHowItWorks",
      "HomeRollout",
      "HomeContact",
      "HomeFooter",
    ];

    let previousSectionIndex = -1;
    for (const sectionName of sectionNames) {
      expect(home).toContain(`<${sectionName} />`);
      const sectionIndex = home.indexOf(`<${sectionName} />`);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }

    for (const learnerComponent of [
      "ContinueCourseButton",
      "CheckpointBanner",
      "ModuleList",
    ]) {
      expect(home).not.toContain(`<${learnerComponent}`);
      expect(modules).toContain(`<${learnerComponent}`);
    }
  });
});
