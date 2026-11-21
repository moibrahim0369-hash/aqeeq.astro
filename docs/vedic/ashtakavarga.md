# Ashtakavarga

The feature displays the raw seven-graha BAVs, SAV and the eight-source contribution matrix. Points are favourable marks. The classical translation calls these Rekhas, whereas modern southern usage often calls them bindus. The UI names the meaning rather than relying on this terminology.

## Convention and limits

Parashari recension: Moon-from-Moon includes 9, Moon-from-Mars excludes 9, Moon-from-Jupiter includes 2 not 12, Venus-from-Mars includes 4 not 5. There are 56 contributor lists. Seven table totals are 48,49,39,54,56,52,39, with SAV 337. No reductions and no eighth Lagna BAV are included. Rahu/Ketu are excluded. A known time is required because Lagna is a contributor; an unknown time is not silently replaced with a Moon chart.

Positions use the existing Lahiri engine. A planet at a sign boundary can change the table if its astronomical position or birth time changes. These scores are traditional counts, not measured probabilities.

## Verification

The implementation encodes destination-house contributor sets. Tests use an independently represented contributor-to-house reference, crosschecked against classical text and a separate published implementation. 200 deterministic position sets compare all 134,400 contribution cells, 1,400 BAV totals and 200 SAV totals. Rotation invariance, value range, missing-time/nonfinite guards and the six recension-sensitive cells are checked. The 337 checksum alone cannot detect recension mixing.

One web translation has transcription conflicts: the favourable paragraph omits Jupiter's own 1st/4th and swaps Sun/Saturn in Mercury's fifth. Its complementary unfavourable table and independent contributor tables settle these. These are corrected explicitly, not averaged.

Sources inspected 21 November 2026:
- BPHS chapter 66: http://jyotishvidya.com/ch66.htm
- Recension differences and totals: https://sanatans.in/tools/ashtakavarga
- Contributor table crosscheck, data only, no implementation copied: https://raw.githubusercontent.com/naturalstupid/PyJHora/main/src/jhora/const.py
- Mercury contributor lists: https://astrobix.com/learn/361-rules-of-ashtakavarga-for-auspicious-planet-bindus-part-2.html
- Independent Sanskrit/translation for the common rows: https://vedicpupil.in/library/books/brihat-jataka/chapter-9

Browser test: `node tests/vedic-ashtakavarga.e2e.js`, optionally `BASE_URL=https://moibrahim0369-hash.github.io/aqeeq.astro`. Tests both hub routes, all seven choices and contributors, unknown time, 320/390/1280 widths, and no JS exceptions. Internal horizontal scrolling is intentional for the 12-sign contributor matrix.
