import { describe, expect, it } from "vitest";
import { parseExercises, renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders headings and lists", () => {
    const html = renderMarkdown("# Hello\n\n- one");
    expect(html).toContain("<h1");
    expect(html).toContain("<li>");
  });
});

describe("parseExercises", () => {
  it("extracts ids, bodies, and answer keys", () => {
    const md = `
## Exercise 1: Map the loop
**id:** ex-1

Do the thing.

<details>
<summary>Answer key</summary>

Look for intent.

</details>

## Exercise 2: Trim context
**id:** ex-2

Trim it.

<details>
<summary>Answer key</summary>

Remove noise.

</details>
`;
    const exercises = parseExercises(md);
    expect(exercises).toHaveLength(2);
    expect(exercises[0]?.id).toBe("ex-1");
    expect(exercises[0]?.title).toBe("Map the loop");
    expect(exercises[0]?.bodyHtml).toContain("Do the thing");
    expect(exercises[0]?.answerHtml).toContain("intent");
    expect(exercises[0]?.bodyHtml).not.toContain("Answer key");
  });
});
