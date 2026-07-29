# Exercises

## Exercise 1: Label turns in a sample thread
**id:** ex-1

Take a real or sample thread from your helper app. Label each turn as **user**, **helper**, or **tool result**. Count how many tool-result turns appear. Circle the bulkiest one. Write two sentences on why that turn should be compacted first.

<details>
<summary>Answer key</summary>

Tool results are often the bulkiest desk items. Mark them clearly so you know what to compact first.

**Worked example** — thread:

1. User: "Summarize our refund policy for a FAQ."
2. Tool result: 40-page scrape of help center pages (bulkiest).
3. Helper: five FAQ bullets.
4. User: "Also write a sales email about the new plan." (topic shift)

Why compact turn 2 first: the raw scrape crowds the desk and will poison the sales email if you keep going. Ask for ten bullets from the scrape, then drop the raw log before the next ask.

</details>

## Exercise 2: Write a handoff note for a fresh chat
**id:** ex-2

Write a handoff with Goal, Done checks, Locked choices, Sources, Do not, and Open questions. Keep it under fifteen lines. A teammate should continue from this note alone — no old chat needed.

<details>
<summary>Answer key</summary>

If a teammate could continue from only this note, it is strong. Drop raw logs and rejected drafts.

**Worked example:**

- Goal: five FAQ answers on refunds for clinic partners.
- Done checks: each under 80 words; every claim cites SOURCES.md; no phone numbers invented.
- Locked choices: plain tone; no medical claims.
- Sources: BRIEF.md limits section; SOURCES.md row 3 (refund policy, dated).
- Do not: legal advice; paste crawl dumps onto the desk.
- Open questions: weekend support hours need ops confirmation.

</details>

## Exercise 3: Choose continue or restart
**id:** ex-3

For five short scenarios, pick **continue** or **restart** and say why in one sentence each. Include at least one topic shift and one stale-tool case.

Use these five (or swap in your own):

1. Same FAQ; fix a typo in Q2.
2. Boss asks for a sales email in the same refund FAQ thread.
3. Tool returned outdated pricing; you now have a new SOURCES.md row.
4. Helper keeps adding a sixth FAQ you did not ask for.
5. You want one more polish pass on wording only.

<details>
<summary>Answer key</summary>

If the topic shifts, tools are stale, or the same mistake keeps repeating, restart with a handoff. If you are polishing the same job, continue.

**Worked example:**

1. Continue — same job, tiny polish.
2. Restart — new job (sales email); handoff the FAQ separately.
3. Restart — sources changed; do not trust the old tool dump on the desk.
4. Restart — same mistake repeating; tighten Done and Do not in a fresh chat.
5. Continue — still the same FAQ polish job.

</details>
