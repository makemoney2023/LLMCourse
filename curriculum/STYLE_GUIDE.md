# Grade-5 plain language style guide

Use this for every learner-facing rewrite (lessons, exercises, quizzes, COURSE.md, slide titles/bullets/steps/body, module.yaml learner fields).

## Rules

1. Most sentences under 15 words. Break long thoughts.
2. Prefer common words. If you use a hard term, define it in the next sentence with a real-life analogy. The in-app glossary also links first uses.
3. One idea per paragraph. One job per section.
4. Voice: “you” + concrete examples (email, report, checklist).
5. Lesson shape (exact H2 titles):
   - In plain words (Goal / Do this / You’ll know it worked)
   - What this is
   - Why it matters (one story)
   - Big ideas (plain meaning → tiny example; prefer before/after pairs)
   - Where this sits in the loop
   - What goes wrong if you skip it
   - Where this shows up in tools
   - Tips
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

Learners mark each step done in order. Practice (exercises) then quiz unlock next. Submitting the quiz completes the module and unlocks the next one.

## Worked demos (optional per module)

- File: `curriculum/modules/<nn-slug>/demo.yaml`
- Images: `public/course/demos/<slug>/before.svg` (or `.png`) and `after.svg`
- Required for modules 5 (tools-and-mcp), 6 (retrieval-and-grounding), and 11 (verify-and-harden)
- Keep chrome tool-agnostic (generic “Helper” UI). Prefer before/after pairs that match Big ideas.

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
| Verify | Checking your work before you turn it in |
