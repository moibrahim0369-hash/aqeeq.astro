# Vimshottari third-level periods

This change exposes the already-used proportional subdivision as `AqVedic.pratyantars(antar)` and adds a dedicated charts tile with Maha/Antar selectors, all nine Pratyantar periods, device-timezone/UTC display and an active-period marker. The time machine now uses the explicit API too. It adds no predictive prose.

## Convention

- Fixed order and year weights: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17.
- Each child starts with the parent lord. Child duration is parent duration multiplied by that child's year weight, divided by 120.
- A Pratyantar therefore lasts MahaYears × AntarYears × PratyantarYears / 14400 years.
- Retains the existing Aqeeq year of 365.25 days. This is a declared convention, not interchangeable with a 360-day year.
- The natal Moon determines the original Maha start and balance. Do not truncate the first Maha at birth before subdividing it.
- Periods are half-open [start, end). The final Pratyantar end is pinned to its Antar end to remove floating-point drift.
- Displayed precision is one second, not a claim about the accuracy of the birth time or of predictive astrology. Unknown-time charts carry a warning. Timezone conversion changes labels only, not interval calculation.

## References checked 21 November 2026

- BPHS chapter 51, verses 1–2, translation: http://jyotishvidya.com/ch51.htm
- Explanatory triple-product formula and 16 × 19 × 10 example: https://satyori.com/jyotish/pratyantardasha/

The latter example gives 77.108333 days under the selected 365.25-day year. Tests independently verify all 729 children of a nine-Maha tree with cumulative weights and the triple-product formula, boundary membership, original birth balance, the 27 nakshatra starts and invalid input.

`tests/vedic-reference.test.js` also now extracts the source engine from its actual split file rather than looking for the old inline block in the generated HTML. No astronomical formulas changed as part of that repair.
