const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "assets/data/tarot/tarot-import-batch.schema.json"), "utf8"));
const template = JSON.parse(fs.readFileSync(path.join(root, "assets/data/tarot/tarot-import-batch.template.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "assets/data/tarot/study-cards.json"), "utf8"));
const docs = fs.readFileSync(path.join(root, "docs/TAROT_CONTENT_IMPORT_WORKFLOW.md"), "utf8");

assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
assert.equal(schema.properties.schemaVersion.const, 1);
assert.deepEqual(schema.required, ["schemaVersion", "batchId", "createdAt", "items"]);
assert.ok(schema.$defs.source.required.includes("rawText"), "Raw submitted source text must be retained");
assert.ok(schema.$defs.source.required.includes("sourceId"), "Each source needs a stable identity");
assert.ok(schema.$defs.block.properties.layer.enum.includes("reference"));
assert.ok(schema.$defs.block.properties.layer.enum.includes("aqeq_original"));
assert.ok(schema.$defs.block.properties.layer.enum.includes("editorial_note"));
assert.ok(schema.$defs.item.properties.review.properties.status.enum.includes("received"));
assert.ok(schema.$defs.item.properties.review.properties.status.enum.includes("approved"));
assert.ok(schema.$defs.item.properties.review.properties.history, "Review history must be recorded");

assert.equal(template.schemaVersion, 1);
assert.equal(template.items[0].review.status, "received", "Intake must not auto-approve content");
assert.equal(template.items[0].contributions[0].source.rawText, "", "Template must not fabricate or prefill external source text");
assert.equal(template.items[0].contributions[0].source.kind, "gemini");
assert.equal(template.items[0].contributions[0].mergedIntoVersion, null);
assert.ok(docs.includes("Preserve the original"));
assert.ok(docs.includes("No automatic approval"));
assert.ok(docs.includes("Never regenerate missing user text"));

const cardIds = new Set(catalog.cards.map((card) => card.id));
for (const item of template.items) {
  assert.ok(cardIds.has(item.targetCardId), "Template example must point to a real stable card ID");
}
const magician = catalog.cards.find((card) => card.id === "major-01-magician");
assert.equal(magician.status, "in_review");
assert.ok(magician.fields.love.dating?.upright && magician.fields.love.dating?.reversed, "Magician should distinguish dating upright/reversed");
assert.ok(magician.fields.love.commitment?.upright && magician.fields.love.commitment?.reversed, "Magician should distinguish commitment upright/reversed");
assert.ok(magician.fields.love.separation?.upright && magician.fields.love.separation?.reversed, "Magician should distinguish separation upright/reversed");
assert.ok(magician.sections.some((section) => section.id === "relationship-stages" && section.status === "in_review"));

console.log("Tarot content import contract passed: source preservation, provenance layers, version mapping, review history, and Magician relationship contexts.");
