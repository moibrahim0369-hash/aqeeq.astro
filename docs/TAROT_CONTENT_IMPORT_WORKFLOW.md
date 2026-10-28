# Tarot content intake and merge workflow

This workflow is for the existing Tarot Study Lab. It does not add a new publishing path and does not replace the current review/version system.

## Files

- `assets/data/tarot/tarot-import-batch.schema.json`: contract for incoming batches.
- `assets/data/tarot/tarot-import-batch.template.json`: blank contribution scaffold.
- `assets/data/tarot/study-cards.json`: current study-card catalog and the researched Magician draft.
- `docs/TAROT_CONTENT_AUDIT.md`: latest broad catalog audit before this batch.

## Intake rules

1. **Resolve the card first.** Set `targetCardId` to an existing stable card ID from `study-cards.json`; do not match on a translated name alone.
2. **Preserve the original.** Put the complete supplied ChatGPT/Gemini/reference text in `source.rawText` exactly as received. Do not paraphrase it in place, silently clean it, or replace it with a merged summary. Keep title, author/model/edition, URL when available, page/section, capture time, and rights note.
3. **Separate source from interpretation.** Every proposed block declares `layer`: `reference` for a faithful sourced summary, `aqeq_original` for original Aqeq Astro analysis, or `editorial_note` for internal caveats. A source's words are not automatically an Aqeq interpretation.
4. **Map by meaning, not by convenience.** Use `area` and, when relevant, `orientation` and `position` to map upright/reversed meanings, love stages, money, work, decisions, spread positions, combinations, examples, or practical steps. One contribution may map to several blocks; retain one immutable source record.
5. **Merge additively.** Compare incoming blocks with existing card sections and prior contributions. Add a new block/version only when it adds distinct, supportable detail. If two sources disagree, preserve both claims and add a `researchNote` describing the disagreement and what would resolve it. Never average conflicting schools into an invented consensus.
6. **Keep provenance attached.** Each reference block must list its `sourceIds`. Original Aqeq blocks can cite the sources that informed them, but should remain visibly labeled as original analysis. Do not claim that a source supports a claim it does not actually contain.
7. **Record every revision.** Keep each received contribution unchanged; record comparison, merge, source request, revision request, approval, or publication in `review.history`. Record the resulting content version in `mergedIntoVersion` and history `version` when applicable. Do not edit prior history entries to conceal a previous state.
8. **No automatic approval.** Intake begins at `received`. Content can become `approved` only after source checking and human editorial review; publication is a separate permission/action. A successful schema check is not a content-quality review.

## Minimum review checklist per card

- The card ID and deck/system are correct.
- Traditional/reference material is distinct from Aqeq's own interpretation.
- Upright and reversed meanings are separated where the chosen school uses reversals.
- Differences between named schools are explicit, not merged without explanation.
- Contexts are specific to this card and question domain; avoid boilerplate copied across the deck.
- Spread position and neighboring-card interpretation is conditional on the actual spread.
- Examples are clearly illustrative, not presented as evidence or predictions.
- Claims have traceable source IDs or are explicitly labeled original interpretation.
- Limits are clear: symbolic reflection, not a scientifically validated diagnosis, proof of another person's feelings, or guaranteed forecast.
- Status remains `in_review`/needs work until an authorized reviewer approves it.

## Applying a user-provided merged pack

When the user supplies a final merged pack, preserve it as an intake artifact first. Validate the target card IDs, source metadata, and raw text. Compare it with existing content before merging. If a source URL is unavailable, record that honestly as `null`; do not invent a URL, author, edition, or citation. Never regenerate missing user text from memory. Do not import content that has not actually been supplied in the conversation or as a file.

## Current Magician status

The Magician remains `in_review`. Its current references and Aqeq interpretation are a researched starting draft, not a substitute for later merged material supplied by the user. Incoming interpretations must be retained as separate contributions and compared against it, not allowed to overwrite it silently.
