const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets/data/tarot/study-cards.json"), "utf8"));
const cards = data.cards;
const magician = cards.find((card) => card.id === "major-01-magician");
assert.ok(magician, "The Magician card must exist");
assert.equal(magician.status, "in_review", "Research-backed starter content must remain unapproved");
assert.ok(magician.sources.length >= 3, "The Magician must carry multiple traceable source records");
for (const source of magician.sources) {
  assert.ok(source.id && source.title && source.url && /^https:\/\//.test(source.url), "Each source needs an ID, title and HTTPS URL");
  assert.ok(["book", "article", "website", "course", "personal_note", "other"].includes(source.sourceType), "Source types must map to database enum");
  assert.ok(source.section && source.supports?.length && source.note, "Each source must explain what it supports");
}
const sourceIds = new Set(magician.sources.map((source) => source.id));
assert.ok(magician.researchNotes.length >= 4, "Research notes should identify sourced claims");
for (const note of magician.researchNotes) assert.ok(sourceIds.has(note.sourceId), "Every research note must resolve to a source");
assert.ok(magician.traditionalReference.upright && magician.traditionalReference.reversed, "Traditional upright and reversed schools must be distinguished");
assert.ok(magician.traditionalReference.traditionNote, "School differences must be explicit");
assert.ok(magician.visualDescription && magician.numberSymbolism && magician.elementalCorrespondences.length === 4);
assert.ok(magician.fields.love.upright && magician.fields.love.reversed);
assert.ok(magician.fields.work.upright && magician.fields.money.upright && magician.fields.personalGrowth.upright && magician.fields.decisions.upright);
assert.ok(magician.spreadPositions.length >= 3 && magician.combinations.length >= 3);
assert.ok(magician.examples.length >= 3 && magician.reflectionQuestions.length >= 3 && magician.practicalSteps.length >= 3);
assert.ok(magician.sections.length >= 7 && magician.sections.every((section) => section.status === "in_review"));
assert.ok(magician.editorialNotes.includes("قيد المراجعة"));
assert.ok(cards.every((card) => card.status !== "published"), "No card may be published by the content seed");
const metrics = {
  total: cards.length,
  cardsWithCore: cards.filter((card) => card.aqeqInterpretation?.core?.trim()).length,
  cardsWithSources: cards.filter((card) => card.sources?.length).length,
  cardsWithoutSources: cards.filter((card) => !card.sources?.length).length,
  placeholderReferenceSummaries: cards.filter((card) => /يحتاج إلى توثيق|تمهيدي يحتاج/.test(card.traditionalReference?.summary || "")).length,
  cardsWithStandaloneReversed: cards.filter((card) => card.aqeqInterpretation?.reversed).length,
  cardsWithExamples: cards.filter((card) => card.examples?.length).length,
  cardsWithSpreadPositions: cards.filter((card) => card.spreadPositions?.length).length,
  cardsWithCombinations: cards.filter((card) => card.combinations?.length).length,
  cardsWithVisualDescription: cards.filter((card) => card.visualDescription).length,
  genericMoneyUpright: cards.filter((card) => card.fields?.money?.upright === "ماليًا: استخدم المعنى كدعوة لمراجعة الاختيارات والموارد لا كتوقع لعائد.").length,
  uniqueCoreTexts: new Set(cards.map((card) => card.aqeqInterpretation?.core)).size,
};
console.log("Tarot content quality audit passed for The Magician; coverage metrics:", JSON.stringify(metrics));
