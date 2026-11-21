# Sidereal house contract

`AqEam.siderealChart` converts natal longitudes to Lahiri sidereal coordinates without mutating the natal chart.

- Placidus, Equal and Porphyry: subtract the same ayanamsa from planets, ASC, MC and all cusps. Relative house membership is invariant, so existing body.house values are retained.
- Whole Sign and the polar Whole Sign fallback: derive cusp 1 from the start of the sidereal ASC sign, then add 30 degrees per cusp and assign every body to these new cusps. Rotating tropical whole-sign cusps would leave them partway through sidereal signs, which is not a sidereal whole-sign chart.
- Unknown birth time: no ASC, cusps or house values are invented.

The Vedic D1/divisional charts, period readings, time-machine transit houses and 2027 report already derive whole-sign houses from sidereal signs independently. They did not use the stale body.house field. The annual Varshaphala chart also assigns its own whole-sign houses.

The generic sidereal table and wheel use siderealChart's selected house system. With Placidus/Equal/Porphyry their houses can differ from Vedic whole-sign D1 by design. This patch does not standardize those systems. The hub usually hides the legacy general table, but copy-all uses textContent and can include hidden rows, so the whole-sign correction also matters for copied chart data.

Reproduction: 2000-01-01 10:00 UTC, 30 N / 31 E, Whole Sign. Sidereal ASC is about 352.553896 degrees. Before correction cusp 1 was 336.147093 degrees; after correction it is 330. Mars is house 12, Jupiter house 2, matching D1, rather than old houses 11 and 1.

Regression coverage:
- `tests/vedic-house-contract.test.js`: five dates/locations across four systems, polar fallback, unchanged natal inputs, unknown time, reproduced case.
- `tests/vedic-house-contract.e2e.js`: actual browser calculation pipeline, table rows, copied data and D1 agreement, all four systems, polar fallback, unknown time, screenshots at 320/390/1280. Supports BASE_URL for deployment checks.
- `tests/helpers/production-page.js`: follows actual built script tags and verifies that reference tests run the real loaded Astro source with the production Astronomy backend, without changing reference tolerances.
