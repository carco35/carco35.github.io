# Builder Readiness Profile

A tool that helps young entrepreneurs — many too young to have traditional
credit — turn their real track record into a structured, AI-generated
profile, then apply to real funding opportunities built for young builders.

## What it does

1. **Build** — add real projects, skills, an optional Plaid Sandbox bank
   connection, and vouches from people who know your work.
2. **Profile** — Claude synthesizes everything into a short narrative,
   strengths, areas still developing, and an internal "readiness tier"
   (never a credit score or credit report).
3. **Opportunities** — see four real, verified funding/mentorship programs
   for young builders (Kiva U.S., NFTE, Diamond Challenge, SCORE), a
   rule-based gap check against each one's requirements, and an AI-drafted
   first-pass application you review and submit yourself.
4. **Export** — a clean, printable one-pager to attach to an application or
   bring to a conversation with a parent or mentor.

## Setup

1. **Plaid (Sandbox)** — sign up free at [plaid.com/docs](https://plaid.com/docs)
   for Sandbox API keys. This is instant, no approval needed. Sandbox uses
   fake test banks and fake data only — never real bank credentials.
2. **Anthropic** — get an API key from
   [console.anthropic.com](https://console.anthropic.com).
3. Copy the example env file and fill in your keys:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   PLAID_CLIENT_ID=your_sandbox_client_id
   PLAID_SECRET=your_sandbox_secret
   PLAID_ENV=sandbox
   ANTHROPIC_API_KEY=your_anthropic_key
   ```

4. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

Data is stored locally in a SQLite file at `data/builder-readiness.sqlite`
(created automatically, git-ignored).

## Demo mode

On the `/build` page, click **"Load example profile"** to instantly fill in
a realistic example profile (a VC research project, a 50+ respondent peer
survey, and a shipped prototype) for live presentations — no need to type
everything on stage.

## Important constraints

- Plaid is configured for **Sandbox only** — this app never talks to Plaid
  Production and never handles real bank credentials.
- Nothing in this app is or claims to be an official credit score, credit
  report, or credit bureau product.
- There is no live integration, auto-submission, or data pipe to Kiva,
  NFTE, Diamond Challenge, SCORE, or any third party. All application
  drafts are copy-and-submit-yourself.
- Plaid access tokens are stored server-side only and are never sent to or
  stored in the browser.
