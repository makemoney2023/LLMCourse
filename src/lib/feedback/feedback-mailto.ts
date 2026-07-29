/** Prefilled mailto so a learner can flag a confusing spot in two clicks. */
export function buildFeedbackMailto(
  email: string,
  context: string,
  step: string | null,
): string {
  const where = step ? `${context} — ${step}` : context;
  const subject = `Course feedback: ${where}`;
  const body = [
    `Where: ${where}`,
    "",
    "What was confusing or wrong:",
    "",
    "What you expected instead:",
    "",
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
