"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildRolloutMailto } from "@/lib/marketing/build-rollout-mailto";
import { getContactEmail } from "@/lib/marketing/contact-email";

const CONTACT_SUBJECT = "LLM Leverage team rollout";

const fields = [
  { id: "contact-name", label: "Name", type: "text", key: "name" as const },
  {
    id: "contact-email",
    label: "Work email",
    type: "email",
    key: "workEmail" as const,
  },
  {
    id: "contact-company",
    label: "Company",
    type: "text",
    key: "company" as const,
  },
  { id: "contact-note", label: "Note", type: "text", key: "note" as const },
] as const;

export function HomeContact() {
  const contactEmail = getContactEmail();
  const [values, setValues] = useState({
    name: "",
    workEmail: "",
    company: "",
    note: "",
  });

  const mailtoHref = useMemo(() => {
    if (!contactEmail) return null;
    return buildRolloutMailto({
      to: contactEmail,
      subject: CONTACT_SUBJECT,
      ...values,
    });
  }, [contactEmail, values]);

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
                value={values[field.key]}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.key]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
          <div className="flex flex-col items-start gap-3 sm:col-span-2">
            {mailtoHref ? (
              <Button asChild>
                <a href={mailtoHref}>Email us about a rollout</a>
              </Button>
            ) : (
              <Button type="button" disabled aria-disabled="true">
                Email us about a rollout
              </Button>
            )}
            <p
              id="contact-helper"
              className="text-sm leading-6 text-muted-foreground"
            >
              {mailtoHref ? (
                <>
                  Opens your email app to{" "}
                  <a
                    href={mailtoHref}
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    {contactEmail}
                  </a>
                  . Your name, company, and note are included in the message.
                </>
              ) : (
                <>
                  Email coming soon — set{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    NEXT_PUBLIC_CONTACT_EMAIL
                  </code>{" "}
                  to enable this form.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
