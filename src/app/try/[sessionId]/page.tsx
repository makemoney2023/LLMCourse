import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TryItSandbox } from "@/components/try-it-sandbox";
import { Button } from "@/components/ui/button";
import {
  listSandboxes,
  loadSandbox,
} from "@/lib/curriculum/load-sandboxes";

type Props = { params: Promise<{ sessionId: string }> };

export function generateStaticParams() {
  return listSandboxes().map((s) => ({ sessionId: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sessionId } = await params;
  const sandbox = loadSandbox(sessionId);
  return { title: sandbox ? sandbox.title : "Try it" };
}

export default async function TryPage({ params }: Props) {
  const { sessionId } = await params;
  const sandbox = loadSandbox(sessionId);
  if (!sandbox) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div>
        <p className="text-sm text-muted-foreground">{sandbox.subtitle}</p>
        <h1 className="font-heading text-4xl tracking-tight">{sandbox.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Static practice — no live model. Copy the starter, draft your answer,
          then compare.
        </p>
      </div>
      <TryItSandbox sandbox={sandbox} />
      <Button asChild variant="outline">
        <Link href="/resources">Back to resources</Link>
      </Button>
    </div>
  );
}
