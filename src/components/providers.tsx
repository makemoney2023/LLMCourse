"use client";

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
    <TooltipProvider>
      <ProgressProvider totalModules={totalModules}>{children}</ProgressProvider>
    </TooltipProvider>
  );
}
