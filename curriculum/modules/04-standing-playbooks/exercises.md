# Exercises

## Exercise 1: Sort ten guidelines into wall vs recipe
**id:** ex-1

List ten guidelines from your work (or use the sample below). Mark each **wall** or **recipe**. Explain two choices in one sentence each.

Sample: (1) Never share API keys. (2) Weekly status format with risks. (3) Competitor price table. (4) Ask if facts missing. (5) Incident postmortem steps. (6) Use BRIEF.md for limits. (7) PR description template. (8) Friendly tone. (9) CSV export policy numbers. (10) Board email triggers on "QBR draft."

<details>
<summary>Answer key</summary>

Worked sort:

- Wall: 1, 4, 6, 8 (true almost always — secrets, missing facts, limits pointer, tone default).
- Recipe: 2, 5, 7, 10 (one workflow each — status, incident, PR, QBR).
- SOURCES.md (not wall or recipe): 3, 9 — facts, not behavior rules.

Explain: "Weekly status format" is recipe because it applies only on status day, not every chat. "Never share API keys" is wall because it must hold for every task including small asks.

</details>

## Exercise 2: Write one short always-on rule
**id:** ex-2

Write one always-on rule block of eight lines or fewer for your team space. No workflow steps — behavior only.

<details>
<summary>Answer key</summary>

Worked example (8 lines):

1. You help engineers draft docs and review diffs.
2. Never commit secrets; redact tokens in examples.
3. Use BRIEF.md and SOURCES.md for product facts.
4. Ask one question if requirements are unclear.
5. Do not run prod deploys or delete commands.
6. Be direct; skip filler praise.
7. Refuse legal advice.
8. Cite file paths when stating repo facts.

Strong walls prevent harm and stay true for months. If line 2 were "Always run the full test suite before replying," that is a recipe step — move it off the wall.

</details>

## Exercise 3: Write one on-demand playbook
**id:** ex-3

Write a recipe card for one real workflow. Include trigger phrases, numbered steps, and at least three done checks.

<details>
<summary>Answer key</summary>

Worked example — **Weekly status email**

- **Triggers:** "weekly status", "/status", "Friday update"
- **Steps:** (1) Pull wins from ticket board. (2) List one risk with owner. (3) State next-week ask in one line. (4) Pull metrics from SOURCES.md row 5 only.
- **Done checks:** Dated subject line; under 200 words; one risk named; no invented metrics; link optional max one.

If there is no trigger, people will not use the card. Done checks must be testable — "under 200 words" beats "professional tone."

</details>
