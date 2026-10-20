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

Set these on the Vercel project (Production and Preview) and redeploy. A missing value fails closed.

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes, to sell | Stripe secret key (`sk_test_…` or `sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | yes, to sell | Signing secret for `POST /api/webhooks/stripe` |
| `STRIPE_PRICE_ID` | yes, to sell | Price id from the setup script (`price_…`) |
| `ACCESS_TOKEN_SECRET` | recommended | Signs the session cookie and access code. If unset, the webhook secret is used. |
| `RESEND_API_KEY` | optional | Sends magic-link email. Without it, buyers use the access code. |
| `EMAIL_FROM` | optional | From address for Resend, for example `LLM Leverage <houdini@abra-ca-dabra.app>` |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical origin for Checkout return URLs when `VERCEL_URL` is not the public host |

Rollout mail and the in-lesson feedback link go to `houdini@abra-ca-dabra.app`.

### Turn on checkout

1. Create the product and the $149 USD one-time price. The script is safe to re-run; it finds the existing product id `llm_leverage_course` and lookup key `llm_leverage_course_14900_usd`.

   ```bash
   STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup
   # live key, after you mean to:
   STRIPE_SECRET_KEY=sk_live_… STRIPE_ALLOW_LIVE=1 npm run stripe:setup
   ```

2. Put `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the printed `STRIPE_PRICE_ID` in Vercel. Add `ACCESS_TOKEN_SECRET` (a long random string) so rotating the Stripe key does not sign buyers out.
3. In Stripe, add a webhook endpoint for this deployment:
   - URL: `https://<your-host>/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
4. Redeploy. The buy button stays **Coming soon** until all three `STRIPE_*` values are present at request time.
5. Optional: set `RESEND_API_KEY` and `EMAIL_FROM` so "Email me a sign-in link" can send mail. Until then, the confirmation page shows an access code the buyer can paste on `/access`.

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

The app loads YAML + Markdown from `curriculum/` at build/request time. Do not maintain a second syllabus in the UI.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- shadcn/ui
- Mermaid diagrams
- LocalStorage progress, plus a server-side Stripe paywall for everything after Module 1

## Audience

Broader teams—knowledge workers, operators, and builders. Concepts map across ChatGPT, Claude, Cursor, Copilot, and similar tools.
