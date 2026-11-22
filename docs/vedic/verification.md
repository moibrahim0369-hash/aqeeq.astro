# Vedic narrative verification

Local build checked on22 November2026, before the coordinated production rebase.

-22 chart views,255 reachable occupied-house source modules,108 planet/sign contexts,22 introductions and9 role notes. These394 modules are composed at runtime, not394 independently written complete chart reports.
-34,490 authored space-delimited words before titles and precision metadata. The build emits the exact counts and hash in content/vedic/coverage.json.
-68 Vedic/build-sync Node tests pass, including explicit132-cell Raman D11 anchors, all internal boundary sides and3600 normalization/opposite-node probes.
-The real-engine uncertainty fixture distinguishes stable and changed high divisions and preserves the input while sampling both sides of its UTC.
-The built-page browser test checks all22 known-time routes against the actual generated JSON. The D60 fixture is correctly withheld when its map changes within the declared margin.
-The same browser test checks all22 actual unknown-time routes. Numbered-house prose is withheld; D1 alone can show sign-only contexts; explicit Moon/Sun references remain labelled and conditional.
-Library filters/search,320/390/1280 viewport overflow and page errors are checked. Screenshots supplement these assertions; a successful text test is not a visual review.

The page has delayed navigation scrolling. Capture checks wait for settled geometry before taking a screenshot so the image actually shows the panel being verified.

## Before publication

This is a local verification record, not proof of production deployment. Preserve the latest home/Chiron work, rebase or apply the source commits in the agreed order, then regenerate the library and page assets. Re-run tests and inspect the deployed pages and their actual data hash. Do not publish a stale generated index or replace newer bundle history with this local snapshot.

Commands:

```
node scripts/build-vedic-library.js
node scripts/build-assets.js
node --test tests/vedic-*.test.js tests/build-sync.test.js
node tests/vedic-narratives.e2e.js
```

The source-library builder rejects missing entries, exact duplicate leads/paragraphs and unreachable D2 occupied-house slots. It does not prove prose truth. Domain review, interpretation limits and the documented convention decisions remain separate from schema and regression tests.
