# Exercises

## Exercise 1: List tools in your helper today
**id:** ex-1

Inventory the tools, plugins, or MCP servers you have enabled. Mark each **useful**, **maybe**, or **noise** for your main daily workflow. Write one line on why for each useful item.

<details>
<summary>Answer key</summary>

Worked example inventory (build mode):

| Tool | Tag | Why |
|------|-----|-----|
| read_file | useful | Pull BRIEF.md and source snippets |
| codebase_search | useful | Find policy strings in repo |
| terminal | maybe | Only when running tests user requested |
| Firecrawl | noise | Research-only — off for daily drafts |
| send_email | noise | Never enable; violates never-list |

If you cannot name a purpose in one line, it is probably noise for that workflow. Move Firecrawl to research sessions only (Module 2).

</details>

## Exercise 2: Design a five-tool allow list
**id:** ex-2

For one workflow (support reply, code fix, or research refresh), list at most five enabled tools with one-line purposes. Add a never-list of at least four forbidden actions.

<details>
<summary>Answer key</summary>

Worked example — **support reply (build mode)**

Allow: (1) read_file — open handbook slice. (2) search_repo — find template. (3) fetch_url — one official policy link from SOURCES.md. (4) edit_draft — write reply text only. (5) ask_user — clarify missing ticket id.

Never-list: send_email, delete_ticket, charge_card, prod_deploy.

Firecrawl/deep crawl: research-only — enable when refreshing SOURCES.md, not when drafting from existing files.

</details>

## Exercise 3: Write one clear tool description
**id:** ex-3

Pick a fuzzy tool name from your setup. Rewrite its description: what it does, when to use it, when not to.

<details>
<summary>Answer key</summary>

Before: "data_wizard — powerful data helper for all your needs."

After: "read_local_file — Reads a file path inside the project repo. Use for BRIEF.md, SOURCES.md, and handbook snippets. Do not use for .env, keys, or paths outside the repo."

Good descriptions let a new teammate predict when the model should open the app — and when it should not.

</details>
