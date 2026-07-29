# Exercises

## Exercise 1: Build a done checklist
**id:** ex-1

Pick a workflow you run often — status notes, support replies, research briefs, or code reviews. Write five verify checks you will run before every ship. Include at least one done check from your spec, one source check against BRIEF.md or SOURCES.md, and one secret scan. Each check must be yes/no.

<details>
<summary>Answer key</summary>

Include source check, secret check, and at least one acceptance check from the spec. Checks should be yes/no, not vibes. If you cannot name three done checks, go back and write a stronger spec first.

**Worked example — weekly status note:**

1. Five bullets present? (yes/no)
2. Each bullet cites a ticket or says "blocked"? (yes/no)
3. No invented metrics vs BRIEF.md / tickets? (yes/no)
4. No API keys or secrets in the text? (yes/no)
5. Under 200 words total? (yes/no)

</details>

## Exercise 2: Diagnose three failed runs
**id:** ex-2

Describe three bad outputs — real incidents from your work or realistic invented ones. For each, name the **failed loop stop** (compaction, retrieval, craft, delegation, etc.) and one fix tied to a specific module habit. Log the stop, not the vibe.

<details>
<summary>Answer key</summary>

Name the stop, not the vibe. Tie the fix to a module habit — a wall rule, a pack file, a handoff template, or a tool trim. "Bad AI" is not a loop stop.

**Worked example:**

1. Wrong price in the FAQ → **retrieval miss** — attach the SOURCES.md excerpt before drafting (Module 6).
2. Old rejected joke returns in a new draft → **compaction miss** — restart with a handoff; drop rejected drafts (Module 7).
3. Two agents edited the same file → **delegation miss** — name one merge owner and separate edit boundaries (Module 9).

</details>

## Exercise 3: Harden tools and permissions
**id:** ex-3

Pick one workflow you use with a helper. List every tool it currently has access to. Remove at least one unused tool. Add approval rules for send, delete, or production actions if any apply. Write one line on why each remaining tool stays.

<details>
<summary>Answer key</summary>

Remove unused apps. Require approval for send, delete, and prod. Keep research tools in research-only steps — not open during every draft. Least apps needed is the default.

**Worked example — support reply workflow:**

Before: browse, deep crawl, calendar, file attach, search, send email.

After:

- Keep: file attach (policy pages), search (tickets).
- Remove: calendar (never used), deep crawl (research-only).
- Approval: send email requires a human click.
- Why search stays: policy lookup needs it. Why crawl goes: drafting from attached files does not.

</details>
