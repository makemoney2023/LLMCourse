"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/progress-provider";
import {
  computeCheckpoints,
  moduleCertificateUnlocked,
} from "@/lib/progress/checkpoints";

const NAME_STORAGE_KEY = "llm-course-learner-name";

function linkedInAddUrl(certTitle: string): string {
  const now = new Date();
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: certTitle,
    organizationName: "LLM Leverage Course",
    issueYear: String(now.getFullYear()),
    issueMonth: String(now.getMonth() + 1),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

const CHECKPOINT_TITLES: Record<string, string> = {
  "session-1-pack": "Session 1 — Research pack habit",
  "session-2-runbook": "Session 2 — Playbooks, tools, retrieval",
  "session-3-scale": "Session 3 — Compaction, memory, delegation",
  "session-4-craft": "Session 4 — Craft, verify, capstone",
  "course-complete": "LLM Leverage Course — Complete",
};

export function CertificateView({
  id,
  moduleTitle,
}: {
  id: string;
  /** Human title when id is module-* */
  moduleTitle?: string;
}) {
  const { progress, claimCert } = useProgress();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_STORAGE_KEY) ?? "");
  }, []);

  const handleNameChange = (next: string) => {
    setName(next);
    if (next.trim() === "") {
      window.localStorage.removeItem(NAME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(NAME_STORAGE_KEY, next);
    }
  };

  const { title, unlocked, claimId } = useMemo(() => {
    if (id.startsWith("module-")) {
      const moduleId = id.slice("module-".length);
      return {
        title: moduleTitle
          ? `Module certificate — ${moduleTitle}`
          : `Module certificate — ${moduleId}`,
        unlocked: moduleCertificateUnlocked(progress, moduleId),
        claimId: id,
      };
    }
    if (id.startsWith("checkpoint-")) {
      const key = id.slice("checkpoint-".length);
      const earned = computeCheckpoints(progress);
      return {
        title: CHECKPOINT_TITLES[key] ?? key,
        unlocked: earned.includes(key),
        claimId: id,
      };
    }
    return { title: "Certificate", unlocked: false, claimId: id };
  }, [id, moduleTitle, progress]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2 print:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href="/modules">Back to modules</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/resources">Resources</Link>
        </Button>
        {unlocked ? (
          <>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                claimCert(claimId);
                window.print();
              }}
            >
              Print / Save PDF
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={linkedInAddUrl(title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to LinkedIn
              </a>
            </Button>
          </>
        ) : null}
      </div>

      <article className="rounded-3xl border-2 border-border bg-card p-8 print:border-black">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          LLM Leverage Course
        </p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight">{title}</h1>
        {!unlocked ? (
          <p className="mt-6 text-muted-foreground">
            This certificate is locked. Finish the related modules (and Session 1
            pack ack when needed), then return.
          </p>
        ) : (
          <>
            <label className="mt-8 block text-sm print:hidden">
              Name on certificate
              <input
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <p className="mt-8 text-lg">
              This recognizes that{" "}
              <span className="font-medium">{name || "________________"}</span>{" "}
              completed the learning outcomes for this milestone.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Date: {new Date().toLocaleDateString()}
            </p>
            <p className="mt-6 text-sm">
              Skills practiced: context loop habits, plain-language setup, and
              verify-before-ship checks.
            </p>
          </>
        )}
      </article>
    </div>
  );
}
