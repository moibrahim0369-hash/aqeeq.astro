# Matrix of Destiny: current-state audit

Review target: PR #26 repair head `98fcd50c6bdb1a067819f739d75648e64ae4a8e0` (this feature branch is based on that head). Review date: 2026-10-26.

## Files inspected

- `index.html`: matrix form `#mform`, date field `#m-date`, output `#mresult`; loads `matrix-loader.js` and `numerology-matrix.js`.
- `assets/js/numerology-matrix.js`: date handling, Life Path, nine matrix points, chakra calculations, ancestry lines, purpose axes, SVG, report render, story-card generation.
- `assets/css/numerology-matrix.css`: chart, node squares, sections, responsive rules, story-card styling.
- `assets/js/matrix-loader.js`: lazy interpretation loader; fields are `psychology`, `shadowTrap`, `bodySymbol`, and `practice`.
- `assets/data/matrix/core.json`: chakra order and Sanskrit names, 22 Arcana labels/headlines.
- `assets/data/matrix/arcana-01.json` through `arcana-22.json`: chakra-specific interpretation schema.
- `tests/matrix-titles.e2e.js`: existing browser checks for the nine points, glossary, tooltip, and mobile layout.
- `README.md`: contains only the repository title. `docs/matrix-reference.md` is absent.

## Reference availability

The repository does not contain the source/manual for the project’s adopted school or a mapping that confirms official section names, formulas, programs, or combinations. The page itself describes some labels as site readings. This audit therefore distinguishes current project behavior from reference-verified rules and does not assert that the present formulas are the canonical Natalia Ladini method.

All 22 Arcana JSON files have the seven chakra keys, but the chakra interpretation values are empty across the four loader fields. The UI correctly presents the expanded chakra interpretation as pending; it is not complete content. The compact 22-entry positive/shadow list in `numerology-matrix.js` is site-authored display text, not a verified external source.

## Current matrix-module inventory

| Area | Current implementation | Status / missing evidence |
|---|---|---|
| Birth-date input | `#mform` and `#m-date` in `index.html`; local calculation | Present and working |
| Matrix map | Eight perimeter positions plus center in a fixed SVG; 9 numbered nodes and existing geometry | Present; geometry retained |
| Point glossary | Nine English site labels with Arabic helper names and site-reading disclaimer | Present; not confirmed as original school terminology |
| Center/personality | Center Arcana headline, positive and shadow summaries; Life Path content data exists separately | Partial; no source verification. `renderLifePathProfile` is defined but is not inserted by the matrix renderer |
| Money line | Current composition: northeast → center → southwest | Displayed as a site-composed symbolic line; original rule not verified |
| Relationship line | Current composition: northwest → center → southeast | Displayed as a site-composed symbolic line; original rule not verified |
| Named karma/program catalog | No stable program IDs, source mapping, or validated combinations in this module | Missing; requires original reference |
| Ancestral lines | Paternal points [F,E,H], maternal [G,E,I]; combined values reduce endpoint sums | Present as site formulas; reference unverified; framed symbolically, not as genetic facts |
| Children | No dedicated children/matrix subsection in this module | Missing here; do not infer that similarly themed text elsewhere is a matrix calculation |
| Chakras | Seven ordered rows with Physics/Energy/Emotions and totals | Calculation and order present; reference unverified; medical disclaimer present; detailed Arcana-to-chakra text is empty |
| Age/time phases | No age-cycle calculation or date ranges in this module | Missing; needs a documented rule |
| Purpose axes | Sky/Earth, socialization, spiritual exam, planetary total | Present as project formulas; names and compositions require reference validation |
| Matrix-to-matrix compatibility | Not implemented in this matrix module | Separate relationship features must not be substituted for a source-verified matrix comparison |
| Copy/share/export | Existing copy attachment and client-side story-card PNG; global result print button | Present; matrix lacked dedicated print styling before this change |
| Persistence/data flow | This module calculates in-browser; it does not submit birth date to a server | Present behavior; no database change in this task |

## Current formula map (recorded, unchanged)

The existing code uses `R(n)` that sums decimal digits repeatedly when `n > 22`.

- `A=R(day)`, `B=R(month)`, `C=R(sum(year digits))`
- `D=R(A+B+C)`; `E=R(A+B+C+D)`
- `F=R(A+B)`; `G=R(B+C)`; `H=R(C+D)`; `I=R(D+A)`
- Current nine nodes: north=A, east=B, south=C, west=D, northeast=F, southeast=G, southwest=H, northwest=I, center=E.
- Current ancillary centers: ancestral center=R(F+G+H+I), common center=R(E+ancestral center).
- Current money/love line indices: [northeast, center, southwest] and [northwest, center, southeast].
- Chakra row formulas and order are in `calculateChakraHealthCard`; emotions are currently `R(physics+energy)`, and totals are reduced sums per column.
- Generation lines display [F,E,H] and [G,E,I]; their combined outputs use `R(F+H)` and `R(G+I)`.
- Sky=[B,D,R(B+D)], Earth=[A,C,R(A+C)], Soul=R(Sky result+Earth result), Social=R(male+female), Spiritual=R(Soul+Social), Planetary=R(Social+Spiritual).

These are descriptions of the current implementation, not claims of reference validity.

## Baseline: 1999-09-25

Actual calculation functions were run from the current source before edits. The E2E test now locks this output so later presentation work cannot silently change it.

- Life Path: 8; reduced components [7,9,1].
- Nodes, in object order: north 7, east 9, south 10, west 8, northeast 16, southeast 19, southwest 18, northwest 15, center 7.
- Money line: 16 → 7 → 18. Relationship line: 15 → 7 → 19.
- Chakra Physics/Energy/Emotions rows: [7,9,16], [21,7,10], [14,16,3], [21,5,8], [7,7,14], [17,15,5], [10,8,18]. Totals: [16,13,11].
- Paternal line [16,7,18], combined 7. Maternal line [19,7,15], combined 7. Ancestral/common centers [14,21].
- Sky [9,8,17], Earth [7,10,17]; Soul 7, Social 14, Spiritual 21, Planetary 8.

No numbers, formulas, point order, or SVG coordinates were changed in this feature.

## Hierarchy applied in the UI

Stable internal IDs are used for the existing map, center reading, glossary, chakra table, parental lines, purpose axes, and point details. A compact navigation index links those existing sections. It does not invent missing original categories. An expandable methodology note distinguishes local calculations from unverified reference rules. Print styles make the retained SVG and report readable without changing screen layout.

## Unresolved / owner decision

To add original named programs, age phases, children analysis, official section hierarchy, verified Chakra/ancestor/purpose formulas, or matrix compatibility, provide the project’s source/reference excerpts or approve a specific reference edition. Until then the page preserves its current calculations and clearly marks the gaps.

## Expanded source-aware inventory

The 14-topic checklist and its per-topic implementation statuses now live in [matrix-reference-map.md](matrix-reference-map.md). It records owner-supplied topic labels separately from source terms, current UI/formula behavior, and the evidence needed to validate the source hierarchy. The accompanying [browser inventory](../assets/js/matrix-report-map.js) powers an expandable report section. It does not change any calculation.
