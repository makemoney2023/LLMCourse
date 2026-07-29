"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/progress-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({
  children,
  totalModules,
}: {
  children: React.ReactNode;
  totalModules: number;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ProgressProvider totalModules={totalModules}>
          {children}
        </ProgressProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
