import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listWorkshopSessions } from "@/lib/curriculum/load-curriculum";

export const metadata: Metadata = {
  title: "Workshops",
};

export default function WorkshopsPage() {
  const sessions = listWorkshopSessions();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-4xl tracking-tight">Workshop series</h1>
      <p className="mt-2 text-muted-foreground">
        Slide decks for live class. Use present mode, speaker notes, and arrow
        keys. Each session links to the self-paced modules for take-home.
      </p>
      <ol className="mt-8 space-y-4">
        {sessions.map((session) => (
          <li key={session.id}>
            <Link
              href={`/workshops/${session.id}`}
              className="block rounded-2xl border border-border/70 bg-card/50 p-5 transition-colors hover:bg-card"
            >
              <Badge variant="secondary" className="mb-2">
                Session {session.order}
              </Badge>
              <p className="font-heading text-2xl tracking-tight">
                {session.title.replace(/^Workshop Session \d+\s*[—-]\s*/i, "")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Modules:{" "}
                {session.moduleSlugs.map((slug, i) => (
                  <span key={slug}>
                    {i > 0 ? ", " : ""}
                    <span className="text-foreground/80">{slug}</span>
                  </span>
                ))}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
