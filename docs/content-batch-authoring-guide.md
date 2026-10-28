# Preparing content batches for Aqeeq Astro

The four JSON files in `docs/content-examples/` are **format examples only**, not approved interpretations or publishable copy. Copy the matching envelope into `assets/data/content/<domain>/<stable-id>.json`, replace every example value, and start with `workflow.status: "draft"`.

## Batch commands

Run from the repository root:

```sh
# Validate new or in-review editorial batches. This mode rejects approved/published/withdrawn entries.
node scripts/validate-content-batch.js docs/content-examples
node scripts/validate-content-batch.js assets/data/content

# Validate the content directory as part of a reviewed release PR.
# This permits lifecycle states only when the full contract (including review metadata) is valid.
node scripts/validate-content-batch.js --release assets/data/content
```

The validator checks JSON syntax, required contract fields, domain payload shape, duplicate `domain + id` pairs, and lifecycle mode. It cannot determine whether a source is authoritative or whether an interpretation is editorially correct.

## Fields required in every entry

- `schemaVersion`: integer `1`.
- `id`: stable lowercase ID matching `[a-z0-9][a-z0-9._-]{1,119}`. Never reuse an ID for another entry.
- `domain`: exactly `matrix`, `tarot`, `astrology`, or `psychology`.
- `contentVersion`: positive integer. Increment whenever the entry changes.
- `workflow.status`: start with `draft`; use `in-review` when ready for review. Publication is a separate reviewed change.
- `review`: object. Drafts should use `status: "not-reviewed"` and null `reviewedBy` / `reviewedAt`. For `approved`, `published`, or `withdrawn`, set `status: "approved"`, a real reviewer identity in `reviewedBy`, and an ISO timestamp in `reviewedAt`.
- `provenance.authorship` and `provenance.sourceType`: non-empty strings. Preserve the author and source kind.
- `payload`: object matching the selected domain.

Optional general provenance fields: `sourceUrl`, `sourceLocator`, and `review.notes`. Use a URL plus a precise chapter/page/section/edition locator for external material when available. For original Aqeeq copy, identify it as original rather than inventing an external source.

## Domain payloads and recommended metadata

| Domain | Required payload | Recommended provenance fields | Optional payload fields |
|---|---|---|---|
| `matrix` | `title`, `body` | `schoolId`, `methodVersion` | Add domain-specific fields only without changing canonical section names, point order, formulas, SVG, or numbering school. Keep reference text separate from Aqeeq interpretation. |
| `tarot` | `title`, `upright` object | `deckId`, `traditionId` | `upright.keywords` (string array), `upright.interpretation`; optional `reversed` object only when supported by the chosen deck/tradition. |
| `astrology` | `title`, `body` | `traditionId`, `zodiacSystem`, `houseSystem` | Record relevant settings, such as Tropical/Sidereal and Placidus, where applicable. Do not mix schools without labeling them. |
| `psychology` | `title`, `body` | `discipline`, `evidenceLevel` | Distinguish evidence-based education from reflection prompts; do not present symbolic interpretation as clinical fact. |

The current tarot pilot is intentionally a draft and remains hidden on the page. It is a wiring fixture, not approved library copy.

## Review, publish, and withdraw

1. Add the entry with a unique ID and `draft` status.
2. Run the default batch validator and submit the JSON with the reviewed change/PR.
3. A human reviewer checks wording, sources, terminology, and domain rules, then records `review.status`, `reviewedBy`, and `reviewedAt`.
4. Publication is a separate reviewed PR that changes `workflow.status` to `published`, sets `workflow.publishedAt` to an ISO timestamp, and retains the approval metadata. Run `node scripts/validate-content-batch.js --release assets/data/content`.
5. To withdraw, set `workflow.status` to `withdrawn`, retain the original `publishedAt` and approval metadata, and submit a reviewed PR. The public resolver fails closed so withdrawn entries are hidden.
6. Increment the static content loader version when shipping a content batch, then verify the intended branch preview. Do not use browser/client fields as an authorization boundary.

The approval process remains file-and-PR based. No admin permissions or database workflow are implied by this format.
