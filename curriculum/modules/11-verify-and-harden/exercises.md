# Exercises

## Exercise 1: Build a done checklist
**id:** ex-1

Pick a workflow you run often. Write five verify checks: at least one done check from your spec, one source check, and one secret scan.

<details>
<summary>Answer key</summary>

Include source check, secret check, and at least one acceptance check from the spec. Checks should be yes/no, not vibes.

**Worked example:** Status note checks: (1) five bullets present, (2) each cites ticket or says blocked, (3) no invented metrics, (4) no API keys in text, (5) under 200 words total.

</details>

## Exercise 2: Diagnose three failed runs
**id:** ex-2

Describe three bad outputs (real or invented). For each, name the **failed loop stop** and one fix tied to a module number.

<details>
<summary>Answer key</summary>

Name the stop, not the vibe. Tie the fix to a module habit.

**Worked example:** Wrong price in FAQ → retrieval miss (Module 6) → attach SOURCES.md excerpt before draft. Old rejected idea returned → compaction miss (Module 7) → restart with handoff.

</details>

## Exercise 3: Harden tools and permissions
**id:** ex-3

Pick one workflow. List every tool it uses. Remove at least one unused tool. Add approval rules for send, delete, or prod if any apply.

<details>
<summary>Answer key</summary>

Remove unused apps. Require approval for send/delete/prod. Keep research tools in research-only steps.

**Worked example:** Support reply workflow: keep file attach + search; remove unused calendar tool; require approval before "send email" action runs.

</details>
