"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import { parseProgressFile, PROGRESS_EXPORT_FILENAME } from "@/lib/progress/export";
import { serializeProgress } from "@/lib/progress/progress";

export function ProgressBackupButtons() {
  const { progress, percent, importProgress } = useProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([serializeProgress(progress)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = PROGRESS_EXPORT_FILENAME;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const parsed = parseProgressFile(await file.text());
    if (!parsed) {
      window.alert(
        "That file does not look like a course progress backup. Nothing was changed.",
      );
      return;
    }
    if (
      window.confirm(
        "Replace the progress on this device with the backup file?",
      )
    ) {
      importProgress(parsed);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        disabled={percent === 0}
        onClick={handleExport}
        title="Download your progress as a file you can restore on another device"
      >
        Export
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        onClick={() => fileInputRef.current?.click()}
        title="Restore progress from a backup file"
      >
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-label="Import progress backup file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleImportFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
