# Exercises

## Exercise 1: Build a done checklist
**id:** ex-1

Pick a workflow you run often — status notes, support replies, research briefs, or code reviews. Write five verify checks you will run before every ship. Include at least one done check from your spec, one source check against BRIEF.md or SOURCES.md, and one secret scan. Each check must be yes/no.

<details>
<summary>Answer key</summary>

Include source check, secret check, and at least one acceptance check from the spec. Checks should be yes/no, not vibes. If you cannot name three done checks, go back and write a stronger spec first.

**Worked example:** Status note checks: (1) five bullets present, (2) each cites ticket or says blocked, (3) no invented metrics, (4) no API keys in text, (5) under 200 words total.

</details>

## Exercise 2: Diagnose three failed runs
**id:** ex-2

Describe three bad outputs — real incidents from your work or realistic invented ones. For each, name the **failed loop stop** (compaction, retrieval, craft, delegation, etc.) and one fix tied to a specific module habit. Log the stop, not the vibe.

<details>
<summary>Answer key</summary>

Name the stop, not the vibe. Tie the fix to a module habit — a wall rule, a pack file, a handoff template, or a tool trim. "Bad AI" is not a loop stop.

**Worked example:** A wrong price in the FAQ traces back to a retrieval miss — attach the SOURCES.md excerpt before you draft next time. An old rejected idea coming back is a compaction miss — restart with a handoff note. Two agents editing the same file is a delegation miss — name one merge owner next time.

</details>

## Exercise 3: Harden tools and permissions
**id:** ex-3

Pick one workflow you use with a helper. List every tool it currently has access to. Remove at least one unused tool. Add approval rules for send, delete, or production actions if any apply. Write one line on why each remaining tool stays.

<details>
<summary>Answer key</summary>

Remove unused apps. Require approval for send, delete, and prod. Keep research tools in research-only steps — not open during every draft. Least apps needed is the default.

**Worked example:** Support reply workflow: keep file attach and search, remove the unused calendar tool, and require approval before the "send email" action runs. Search stays because policy lookup needs it. Calendar goes because replies never schedule meetings.

</details>
