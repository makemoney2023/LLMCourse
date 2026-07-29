/** Hash fragment used by Continue links (`#step-orient`, `#step-practice`, …). */
export function stepIdToHash(stepId: string): string {
  return `step-${stepId}`;
}

/** Parse a location hash into a module step id, or null if invalid. */
export function parseStepHash(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw.startsWith("step-")) return null;
  const stepId = raw.slice("step-".length);
  return stepId.length > 0 ? stepId : null;
}
