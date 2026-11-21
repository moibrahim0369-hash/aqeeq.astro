# Shadbala: declared calculation convention and unsupported cases

This is an inspectable six-component implementation, not a claim to reproduce every Shadbala program. All strengths remain in Virupas until the displayed total is divided by 60. The seven minimum requirements are 390,360,300,420,390,330,300 Virupas from BPHS 27.32–33.

## Explicit choices

- Sthana = Uchcha + Saptavargaja + Ojhayugma + Kendradi + Drekkana. BPHS translation weights 45/30/20/15/10/4/2 are selected, not Raman's 22.5/7.5/3.75/1.875 alternative. Moolatrikona is applied in D1 only. Compound friendship is based on natal Rasi positions. Gender/decan allocation follows BPHS 27.6: male first, female second, neutral third, rather than silently substituting Raman's different ordering.
- Dig uses actual ascendant, descendant, meridian and nadir longitudes, not sign centres.
- Nathonnatha uses apparent solar hour angle, not the civil clock. Tribhaga and Hora use astronomical sunrise and sunset. Horas split daylight into 12 and night into 12. A birth before sunrise belongs to the preceding solar day. Dates for calendar lordship use the local mean-solar date of the preceding sunrise, not the reader's device timezone.
- Varsha and Masa lords use the explicitly published Saravali calendar formulas. This is neither a Gregorian-first-day weekday shortcut nor a reconstructed Kali-yuga epoch system.
- Paksha uses the folded Moon-Sun angle divided by three for benefics and its complement for malefics. Waxing/waning determines the Moon's classification. Mercury becomes malefic when in the same sign as Sun, Mars, Saturn, waning Moon or a node. No extra Moon doubling is applied under the literal BPHS translation selected here. Other schools differ.
- Ayana uses BPHS's 45/33/12 tabulation and the specified north/south signs. Mercury uses the absolute arc. The Sun's Ayana enters Kala once; its Chesta substitution enters the separate motion component once. The Moon's Chesta equals its selected Paksha value.
- Other Chesta values use modern Meeus mean orbital elements of date, with the inferior-planet switch for Mercury and Venus. Circular means are used across the 0/360 boundary. These are modern astronomical mean elements, not a claim of reproducing ancient Siddhantic tables.
- Drik uses directed degree-wise BPHS 26 aspects including special Mars/Jupiter/Saturn rules. The selected reading of BPHS 27.19 is signed quarter-aspects plus the entire Mercury/Jupiter aspect. Negative Drik is retained. Other published readings of this verse differ, so cross-program agreement is not asserted.

## Planetary war: explicit Raman correction

War correction now follows B. V. Raman, Graha and Bhava Balas, articles 76-77, printed page 61. Only Mars/Mercury/Jupiter/Venus/Saturn fight when their circular separation is strictly less than one degree. The planet with the lesser normalized zodiac longitude wins in this selected school. This deliberately differs from higher-longitude, ecliptic-latitude or northern-declination schools. At the zodiac wrap, 0.2 degrees is less than 359.8 degrees by the selected literal normalized-longitude rule.

For each independent pair, take the absolute difference of their Sthana + Dig + Kala through Hora, **excluding Ayana**, divided by the absolute difference of their fixed traditional disc diameters: 9.4, 6.6, 190.4, 16.6 and 158.0 arcseconds. Add the result to the winner's Kala and subtract it from the loser's. Both transfers use the same pre-war aggregates. This does not change the selected convention of the other five components or claim that the entire implementation is Raman's Shadbala.

The previous blanket suppression for any war is removed. Ordinary pairs have totals and ratios, with a disclosed transfer. An exactly equal longitude gives no source-defined victor. A connected cluster of three or more fighters has no source-defined ordering of pair corrections. Only the affected planets remain unresolved in those cases; unaffected planets still have totals. No arbitrary tie-breaking or iterative redistribution is presented as classical fact.

Unknown birth time, missing positions and polar dates without a daily sunrise/sunset are rejected. No fallback birth time or fictitious sunrise is used.

No complete end-to-end external Shadbala printout is claimed as matched. Verification covers the formulas, all six-component bookkeeping, independent astronomical mean-motion fixtures and published worked anchors. A source-matched full external printout remains future validation work.

## Tests

`node --test tests/vedic-shadbala.test.js`

- Modern mean elements checked against separate PyMeeus calculations at five epochs; true positions from Swiss Ephemeris 2.10.03. Chesta fixture uses vector bisectors and acos, independently from the implementation's signed-angle arithmetic, including inferior-planet handling.
- Published hand calculations: Sun at 12 Gemini gives 118/3 Uchcha, every exaltation/debilitation/opposite point; Ayana equinoxes and solstices; six exact special aspects.
- Published Saravali year/month examples, sunrise/sunset and pre-sunrise Hora transitions, six-component sums and ratio conversions.
- Raman war arithmetic is checked with a separate hand calculation: aggregate difference 28 and disc difference 2.8 yield a transfer of 10. Strict one-degree boundaries, exclusions, zero-sum transfers, wrap, exact ties and multi-party clusters are tested.
- Browser test checks seven selectors, six components, guards and 320/390/1280 widths.

## Sources inspected 21 November 2026

- https://astrojyotish.info/pdf/graha-bhava-balas.pdf (Raman, articles 76-77, printed page 61)
- http://jyotishvidya.com/ch27.htm
- http://jyotishvidya.com/ch26.htm
- https://saravali.github.io/astrology/bala_sthana.html
- https://saravali.github.io/astrology/bala_kala.html
- https://saravali.github.io/astrology/hora_calculation.html
- https://saravali.github.io/astrology/hora_lords.html
- https://www.dirah.org/shadbala.htm (comparison with Raman, not silently merged)
- https://github.com/AnandShah10/jyotipy (reviewed as an independent comparison, not treated as authoritative; no implementation copied)
- Meeus, Astronomical Algorithms, mean orbital elements of date, checked through PyMeeus 0.5.12.

The numbers describe a traditional astrological scoring system. They do not validate predictive claims scientifically.
