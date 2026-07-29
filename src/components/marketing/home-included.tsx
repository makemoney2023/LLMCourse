import { listModules } from "@/lib/curriculum/load-curriculum";

export function HomeIncluded() {
  const modules = listModules();

  return (
    <section className="border-b border-border/70 bg-secondary/45">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Built for class and self-paced.
        </h2>
        <p className="mt-7 max-w-5xl text-lg leading-8 text-foreground/90">
          About 5 hours self-paced · 4 workshop sessions · 12 modules ·
          sandboxes · templates · glossary · capstone gallery.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          Tool-agnostic on purpose—habits transfer when the vendor stack
          changes.
        </p>
        <ol className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {modules.map((mod) => (
            <li
              key={mod.id}
              className="flex gap-3 text-sm leading-6 text-foreground/90"
            >
              <span className="font-heading text-primary/70">
                {String(mod.order).padStart(2, "0")}
              </span>
              <span>
                <span className="font-medium">{mod.title}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — {mod.subtitle}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
