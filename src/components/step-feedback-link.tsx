"use client";

import { buildFeedbackMailto } from "@/lib/feedback/feedback-mailto";
import { getContactEmail } from "@/lib/marketing/contact-email";

/** Two-click "this was confusing" escape hatch; hidden when no inbox is set. */
export function StepFeedbackLink({
  context,
  step,
}: {
  context: string;
  step: string | null;
}) {
  const email = getContactEmail();
  if (!email) return null;

  return (
    <p className="text-xs text-muted-foreground">
      Spot something confusing or wrong?{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground"
        href={buildFeedbackMailto(email, context, step)}
      >
        Tell us about this section
      </a>
      {" — it takes one minute and makes the course better."}
    </p>
  );
}
