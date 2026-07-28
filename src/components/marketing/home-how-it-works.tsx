import { LoopMap } from "@/components/loop-map";

export function HomeHowItWorks() {
  return (
    <section className="border-b border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
            One map. Every tool.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            The context loop connects intent, standing context, the working
            window, tools, results, memory, and verification—so teams can
            diagnose quality instead of guessing at prompts.
          </p>
        </div>
        <div className="mt-10">
          <LoopMap />
        </div>
        <p className="mt-8 max-w-3xl text-base leading-7 text-foreground/90">
          Managers get a common language; employees can finish without a
          facilitator in the room.
        </p>
      </div>
    </section>
  );
}
