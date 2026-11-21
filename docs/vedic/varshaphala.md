# Varshaphala: sidereal return, annual chart and explicit Tajika scope

## Calculation

The return is the numerical root of the site's true sidereal Sun minus its natal sidereal Sun, using Lahiri at both instants. A bracket around each completed sidereal year is bisected and the angular residual must be below 0.000001 degree. This numerical tolerance is not a claim of second-level ephemeris or birth-time accuracy. The annual chart is recalculated at the return instant and selected location, with whole-sign houses and actual ascendant/MC. The birthplace is the explicit default, with optional return-location coordinates. Location changes the annual ascendant and houses, not the solar-return instant.

The reference year is the local birth year plus completed age, not the UTC birth year. The first return is age 1. Birth time must be known. Unsupported coordinates, years outside 1..120 completed years or beyond 2200, and failed brackets are rejected. No guessed noon time is used.

Muntha advances one sign per completed year from the natal ascendant sign. Its annual house and sign lord are displayed.

## Tajika conventions and limits

- Five-dignity strength follows the named Hayanaratna/Samjnatantra reading: domicile 30, exaltation 20, Hadda 15, decan 10 and ninth-part 5. The total is divided by four. Tajika friendship uses relative signs, with own/friendly/neutral/enemy factors 1, .75, .5 and .25. It is not Parashari compound friendship.
- The 12 Hadda tables, non-Parashari decans and musallaha ninth-parts are encoded from the scholarly translation. Alternative historical dignity systems are not silently mixed.
- Five annual-office candidates now receive an explicit duruhpha audit. Retrogression, houses 6/8/12, opposite an owned sign, malefic aspects within the declared Tajika orb, and ongoing itthasala with a planet in its fall are disqualifications. Vamana's benefic/malefic classification is used, including waning Moon and Mercury joined to malefics by sign. Lunar checks also cover the twelfth sign from Sun, the latter half of Libra/former half of Scorpio, lack of a sign-lord aspect, lack of any aspect, lack of own dignity, and waning. These reasons are shown for each candidate, not hidden in a single score.
- Selection uses strength, then aspect strength, then number of annual-office claims. Remaining ties use Muntha lord, Sun/Moon sign lord, then triplicity lord. An unresolved remainder is not broken arbitrarily. This is a declared combination of the quoted Yadava/Samarasimha tie rules, not a claim that all historical rankings agree.
- No-aspect fallback follows Tajikamuktavali 4.9: the annual ascendant lord, still subject to the audit. Other quoted sources use Muntha or natal aspects. The selected fallback is named in the result.
- The winning Moon follows Tajikamuktavali 4.6-8: a unique, eligible **currently perfected** itthasala recipient replaces it. Per the selected Hayanaratna definition, perfected means the faster body is equal or up to half an arcminute behind. This is not a forecast that an application will perfect later. If there is no joining, its sign lord replaces it; a Moon in Cancer can therefore remain itself. Multiple perfected recipients, a still-ongoing application, or a disqualified replacement remain unresolved. The alternate exception retaining the Moon as triplicity lord is not silently mixed in.
- **Remaining source-boundary limits:** the selected duruhpha passage does not give a unique numerical heliacal-setting/combustion cutoff or node-conjunction cutoff. Candidates within a conservative 17 degrees of Sun or 12 degrees of either node are marked for unresolved boundary review, not automatically declared combust or excluded. These are screening envelopes, not invented classical cutoffs. The 17-degree envelope includes the standard published combustion tables; the node envelope uses the published Rahu orb. A Moon in the last degree is similarly marked because the passage does not define how far its end-of-sign condition extends. If an otherwise viable candidate could change the result, selection is withheld with the specific reason. Actual visibility modelling, the complete sixteen-yoga system and future perfected-event simulation are not claimed.
- Day/night uses apparent solar altitude at the selected location. Within one degree of the horizon it is unresolved, rather than forcing a boundary decision.
- Punya saham uses the day/night reversal plus the conditional 30-degree addition. A same-sign boundary involving the ascendant is left unresolved.
- Tajika aspects are sign-based, with orb of the instantaneously faster planet. Applying/separating is only instantaneous numerical motion; retrograde pairs are not classified. This is **not the complete sixteen-yoga system**, perfected itthasala, or all fifty sahams.

## Independent verification

`node --test tests/vedic-varshaphala.test.js`

Seven synthetic charts are compared to independent Swiss Ephemeris 2.10.03 sidereal Lahiri roots, including leap day, southern hemisphere and a local birth year different from UTC. Observed return-time differences are 13.5..57.4 seconds; annual ascendant differences 2.7..12.4 arcminutes. The tests require return differences below 120 seconds, ascendant differences below .5 degree and all tested grahas below .04 degree. All seven ascendant signs and Muntha signs agree. This is bounded agreement, not exact identity with Swiss or every commercial program.

Published worked checks include the Hyderabad annual chart: Venus 13.5, Moon 12.3 and Saturn 9.3, with the five candidates Venus/Jupiter/Venus/Saturn/Moon. That source uses a simplified year-lord selection. After the new duruhpha audit its preliminary Venus result is no longer treated as an unqualified final result. Punya matches the published Hyderabad example, Aquarius 20 degrees 52 minutes, plus a separate hand-worked example at Capricorn 2 degrees 44 minutes. Additional tests cover Hadda boundaries, 0-Aries solar root, all Muntha cycles through age 120, location invariance, invalid input and unknown time.

The e2e test checks both hub routes, year and location controls, unknown-time guard, invalid location handling, no JS errors and widths 320/390/1280.

## Sources inspected 21 November 2026

- https://jatakaveda.com/library/study/annual-charts/ (worked Hyderabad example)
- https://jatakaveda.com/library/teachers/nilakantha/the-chart-of-the-year/
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500896.html (Gansten 2020 scholarly translation, five dignities and tables)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500936.html (five candidates and conflicting rules)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500937.html (Moon and exclusions)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500918.html (duruhpha and lunar conditions)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500905.html (ongoing versus perfected itthasala)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500886.html (planetary natures)
- https://www.wisdomlib.org/hinduism/book/hayanaratna-the-jewel-of-annual-astrology/d/doc1500903.html (orbs)
- https://astrojyotish.info/vedic-astrology/vedic-astrology-by-agarwal/combust-planets/ (comparison of conflicting combustion limits, used only for a conservative review envelope)
- https://hssa-journal.org/index.php/hssa/article/download/34/91/401 (historical aspect/dignity conventions)

These are traditional astrological calculations. Matching their formulas does not establish their predictive validity scientifically.

## License decision

On 21 November 2026 the owner declined both AGPL licensing and a paid Swiss license. No Swiss Ephemeris runtime, WASM, source or ephemeris data files are distributed in this site. Swiss was used solely as an independent local reference for the synthetic tests. The production engine remains the existing true-Sun model. The measured 13.5..57.4 seconds are time differences in seven cases, not arcseconds, and not a guaranteed global error bound. The UI states this distinction.
