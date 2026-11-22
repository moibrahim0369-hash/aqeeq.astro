# Vedic narrative sources: D20, D24, D30, D40, D45 and D60

Date: 2026-11-22
Delivery: `vedic-group-d.json`, schemaVersion 1.
Scope: keys `20`, `24`, `30`, `40`, `45`, `60`; 12 occupied-house topic entries per chart, 72 authored entries total. Six authored introductions, scope lines and precision notes are additional metadata, not extra house entries. No planet/sign combinations are counted as authored texts.

## Meaning and convention boundaries

The cited astrology material establishes what traditions say, not scientific confirmation of astrological claims. The domain descriptions below are sourced. The everyday scenes, questions and practical suggestions are original, non-predictive reflective adaptations. None should be presented as a verbatim ancient reading or as proof of reader biography.

### D20

Sourced domain: religious and spiritual practice. The textbook supplies the general domain and the app's current formula. PJC's exposition supplies additional practice-oriented framing, including a distinction between devotion, repeated practice and contemplation. The library does not prescribe a religion, deity, mantra, initiation or spiritual rank, and does not import that page's deterministic spiritual-status claims.

Modern adaptation: practical commitment, study, service, community, boundaries, quiet and the relationship between private practice and ordinary conduct. The house topics are used within the chart domain, not as separate promises of experiences.

### D24

Sourced domain: learning, knowledge and education. The code follows the older textbook's direct counting from Leo for odd signs and Cancer for even signs.

Material convention conflict: the same author's 2012 paper proposes reverse counting for even signs, while describing the forward method as the prevailing convention at that time. PJC distinguishes forward D24 for worldly/formal education from a reverse even-sign variant for spiritual knowledge. These are not the same computation. This library preserves the current app method and focuses on learning and education. It does not silently substitute the newer proposal, assert that the chosen formula is the only valid tradition, use divisional dashas, or invent a field of study, intelligence score, exam result or admission outcome.

### D30

Sourced domain in the textbook includes difficult subconscious patterns and traditionally broader adverse/medical language. This library deliberately does not translate those into disease, danger, punishment, moral blame or a prediction that the reader must suffer. Its bounded adaptation concerns responses and avoidable friction in ordinary situations.

The actual formula is unequal. The baseline code and the textbook agree on these interval endpoints and zero-based sign outputs:

- Odd source signs: endpoints 5, 10, 18, 25, 30 degrees; outputs 0, 10, 8, 2, 6.
- Even source signs: endpoints 5, 12, 20, 25, 30 degrees; outputs 1, 5, 11, 9, 7.

The inspected verse translation also supports unequal portions. No text describes the method as thirty equal one-degree pieces or a generic harmonic.

### D40

The textbook's table gives auspicious and inauspicious matters, not an exclusively maternal biography. The library uses a bounded lens about supportive and obstructive circumstances, agreements and choices. It does not claim actual events, maternal secrets, inherited trauma or an explanation of why a reader's family behaved as it did.

### D45

The textbook's table gives a broad all-matters domain, not an exclusively paternal history. There is no source basis here for 12 detailed, uniquely classical character verdicts. The library therefore labels its lens transparently as a modern reflection on consistency among values, decisions and responsibility across house topics. It is not a newly claimed classical D45 doctrine.

### D60

The traditional textbook domain includes karma/past life and a broad all-matters use. The library does not convert that religious framework into factual past-life events, inherited guilt, fixed fate or a reason the reader deserved harm. Its bounded adaptation asks about patterns readers can actually recognize, decisions and consequences.

A present time field is not evidence that it is accurate. A narrow boundary check alone does not validate a recorded time. When birth-time uncertainty could change the divided ascendant or relevant placements, personalized house interpretation is unsupported; a general topic explanation has a different, non-personalized scope.

## Title scope

The JSON titles describe the authored material's interpretive scope, not changes to calculation methods. D40/D45 wording avoids making maternal/paternal attribution the sole meaning. D60 wording avoids presenting speculative literal biography as fact. Older exclusive lineage labels would not accurately describe these broader source-based scopes.

## Applicability and counting

- Use each house entry once for an actually occupied house in the selected chart, not once per planet in that house.
- Empty houses are not absent life areas or failures. This library does not need to invent occupation to display more text.
- For time-known charts, use the ascendant belonging to that division. The Moon-based fallback is not equivalent.
- D20/D24/D40/D45/D60 formulas can return all 12 signs. The D30 formula's image omits Cancer and Leo but relative differences between its ten possible output signs cover all 12 house numbers. Thus D30 does not have the D2 restriction to only three occupied-house numbers.
- That range calculation establishes formula-level house-key applicability, not proof that every independent Cartesian combination is astronomically realizable for a birth moment. Do not inflate counts.
- The 72 entries are a topic layer only. It does not contain planet/sign/condition modifiers or establish coverage of those separate interpretive conditions.

## Voice grounding

Repository read at baseline `f334bf04400780d56715602521bb723286e3e9b7`:

- `assets/js/sky-readings.js`: scene-first language, specific emotional tension, ordinary actions and a closing direction.
- `assets/js/sky-sign-leads.js`: distinct short openings and a plain Arabic register.
- `assets/js/sign-live-texts.js`: understandable life situations and conversational flow.
- `assets/js/vedic-extras.js`: exact division calculation contract and current short introductions.

Only tone was transferred. No sky/horoscope paragraph was copied, no tropical or transit interpretation was reused, and natal texts do not rotate with the clock or promise a dated event. Arabic is light shared Arabic, not heavy local slang. Leads vary between a question, contrast, everyday scene and practical observation.

## Inspected source ledger

1. Repository, code and house style, primary implementation evidence:
   https://github.com/moibrahim0369-hash/aqeeq.astro
   Inspected locally at the exact SHA above. Establishes what the app currently calculates and how its reference prose sounds, not the universal correctness of a school.

2. P.V.R. Narasimha Rao, Vedic Astrology: An Integrated Approach, author-hosted textbook PDF:
   https://www.vedicastrologer.org/articles/vedic_astro_textbook.pdf
   Downloaded and extracted the relevant text. Printed chapter 6, sections 6.2.14 through 6.2.20, Table 11 and sections 6.4/6.5. Supports all six general domains, current formulas, the broad house-topic-within-division method and limits of simplifying the higher divisions.

3. PJC Year-2, D20 teaching exposition:
   https://pjc2.parasarahora.in/varga/vimsa%e1%b9%81sa-d20/vi%e1%b9%81sa%e1%b9%81sa-d20/
   Fetched and read. Used only for general practice-oriented framing and selected house-domain context, not promised attainments, deity assignment or character judgments.

4. PJC Year-2, D24 teaching exposition and forward/reverse tables:
   https://pjc2.parasarahora.in/varga/siddha%e1%b9%81sa-d24/siddha%e1%b9%81sa-slides/
   Fetched and read. Supports the education framing and makes an explicit distinction between forward worldly-education D24 and a reverse even-sign variant.

5. P.V.R. Narasimha Rao, Correct Siddhamsa Chart of Pararsara, 2012-09-09:
   https://www.vedicastrologer.org/articles/para_d24.pdf
   Fetched and read. Used to record the material conflict with the older forward even-sign calculation, and to confirm the broader learning domain. Its example charts, timing techniques, proposed ayanamsa and deterministic outcomes were not used. No source passages were copied into the library.

6. Brihat Parashara Hora Shastra, chapter 6 verse 27, text and translation hosted by Enjoy Learning Sanskrit:
   https://enjoylearningsanskrit.com/scriptures/parashara/chapter-6/verse-27/
   Fetched and read. Supports unequal D30 portions. The third-party transcription includes inconsistent glossing in its word analysis, so it is corroboration for unequal portions rather than the sole authority for exact sign mapping; the inspected code and textbook establish that mapping.

Sources 2, 3, 4 and 5 are related teaching traditions, not independent empirical evidence. Source counts must not imply consensus across all Vedic schools.
