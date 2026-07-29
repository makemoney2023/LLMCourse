import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Swap this when a production inbox or Cal.com URL is ready. */
const CONTACT_EMAIL = "hello@llmleverage.course";
const MAILTO_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "LLM Leverage team rollout",
)}`;

const fields = [
  { id: "contact-name", label: "Name", type: "text" },
  { id: "contact-email", label: "Work email", type: "email" },
  { id: "contact-company", label: "Company", type: "text" },
  { id: "contact-note", label: "Note", type: "text" },
] as const;

export function HomeContact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-b border-border/70 bg-background/75"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-28">
        <div>
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
            Talk to us about a rollout.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
            Tell us your team size, tools, and timeline. We’ll reply with a
            suggested pilot plan.
          </p>
        </div>
        <div
          className="grid gap-5 rounded-xl border border-border/70 bg-card/70 p-6 shadow-sm sm:grid-cols-2 sm:p-8"
          aria-label="Contact details"
        >
          {fields.map((field) => (
            <div
              key={field.id}
              className={field.id === "contact-note" ? "sm:col-span-2" : ""}
            >
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                className="mt-2 bg-background"
                aria-describedby="contact-helper"
              />
            </div>
          ))}
          <div className="flex flex-col items-start gap-3 sm:col-span-2">
            <Button asChild>
              <a href={MAILTO_HREF}>Email us about a rollout</a>
            </Button>
            <p
              id="contact-helper"
              className="text-sm leading-6 text-muted-foreground"
            >
              Opens your email app to{" "}
              <a
                href={MAILTO_HREF}
                className="underline underline-offset-4 hover:text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
              . Include name, company, and team size in the note above if
              helpful.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
