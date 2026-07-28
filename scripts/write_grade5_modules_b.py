#!/usr/bin/env python3
"""Rewrite modules 05-12 at grade-5 reading level."""
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "curriculum" / "modules"
DATA: dict[str, dict] = {}

DATA["05-tools-and-mcp"] = {
    "subtitle": "Apps the helper is allowed to open",
    "objectives": [
        "Explain how tool lists shape what the helper can do.",
        "Describe MCP as a shared menu of apps.",
        "Choose a small tool list for one workflow.",
    ],
    "loopPlacement": "The helper picks a tool, gets a result, and puts that result back on the desk.",
    "skipConsequence": "Too many apps confuse choices. Too few apps lead to fake ‘I checked’ answers.",
    "exerciseTitles": [
        "List tools in your helper today",
        "Design a five-tool allow list",
        "Write one clear tool description",
    ],
    "lesson": """# Tools and MCP

## What this is

**Tools** are apps the helper is allowed to open.
**MCP** is a shared way to plug those apps in. Think of a shared app menu.

## Why it matters

Without tools, a helper only uses words. It may pretend to check a calendar.
With too many tools, it picks the wrong app. A small clear list works best.

## Big ideas

### Tool lists steer choices

Each tool has a name and a short description.
The helper reads that list from the desk.
Clear names beat clever names.

### Observations come back

When a tool runs, the result returns to the desk.
That result uses desk space. Huge dumps can bury your goal.

### Research tools vs build tools

Firecrawl-like tools are great for Module 2 research packs.
You may not need them for every short drafting task.
Use a research mode list and a build mode list.

## Where it sits in the loop

Goal in → helper may open an app → result back on the desk → next step.

## What goes wrong if you skip it

Wrong tool picks. Fake actions. Or a desk flooded with tool noise.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Tools | Browse, code, search, plugins |
| MCP | Connectors and MCP servers |
| Allow list | Enabled apps only |

## Tips

- Max five tools for one workflow.
- Write a never-list (send, delete, pay, prod changes).
- Keep research crawl tools out of daily drafting unless refreshing facts.
""",
    "exercises": """# Exercises

## Exercise 1: List tools in your helper today
**id:** ex-1

Inventory the tools or plugins you have on. Mark useful, maybe, or noise.

<details>
<summary>Answer key</summary>

If you cannot name a purpose in one line, it is probably noise for your main workflow.

</details>

## Exercise 2: Design a five-tool allow list
**id:** ex-2

For one workflow, list at most five tools with one-line purposes. Add a never-list.

<details>
<summary>Answer key</summary>

Include whether Firecrawl/deep research is research-only. Keep build mode small.

</details>

## Exercise 3: Write one clear tool description
**id:** ex-3

Rewrite a fuzzy tool blurb into a clear one: what it does, when to use it, when not to.

<details>
<summary>Answer key</summary>

Good: “Read a local file path. Use for project docs. Do not use for secrets.”

</details>
""",
    "quiz": """moduleId: tools-and-mcp
questions:
  - id: q1
    prompt: "What are tools, in plain words?"
    options:
      - id: a
        label: "Apps the helper is allowed to open"
      - id: b
        label: "Wall rules only"
      - id: c
        label: "Unlimited memory"
      - id: d
        label: "Quiz scores"
    correctOptionId: a
    explanation: "Tools extend the loop beyond words."
  - id: q2
    prompt: "What is MCP like?"
    options:
      - id: a
        label: "A shared app menu for helpers"
      - id: b
        label: "A kind of desk chair"
      - id: c
        label: "A brand of paper"
      - id: d
        label: "A password"
    correctOptionId: a
    explanation: "MCP standardizes how apps plug into helpers."
  - id: q3
    prompt: "Why keep the tool list small?"
    options:
      - id: a
        label: "Too many apps confuse picks and crowd the desk"
      - id: b
        label: "Helpers hate all tools"
      - id: c
        label: "Tools never return results"
      - id: d
        label: "Small lists ban research"
    correctOptionId: a
    explanation: "Less, clearer tools improve choices."
  - id: q4
    prompt: "When do research crawl tools belong?"
    options:
      - id: a
        label: "Mostly when refreshing a research pack"
      - id: b
        label: "In every one-line rewrite"
      - id: c
        label: "Never"
      - id: d
        label: "Only after delete tools"
    correctOptionId: a
    explanation: "Separate research mode from build mode."
""",
}

DATA["06-retrieval-and-grounding"] = {
    "subtitle": "Look things up before you answer",
    "objectives": [
        "Explain retrieval as looking facts up in a binder.",
        "Use BRIEF.md and SOURCES.md as grounding files.",
        "Practice retrieve-then-answer instead of guessing.",
    ],
    "loopPlacement": "Retrieval brings binder pages onto the desk so answers rest on evidence.",
    "skipConsequence": "Answers sound sure but may be invented. Or the desk fills with junk files.",
    "exerciseTitles": [
        "Pick sources for three task types",
        "Trim an overstuffed file pack",
        "Write retrieve-then-answer steps",
    ],
    "lesson": """# Retrieval and grounding

## What this is

**Retrieval** is like looking something up in a binder before you answer.
**Grounding** means the answer rests on those pages—not on guesses.

## Why it matters

Fluent words are not the same as true words.
If the job needs your policy or your BRIEF.md, the helper must see that page.

## Big ideas

### Retrieve, then answer

1. Name the question.
2. Bring the right page to the desk (file, link, search hit).
3. Answer from that page.
4. If the page is missing, say you do not know.

### Use your research pack

From Module 2, keep BRIEF.md and SOURCES.md handy.
Attach short parts. Do not dump every raw crawl every time.

### Standing rules are not evidence

Wall rules steer behavior. They are not your fact binder.
Memory sticky notes are also not today’s source of truth.

## Where it sits in the loop

Your goal plus binder pages feed the desk. Then the helper can answer with proof.

## What goes wrong if you skip it

Confident wrong answers. Or a desk buried under huge unused files.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Retrieval | File attach, @ mentions, search, knowledge bases |
| Grounding | Quotes, citations, “unknown if missing” |
| Pack files | BRIEF.md, SOURCES.md |

## Tips

- Prefer one good page over twenty random PDFs.
- Say “quote the source.”
- Refresh SOURCES.md when facts change.
""",
    "exercises": """# Exercises

## Exercise 1: Pick sources for three task types
**id:** ex-1

For a how-to, a number claim, and a tone rewrite, name the best source type for each.

<details>
<summary>Answer key</summary>

How-to → official docs. Number → metrics sheet. Tone rewrite → brand guide. Use BRIEF/SOURCES when they hold the fact.

</details>

## Exercise 2: Trim an overstuffed file pack
**id:** ex-2

You attached five huge PDFs. Cut to the smallest set that still answers the question.

<details>
<summary>Answer key</summary>

Keep the one section that holds the answer. Move the rest back to the binder.

</details>

## Exercise 3: Write retrieve-then-answer steps
**id:** ex-3

Write steps that force lookup from BRIEF.md or SOURCES.md before answering.

<details>
<summary>Answer key</summary>

Include: open source → quote → answer → stop if missing.

</details>
""",
    "quiz": """moduleId: retrieval-and-grounding
questions:
  - id: q1
    prompt: "What is retrieval like?"
    options:
      - id: a
        label: "Looking something up in a binder before answering"
      - id: b
        label: "Deleting all rules"
      - id: c
        label: "Turning off the desk"
      - id: d
        label: "Guessing faster"
    correctOptionId: a
    explanation: "Retrieval brings evidence onto the desk."
  - id: q2
    prompt: "What should you attach for project facts?"
    options:
      - id: a
        label: "BRIEF.md or a source from SOURCES.md"
      - id: b
        label: "Every file you own"
      - id: c
        label: "Only emojis"
      - id: d
        label: "Nothing ever"
    correctOptionId: a
    explanation: "Use the research pack. Keep it lean."
  - id: q3
    prompt: "What is grounding?"
    options:
      - id: a
        label: "Making the answer rest on real pages, not guesses"
      - id: b
        label: "Making text longer"
      - id: c
        label: "Hiding sources"
      - id: d
        label: "Removing tools"
    correctOptionId: a
    explanation: "Grounded answers can point to evidence."
  - id: q4
    prompt: "What if the source is missing?"
    options:
      - id: a
        label: "Say you do not know, or ask for the page"
      - id: b
        label: "Invent a confident answer"
      - id: c
        label: "Ignore the question"
      - id: d
        label: "Add twenty more tools"
    correctOptionId: a
    explanation: "Do not invent. Retrieve or stop."
""",
}

DATA["07-conversation-and-compaction"] = {
    "subtitle": "Keep the desk clean as the chat grows",
    "objectives": [
        "See how messages and tool results pile up on the desk.",
        "Write a short handoff note when the desk gets messy.",
        "Choose continue vs start fresh for common cases.",
    ],
    "loopPlacement": "The chat is working papers on the desk. Compaction is a short note so you can clear space.",
    "skipConsequence": "Old junk steers new answers. Quality drops near the edge of desk space.",
    "exerciseTitles": [
        "Label turns in a sample thread",
        "Write a handoff note for a fresh chat",
        "Choose continue or restart",
    ],
    "lesson": """# Conversation and compaction

## What this is

A chat piles papers on the desk: your asks, answers, and tool results.
**Compaction** is like writing a short note so you can clear the desk.

## Why it matters

Long threads feel busy. They also hide bad old results.
A clean handoff beats one more confused reply.

## Big ideas

### What piles up

- Your goals and corrections
- Helper drafts
- Tool dumps (often the biggest)
- Auto summaries

### Good handoff notes

Keep: goal, done checks, locked choices, sources, do-not list, open questions.
Drop: long rants and raw logs.

### Continue vs restart

Continue for a small polish on the same job.
Restart when the topic shifts, sources changed, or the same mistake repeats.
Paste the handoff—not the whole old chat.

## Where it sits in the loop

Working papers live on the desk. A summary shrinks the past for the next turn.

## What goes wrong if you skip it

Stale tool output wins. Rejected ideas come back. The desk overflows.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Conversation | Chat threads and agent logs |
| Compaction | Summarize-and-continue, handoff notes |
| Restart | New chat with a short brief |

## Tips

- After a big tool dump, ask for ten bullets, then drop the raw log.
- Keep a living “decisions” list.
- Restart with Goal / Done / Sources / Do not.
""",
    "exercises": """# Exercises

## Exercise 1: Label turns in a sample thread
**id:** ex-1

Take a real or sample thread. Label user, helper, and tool-result turns.

<details>
<summary>Answer key</summary>

Tool results are often the bulkiest desk items. Mark them clearly.

</details>

## Exercise 2: Write a handoff note for a fresh chat
**id:** ex-2

Write a handoff with Goal, Done, Constraints, Sources, Do not, Open questions.

<details>
<summary>Answer key</summary>

If a teammate could continue from only this note, it is strong.

</details>

## Exercise 3: Choose continue or restart
**id:** ex-3

For five short scenarios, pick continue or restart and say why.

<details>
<summary>Answer key</summary>

Topic shift, stale tools, or repeated mistakes → restart. Small polish → continue.

</details>
""",
    "quiz": """moduleId: conversation-and-compaction
questions:
  - id: q1
    prompt: "What is compaction like?"
    options:
      - id: a
        label: "A short note so you can clear the desk"
      - id: b
        label: "Deleting the helper"
      - id: c
        label: "Adding more PDFs"
      - id: d
        label: "Turning off checks"
    correctOptionId: a
    explanation: "Compaction shrinks old clutter into a usable note."
  - id: q2
    prompt: "When should you restart?"
    options:
      - id: a
        label: "When the topic shifts or old junk keeps winning"
      - id: b
        label: "After every single word"
      - id: c
        label: "Never"
      - id: d
        label: "Only on weekends"
    correctOptionId: a
    explanation: "Restart with a handoff when the desk is contaminated."
  - id: q3
    prompt: "What should a handoff keep?"
    options:
      - id: a
        label: "Goal, done checks, sources, and do-not list"
      - id: b
        label: "Every raw log"
      - id: c
        label: "Only emojis"
      - id: d
        label: "Secrets"
    correctOptionId: a
    explanation: "Keep signal. Drop sludge."
  - id: q4
    prompt: "Why are tool dumps risky in long chats?"
    options:
      - id: a
        label: "They use lots of desk space and can bury the goal"
      - id: b
        label: "They shrink the desk forever"
      - id: c
        label: "They remove wall rules"
      - id: d
        label: "They ban research"
    correctOptionId: a
    explanation: "Huge results crowd the context window."
""",
}

DATA["08-memory-systems"] = {
    "subtitle": "Sticky notes that help next time",
    "objectives": [
        "Sort facts into desk, binder notes, or sticky memory.",
        "Choose what should persist across chats.",
        "Prune bad or old memory entries.",
    ],
    "loopPlacement": "Memory sticky notes come back onto the desk in later sessions.",
    "skipConsequence": "You re-explain everything—or a wrong sticky note steers every future chat.",
    "exerciseTitles": [
        "Sort ten facts by memory place",
        "Draft a project note template",
        "Prune a noisy memory list",
    ],
    "lesson": """# Memory systems

## What this is

**Memory** is like sticky notes you keep for next time.
Some notes stay only on today’s desk. Some live in a binder you control.

## Why it matters

Without memory, you repeat yourself every chat.
With bad memory, a wrong fact returns forever.

## Big ideas

### Three places for facts

1. **On the desk now** — this chat only.
2. **Binder notes you own** — BRIEF.md, wiki pages, tickets.
3. **Product sticky memory** — saved preferences across chats.

For important facts, prefer binder notes you can audit.
Use product memory for light preferences—not secrets.

### What to save

Good: tone preference, stable team facts, project anchors.
Bad: secrets, one-day guesses, huge tables (put those in SOURCES.md).

### Prune often

Delete stale stickies. Date facts. Promote stable process into wall rules.

## Where it sits in the loop

Durable notes re-enter the desk later. They sit beside wall rules—but may load quietly.

## What goes wrong if you skip it

Endless re-teaching—or silent wrong “memories.”

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Desk memory | Current chat |
| Binder notes | BRIEF.md, project docs |
| Product memory | Chat memory toggles |

## Tips

- Write facts with dates.
- Never store secrets in memory.
- Link to a canonical doc instead of restating a long policy.
""",
    "exercises": """# Exercises

## Exercise 1: Sort ten facts by memory place
**id:** ex-1

Sort ten facts into desk / binder / product memory / never-store.

<details>
<summary>Answer key</summary>

Secrets → never. Today’s hypothesis → desk. Stable process → binder or wall. Preference → product memory.

</details>

## Exercise 2: Draft a project note template
**id:** ex-2

Make a tiny template: Goal, Owners, Links, Do not, Open questions.

<details>
<summary>Answer key</summary>

If it replaces re-explaining the project each Monday, it works.

</details>

## Exercise 3: Prune a noisy memory list
**id:** ex-3

Cross out three bad memories. Rewrite one dated fact.

<details>
<summary>Answer key</summary>

Delete conflicts and undated folklore. Keep dated, useful stickies.

</details>
""",
    "quiz": """moduleId: memory-systems
questions:
  - id: q1
    prompt: "What is memory like in this course?"
    options:
      - id: a
        label: "Sticky notes you keep for next time"
      - id: b
        label: "A bigger monitor"
      - id: c
        label: "A delete button for tools"
      - id: d
        label: "A kind of quiz"
    correctOptionId: a
    explanation: "Memory brings durable facts back later."
  - id: q2
    prompt: "Where should important project facts live?"
    options:
      - id: a
        label: "In binder notes you control, like BRIEF.md"
      - id: b
        label: "Only in jokes"
      - id: c
        label: "Inside secrets vaults in the chat"
      - id: d
        label: "Nowhere"
    correctOptionId: a
    explanation: "Prefer auditable docs for important facts."
  - id: q3
    prompt: "What should never go in memory?"
    options:
      - id: a
        label: "Secrets and API keys"
      - id: b
        label: "Tone preferences"
      - id: c
        label: "Project links"
      - id: d
        label: "Open questions"
    correctOptionId: a
    explanation: "Secrets do not belong in prompts or memory."
  - id: q4
    prompt: "Why prune memory?"
    options:
      - id: a
        label: "Old wrong stickies can steer future chats"
      - id: b
        label: "Pruning bans research"
      - id: c
        label: "Pruning removes the desk"
      - id: d
        label: "Pruning deletes BRIEF.md automatically"
    correctOptionId: a
    explanation: "Uncurated memory becomes slow pollution."
""",
}

DATA["09-delegation"] = {
    "subtitle": "Ask a specialist for one clear job",
    "objectives": [
        "Know when to split work for a specialist.",
        "Write a short job contract for a helper or teammate.",
        "Spot unsafe parallel work on the same file.",
    ],
    "loopPlacement": "A subagent is like a specialist classmate with their own desk. Results come back to you.",
    "skipConsequence": "One desk carries every job—or two helpers overwrite the same work.",
    "exerciseTitles": [
        "Split a big job into specialist briefs",
        "Write a delegation contract",
        "Spot unsafe parallel work",
    ],
    "lesson": """# Delegation

## What this is

**Delegation** means giving one clear job to a specialist.
A **subagent** is like a specialist classmate with their own desk.

## Why it matters

One messy chat tried to research, write, and review at once.
The desk overflowed. Parallel helpers then edited the same file.
Clear jobs and one merge owner fix that.

## Big ideas

### When to split

Split when jobs need different rules or tools.
Split when work can proceed without sharing the same editable file.
Clarify the goal first. Then split.

### The job contract

Include: goal, inputs, allowed tools, out of scope, done checks, return format, merge owner.

### Safe vs unsafe parallel

Safe: two different docs.
Unsafe: two helpers editing the same module with no owner.

## Where it sits in the loop

You launch specialists with their own desk space. Their results return as new papers on your desk.

## What goes wrong if you skip it

One overloaded desk—or colliding edits.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Subagents | Specialist agents, custom GPTs |
| Contracts | Task briefs and tickets |
| Merge owner | One person who integrates results |

## Tips

- Name the job, not the brand of model.
- Cap parallel helpers until merge is easy.
- Bring BRIEF.md into the brief when facts matter.
""",
    "exercises": """# Exercises

## Exercise 1: Split a big job into specialist briefs
**id:** ex-1

Take a mega-task. Write two specialist goals with clear boundaries.

<details>
<summary>Answer key</summary>

Each specialist should own different outputs. No shared editable collision.

</details>

## Exercise 2: Write a delegation contract
**id:** ex-2

Fill goal, inputs, tools, out of scope, done checks, return format, merge owner.

<details>
<summary>Answer key</summary>

If the merge owner is missing, rewrite until someone owns integration.

</details>

## Exercise 3: Spot unsafe parallel work
**id:** ex-3

Mark three scenarios safe or unsafe. Fix the unsafe ones.

<details>
<summary>Answer key</summary>

Same file or same rows without a lock → unsafe. Serialize or split ownership.

</details>
""",
    "quiz": """moduleId: delegation
questions:
  - id: q1
    prompt: "What is a subagent like?"
    options:
      - id: a
        label: "A specialist classmate with their own desk"
      - id: b
        label: "Unlimited wall rules"
      - id: c
        label: "A deleted source"
      - id: d
        label: "A secret key"
    correctOptionId: a
    explanation: "Specialists get scoped jobs and return results."
  - id: q2
    prompt: "What must a delegation contract include?"
    options:
      - id: a
        label: "Goal, inputs, done checks, and a merge owner"
      - id: b
        label: "Only emojis"
      - id: c
        label: "Every company file"
      - id: d
        label: "No boundaries"
    correctOptionId: a
    explanation: "Contracts prevent collisions and fuzzy work."
  - id: q3
    prompt: "Which parallel plan is unsafe?"
    options:
      - id: a
        label: "Two helpers editing the same file with no owner"
      - id: b
        label: "One helper drafts while another reviews a copy"
      - id: c
        label: "Research on different sources"
      - id: d
        label: "One person merges at the end"
    correctOptionId: a
    explanation: "Shared mutable work needs a single owner."
  - id: q4
    prompt: "When should you NOT delegate yet?"
    options:
      - id: a
        label: "When the goal is still fuzzy"
      - id: b
        label: "When inputs are clear"
      - id: c
        label: "When done checks exist"
      - id: d
        label: "When outputs do not overlap"
    correctOptionId: a
    explanation: "Clarify first, then split."
""",
}

DATA["10-human-craft"] = {
    "subtitle": "Clear asks, one job, smart approvals",
    "objectives": [
        "Write a short task spec with done checks.",
        "Keep one job per turn; ask clarifying questions first when needed.",
        "Pick plan mode vs go mode and when to require approval.",
    ],
    "loopPlacement": "Your clear ask feeds the desk. Approvals gate risky tool use.",
    "skipConsequence": "The helper races at the wrong target. Approvals come too late—or too often.",
    "exerciseTitles": [
        "Turn a vague ask into a one-page spec",
        "Practice reverse questioning",
        "Pick mode and approval rules",
    ],
    "lesson": """# Human craft

## What this is

**Human craft** is how you aim the helper.
You write a clear ask. You keep one job at a time. You approve risky moves.

## Why it matters

Helpers are eager. A fuzzy ask still gets a polished answer—aimed wrong.
Your craft is the steering wheel.

## Big ideas

### Short specs win

Include outcome, audience, limits, sources (often BRIEF.md), and done checks.
You do not need a novel. You need clarity.

### One job per turn

Stacking ten asks in one message drops later asks.
Finish, check, then next.

### Reverse questioning

If the ask is fuzzy, tell the helper: “Ask questions first. Do not draft yet.”
Answer. Then allow the draft.

### Modes and approvals

Use plan mode when scope is unclear or risk is high.
Require approval for send, delete, pay, and production changes.

## Where it sits in the loop

Your intent feeds the desk. You also gate tools and close with verify.

## What goes wrong if you skip it

Fast wrong work. Rubber-stamp approvals. Blame aimed at “the model.”

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Specs | First message, tickets, plan mode |
| Reverse questions | “Ask clarifying questions” |
| Approvals | Confirm dialogs before actions |

## Tips

- Keep an eight-line spec template.
- End with “Done when:” and three checks.
- Separate explore chats from execute chats.
- Bring SOURCES.md when facts matter.
""",
    "exercises": """# Exercises

## Exercise 1: Turn a vague ask into a one-page spec
**id:** ex-1

Rewrite a vague request with outcome, limits, sources, and done checks.

<details>
<summary>Answer key</summary>

A partner should be able to execute without asking you three more questions.

</details>

## Exercise 2: Practice reverse questioning
**id:** ex-2

Take a fuzzy ask. Write the instruction that forces questions-only first. List answers you would give.

<details>
<summary>Answer key</summary>

If the helper drafts anyway, stop it and reinforce the gate.

</details>

## Exercise 3: Pick mode and approval rules
**id:** ex-3

For four tasks, choose plan vs go, and whether approval is required.

<details>
<summary>Answer key</summary>

High blast radius → plan + approvals. Clear checklist work → go with light gates.

</details>
""",
    "quiz": """moduleId: human-craft
questions:
  - id: q1
    prompt: "What belongs in a short spec?"
    options:
      - id: a
        label: "Outcome, limits, sources, and done checks"
      - id: b
        label: "Only ‘make it good’"
      - id: c
        label: "Secrets"
      - id: d
        label: "Twenty unrelated jobs"
    correctOptionId: a
    explanation: "Specs aim the helper."
  - id: q2
    prompt: "What is reverse questioning?"
    options:
      - id: a
        label: "Asking the helper to interview you before drafting"
      - id: b
        label: "Deleting the brief"
      - id: c
        label: "Running all tools at once"
      - id: d
        label: "Skipping checks"
    correctOptionId: a
    explanation: "Clarify first, then draft."
  - id: q3
    prompt: "When should you require approval?"
    options:
      - id: a
        label: "Before send, delete, pay, or production changes"
      - id: b
        label: "Never"
      - id: c
        label: "Only for spelling"
      - id: d
        label: "After the damage is done"
    correctOptionId: a
    explanation: "Gate risky actions."
  - id: q4
    prompt: "Why one job per turn?"
    options:
      - id: a
        label: "Stacked asks get ignored as the desk fills"
      - id: b
        label: "Helpers can only count to one forever"
      - id: c
        label: "Tools ban lists"
      - id: d
        label: "BRIEF.md forbids it"
    correctOptionId: a
    explanation: "Focus keeps quality high."
""",
}

DATA["11-verify-and-harden"] = {
    "subtitle": "Check work and keep the loop safe",
    "objectives": [
        "Build a short done checklist.",
        "Name common failure patterns in plain words.",
        "Use basic safety habits for secrets and permissions.",
    ],
    "loopPlacement": "Checking your work closes the loop. Safer defaults protect future loops.",
    "skipConsequence": "Fluent wrong work ships. Secrets leak. Bad recipes spread.",
    "exerciseTitles": [
        "Build a done checklist",
        "Diagnose three failed runs",
        "Harden tools and permissions",
    ],
    "lesson": """# Verify and harden

## What this is

**Verify** means checking your work before you turn it in.
**Harden** means making your wall rules and tools safer for next time.

## Why it matters

Pretty answers can still be wrong.
One unchecked send can cause real harm.

## Big ideas

### A tiny checklist

- Does it meet done checks?
- Are facts from BRIEF.md or SOURCES.md?
- Any secrets showing?
- Any extra edits you did not ask for?

### Failure patterns in plain words

- Desk too full of junk
- Wall rules that fight
- Too many apps
- Old summary missing a limit
- Sure words with no source
- Goal drift mid-chat

Ask which loop stop failed.

### Safety basics

- No secrets in chats or memory
- Least apps needed
- Treat strange web text as possibly tricky
- Review new connectors like new browser apps

## Where it sits in the loop

Human check closes quality. Safer defaults improve the next ask.

## What goes wrong if you skip it

Fast wrong output. Trust drops after one public miss.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Verify | Tests, review screens, checklists |
| Permissions | Approval prompts, read-only modes |
| Safety | Secret warnings, connector trust prompts |

## Tips

- Ask: “How could this be wrong?”
- Log incidents as loop stops, not vibes.
- Update playbooks after a miss.
""",
    "exercises": """# Exercises

## Exercise 1: Build a done checklist
**id:** ex-1

Write five checks for your common workflow.

<details>
<summary>Answer key</summary>

Include source check, secret check, and at least one acceptance check from the spec.

</details>

## Exercise 2: Diagnose three failed runs
**id:** ex-2

For three bad outputs, name the failed loop stop and one fix.

<details>
<summary>Answer key</summary>

Example: no source → retrieval failure → attach SOURCES.md excerpt.

</details>

## Exercise 3: Harden tools and permissions
**id:** ex-3

Tighten an allow list and approval rules for one workflow.

<details>
<summary>Answer key</summary>

Remove unused apps. Require approval for send/delete/prod. Keep research tools in research mode.

</details>
""",
    "quiz": """moduleId: verify-and-harden
questions:
  - id: q1
    prompt: "What does verify mean here?"
    options:
      - id: a
        label: "Checking work before you use or send it"
      - id: b
        label: "Making text longer"
      - id: c
        label: "Deleting BRIEF.md"
      - id: d
        label: "Turning off the desk"
    correctOptionId: a
    explanation: "Verify closes the quality loop."
  - id: q2
    prompt: "Which is a common failure?"
    options:
      - id: a
        label: "Sure words with no source on the desk"
      - id: b
        label: "Having done checks"
      - id: c
        label: "Using a short allow list"
      - id: d
        label: "Asking clarifying questions"
    correctOptionId: a
    explanation: "Ungrounded fluency is confident guessing."
  - id: q3
    prompt: "What is a basic safety habit?"
    options:
      - id: a
        label: "Never put secrets in chats or memory"
      - id: b
        label: "Approve every action without looking"
      - id: c
        label: "Enable every plugin"
      - id: d
        label: "Skip source checks"
    correctOptionId: a
    explanation: "Secrets and blind approvals create harm."
  - id: q4
    prompt: "After a miss, what should you update?"
    options:
      - id: a
        label: "The playbook or wall rule that would catch it next time"
      - id: b
        label: "Nothing"
      - id: c
        label: "Only the font"
      - id: d
        label: "Delete all sources"
    correctOptionId: a
    explanation: "Harden the loop defaults."
""",
}

DATA["12-capstone-lab"] = {
    "subtitle": "Run one real job through the whole loop",
    "objectives": [
        "Pick a real workflow you own and map it to the loop.",
        "Set up research pack, wall rules, tools, and checks.",
        "Run once, measure, and write a short look-back.",
    ],
    "loopPlacement": "Capstone uses every stop: research, wall rules, desk, tools, memory, check.",
    "skipConsequence": "Ideas stay only ideas. Monday habits do not change.",
    "exerciseTitles": [
        "Choose and scope your capstone workflow",
        "Configure loop artifacts",
        "Run, measure, and write a look-back",
    ],
    "lesson": """# Capstone lab

## What this is

The capstone is practice on a real job you own.
You set up the loop. You run it. You check it. You keep what worked.

## Why it matters

Reading alone does not change Monday.
One measured run installs the habit.

## Big ideas

### Pick a real workflow

Choose something you do often: status note, research brief, support reply, small code change.
Make it finishable in under 90 focused minutes.

### Configure before you generate

1. BRIEF.md + SOURCES.md (Module 2)
2. Short wall rules (Module 3)
3. One recipe card (Module 4)
4. Small tool list (Module 5)
5. Done checklist (Module 11)

### Run and measure

Compare to your old way.
Track time, revision count, or errors caught.
Write a short look-back: what to keep as a team default.

## Where it sits in the loop

Every stop gets used on one real task.

## What goes wrong if you skip it

Learning stays on the page. Habits do not move.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Full loop | Your daily helper apps |
| Pack files | BRIEF.md / SOURCES.md |
| Defaults | Shared rules and checklists |

## Tips

- Timebox setup to 25 minutes, then run.
- Keep before/after notes.
- Share one default with a teammate.
- Revisit in 30 days and prune what did not stick.
""",
    "exercises": """# Exercises

## Exercise 1: Choose and scope your capstone workflow
**id:** ex-1

Name the workflow, the artifact, and a time box. Keep one outcome only.

<details>
<summary>Answer key</summary>

If it needs a week, cut scope. It must finish in this practice window.

</details>

## Exercise 2: Configure loop artifacts
**id:** ex-2

Create or update BRIEF.md, SOURCES.md, wall rules, one playbook, tool allow list, done checks.

<details>
<summary>Answer key</summary>

All six pieces should exist, even if short. Facts stay in the pack, not in huge wall text.

</details>

## Exercise 3: Run, measure, and write a look-back
**id:** ex-3

Run once. Record one metric. Write what improved and what becomes a team default.

<details>
<summary>Answer key</summary>

Strong look-backs name a metric and one durable default (rule, checklist, or pack habit).

</details>
""",
    "quiz": """moduleId: capstone-lab
questions:
  - id: q1
    prompt: "What makes a good capstone workflow?"
    options:
      - id: a
        label: "A real job you own that can finish in one practice block"
      - id: b
        label: "A giant rewrite of the whole company"
      - id: c
        label: "A toy with no artifact"
      - id: d
        label: "Something you will never do again"
    correctOptionId: a
    explanation: "Real and finishable beats fantasy scope."
  - id: q2
    prompt: "What should you configure before generating?"
    options:
      - id: a
        label: "Research pack, wall rules, playbook, tools, and done checks"
      - id: b
        label: "Only a funny opener"
      - id: c
        label: "Every plugin on earth"
      - id: d
        label: "Nothing"
    correctOptionId: a
    explanation: "Setup makes the run teach the loop."
  - id: q3
    prompt: "What should a look-back include?"
    options:
      - id: a
        label: "One metric and one default to keep"
      - id: b
        label: "Only vibes"
      - id: c
        label: "Secrets"
      - id: d
        label: "A promise to skip checks next time"
    correctOptionId: a
    explanation: "Measure and keep a durable habit."
""",
}


def update_yaml_fields(path: Path, fields: dict) -> None:
    text = path.read_text()
    for key, value in fields.items():
        if isinstance(value, list):
            block = "\n".join(f"  - {item}" for item in value)
            pattern = rf"{key}:\n(?:  - .*\n)*"
            repl = f"{key}:\n{block}\n"
            text2, n = re.subn(pattern, repl, text, count=1)
            if n == 0:
                text = text.rstrip() + f"\n{key}:\n{block}\n"
            else:
                text = text2
        else:
            # quote if colon present
            rendered = value if ":" not in value else f'"{value}"'
            pattern = rf"{key}:.*"
            text2, n = re.subn(pattern, f"{key}: {rendered}", text, count=1)
            if n == 0:
                text = text.rstrip() + f"\n{key}: {rendered}\n"
            else:
                text = text2
    path.write_text(text)


def write_module(dir_name: str, payload: dict) -> None:
    d = ROOT / dir_name
    (d / "lesson.mdx").write_text(payload["lesson"].strip() + "\n")
    (d / "exercises.md").write_text(payload["exercises"].strip() + "\n")
    (d / "quiz.yaml").write_text(payload["quiz"].strip() + "\n")
    update_yaml_fields(
        d / "module.yaml",
        {
            "subtitle": payload["subtitle"],
            "objectives": payload["objectives"],
            "loopPlacement": payload["loopPlacement"],
            "skipConsequence": payload["skipConsequence"],
            "exerciseTitles": payload["exerciseTitles"],
        },
    )
    print("wrote", dir_name)


def main() -> None:
    for name, payload in DATA.items():
        write_module(name, payload)


if __name__ == "__main__":
    main()
