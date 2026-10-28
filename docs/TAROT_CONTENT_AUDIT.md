# Tarot content quality audit (branch snapshot)

Audit target: `assets/data/tarot/study-cards.json` on PR #42 branch.
Snapshot SHA before this audit commit: `a3950eaca4b6da04e7d262459f7658bc7b8dd17e`.
This is a content-quality audit, not a claim that symbolic interpretations are scientific facts.

## Findings

| Check | Count |
|---|---:|
| Catalog entries | 78 |
| Entries with a non-empty original core paragraph | 78 |
| Entries with at least one source record | 1 |
| Entries with no source records | 77 |
| Entries whose traditional summary still explicitly says it needs documentation | 21 |
| Core paragraphs shorter than 100 characters | 4 |
| Entries with a standalone original reversed interpretation | 1 |
| Entries with concrete examples | 1 |
| Entries with position-specific spread guidance | 1 |
| Entries with card-combination guidance | 1 |
| Entries with a visual description | 1 |
| Entries repeating the same generic upright money paragraph | 21 |
| Distinct core paragraphs | 78 |
| Published entries | 0 |

All 78 cards remain `in_review`. All 78 have some card-specific core wording, but unique wording is not the same as verified accuracy or editorial completeness. In the pre-audit snapshot, all 78 had no sources, 22 traditional summaries were explicit placeholders, the generic money paragraph repeated 22 times, and there were no dedicated examples, spread-position guides, card combinations, or visual descriptions. The Magician is now the first card with traceable references and expanded, context-specific material; the remaining 77 are not to be treated as researched or complete.

## The Magician: researched draft

The Magician now includes:
- A separately summarized traditional reference layer and original Aqeq Astro analysis.
- Four source records with stable IDs, URLs, named sections, and an explanation of which claims each source supports.
- Research notes mapped to source IDs.
- Upright and reversed meanings with a note about school differences.
- Visual symbols, number 1, four suit/element correspondences, relationship/work/money/growth/decision contexts, spread positions, combinations, examples, reflection questions, and practical steps.
- Explicit limitations: reflective symbolism only, not diagnosis, proof of another person's feelings, or certain prediction.

### Sources used

1. **Arthur Edward Waite**, *The Pictorial Key to the Tarot* (1911), “I. The Magician”, inner symbolism: https://en.wikisource.org/wiki/Page:The_Pictorial_Key_to_the_Tarot.pdf/85
2. **Arthur Edward Waite**, *The Pictorial Key to the Tarot* (1911), “The Magician”, divinatory meanings: https://en.wikisource.org/wiki/Page:The_Pictorial_Key_to_the_Tarot.pdf/296
3. **Biddy Tarot**, “The Magician Tarot Card Meanings”, modern upright/reversed comparison: https://biddytarot.com/tarot-card-meanings/major-arcana/magician/
4. **Victoria and Albert Museum**, “A history of tarot cards”, deck-history and suit-context background: https://www.vam.ac.uk/articles/tarot-cards

The Waite text is treated as a historical primary source; Biddy Tarot is a modern secondary comparison; V&A supports deck history and general suit context only. Their authority is not interchangeable. The Arabic prose is newly written and paraphrased, not copied verbatim.

## Status and limitations

- The Magician remains `in_review`, not approved or published.
- Source records in the JSON document the research trail but are not yet inserted into the live Supabase `tarot_sources` table; no database was modified.
- The branch now defines writer, reviewer, and admin capabilities in RLS helper functions and Edge Function gates. Writers' queue/material/draft reads are owner-scoped; reviewers can approve/reject; only admins can approve sources and publish. Existing `editor` role remains a legacy writer-like role.
- These are code-level guardrails only. No live assistant request, Supabase RLS integration test, role-permission test against a deployed function, or browser-device test was possible from the current branch-only setup.
- The static tests can enforce structure and citation traceability; they cannot prove that a symbolic interpretation is correct or replace human review.
- The remaining 77 cards need card-by-card research and writing. Do not bulk-promote the current starter text to approved.

## Follow-up content batch (2026-10-28)

The catalog-wide gap counts above remain applicable: the Magician is still the only card with documented source records, and the other 77 cards still require individual research. This batch did not fill missing fields with generic prose.

- Expanded The Magician's original Aqeq relationship interpretation with distinct dating, commitment, and separation contexts, each with upright/reversed guidance. Added a dedicated `relationship-stages` section. These remain `in_review`.
- Added `assets/data/tarot/tarot-import-batch.schema.json` and `assets/data/tarot/tarot-import-batch.template.json`, plus `docs/TAROT_CONTENT_IMPORT_WORKFLOW.md`. The intake contract preserves the exact source text, source identity and attribution, proposed block provenance, target card ID, merged-version pointer, and append-only review history. Intake defaults to `received`; it never approves or publishes content.
- Added `tests/tarot-content-import-contract.test.js` to check the import contract and Magician's relationship-stage coverage; it is run by PR validation.
- Corrected the existing `tarot-assistant` retrieval path to retain a spread card's supplied upright/reversed orientation and position in retrieved context, include position terms in ranking, and return an explicit insufficient-knowledge response when no selected card is supplied and no published knowledge matches. A missing orientation is recorded as `unknown`, not guessed. The static contract checks pass, but this is not a live Supabase/Gemini test.
- No new user-supplied ChatGPT/Gemini pack was available in this batch, so none was imported. The blank template's empty `rawText` is a placeholder only, not a source record.
- No card was approved or published. No Supabase migration, database write, function deployment, or production change was performed.

