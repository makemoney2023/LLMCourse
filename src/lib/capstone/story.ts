export type CapstoneStory = {
  role: string;
  workflow: string;
  before: string;
  after: string;
  lesson: string;
};

/** Plain-text snippet in the capstone gallery's format, ready to email or paste. */
export function buildGalleryStory(story: CapstoneStory): string {
  const lines: [string, string][] = [
    ["Role", story.role],
    ["Workflow", story.workflow],
    ["Before", story.before],
    ["After", story.after],
    ["Lesson", story.lesson],
  ];
  const body = lines
    .map(([label, value]) => [label, value.trim()] as const)
    .filter(([, value]) => value.length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return `Capstone story for the gallery\n\n${body}\n`;
}

/** Role is optional; the before/after arc is what the gallery needs. */
export function storyIsComplete(story: CapstoneStory): boolean {
  return [story.workflow, story.before, story.after, story.lesson].every(
    (value) => value.trim().length > 0,
  );
}
