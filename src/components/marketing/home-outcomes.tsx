const outcomes = [
  "Shared operating model (context loop)",
  "Fewer ungrounded answers (BRIEF/SOURCES habits)",
  "Role-relevant practice (ops / sales / eng / marketing overlays)",
  "Measurable completion (sequenced modules, quizzes, checkpoints, certificates)",
] as const;

export function HomeOutcomes() {
  return (
    <section className="border-b border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <h2 className="max-w-3xl font-heading text-3xl tracking-tight sm:text-4xl">
          What your organization gets.
        </h2>
        <ol className="mt-10 grid border-y border-border/70 sm:grid-cols-2">
          {outcomes.map((outcome, index) => (
            <li
              key={outcome}
              className="flex gap-5 border-b border-border/70 py-6 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <span
                aria-hidden="true"
                className="font-heading text-2xl text-primary/70"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="pt-1 text-base leading-7 text-foreground/90">
                {outcome}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
