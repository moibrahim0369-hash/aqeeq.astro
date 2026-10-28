const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const dataPath = path.join(__dirname, "..", "assets", "data", "tarot", "study-cards.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

assert.equal(data.schemaVersion, 1, "Tarot data schema version should be declared");
assert.equal(data.system, "Rider-Waite-Smith", "The reference tarot system should be explicit");
assert.ok(Array.isArray(data.cards), "cards should be an array");
assert.ok(data.cards.length >= 1, "At least one reviewed seed card should exist");

const cardIds = data.cards.map((card) => card.id);
assert.equal(new Set(cardIds).size, cardIds.length, "Card IDs must be unique");

for (const card of data.cards) {
  assert.ok(card.nameAr && card.nameEn, "Each card needs Arabic and English names");
  assert.ok(["major", "minor"].includes(card.arcana), "Each card needs a valid arcana type");
  assert.ok(Array.isArray(card.sections), "Each card needs a sections array");
  const sectionIds = card.sections.map((section) => section.id);
  assert.equal(new Set(sectionIds).size, sectionIds.length, `${card.id}: section IDs must be unique`);
  for (const section of card.sections) {
    assert.ok(section.title && section.content.trim(), `${card.id}: section title and content are required`);
    assert.ok(["raw", "in_review", "approved", "published"].includes(section.status), `${card.id}: invalid section status`);
    assert.ok(section.provenance, `${card.id}: provenance must be declared`);
  }
}

const magician = data.cards.find((card) => card.id === "major-01-magician");
assert.ok(magician, "The Magician must be the initial reference card");
assert.ok(magician.sections.some((section) => section.id === "paradox"), "The Magician should include the core paradox");
assert.ok(magician.sections.some((section) => section.id === "practice"), "The Magician should include a practical exercise");

console.log(`Tarot study data checks passed: ${data.cards.length} seeded card(s), ${magician.sections.length} Magician sections.`);
