# Workshop facilitator notes: Verify & harden

**Workshop session:** 4  
**Module duration:** ~35 minutes  
**Precedes capstone in same session**

## Purpose

Learners build done checklists, diagnose traces, and harden permissions—closing the quality and security loop.

## Timing

| Segment | Minutes | Activity |
|---------|---------|----------|
| Teach | 10 | Done checklist; failure modes table; security habits. |
| Exercise 1 | 8 | Personal workflow checklist—share one item. |
| Exercise 2 | 8 | Diagnose three failures—map to loop node. |
| Exercise 3 | 7 | Harden MCP setup—groups post top three fixes. |
| Bridge | 2 | Intro capstone: run full loop with verify embedded. |

## Demo steps

1. Show trace with stale tool output → wrong fix (link Module 7 compaction / Module 6 retrieval).
2. Conflicting playbooks example—agent violates team norm.
3. Secret in chat screenshot (sanitized)—rotate + rule.
4. Golden task re-run: playbook change → regression caught.

## Discussion prompts

- "What failed verify last month—and why?"
- "Where do secrets enter your workflow today?"
- "Who reviews shared agent rules before merge?"
- "What's on your team's approval matrix?"

## Materials

- Failure mode cheat sheet (one slide)
- Exercise 3 scenario on slide
- Module diagram (verify loop close highlighted)
