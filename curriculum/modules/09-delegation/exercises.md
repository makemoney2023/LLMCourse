# Exercises

## Exercise 1: Map the four layers
**id:** ex-1

Pick an AI tool your team uses. Name its model, agent actions, harness features, and any agentic framework. Then answer: do you need a framework? Score the current harness on tool fit, memory, approvals, logs, portability, and collaboration. Mark each check pass or gap.

<details>
<summary>Answer key</summary>

The model writes. The agent acts. The harness supplies rules, tools, files, memory, approvals, logs, and checks. A framework builds a custom workflow.

Choose a framework only when the harness has a real gap. A brand comparison is not a reason.

**Worked example:** A coding agent can read files, run tests, and show diffs. Its harness passes tools, logs, portability, and approvals. The team does not need a framework for one reviewed code change.

</details>

## Exercise 2: Write a shared workspace contract
**id:** ex-2

Use a real or sample workflow. List the canonical sources, shared rules, playbooks, tool allow list, approval gates, handoff format, output owners, and merge owner. Add one line for personal scratch work that must stay outside the workspace.

<details>
<summary>Answer key</summary>

The contract needs one home for each fact and one owner for each editable output. Personal chats and rejected drafts should not become shared truth.

**Worked example:** BRIEF.md owns product facts. SOURCES.md owns proof. Wall rules ban invented prices. Search is allowed. A person approves facts before drafting. Research returns ten cited bullets. Maya owns the draft and final merge. Personal brainstorm chats stay private.

</details>

## Exercise 3: Repair a workspace collision
**id:** ex-3

Two agents edited the same launch draft. One used stale product memory. The other followed an old rule file. Nobody approved the facts or owned the merge. Repair the workflow. Name the canonical source, rule owner, edit boundaries, approval gate, handoff, and merge owner.

<details>
<summary>Answer key</summary>

Move product facts into one dated BRIEF.md and proof into SOURCES.md. Delete stale personal memory. Name one owner for shared rules. Give the researcher a read-only job and the writer sole draft ownership. Require fact approval before drafting. Return cited bullets through the handoff format. Name one merge owner.

Parallel work is safe only when outputs do not overlap. Separate files, sections, rows, branches, or worktrees can work. One shared draft needs one editor at a time.

</details>
