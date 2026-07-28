# Exercises

## Exercise 1: Audit a rule block you already use
**id:** ex-1

Open your custom instructions, project instructions, or agent rules file. List three lines that help, two lines that are fluff, and any two lines that conflict.

<details>
<summary>Answer key</summary>

Worked example audit:

- Helps: "Do not invent pricing." / "Ask if a policy fact is missing." / "Be concise."
- Fluff: "You are the world's best assistant." / "Always try your hardest." (Not testable.)
- Conflict: "Always be brief" vs "Always include full history." → merge in Exercise 3.

Keep limits that stop real harm. Cut style essays nobody verifies.

</details>

## Exercise 2: Rewrite bloated rules to be short
**id:** ex-2

Take a long rule block (yours or a sample). Cut it to 12 lines or fewer at the right altitude. Add one line pointing to BRIEF.md or SOURCES.md if you have them from Module 2.

<details>
<summary>Answer key</summary>

Before (bloated): "When writing emails, use a friendly tone, include a greeting, mention the weather if appropriate, sign with Best regards unless…" (15 micro-rules for one task → belongs on a recipe card, Module 4.)

After (wall, 8 lines):

1. You help internal analysts draft docs and tables.
2. Never share secrets or customer PII in examples.
3. Do not invent numbers; use BRIEF.md and SOURCES.md.
4. If a fact is missing, ask one short question.
5. Be concise by default.
6. Refuse medical and legal advice; suggest a human expert.
7. Out of scope: sending email, deleting files, prod changes.

Good rewrites are short and testable. They steer behavior — not every sentence of every workflow.

</details>

## Exercise 3: Fix two rules that fight
**id:** ex-3

Write two conflicting wall rules. Then rewrite them as one clear rule. Explain which priority wins.

<details>
<summary>Answer key</summary>

Fight:

- "Always be brief — one paragraph max."
- "Always explain full background and history."

Merged rule: "Be brief by default — one paragraph. Give full background only when the user asks for history or says 'explain why.'"

Priority: brevity wins unless the user opts into detail. Delete the old pair so the wall does not fight itself.

</details>
