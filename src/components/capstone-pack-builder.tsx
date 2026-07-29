"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type PackTemplate = {
  fileName: string;
  label: string;
  hint: string;
  template: string;
};

const STORAGE_PREFIX = "llm-course-capstone-";

function downloadMarkdown(fileName: string, contents: string) {
  const blob = new Blob([contents], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PackFileEditor({
  file,
  defaultOpen = false,
}: {
  file: PackTemplate;
  defaultOpen?: boolean;
}) {
  const storageKey = `${STORAGE_PREFIX}${file.fileName}`;
  const [value, setValue] = useState(file.template);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved != null) setValue(saved);
    setLoaded(true);
  }, [storageKey]);

  const handleChange = (next: string) => {
    setValue(next);
    window.localStorage.setItem(storageKey, next);
  };

  const resetToTemplate = () => {
    if (
      window.confirm(
        `Replace your ${file.fileName} draft with the blank template?`,
      )
    ) {
      window.localStorage.removeItem(storageKey);
      setValue(file.template);
    }
  };

  return (
    <details
      className="rounded-2xl border border-border/60 bg-card/30 px-4 py-3"
      open={defaultOpen}
    >
      <summary className="cursor-pointer font-heading text-lg tracking-tight">
        {file.label}
      </summary>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{file.hint}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => downloadMarkdown(file.fileName, value)}
            >
              Download {file.fileName}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={resetToTemplate}
            >
              Reset
            </Button>
          </div>
        </div>
        <textarea
          className="min-h-56 w-full rounded-xl border border-border bg-background p-4 font-mono text-sm leading-relaxed"
          value={value}
          disabled={!loaded}
          onChange={(event) => handleChange(event.target.value)}
          aria-label={`${file.fileName} contents`}
          spellCheck={false}
        />
      </div>
    </details>
  );
}

export function CapstonePackBuilder({ files }: { files: PackTemplate[] }) {
  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <PackFileEditor
          key={file.fileName}
          file={file}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
