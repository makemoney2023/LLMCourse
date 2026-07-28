import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            Tell us what your team needs. This preview is honest about the next
            step: the contact channel is not connected yet.
          </p>
        </div>
        <div
          className="grid gap-5 rounded-xl border border-border/70 bg-card/70 p-6 shadow-sm sm:grid-cols-2 sm:p-8"
          aria-label="Contact form preview"
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
            <Button type="button" disabled>
              Send rollout request
            </Button>
            <p
              id="contact-helper"
              className="text-sm leading-6 text-muted-foreground"
            >
              Email coming soon — reach us at [your address].
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
