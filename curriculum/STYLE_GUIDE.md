# Grade-5 plain language style guide

Use this for every learner-facing rewrite (lessons, exercises, quizzes, COURSE.md, slide titles/bullets/steps/body, module.yaml learner fields).

## Rules

1. Most sentences under 15 words. Break long thoughts.
2. Prefer common words. If you use a hard term, define it in the next sentence with a real-life analogy. The in-app glossary also links first uses.
3. One idea per paragraph. One job per section.
4. Voice: “you” + concrete examples (email, report, checklist).
5. Lesson shape (exact H2 titles):
   - In plain words — exact bullet lines:
     - `- **Goal:** …`
     - `- **Do this:** …`
     - `- **You'll know it worked:** …`
   - What this is
   - Why it matters (one story)
   - Big ideas (plain meaning → tiny example; prefer before/after pairs)
   - Where this sits in the loop
   - What goes wrong if you skip it
   - Where this shows up in tools
   - Tips
   Keep vendor brand names out of lesson prose when a plain label works (e.g. “crawl tool”). Brand names may appear in tool-mapping tables and facilitator demos only.
6. Keep accuracy. Same ideas, simpler words.
7. Facilitator notes stay clear adult language with full demo steps.

## Lay-person polish

1. **Plain synonym before jargon.** Example: “always-on rules (standing instructions).”
2. **File names second.** Example: “a one-page project summary (BRIEF.md).”
3. **Neighbor-only loop placement.** Modules 2–12 name at most two neighbors. Module 1 keeps the full map.
4. **One analogy per section.** Do not stack desk + wall + binder + recipe in one paragraph.
5. **Expand acronyms on first use.** Glossary covers hover definitions after that.
6. **Before / after pairs** for hard ideas when you can.
7. **In plain words** comes first so readers know the destination before vocabulary.
8. **Gloss a file name in full once per lesson.** First mention: "a one-page project summary (BRIEF.md)." Every mention after that in the same lesson: just "BRIEF.md" — the in-app glossary hover covers the rest. Do not re-spell the parenthetical every time.
9. **Vary the definition sentence template.** Don't default every key term to "X is like Y." Rotate: term-last ("You pull it out only when needed — that's a **playbook**."), question form ("What steers every answer before you type? **Standing instructions**."), or plain statement ("**Retrieval** means looking up the right page before you answer."). Reserve "is like" for at most one term per lesson.
10. **Prefer parallel full sentences over noun-fragment bullets** when a bulleted list is standing in for prose (e.g. explaining what fills a space, or what a good version includes). Fragments are fine for short reference lists (trigger words, file names); give each item a verb when the list is explaining a concept.
11. **Split dense callout lines.** `Do this:`, `Design rule:`, and `You'll know it worked:` lines are the most-read lines in a lesson — keep each one under ~15 words. If a line needs an em-dash plus two commas to fit everything, it's two sentences, not one.

## Glossary authoring

- Canonical file: `curriculum/glossary.yaml`
- `shortDefinition` for hover tips; `longDefinition` for `/glossary`
- Unique ids; aliases must not collide (case-insensitive)
- See `docs/COURSE_OPERATIONS.md`

## Module steps (locking)

Every `module.yaml` must declare:

```yaml
steps:
  - id: orient
    title: Get oriented
    headings: ["In plain words", "What this is", "Why it matters"]
  - id: ideas
    title: Big ideas
    headings: ["Big ideas"]
  - id: apply
    title: Put it to work
    headings:
      - "Where this sits in the loop"
      - "What goes wrong if you skip it"
      - "Where this shows up in tools"
      - "Tips"
```

Learners mark each step done in order. Practice (exercises) then quiz unlock next. Scoring 75% or higher on the quiz completes the module. Best score is kept across retries; option order is shuffled per question. Each quiz keeps a bank of at least 8 questions and shows a sample of 5 per attempt, so retries see different questions. Modules themselves are soft-open — a "recommended after Module N" banner shows when learners jump ahead.

## Worked demos (optional per module)

- File: `curriculum/modules/<nn-slug>/demo.yaml`
- Images: `public/course/demos/<slug>/before.svg` (or `.png`) and `after.svg`
- Required for modules 5 (tools-and-mcp), 6 (retrieval-and-grounding), and 11 (verify-and-harden)
- Keep chrome tool-agnostic (generic “Helper” UI). Prefer before/after pairs that match Big ideas.

## Role track overlays (`curriculum/tracks/*.yaml`)

These `story` / `exampleAsk` / `watchOut` fields render as a callout on the module page, **above** the lesson content — before any term on the page has been defined. Treat them as extra-strict plain language:

1. **Full sentences only.** No colon-labeled fragments ("Audience: clinic owner. Done: 5 bullets."), no `+`/`→`/`;` chains standing in for "and"/"then"/"but".
2. **No jargon-as-verb.** Never turn a course term into a command the reader hasn't met yet (e.g. "Reverse-prompt when…"). Describe the behavior in plain words instead: "If the ask has no audience, ask the helper to question you first."
3. **Expand role jargon too.** "AE," "CTA," "prod," and similar shorthand are not safe to assume — spell them out or replace with a plain phrase.
4. `exampleAsk` should read like a sentence a person would actually type to a helper, not a compressed spec.

## Analogy bank

| Term | Analogy |
|------|---------|
| Context window | Desk space for one homework session |
| Standing instructions | Rules on the classroom wall |
| Playbook / skill | A recipe card you pull out when needed |
| Tool / MCP | Apps the helper is allowed to open |
| Retrieval | Looking something up in a binder |
| Deep research | Fact-finding before you start |
| Compaction / summary | A short note so you can clear the desk |
| Memory | Sticky notes for next time |
| Agent harness | The workbench around the helper |
| Agentic framework | A builder kit for custom helper workflows |
| Shared workspace | A team project room |
| Verify | Checking your work before you turn it in |
