import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="font-heading text-4xl tracking-tight">
        That page wandered off
      </h1>
      <p className="text-muted-foreground">
        The link may be old, or the module slug may have changed. Your progress
        is safe — it lives on this device.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/modules">Browse the modules</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to the homepage</Link>
        </Button>
      </div>
    </div>
  );
}
