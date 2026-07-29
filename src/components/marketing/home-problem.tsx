export function HomeProblem() {
  return (
    <section className="border-b border-border/70 bg-background/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-28">
        <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
          Tool access isn’t the same as capability.
        </h2>
        <div className="mt-6 max-w-2xl lg:mt-0">
          <p className="text-lg leading-8 text-muted-foreground">
            Every seat has ChatGPT or Claude. Almost no one has a shared way to
            use it. The result: everyone reinvents prompts from scratch, quality
            swings team to team, and nobody catches invented facts until a
            client does. Prompt-tips training doesn’t fix this—it goes stale the
            moment the tool’s UI changes.
          </p>
          <p className="mt-5 text-base leading-7 text-foreground/85">
            Built from real workshop pilots with ops, sales, and eng teams.
          </p>
        </div>
      </div>
    </section>
  );
}
