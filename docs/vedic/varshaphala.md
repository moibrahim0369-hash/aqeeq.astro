# Varshaphala: sidereal return, annual chart and explicit Tajika scope

## Calculation

The return is the numerical root of the site's true sidereal Sun minus its natal sidereal Sun, using Lahiri at both instants. A bracket around each completed sidereal year is bisected and the angular residual must be below 0.000001 degree. This numerical tolerance is not a claim of second-level ephemeris or birth-time accuracy. The annual chart is recalculated at the return instant and selected location, with whole-sign houses and actual ascendant/MC. The birthplace is the explicit default, with optional return-location coordinates. Location changes the annual ascendant and houses, not the solar-return instant.

The reference year is the local birth year plus completed age, not the UTC birth year. The first return is age 1. Birth time must be known. Unsupported coordinates, years outside 1..120 completed years or beyond 2200, and failed brackets are rejected. No guessed noon time is used.

Muntha advances one sign per completed year from the natal ascendant sign. Its annual house and sign lord are displayed.

## Tajika conventions and limits

- Five-dignity strength follows the named Hayanaratna/Samjnatantra reading: domicile 30, exaltation 20, Hadda 15, decan 10 and ninth-part 5. The total is divided by four. Tajika friendship uses relative signs, with own/friendly/neutral/enemy factors 1, .75, .5 and .25. It is not Parashari compound friendship.
- The 12 Hadda tables, non-Parashari decans and musallaha ninth-parts are encoded from the scholarly translation. Alternative historical dignity systems are not silently mixed.
- Five annual-office candidates, their strengths and aspects to the ascendant are displayed. The strongest aspecting candidate is a **preliminary candidate**, not an unconditional year lord. Exact unresolved ties, no aspect, or a winning Moon leave selection unresolved. Full duruhpha exclusions and the Moon's perfected-itthasala replacement are not implemented. This limitation is shown in the UI.
- Day/night uses apparent solar altitude at the selected location. Within one degree of the horizon it is unresolved, rather than forcing a boundary decision.
- Punya saham uses the day/night reversal plus the conditional 30-degree addition. A same-sign boundary involving the ascendant is left unresolved.
- Tajika aspects are sign-based, with orb of the instantaneously faster planet. Applying/separating is only instantaneous numerical motion; retrograde pairs are not classified. This is **not the complete sixteen-yoga system**, perfected itthasala, or all fifty sahams.

## Independent verification

`node --test tests/vedic-varshaphala.test.js`

Seven synthetic charts are compared to independent Swiss Ephemeris 2.10.03 sidereal Lahiri roots, including leap day, southern hemisphere and a local birth year different from UTC. Observed return-time differences are 13.5..57.4 seconds; annual ascendant differences 2.7..12.4 arcminutes. The tests require return differences below 120 seconds, ascendant differences below .5 degree and all tested grahas below .04 degree. All seven ascendant signs and Muntha signs agree. This is bounded agreement, not exact identity with Swiss or every commercial program.

Published worked checks include the Hyderabad annual chart: Venus 13.5, Moon 12.3 and Saturn 9.3, with the five candidates Venus/Jupiter/Venus/Saturn/Moon and preliminary Venus selection. Punya matches the published Hyderabad example, Aquarius 20 degrees 52 minutes, plus a separate hand-worked example at Capricorn 2 degrees 44 minutes. Additional tests cover Hadda boundaries, 0-Aries solar root, all Muntha cycles through age 120, location invariance, invalid input and unknown time.

The e2e test checks both hub routes, year and location controls, unknown-time guard, invalid location handling, no JS errors and widths 320/390/1280.

## Sources inspected 21 November 2026

- https://jatakaveda.com/library/study/annual-charts/ (worked Hyderabad example)
- https://jatakaveda.com/library/teachers/nilakantha/the-chart-of-the-year/
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500896.html (Gansten 2020 scholarly translation, five dignities and tables)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500936.html (five candidates and conflicting rules)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500937.html (Moon and exclusions)
- https://hssa-journal.org/index.php/hssa/article/download/34/91/401 (historical aspect/dignity conventions)

These are traditional astrological calculations. Matching their formulas does not establish their predictive validity scientifically.
