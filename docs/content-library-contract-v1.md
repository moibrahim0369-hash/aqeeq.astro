# Aqeeq Astro content library contract (v1)

This is a static-first content envelope and validation contract. It is not a CMS, database migration, or admin interface.

## Paths

- Matrix drafts and existing interpretation files remain under `assets/data/matrix/`.
- New cross-library entries live under `assets/data/content/<domain>/<stable-id>.json`.
- Supported domain folders: `matrix`, `tarot`, `astrology`, `psychology`.
- The test-only lifecycle fixture is intentionally unpublished at `assets/data/content/matrix/qa-lifecycle-sample.json`; never copy it into production content as final copy.

## Required envelope

- `schemaVersion`: currently `1`.
- `id`: stable lowercase identifier, unique within the domain.
- `domain`: one of the supported domains.
- `contentVersion`: positive integer. Increment it when editing the entry.
- `workflow.status`: `draft` → `in-review` → `approved` → `published`; `withdrawn` hides a previously published entry.
- `review`: status and, after approval, `reviewedBy` and `reviewedAt`.
- `provenance`: `authorship`, `sourceType`, optional source URL/locator, and school/version details where relevant.
- `payload`: domain-specific content. The schema deliberately does not flatten all libraries into one text shape.

## Domain payloads in v1

- Matrix: `title` and `body` (additional fields are allowed).
- Tarot: `title` and an `upright` object (other spread/position fields may be added by the Tarot-specific schema later).
- Astrology: `title` and `body`.
- Psychology/education: `title` and `body`.

The validator is fail-closed: invalid entries, drafts, entries awaiting review, approved-but-unpublished entries, and withdrawn entries return no public result. Publishing requires explicit approved review metadata and a publication timestamp.

## Cache/version rules

- The loader appends a version query string to static requests and deduplicates concurrent/repeated loads.
- Failed requests are evicted from cache so a later retry can succeed.
- Call `clear(path)` or `clear()` after a content change in the same runtime.
- Increment the loader's version when deploying a batch that changes content assets, otherwise a browser/CDN may continue serving a cached response.

## Important limits

- This module validates and resolves content; it does not write statuses to GitHub, enforce permissions on a server, or provide an editorial admin UI.
- For this static site, changing a file's workflow state is a reviewed code change. Do not treat a client-side status flag as an authorization boundary for private or paid content.
- Do not mark traditional Matrix rules as verified without source, edition, locator, and school. Keep original reference terminology, Aqeeq interpretation, and third-party source text separate.
- Arcana 8/11 mapping conflict remains unresolved and must not be “fixed” by this content schema.
