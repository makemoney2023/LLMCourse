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
npm run build     # Next.js production build (local smoke)
npm run build:vinext  # Cloudflare Worker build
```

## Live deploy

The course runs as a Cloudflare Worker (`llm-leverage-course`) with static assets. The older Vercel alias [https://llm-leverage-course.vercel.app](https://llm-leverage-course.vercel.app) is a previous deploy of this repo, not the target host.

```bash
npm run deploy:cloudflare
```

## Access and payments

Lifetime access is **$149 USD**, paid once through Stripe Checkout. Buyers sign back in with a magic link to the checkout email, or with the access code shown after payment.

Free without an account:

- Landing page
- Module list (titles and subtitles; modules 2–12 are marked locked)
- Module 1, including its lesson, exercises, quiz, and practice sandbox
- Glossary

Locked until a paid Checkout Session is confirmed:

- Modules 2–12 (lessons, exercises, quizzes, diagrams)
- Workshop decks and the other practice sandboxes
- Templates and worked-example diagrams
- Capstone builder, gallery, flashcards, review, and certificates

The lock is on the server. Locked routes do not render the lesson, deck, or file, and template and diagram URLs return 401. If Stripe is not configured, those routes stay locked and every buy button is a disabled **Coming soon**.

### Environment variables

Store these as Worker secrets (or, for the public site URL, a var). The Worker reads them from `process.env` (`nodejs_compat` plus `nodejs_compat_populate_process_env`). A missing Stripe value fails closed: locked routes stay locked and the buy button is a disabled **Coming soon**. Deploy does not require the secrets to exist.

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes, to sell | Stripe secret key (`sk_test_…` or `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | yes, to sell | Signing secret for `POST /api/webhooks/stripe` |
| `STRIPE_PRICE_ID` | yes, to sell | Price id from the setup script (`price_…`) |
| `ACCESS_TOKEN_SECRET` | recommended | Signs the session cookie and access code. If unset, the webhook secret is used. |
| `RESEND_API_KEY` | optional | Sends magic-link email. Without it, buyers use the access code. |
| `EMAIL_FROM` | optional | From address for Resend, for example `LLM Leverage <houdini@abra-ca-dabra.app>` |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin for sitemap and share links. Defaults to `https://learn.abra-ca-dabra.app` outside local dev. Checkout return URLs use the request host. |

Rollout mail and the in-lesson feedback link go to `houdini@abra-ca-dabra.app`.

Local Worker dev reads `.dev.vars` (see `.dev.vars.example`). Do not commit that file.

### Turn on checkout

1. Create the product and the $149 USD one-time price. The script is safe to re-run; it finds the existing product id `llm_leverage_course` and lookup key `llm_leverage_course_14900_usd`.

   ```bash
   STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup
   # live key, after you mean to:
   STRIPE_SECRET_KEY=sk_live_… STRIPE_ALLOW_LIVE=1 npm run stripe:setup
   ```

2. From a Cloudflare API token that can edit this Worker, set the secrets (each command prompts for the value; it is not stored in the repo):

   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   npx wrangler secret put STRIPE_PRICE_ID
   npx wrangler secret put ACCESS_TOKEN_SECRET
   # optional mail
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put EMAIL_FROM
   ```

   `ACCESS_TOKEN_SECRET` should be a long random string so rotating the Stripe key does not sign buyers out.
3. The public origin defaults to `https://learn.abra-ca-dabra.app`. Set `NEXT_PUBLIC_SITE_URL` only when this deployment should advertise a different origin:

   ```bash
   npx wrangler secret put NEXT_PUBLIC_SITE_URL
   # or add it under "vars" in wrangler.jsonc if you want it visible in the dashboard
   ```
4. In Stripe, add a webhook endpoint for this deployment:
   - URL: `https://learn.abra-ca-dabra.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
5. Redeploy with `npm run deploy:cloudflare`. The buy button stays **Coming soon** until all three `STRIPE_*` values are present at request time.
6. Optional: `RESEND_API_KEY` and `EMAIL_FROM` so "Email me a sign-in link" can send mail. Until then, the confirmation page shows an access code the buyer can paste on `/access`.

A completed checkout sets Stripe customer metadata `llm_leverage_access=active`. The success URL and the webhook both do this, so a replay does not grant access twice. A refund for this product sets the metadata to `revoked`; the next sign-in is refused. A browser that already has a session cookie keeps it until the cookie expires (400 days) or the buyer signs out.

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

The app loads YAML + Markdown from `curriculum/`. The Cloudflare build copies those files into the Worker server bundle so they are not public assets. Do not maintain a second syllabus in the UI.

## Stack

- Next.js App Router on Cloudflare Workers via vinext, TypeScript, Tailwind CSS v4
- shadcn/ui
- Mermaid diagrams
- LocalStorage progress, plus a server-side Stripe paywall for everything after Module 1

## Cloudflare

`wrangler.jsonc` is the Worker config. `npm run build:vinext` copies `curriculum/` into the Worker server bundle and refuses to finish if that text is missing. `npm run deploy:cloudflare` runs that build, then uploads `dist/` with `vinext-cloudflare deploy --skip-build`. The deploy command's own rebuild reads the empty curriculum stub and produces a Worker that 500s, so the npm script does not use it. Static files under `public/` are assets. Curriculum, templates, and diagrams are read only after the Worker checks the session cookie.

```bash
npm run dev:vinext          # Vite + workerd on port 3001
npm run preview:cloudflare  # production Worker build, local
npm run deploy:cloudflare   # build and deploy llm-leverage-course
```

## Audience

Broader teams—knowledge workers, operators, and builders. Concepts map across ChatGPT, Claude, Cursor, Copilot, and similar tools.
