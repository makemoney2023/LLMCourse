import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { Providers } from "@/components/providers";
import { listModules } from "@/lib/curriculum/load-curriculum";
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
  const totalModules = listModules().length;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-foreground">
        <Providers totalModules={totalModules}>
          <SkipLink />
          <SiteHeader />
          <main id="main-content" className="relative flex-1" tabIndex={-1}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
