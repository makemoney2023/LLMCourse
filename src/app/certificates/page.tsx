import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { listModules } from "@/lib/curriculum/load-curriculum";

export const metadata: Metadata = {
  title: "Certificates",
};

export default function CertificatesIndexPage() {
  const modules = listModules();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Certificates</h1>
      <p className="mt-2 text-muted-foreground">
        Finish a module quiz to unlock its certificate. Session certificates
        unlock from the Modules checkpoints banner.
      </p>
      <ul className="mt-8 space-y-2">
        {modules.map((mod) => (
          <li key={mod.id}>
            <Link
              href={`/certificates/module-${mod.id}`}
              className="text-primary underline underline-offset-2"
            >
              Module {mod.order}: {mod.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/modules">Back to modules</Link>
        </Button>
      </div>
    </div>
  );
}
