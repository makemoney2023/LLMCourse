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

function PackFileEditor({ file }: { file: PackTemplate }) {
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
    <section className="space-y-3" aria-label={file.fileName}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-heading text-2xl tracking-tight">
            {file.label}
          </h2>
          <p className="text-sm text-muted-foreground">{file.hint}</p>
        </div>
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
        className="min-h-72 w-full rounded-xl border border-border bg-background p-4 font-mono text-sm leading-relaxed"
        value={value}
        disabled={!loaded}
        onChange={(event) => handleChange(event.target.value)}
        aria-label={`${file.fileName} contents`}
        spellCheck={false}
      />
    </section>
  );
}

export function CapstonePackBuilder({ files }: { files: PackTemplate[] }) {
  return (
    <div className="space-y-12">
      <p className="text-sm text-muted-foreground">
        Drafts save on this device as you type. Download each file when it is
        ready and drop the three into your project folder — that is your
        context pack.
      </p>
      {files.map((file) => (
        <PackFileEditor key={file.fileName} file={file} />
      ))}
    </div>
  );
}
