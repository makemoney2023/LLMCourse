# LLM Leverage Course

Plain-language, tool-agnostic course on getting better AI answers via the **context loop**: research packs, wall rules, tools/MCP, lookup, clean chats, memory, specialists, clear asks, and checks. Written for broad teams at roughly grade-5 reading level.

## Surfaces

- **Self-paced app** — Next.js modules with diagrams, exercises, quizzes, review mode, command palette search, dark mode, and local progress (with export/import backup)
- **Workshop series** — four in-class sessions that mirror the same curriculum (`curriculum/workshops/`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # vitest unit/content tests
npm run test:e2e  # Playwright smoke (builds via webServer start)
npm run build     # production build
```

## Live deploy

Production: [https://llm-leverage-course.vercel.app](https://llm-leverage-course.vercel.app)

## Curriculum source of truth

```
curriculum/
  COURSE.md
  workshops/session-0{1..4}.md
  modules/NN-slug/
    module.yaml
    lesson.mdx
    exercises.md
    workshop.md
    diagram.mmd
    quiz.yaml
```

The app loads YAML + Markdown from `curriculum/` at build/request time. Do not maintain a second syllabus in the UI.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- shadcn/ui
- Mermaid diagrams
- LocalStorage progress (no auth in v1)

## Audience

Broader teams—knowledge workers, operators, and builders. Concepts map across ChatGPT, Claude, Cursor, Copilot, and similar tools.
