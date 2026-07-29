import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { Providers } from "@/components/providers";
import { listModules } from "@/lib/curriculum/load-curriculum";
import { loadGlossary } from "@/lib/curriculum/glossary";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LLM Leverage Course",
    template: "%s · LLM Leverage",
  },
  description:
    "A tool-agnostic course on the context loop: system instructions, tools, memory, and verification for better LLM output.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const modules = listModules();
  const glossary = loadGlossary();
  const moduleDurations = modules.map((m) => ({
    id: m.id,
    durationMinutes: m.durationMinutes,
  }));
  const paletteModules = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    order: m.order,
  }));
  const paletteTerms = glossary.terms.map((t) => ({
    id: t.id,
    term: t.term,
    shortDefinition: t.shortDefinition,
  }));

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body text-foreground">
        <Providers totalModules={modules.length}>
          <SkipLink />
          <SiteHeader
            moduleDurations={moduleDurations}
            paletteModules={paletteModules}
            paletteTerms={paletteTerms}
          />
          <main id="main-content" className="relative flex-1" tabIndex={-1}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
