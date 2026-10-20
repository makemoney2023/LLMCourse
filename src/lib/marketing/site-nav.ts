/** Marketing header, copied from abracadabra `scripts/site-chrome.mjs`. */

export const MARKETING_ORIGIN = "https://abra-ca-dabra.app";

export function marketingHref(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`Marketing path must start with /: ${path}`);
  }
  return new URL(path, MARKETING_ORIGIN).href;
}

export type MarketingLink = {
  href: string;
  title: string;
  description: string;
  icon: string;
};

export type MarketingGroup = {
  label: string;
  links: MarketingLink[];
};

function service(
  slug: string,
  title: string,
  description: string,
): MarketingLink {
  return {
    href: marketingHref(`/services/${slug}/`),
    title,
    description,
    icon: slug,
  };
}

function learn(
  title: string,
  path: string,
  description: string,
): MarketingLink {
  return {
    href: marketingHref(path),
    title,
    description,
    icon: path,
  };
}

/** Services mega menu. Group order and copy match the live marketing header. */
export const marketingGroups: MarketingGroup[] = [
  {
    label: "Build",
    links: [
      service(
        "custom-apps",
        "Apps built around your workflow.",
        "Software around the way the work already runs.",
      ),
      service(
        "web-automation",
        "Put repetitive web work on autopilot.",
        "Repetitive web jobs that run themselves.",
      ),
      service(
        "answers-from-your-documents",
        "Instant answers from your own documents.",
        "Answers from the files you already keep.",
      ),
      service(
        "safe-code-execution",
        "Let AI run code, safely.",
        "AI that can run code, with a fence around it.",
      ),
      service(
        "machine-learning",
        "Machine learning that shows its working.",
        "Models that show a number and the reasons.",
      ),
      service(
        "mcp-connectors",
        "Connect your AI to your tools.",
        "Let your AI use your tools, safely.",
      ),
    ],
  },
  {
    label: "Create",
    links: [
      service(
        "ai-media",
        "On-brand images, video and voice, on demand.",
        "On-brand images, video and voice.",
      ),
      service(
        "voice-and-realtime-agents",
        "AI that answers your phone.",
        "A voice that answers from your records.",
      ),
      service(
        "ai-assistants-and-agents",
        "AI assistants that actually get things done.",
        "An assistant that finishes the request.",
      ),
    ],
  },
  {
    label: "Grow",
    links: [
      service(
        "ai-visibility",
        "Get found in AI search.",
        "Show up when someone asks an assistant.",
      ),
      service(
        "search-grounded-research",
        "Research you can trust, with every source cited.",
        "Research you can open and check.",
      ),
      service(
        "any-model-one-bill",
        "Every AI model. One bill.",
        "Every model, on one invoice.",
      ),
    ],
  },
  {
    label: "Learn",
    links: [
      learn(
        "LLM Leverage",
        "/course/llm-leverage/",
        "A course for better answers from any model.",
      ),
      learn("Notes", "/blog", "How to put AI to work."),
      learn("Films", "/films.html", "The work, shown."),
    ],
  },
];

/** Top-level items after Services. Non-home pages send the CTA to /start/. */
export const marketingTopLinks = [
  { href: marketingHref("/portfolio/"), label: "Work" },
  { href: marketingHref("/products/"), label: "Products" },
  { href: marketingHref("/blog"), label: "Blog" },
  { href: marketingHref("/films.html"), label: "Films" },
  {
    href: marketingHref("/start/"),
    label: "Start a project",
    cta: true,
  },
] as const;

export const marketingHomeHref = marketingHref("/");

/** Course pages stay on this host. The marketing bar does not replace them. */
export const courseLinks = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/resources", label: "Resources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/workshops", label: "Workshops" },
  { href: "/access", label: "Sign in" },
] as const;
