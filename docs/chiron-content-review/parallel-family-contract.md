# Chiron prose family source contract

Local editorial work only. No publication or changes to the original 1,270 natal objects.

## Disjoint planet families

- A: Sun and Moon. Output `chiron-family-sun-moon.json`.
- B: Mercury and Venus. Output `chiron-family-mercury-venus.json`.
- C: Mars and Jupiter. Output `chiron-family-mars-jupiter.json`.
- D: Saturn and Uranus. Output `chiron-family-saturn-uranus.json`.
- E: Neptune and Pluto. Output `chiron-family-neptune-pluto.json`.

Axes, nodes, mean Lilith, Fortune and Chiron self-cycle contacts remain outside these files. Existing reviewed representative overrides have integration precedence until an actual prose comparison accepts their replacements.

## Coverage and exact schema

For each of the two assigned bodies, write all nine aspect keys: `conjunction`, `sextile`, `square`, `trine`, `opposition`, `semisextile`, `semisquare`, `sesquiquadrate`, `quincunx`.

Use a top-level object with `schemaVersion: 1`, `bodies: { bodyKey: { aspects: { aspectKey: nucleus } } }`.

Each nucleus has:

- `title`: a short connection-specific title, without chart-input numbers.
- `core`: 45-75 Arabic words explaining this particular body/aspect dynamic, not a general body definition followed by an isolated angle definition. Do not put a fixed-personality or relationship claim here, because the core is shared by contexts.
- `natal`: only for the four minor aspects. Object with `scene` (35-60 words), `choice` (35-60 words), and `question` (one sentence).
- `chironTransit`: all nine aspects. Same scene/choice/question shape. Chiron is moving, the assigned body is a natal reference. Explore reconsideration of that body's function, without inventing biography or timing.
- `bodyTransit`: all nine aspects. The assigned body is moving, natal Chiron is the reference. Explore a present expression/action/situation meeting an existing sensitive meaning. This must be more than swapping labels in the other transit lens.
- `synastry`: all nine aspects. Same shape. Use the roles `صاحب كيرون` and `صاحب الشمس` / `صاحب القمر` etc. Explicit, balanced agency for both people. One shared question. No first/second chart numbering.

The final text composes the pair/aspect core with exactly one context lens, followed by separately controlled factual precision notes. A scene and choice should differ meaningfully by angle, not merely by synonyms. These are nuclei and context lenses, not a claim to separately authored essays for every stored route.

## Editorial model

Use the accepted representative file as the quality model. Accessible Fusha narrative, with occasional natural Egyptian warmth. Concrete optional examples, not invented history. Questions should clarify a real choice, not demand agreement with a diagnosis. Safety limitations should not crowd out the reading, and repeated technical caveats belong to the shared note layer.

- Synastry meaning follows Chiron owner and other-body owner. Swapping chart inputs must preserve the physical contact's meaning, with owner labels supplied by the renderer. Within one pair, A-Chiron/B-Venus and A-Venus/B-Chiron are distinct contacts because the owners differ, not because the aspect acquires a different meaning from input order.
- Both people can give and receive. Neither is automatically patient, healer, victim or source of pain. Do not assign hidden intent or guaranteed relationship outcome.
- Natal readings are not events. Transits are not fixed traits. Distinguish the moving/natal mechanism. Never infer duration or relative speed from the body name; actual motion owns timing.
- Four minor angles are 30/45/135/150 degrees, with a fixed two-degree product rule. They are details, not dominant verdicts. Do not embed compatibility-score explanations in natal/transit prose.
- Major-angle policy remains unchanged. Original natal major-planet/Chiron readings remain owned by the old library, so no new natal-major lens is requested here.
- No life-history, trauma, diagnosis, sexual-history, past-life, fate, wealth or healing promises. A real harmful act remains real; the chart does not explain it away.
- No forced Uranus conjunction. No new points or aspect types.

## Review evidence

Check actual complete composed examples, not word counts or unique-string counts alone. Compare the four minors side by side, each pair of transit directions, and canonical synastry roles. Report any place where a body/aspect distinction remains too generic. Source entries remain draft until actual editorial review and release QA.
