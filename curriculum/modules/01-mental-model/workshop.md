# Workshop facilitator notes: Mental model

**Workshop session:** 1  
**Module duration:** ~25 minutes (within Session 1 block)  
**Session reference:** `curriculum/workshops/session-01.md`

## Purpose

Establish shared vocabulary before anyone touches custom instructions or playbooks. Learners should leave able to sketch the loop and point to where their last session went wrong.

## Timing

| Segment | Minutes | Activity |
|---------|---------|----------|
| Hook | 3 | Ask: "Who had the model forget something mid-thread?" Connect to context budget. |
| Teach | 10 | Walk the loop diagram; contrast one-shot chat vs agent loop. |
| Live demo | 8 | Map a real chat (facilitator screen) onto nodes. |
| Exercise 1 | 4 | Pairs: map *their* last session (sticky notes or doc). |
| Debrief | 5 | 2–3 volunteers; collect one "skip consequence" story. |

## Demo steps

1. Open any assistant with tools enabled (browse, file attach, or codebase search).
2. Run a small multi-step task: e.g., "Summarize this attached one-pager and list three risks."
3. **Pause after each step** and label aloud:
   - What entered standing context (if any)?
   - What was user intent this turn?
   - What tool/attachment added observations?
   - What is now sitting in the working thread?
4. Optionally continue one more turn to show thread growth ("Now rewrite for executives")—note that prior tool output is still present.
5. Show a "conversation too long" or context indicator if the product exposes one; if not, explain truncation conceptually.

## Discussion prompts

- "Which node failed in your last bad session—intent, standing context, retrieval, or verify?"
- "Where did you pay context cost without getting value?"
- "What would you verify before shipping output from an agent loop vs a one-shot answer?"
- "If we all use different products, what still transfers from this diagram?"

## Common misconceptions to address

| Misconception | Correction |
|---------------|------------|
| "The model remembered our kickoff last month." | Likely memory feature, pasted context, or retrieval—not magic recall. |
| "More context is always better." | Irrelevant attachments and stale tool output hurt attention. |
| "Agents are just smarter chat." | Tools change the loop; observations persist in the window. |
| "Verification is optional for drafts." | Drafts ship; verify is part of the loop, not a nice-to-have. |

## Materials

- Projector: module `diagram.mmd` (all nodes highlighted)
- Sticky notes or Miro: eight node labels for Exercise 1
- Optional: printed portable mapping table from `lesson.mdx`

## Facilitator prep

- Pick a demo task that completes in ≤3 tool turns.
- Avoid customer-specific secrets in live demo.
- Read Session 1 agenda for handoff to Module 2 (deep research pack).
