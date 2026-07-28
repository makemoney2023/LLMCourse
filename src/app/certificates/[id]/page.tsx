import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/certificate-view";
import { listModules } from "@/lib/curriculum/load-curriculum";
import { SESSION_MODULE_IDS } from "@/lib/progress/checkpoints";

type Props = { params: Promise<{ id: string }> };

const CHECKPOINT_KEYS = [
  ...Object.keys(SESSION_MODULE_IDS),
  "course-complete",
] as const;

export function generateStaticParams() {
  const moduleIds = listModules().map((m) => ({ id: `module-${m.id}` }));
  const checkpoints = CHECKPOINT_KEYS.map((key) => ({
    id: `checkpoint-${key}`,
  }));
  return [...moduleIds, ...checkpoints];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id.startsWith("module-")) {
    const moduleId = id.slice("module-".length);
    const meta = listModules().find((m) => m.id === moduleId);
    return {
      title: meta ? `Certificate — ${meta.title}` : "Module certificate",
    };
  }
  if (id.startsWith("checkpoint-")) {
    return { title: "Session certificate" };
  }
  return { title: "Certificate" };
}

export default async function CertificatePage({ params }: Props) {
  const { id } = await params;
  if (!id || (!id.startsWith("module-") && !id.startsWith("checkpoint-"))) {
    notFound();
  }

  let moduleTitle: string | undefined;
  if (id.startsWith("module-")) {
    const moduleId = id.slice("module-".length);
    const meta = listModules().find((m) => m.id === moduleId);
    if (!meta) notFound();
    moduleTitle = meta.title;
  } else {
    const key = id.slice("checkpoint-".length);
    if (!CHECKPOINT_KEYS.includes(key as (typeof CHECKPOINT_KEYS)[number])) {
      notFound();
    }
  }

  return <CertificateView id={id} moduleTitle={moduleTitle} />;
}
