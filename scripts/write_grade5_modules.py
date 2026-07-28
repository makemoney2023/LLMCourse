#!/usr/bin/env python3
"""Rewrite modules 02-12 learner-facing content at grade-5 reading level."""
from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "curriculum" / "modules"

DATA: dict[str, dict] = {}

DATA["02-deep-research"] = {
    "subtitle": "Find facts before you start the project",
    "objectives": [
        "Explain why fact-finding first makes goals clearer.",
        "Run a small research pass and save source links.",
        "Make a short BRIEF.md and SOURCES.md pack for later use.",
    ],
    "loopPlacement": "Research sharpens your goal. It also makes files you can put on the desk later.",
    "skipConsequence": "You write rules from guesses. Later answers invent facts with no trail.",
    "exerciseTitles": [
        "Scope three research questions",
        "Capture sources with links and dates",
        "Write a short cited BRIEF.md",
    ],
    "lesson": """# Deep research

## What this is

**Deep research** means fact-finding before you start.
You gather real pages and notes first. Then you build.

## Why it matters

Sam started a project by chatting. The AI invented “facts.”
Sam wrote rules from those guesses. Weeks later, nothing matched real docs.
A short research pack would have stopped that.

## Big ideas

### Research is not chatting

Chatting asks the helper to remember or invent.
Deep research **collects**. It visits pages and saves what it finds.
Treat results as draft evidence. You still check important claims.

### Your project pack

Make simple files you can reuse:

| File | What it holds |
|------|----------------|
| BRIEF.md | One-page summary of the problem |
| SOURCES.md | Links, dates, and why each link matters |
| GLOSSARY.md | Shared words (optional) |

You need at least BRIEF.md and SOURCES.md.
Keep them short. Do not paste a whole website into wall rules.

### Tools like Firecrawl

Firecrawl is one research tool. Other tools can browse or dig deep too.
They help you search, copy clean page text, and save sources.
The habit matters more than the brand name.

### Clear goals need facts

Bad goal: “Build an AI helper for sales.”
Better goal: “Help SDRs prep first calls. Use the clinic website. No medical claims.”

## Where it sits in the loop

Research feeds a sharper goal. The pack becomes binder pages for later lookup.

## What goes wrong if you skip it

Rules encode folklore. Answers sound sure but have no sources.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Deep research | Research modes, browse tools, Firecrawl |
| Context pack | Project files, wiki pages, repo docs |
| Citations | Link lists in BRIEF.md and SOURCES.md |

## Tips

- Ask three narrow questions, not “everything.”
- Save URL + date for every key claim.
- Keep raw scrapes in a scrap folder.
- Attach BRIEF.md later—not the whole crawl.
""",
    "exercises": """# Exercises

## Exercise 1: Scope three research questions
**id:** ex-1

Pick a real project. Write one sentence for the problem.
Write three research questions. Write what is out of scope. Set a time box.

<details>
<summary>Answer key</summary>

Good questions are narrow. Weak ones sound like “research the market.”
Example: “What does the official docs say about login steps?”

</details>

## Exercise 2: Capture sources with links and dates
**id:** ex-2

Answer your questions with a research tool or careful browsing.
List at least five sources: URL, date, one-line why it matters.

<details>
<summary>Answer key</summary>

If your only source is “the chat said so,” you did not do deep research.
Prefer first-hand pages. Note the date. Pages change.

</details>

## Exercise 3: Write a short cited BRIEF.md
**id:** ex-3

Write BRIEF.md (one page) and SOURCES.md.
Each big claim in BRIEF.md should point to a source.

<details>
<summary>Answer key</summary>

Checklist: clearer goal than before; risky claims have links; open questions listed; a teammate could continue without the chat.

</details>
""",
    "quiz": """moduleId: deep-research
questions:
  - id: q1
    prompt: "Why research before writing standing rules?"
    options:
      - id: a
        label: "So goals and words come from sources, not guesses"
      - id: b
        label: "Because only Firecrawl works"
      - id: c
        label: "To fill the desk with every page forever"
      - id: d
        label: "So you can skip checking later"
    correctOptionId: a
    explanation: "Research makes goals real. Rules from guesses encode the wrong problem."
  - id: q2
    prompt: "What belongs in a simple project pack?"
    options:
      - id: a
        label: "A short BRIEF.md and a SOURCES.md with links and dates"
      - id: b
        label: "Only the chat scroll"
      - id: c
        label: "Every raw page pasted into wall rules"
      - id: d
        label: "Secrets and API keys"
    correctOptionId: a
    explanation: "Short cited files beat scrollback and keep wall rules light."
  - id: q3
    prompt: "How should research files feed later chats?"
    options:
      - id: a
        label: "Save cited files; attach short parts when needed"
      - id: b
        label: "Paste the full crawl into every rule block"
      - id: c
        label: "Never save sources"
      - id: d
        label: "Turn every page into always-on rules"
    correctOptionId: a
    explanation: "Keep synthesis short. Pull pages from the binder when needed."
  - id: q4
    prompt: "Which research question is best?"
    options:
      - id: a
        label: "What login steps do the official docs require?"
      - id: b
        label: "Tell me everything about software"
      - id: c
        label: "Research the future"
      - id: d
        label: "Find something cool"
    correctOptionId: a
    explanation: "Narrow questions make useful sources."
""",
}

DATA["03-system-instructions"] = {
    "subtitle": "Wall rules that guide every chat",
    "objectives": [
        "Explain what standing instructions do before you type.",
        "Write short wall rules at the right level of detail.",
        "Spot and fix rules that fight each other.",
    ],
    "loopPlacement": "Standing instructions sit on the wall. They shape every turn on the desk.",
    "skipConsequence": "Hidden rules steer every answer. Conflicts are hard to see from the chat alone.",
    "exerciseTitles": [
        "Audit a rule block you already use",
        "Rewrite bloated rules to be short",
        "Fix two rules that fight",
    ],
    "lesson": """# System instructions

## What this is

**Standing instructions** are like rules on the classroom wall.
They are there before you ask the first question.
They guide every answer in that space.

## Why it matters

Jordan’s helper kept writing long jokes. Jordan never asked for jokes.
An old wall rule said “be playful.” Nobody remembered it.
Wall rules are powerful because they are quiet.

## Big ideas

### What wall rules should cover

- Who the helper is for (writer, analyst, coding partner)
- Always / never rules (tone, secrets, made-up numbers)
- What to do when something is unclear (ask vs guess)
- What is out of bounds

### Right altitude

Too vague: “Be helpful.”
Too detailed: twenty pages of micro steps for every task.
Right altitude: clear limits, short defaults, room for the task.

Write wall rules from your BRIEF.md when you can.
Point to SOURCES.md for facts. Do not paste whole pages into the wall.

### Conflicts

If one rule says “be brief” and another says “explain everything,” the helper gets confused.
Pick one. Delete the fight.

## Where it sits in the loop

Wall rules load into desk space with your ask. They steer every turn.

## What goes wrong if you skip it

Quiet conflicts shape answers. You debug the chat and miss the wall.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Standing instructions | Custom instructions, project instructions, agent rules |
| Conflicts | Mixed tones or opposite “always” lines |
| Evidence link | “Prefer BRIEF.md; ask if facts are missing” |

## Tips

- Keep wall rules under about 12 short lines.
- Put recipes in a playbook, not on the wall.
- After research, update wall rules from the brief.
- Read wall rules when answers feel “weird for no reason.”
""",
    "exercises": """# Exercises

## Exercise 1: Audit a rule block you already use
**id:** ex-1

Open your custom or project instructions. List what helps, what is fluff, and what conflicts.

<details>
<summary>Answer key</summary>

Keep limits that stop real harm. Cut style essays. Mark any two lines that disagree.

</details>

## Exercise 2: Rewrite bloated rules to be short
**id:** ex-2

Cut the block to 12 lines or fewer at the right level of detail.
Add one line that points to BRIEF.md or SOURCES.md if you have them.

<details>
<summary>Answer key</summary>

Good rewrites are short and testable. They do not micromanage every sentence.

</details>

## Exercise 3: Fix two rules that fight
**id:** ex-3

Write two conflicting rules. Then rewrite them as one clear rule.

<details>
<summary>Answer key</summary>

Example fight: “always be brief” vs “always give full history.”
Fix: “Be brief by default. Give detail only when asked.”

</details>
""",
    "quiz": """moduleId: system-instructions
questions:
  - id: q1
    prompt: "What are standing instructions like?"
    options:
      - id: a
        label: "Rules on the classroom wall that apply every day"
      - id: b
        label: "A one-time joke in a single message"
      - id: c
        label: "A secret the helper never reads"
      - id: d
        label: "Only tool output"
    correctOptionId: a
    explanation: "Standing instructions guide every turn in that space."
  - id: q2
    prompt: "What is ‘right altitude’ for wall rules?"
    options:
      - id: a
        label: "Clear limits without micromanaging every step"
      - id: b
        label: "The longest document you can paste"
      - id: c
        label: "No rules at all"
      - id: d
        label: "Only emoji rules"
    correctOptionId: a
    explanation: "Short, clear constraints beat novels and vibes."
  - id: q3
    prompt: "Where should long facts live?"
    options:
      - id: a
        label: "In BRIEF.md or SOURCES.md, not in huge wall text"
      - id: b
        label: "Inside every always-on rule"
      - id: c
        label: "Nowhere"
      - id: d
        label: "Only in your head"
    correctOptionId: a
    explanation: "Point to the pack. Keep the wall light."
  - id: q4
    prompt: "What should you do with fighting rules?"
    options:
      - id: a
        label: "Rewrite them into one clear rule"
      - id: b
        label: "Add both and hope"
      - id: c
        label: "Hide them"
      - id: d
        label: "Delete all tools"
    correctOptionId: a
    explanation: "Conflicts confuse the helper. Pick one."
""",
}

DATA["04-standing-playbooks"] = {
    "subtitle": "Always-on rules vs recipe cards",
    "objectives": [
        "Choose wall rules vs recipe cards for a task.",
        "Write one short always-on rule and one playbook.",
        "Explain how too many always-on rules crowd the desk.",
    ],
    "loopPlacement": "Wall rules stay hot. A playbook is like a recipe card you pull out when needed.",
    "skipConsequence": "Everything becomes noisy wall text—or nothing is reusable.",
    "exerciseTitles": [
        "Sort ten guidelines into wall vs recipe",
        "Write one short always-on rule",
        "Write one on-demand playbook",
    ],
    "lesson": """# Standing playbooks

## What this is

A **playbook** is like a recipe card. You pull it out when you cook that dish.
**Always-on rules** stay on the wall. They apply to most work in a space.

## Why it matters

A team pasted a great prompt into every chat. The desk filled with noise.
Another team wrote nothing down. Every chat started from zero.
You need both: a short wall and good recipe cards.

## Big ideas

### Always-on rules

Keep them short, stable, and true most of the time.
Example: “Do not share secrets. Ask if a fact is missing.”

These sit next to Module 3 wall instructions. Many tools call them project rules.

### On-demand playbooks

Use them for a special job: status email, incident note, PR write-up.
Give trigger words so people know when to use them.
Keep steps and “done when” checks on the card—not on the wall.

### Facts are not rules

Long competitor lists belong in SOURCES.md from Module 2.
Do not paste them into always-on rules.

## Where it sits in the loop

Wall rules stay in standing context. Recipe cards enter when the task matches.

## What goes wrong if you skip it

The desk fills with unused rules. Or quality resets every chat.

## Where this shows up in tools

| Idea | Where you see it |
|------|------------------|
| Always-on rules | Project rules, AGENTS.md, guidelines |
| Playbooks | Skills, saved prompts, slash commands |
| Triggers | “/status”, “draft board update” |

## Tips

- If a line is only for one workflow, make it a recipe card.
- Keep wall rules under one short screen.
- Build playbooks from BRIEF.md constraints when you can.
""",
    "exercises": """# Exercises

## Exercise 1: Sort ten guidelines into wall vs recipe
**id:** ex-1

List ten guidelines from your work. Mark each wall or recipe. Explain two choices.

<details>
<summary>Answer key</summary>

Wall = true almost always. Recipe = only for a named workflow. Facts go in SOURCES.md.

</details>

## Exercise 2: Write one short always-on rule
**id:** ex-2

Write one always-on rule of eight lines or fewer for your team space.

<details>
<summary>Answer key</summary>

Strong rules prevent real harm and stay true for months. Cut fluff.

</details>

## Exercise 3: Write one on-demand playbook
**id:** ex-3

Write a recipe card with trigger phrases, steps, and done checks.

<details>
<summary>Answer key</summary>

If there is no trigger, people will not use it. Done checks must be testable.

</details>
""",
    "quiz": """moduleId: standing-playbooks
questions:
  - id: q1
    prompt: "What is a playbook like?"
    options:
      - id: a
        label: "A recipe card you open for one kind of task"
      - id: b
        label: "A secret key"
      - id: c
        label: "Unlimited desk space"
      - id: d
        label: "A random joke"
    correctOptionId: a
    explanation: "Playbooks are on-demand procedures."
  - id: q2
    prompt: "What should stay always-on?"
    options:
      - id: a
        label: "Short rules that are true for most tasks"
      - id: b
        label: "Every workflow step you have ever used"
      - id: c
        label: "Whole websites"
      - id: d
        label: "Nothing"
    correctOptionId: a
    explanation: "Always-on text must stay small or it crowds the desk."
  - id: q3
    prompt: "Where do long fact lists belong?"
    options:
      - id: a
        label: "In SOURCES.md or BRIEF.md, not in wall rules"
      - id: b
        label: "In every always-on block"
      - id: c
        label: "Only in jokes"
      - id: d
        label: "In tool names"
    correctOptionId: a
    explanation: "Facts are binder pages. Rules are wall text."
  - id: q4
    prompt: "Why do playbooks need triggers?"
    options:
      - id: a
        label: "So people know when to pull the recipe card"
      - id: b
        label: "So the desk becomes infinite"
      - id: c
        label: "So tools turn off"
      - id: d
        label: "So research is banned"
    correctOptionId: a
    explanation: "No trigger means the playbook stays unused."
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
            if n:
                text = text2
            else:
                text += f"\n{key}:\n{block}\n"
        else:
            pattern = rf"{key}:.*"
            text2, n = re.subn(pattern, f"{key}: {value}", text, count=1)
            if n:
                text = text2
            else:
                text += f"\n{key}: {value}\n"
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
