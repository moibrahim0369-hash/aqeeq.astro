# Tarot Study Lab: implementation status

## What is implemented in this branch

- A standalone Arabic RTL study page at `tarot-study.html`.
- A 78-card Rider-Waite-Smith catalog: 22 Major Arcana and 56 Minor Arcana across four suits.
- Structured starter content in `assets/data/tarot/study-cards.json`, with reference meanings separated from Aqeq Astro original interpretation, constructive/challenging expressions, practical reflection prompts, and editorial status.
- All starter content remains `in_review`. Sources are currently empty in the starter JSON, so it must not be represented as independently source-verified or published.
- Deterministic local retrieval in `assets/js/tarot-retrieval.js`.
- An authenticated `tarot-assistant` Edge Function that searches only published versions and cards, applies per-user daily limits, sends context to Gemini using a server-side secret, and returns only source records found in the database.
- A role-gated `tarot-editor` Edge Function for raw material capture, draft version creation, submission to review, source approval, content approval, publication, and review-queue retrieval.
- A non-destructive SQL migration for cards, sources, raw materials, version history, review events, request usage, RLS, and a seeded 78-card catalog.
- Node contract tests for the card catalog, retrieval, and security boundaries.

## Roles and security assumptions

- The server reads editor roles only from verified Supabase Auth `app_metadata.role`, with values `editor` or `admin`. Do not use user-editable `user_metadata` for authorization.
- Editors can add raw material, create drafts, and submit versions for review.
- Admins can approve source records, approve versions, and publish approved versions.
- The assistant requires an authenticated user and retrieves only rows with both version and card status `published`.
- Gemini API credentials belong in the Edge Function secret `GEMINI_API_KEY`; never place that secret in browser JavaScript.
- The Supabase publishable key in the browser is public by design and is not a service-role key.
- The database migration and Edge Functions are source code only in this PR. They have **not** been applied or deployed to the connected project.

## Before enabling the server workflow

1. Review the migration against the live schema, then apply it through the approved migration process.
2. Configure the signed-in site to share the same Supabase Auth session with this standalone page. The page uses the project's public publishable key.
3. Add `GEMINI_API_KEY` as an Edge Function secret and set `GEMINI_MODEL` / `TAROT_MAX_REQUESTS_PER_DAY` as appropriate.
4. Assign `app_metadata.role` using a trusted server/admin path, never from client-side profile editing.
5. Deploy `tarot-assistant` and `tarot-editor` with JWT verification enabled.
6. Test as anonymous, normal authenticated user, editor, and admin. The navigation link is included in this PR branch, but it will not reach production unless the PR is approved and merged.

## Editorial acceptance rules

- Raw source material remains separate from reference summaries and Aqeq Astro's original interpretation.
- An approved/published content version must have at least one source ID, an admin approval record, and approved source records.
- Do not mark starter content approved or published just because it has been generated or seeded.
- Tarot is framed as symbolic reflection, not diagnosis, evidence of another person's private feelings, or a guaranteed prediction.

## Tests

The PR workflow runs:

- `node tests/tarot-study.test.js`
- `node tests/tarot-retrieval.test.js`
- `node tests/tarot-security-contract.test.js`

These are contract tests, not live Supabase RLS integration tests or live Gemini end-to-end tests. Those require the migration and Edge Functions to be deployed in a non-production test environment with the required secret configured.
