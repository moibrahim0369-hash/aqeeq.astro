const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const dataPath = path.join(__dirname, "..", "assets", "data", "tarot", "study-cards.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
assert.equal(data.schemaVersion, 2, "Tarot schema version should be explicit");
assert.equal(data.system, "Rider-Waite-Smith", "Reference system should be explicit");
assert.equal(data.cards.length, 78, "Catalog must contain all 78 cards");
assert.equal(new Set(data.cards.map((card) => card.id)).size, 78, "Card IDs must be unique");
assert.equal(data.cards.filter((card) => card.arcana === "major").length, 22);
assert.equal(data.cards.filter((card) => card.arcana === "minor").length, 56);
for (const suit of ["wands", "cups", "swords", "pentacles"]) assert.equal(data.cards.filter((card) => card.suit === suit).length, 14);
for (const card of data.cards) {
  assert.ok(card.nameAr && card.nameEn, `${card.id}: bilingual names required`);
  assert.ok(["major", "minor"].includes(card.arcana), `${card.id}: invalid arcana`);
  assert.ok(["raw", "draft", "in_review", "approved", "published", "archived"].includes(card.status));
  assert.ok(card.traditionalReference && card.aqeqInterpretation, `${card.id}: separate reference and original interpretation`);
  assert.ok(Array.isArray(card.sources) && card.editorialNotes);
  assert.ok(Array.isArray(card.sections) && card.sections.length >= 3);
  assert.equal(new Set(card.sections.map((section) => section.id)).size, card.sections.length);
  for (const section of card.sections) {
    assert.ok(section.title && section.content.trim());
    assert.ok(["raw", "draft", "in_review", "approved", "published", "archived"].includes(section.status));
    assert.ok(section.provenance);
  }
  assert.notEqual(card.status, "published", "Starter content must not be published before review");
}
const magician = data.cards.find((card) => card.id === "major-01-magician");
assert.ok(magician && magician.aqeqInterpretation.core.includes("القدرة"));
assert.ok(magician.sections.some((section) => section.id === "reflection"));
console.log(`Tarot study data checks passed: ${data.cards.length} cards, 22 Major Arcana, 56 Minor Arcana.`);
