# Vedic chart narrative contract

This layer adds authored readings to the chart views. It does not replace the ephemeris, the existing sky/horoscope copy, timing tools, private expert notes or the separate paid 2027 report.

## Coverage and what a count means

The chart catalogue contains22 views: D1, Moon and Sun reference charts, plus D2/D3/D4/D5/D6/D7/D8/D9/D10/D11/D12/D16/D20/D24/D27/D30/D40/D45/D60.

An authored chart-house module, an authored planet-sign context, an introduction and a planet role are different source units. The build records their counts separately. Possible combinations are not counted as independently authored readings. `content/vedic/coverage.json` records the built source counts and content hash.

The D2 in this project uses the two-hora formula. Cancer and Leo are its only planet signs, so occupied houses can only be1,2,12 relative to its divided ascendant. Nine other occupied-house prose slots are not manufactured or counted.

## Input routing

- `AqVedicChart.build()` remains the source of selected-chart signs, houses and reference basis.
- Numbered divisions use their divided ascendant when the birth time is known.
- Moon/Sun reference charts keep D1 sidereal signs and recount houses from the luminary. They are not new divisions or new measured ascendants.
- House prose is selected by chart key and the actually occupied house. A planetary cluster gets one house reading, followed by separate contexts for each actual planet/sign.
- The factual disclosure uses that same map for the ruler of the selected house, the ruler's current placement and the project's existing drishti convention.
- Interpretation is stable for identical inputs. No clock-based rotation or random substitution changes a natal reading.
- Source strings are escaped before insertion into the document.
- The library loads only when a chart reading is needed, with an explicit retry on a failed fetch. A failed text fetch does not change the calculated chart.

## Missing and uncertain time

A Moon-reference fallback in a numbered drawing is not a measured ascendant. The new layer withholds numbered-chart house prose when birth time is unknown. D1 can show the calculated planet/sign contexts separately, with an uncertainty note. Explicit Moon/Sun reference charts retain their own meanings and state the uncertainty of the underlying inputs.

D27/D30/D40/D45/D60 require the user to state an uncertainty margin before personalized house prose can be shown. No margin is invented or preselected. The resolver recalculates the actual chart engine at five times: both ends of the stated interval, both half-intervals and the recorded time. It compares the divided ascendant, planet signs and occupied houses with the displayed map. A changed map or an unavailable calculation keeps personal prose withheld. The general source library remains accessible.

An unchanged five-sample result is a sample check, not a continuous proof, birth-record authentication or a guarantee of correct interpretation. A recorded hour and minute are not proof of the time's reliability. In particular D60 is not used to assert literal past-life events.

## Conditions

The layer uses the existing project's seven classical planets for own-sign/exaltation/debilitation context. It deliberately does not assert that a node's exaltation scheme is universal. Rahu/Ketu remain in the selected project convention, mean north node and its opposite.

Combustion is evaluated from the actual natal longitudes for D1/Moon/Sun reference charts only. Projected divisional signs are not treated as physical angular separations. A preceding display defect subtracted the shortest Sun separation from180 before comparing the threshold; the correction removes that inversion while preserving the existing direct/retrograde thresholds. Tests cover conjunction, opposition, the0/360 wrap and threshold boundaries.

Drishti is the current chart module's house-based convention, including its nodal choice. It is disclosed as that convention, not described as unanimous across schools. The reading does not import Tajika contacts, western major aspects or Shadbala scores into a natal condition without an explicit separate rule.

## Style and interpretive boundary

The same-site sky/horoscope files are a voice reference: clear Arabic, recognisable scenes, emotional tension, useful questions and distinct openings. Their tropical placement rules, transit timeframes and rotating copies are not reused as Vedic meanings.

A chart is not proof of a person's biography, family secrets, medical state, fertility, number/sex of children, unavoidable losses or exceptional powers. The prose uses the selected chart as an interpretive lens, with ordinary choices and possibilities rather than invented facts or fixed outcomes. A broad traditional domain and a modern reflective adaptation must not be represented as the same claim.

## Sources and convention review

Primary tradition reference: P.V.R. Narasimha Rao, *Vedic Astrology: An Integrated Approach*, chapter6, especially Table11, and chapter7's luminary-reference discussion:
https://www.vedicastrologer.org/articles/vedic_astro_textbook.pdf

The author's2010 update notes that later research refined some of the book's choices. This is a source for an astrology tradition, not scientific validation. Source-specific caveats belong with the chart source notes.

D11 is outside the classical sixteen in this reference, and both its calculation and interpretive purpose vary. A backward-from-Pisces tradition and a reflected-start/forward-count tradition are discussed here:
https://www.indiadivine.org/content/topic/1487098-jagannath-rudramsa-reckoning-ashtamsa-controversy/
https://astromeena.wordpress.com/2020/10/12/how-can-we-calculate-the-d-11-rudramsha-chart/

D11 uses the named Raman Ekadasamsa reverse convention. The preceding implementation omitted the natal source-sign term, so it assigned every source sign the same11-part run. The correction counts backwards from the sign immediately before the source sign. With zero-based source sign `s` and part `p`, the result is `(s +11 -p) mod12`. All12 output signs are reachable, and opposite nodes remain opposite. The old rule disagreed with121 of132 sign/part anchors.

Implementation corroboration, read directly:
https://raw.githubusercontent.com/naturalstupid/PyJHora/48e57d29b47a3143519910a24866758116467485/src/jhora/horoscope/chart/charts.py

Source-relative reverse-count wording, attributed by the page to B.V. Raman, *Varshaphala or The Hindu Progressed Horoscope*, chapter3:
https://vedastro.org/blog/Varshaphala-Part-4-The-12-Vargas.html

The reflected-start/forward-count Rath/Rao rule remains a distinct alternative, not an equivalent spelling of this method. The gains/networks theme is disclosed as the application's contemporary reflective frame, not a rule promising money or protection. This correction does not import annual-chart strength rules into the natal reading.

D24 has later variants, including a reversed/spiritual convention, so the current forward even-sign convention is not claimed as universal:
https://www.vedicastrologer.org/articles/para_d24.pdf
https://pjc2.parasarahora.in/varga/siddha%e1%b9%81sa-d24/siddha%e1%b9%81sa-slides/

## Verification

Unit tests cover the content contract, correct chart/house/sign routing, stable outputs, clusters, unknown-time limits, reference charts, the precision-margin gate, ruler/drishti facts, combustion and escaping. Real-engine precision fixtures check stable and changed divisions and confirm sampling on both sides of the input UTC without mutating the input. The full-page browser regression checks all22 selected chart views, data-matching entry IDs, the actual unknown-time form flow, mobile overflow and the library's filters/search. Actual screenshots must be inspected before visual sign-off. Passing calculation tests is not proof that every prose claim is appropriate; source review and prose review remain separate checks.
