import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Inter_Tight } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { Providers } from "@/components/providers";
import { listModules } from "@/lib/curriculum/load-curriculum";
import { loadGlossary } from "@/lib/curriculum/glossary";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const description =
  "A tool-agnostic course on the context loop: system instructions, tools, memory, and verification for better LLM output.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  alternates: {
    canonical: "./",
  },
  title: {
    default: "LLM Leverage Course",
    template: "%s · LLM Leverage",
  },
  description,
  openGraph: {
    type: "website",
    url: "./",
    siteName: "LLM Leverage Course",
    title: "LLM Leverage Course",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Leverage Course",
    description,
  },
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
      className={`${plexSans.variable} ${interTight.variable} ${plexMono.variable} h-full antialiased`}
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
