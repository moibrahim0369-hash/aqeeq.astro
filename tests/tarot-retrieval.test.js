const assert = require("node:assert/strict");
const { rankTarotKnowledge, normalize, filterTarotCatalog, toggleProgressList } = require("../assets/js/tarot-retrieval.js");
const data = require("../assets/data/tarot/study-cards.json");
assert.equal(data.cards.length, 78, "Knowledge catalog must contain exactly 78 cards");
assert.equal(new Set(data.cards.map((card) => card.id)).size, 78, "All 78 card IDs must be unique");
assert.equal(data.cards.filter((card) => card.arcana === "major").length, 22, "Must contain 22 Major Arcana");
assert.equal(data.cards.filter((card) => card.arcana === "minor").length, 56, "Must contain 56 Minor Arcana");
for (const suit of ["wands", "cups", "swords", "pentacles"]) {
  assert.equal(data.cards.filter((card) => card.suit === suit).length, 14, `Suit ${suit} must contain 14 cards`);
}
for (const card of data.cards) {
  assert.ok(card.nameAr && card.nameEn, `${card.id}: bilingual names required`);
  assert.ok(["major", "minor"].includes(card.arcana), `${card.id}: valid arcana required`);
  assert.ok(["raw", "draft", "in_review", "approved", "published", "archived"].includes(card.status), `${card.id}: valid editorial status required`);
  assert.ok(card.traditionalReference && card.aqeqInterpretation, `${card.id}: reference and original interpretation must remain separate`);
  assert.ok(Array.isArray(card.sources), `${card.id}: source list required`);
  assert.ok(card.editorialNotes, `${card.id}: editorial limitation must be explicit`);
  assert.ok(Array.isArray(card.sections) && card.sections.length >= 3, `${card.id}: substantive sections required`);
  assert.ok(card.sections.every((section) => section.title && section.content.trim()), `${card.id}: sections cannot be empty`);
  assert.ok(card.sections.every((section) => ["raw", "draft", "in_review", "approved", "published", "archived"].includes(section.status)), `${card.id}: invalid section status`);
  assert.ok(card.sections.every((section) => section.provenance), `${card.id}: provenance required`);
  assert.notEqual(card.status, "published", "Generated starter content must not be marked published without human review");
}
assert.equal(normalize("الكاهِن العُليا"), "الكاهن العليا");
const catalog = data.cards.map((card) => [card.id, card.number, card.nameAr, card.nameEn, card.arcana === "major" ? "major" : card.suit]);
assert.ok(filterTarotCatalog(catalog, "القمر", "major").some((item) => item[0] === "major-18-moon"), "Arabic search and Major filter should work");
assert.equal(filterTarotCatalog(catalog, "", "wands").length, 14, "Suit filter should return 14 cards");
assert.deepEqual(toggleProgressList([], "major-01-magician"), ["major-01-magician"], "Progress helper should add a card");
assert.deepEqual(toggleProgressList(["major-01-magician"], "major-01-magician"), [], "Progress helper should remove a completed card");
const results = rankTarotKnowledge(data.cards, "القمر والغموض والقلق من المجهول", {limit:5});
assert.ok(results.length > 0, "Retrieval should return matching knowledge");
assert.ok(results.some((item) => item.card.id === "major-18-moon"), "Moon should rank for uncertainty/fear queries");
const work = rankTarotKnowledge(data.cards, "العمل والموارد والميزانية", {limit:5});
assert.ok(work.some((item) => item.card.suit === "pentacles"), "Money/work query should retrieve Pentacles");
const selected = rankTarotKnowledge(data.cards, "أي سؤال", {cardIds:["major-01-magician"],limit:5});
assert.ok(selected.every((item) => item.card.id === "major-01-magician"), "Explicit card scope must be respected");
console.log(`Tarot knowledge and retrieval checks passed: ${data.cards.length} cards, ${results.length} ranked matches.`);
