# Preparing content batches for Aqeeq Astro

These four files are **format examples only**, not approved interpretations or publishable copy. Copy the appropriate envelope into `assets/data/content/<domain>/<stable-id>.json`, replace every example value, and keep `workflow.status` as `draft`.

## Validate before submitting a batch

Run from the repository root:

```sh
node scripts/validate-content-batch.js assets/data/content
node scripts/validate-content-batch.js docs/content-examples
```

The batch validator checks JSON syntax, required fields, domain-specific payload shape, duplicate IDs within each domain, and refuses approved/published/withdrawn entries. It does not decide whether a source is authoritative or whether an interpretation is editorially correct.

## Required workflow

1. Add new entries with a stable unique ID and increment `contentVersion` whenever that entry changes.
2. Record who authored it and the source type. Add a URL and precise locator when based on an external source. For Matrix, record the school and method version; do not mix numbering schools.
3. Submit as `draft` or `in-review`.
4. Review the text, source, terminology, and domain-specific rules.
5. Approval and publication require a reviewed change and reviewer metadata. Do not use client-side fields as an authorization boundary.
6. For static deployment, update the content cache version when shipping a batch and test the intended preview before considering release.

## Domain-specific payload notes

- **Matrix:** preserve the established section names, point order, formulas, and school-specific numbering. Keep source/reference text separate from Aqeeq interpretation.
- **Tarot:** `upright` is an object so keywords, interpretation, and later spread-specific data can remain structured. Add `reversed` only when supported by the chosen deck/tradition.
- **Astrology:** record the tradition and settings needed to interpret the text, such as tropical/sidereal zodiac and house system where relevant.
- **Psychology:** distinguish evidence-based educational material from reflective prompts; avoid presenting a symbolic interpretation as clinical fact.

Examples in this directory must not be copied as final content.
