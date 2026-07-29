# Exercises

## Exercise 1: Map the four layers
**id:** ex-1

Pick an AI tool your team uses. Name its model, agent actions, harness features, and any agentic framework. Then answer: do you need a framework? Score the current harness on tool fit, memory, approvals, logs, portability, and collaboration. Mark each check pass or gap.

<details>
<summary>Answer key</summary>

The model writes. The agent acts. The harness supplies rules, tools, files, memory, approvals, logs, and checks. A framework builds a custom workflow.

Choose a framework only when the harness has a real gap. A brand comparison is not a reason.

**Worked example — coding agent in an IDE:**

| Layer | What you see |
|-------|----------------|
| Model | Text engine behind the agent |
| Agent | Reads files, runs tests, continues after results |
| Harness | Rules files, tool allow list, diff review, approvals |
| Framework | None — ready-made harness is enough for one reviewed change |

Scorecard: tools pass · memory pass (repo files) · approvals pass (command allow list) · logs pass (transcript) · portability pass (export brief) · collaboration pass (shared rules). **No framework needed.**

</details>

## Exercise 2: Write a shared workspace contract
**id:** ex-2

Use a real or sample workflow. List the canonical sources, shared rules, playbooks, tool allow list, approval gates, handoff format, output owners, and merge owner. Add one line for personal scratch work that must stay outside the workspace.

<details>
<summary>Answer key</summary>

The contract needs one home for each fact and one owner for each editable output. Personal chats and rejected drafts should not become shared truth.

**Worked example — product launch one-pager:**

- Canonical sources: BRIEF.md (product facts), SOURCES.md (proof with dates).
- Shared rules: plain tone; no invented prices; cite SOURCES.md for numbers.
- Playbook: `/launch-onepager` recipe with steps and done checks.
- Tool allow list: read file, search repo. Never: send email, deploy, delete.
- Approval gate: person approves cited bullets before drafting starts.
- Handoff format: Goal / Done / Sources / Do not / Open questions.
- Output owner: Maya owns the draft file.
- Merge owner: Maya merges researcher bullets into the draft.
- Outside the workspace: personal brainstorm chats and rejected intros.

</details>

## Exercise 3: Repair a workspace collision
**id:** ex-3

Two agents edited the same launch draft. One used stale product memory. The other followed an old rule file. Nobody approved the facts or owned the merge. Repair the workflow. Name the canonical source, rule owner, edit boundaries, approval gate, handoff, and merge owner.

<details>
<summary>Answer key</summary>

Move product facts into one dated BRIEF.md and proof into SOURCES.md. Delete stale personal memory. Name one owner for shared rules. Give the researcher a read-only job and the writer sole draft ownership. Require fact approval before drafting. Return cited bullets through the handoff format. Name one merge owner.

Parallel work is safe only when outputs do not overlap. Separate files, sections, rows, branches, or worktrees can work. One shared draft needs one editor at a time.

**Worked repair:**

1. Canonical source: BRIEF.md dated today; wipe conflicting product stickies.
2. Rule owner: Lee maintains AGENTS.md / project instructions.
3. Edit boundaries: researcher returns `research-bullets.md` only; writer alone edits `launch.md`.
4. Approval gate: Lee signs facts before writer starts.
5. Handoff: ten cited bullets, no raw logs.
6. Merge owner: writer merges after verify against SOURCES.md.

</details>
