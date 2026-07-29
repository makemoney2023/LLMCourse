export type RolloutMailtoFields = {
  to: string;
  subject: string;
  name: string;
  workEmail: string;
  company: string;
  note: string;
};

export function buildRolloutMailto(fields: RolloutMailtoFields): string {
  const lines = [
    fields.name.trim() ? `Name: ${fields.name.trim()}` : null,
    fields.workEmail.trim() ? `Work email: ${fields.workEmail.trim()}` : null,
    fields.company.trim() ? `Company: ${fields.company.trim()}` : null,
    fields.note.trim() ? `Note: ${fields.note.trim()}` : null,
  ].filter((line): line is string => Boolean(line));

  const parts = [`subject=${encodeURIComponent(fields.subject)}`];
  if (lines.length > 0) {
    parts.push(`body=${encodeURIComponent(lines.join("\n"))}`);
  }
  return `mailto:${fields.to}?${parts.join("&")}`;
}
