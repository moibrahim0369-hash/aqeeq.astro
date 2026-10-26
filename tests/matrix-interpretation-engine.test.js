const assert = require('node:assert/strict');
const engine = require('../assets/js/matrix-interpretation-engine.js');
const prototype = require('../assets/data/matrix/interpretations/center-07.json');

assert.deepEqual(engine.validateEntry(prototype), { valid: true, errors: [] });
assert.equal(prototype.arcanaNumber, 7);
assert.equal(prototype.position.key, 'center');
assert.equal(prototype.referenceRule.verificationStatus, 'unverified');
assert.equal(prototype.interpretation.voice, 'aqeeq-original');
assert.equal(prototype.interpretation.completionStatus, 'prototype');

const facts = Object.freeze({
  matrix: Object.freeze({
    nodes: Object.freeze({ center: 7, north: 7, northEast: 16, southWest: 18 })
  })
});
const before = JSON.stringify(facts);
assert.equal(engine.resolve(facts, [prototype]), null, 'prototype content must never be returned for display');
const approved = {
  ...prototype,
  interpretation: {
    ...prototype.interpretation,
    reviewStatus: 'approved',
    completionStatus: 'complete'
  }
};
const base = engine.resolve(facts, [approved]);
assert.equal(base.entryId, prototype.id);
assert.equal(base.position, 'center');
assert.equal(base.arcanaNumber, 7);
assert.equal(base.contextFragments.length, 0);
assert.equal(base.combinationFragments.length, 0);
assert.equal(base.completeness, 'complete');
assert.equal(JSON.stringify(facts), before, 'resolver must not mutate calculated facts');
assert.equal(engine.resolve({ matrix: { nodes: { center: 8 } } }, [approved]), null);

const testOnlyRule = {
  id: 'test-only-context-fixture',
  verificationStatus: 'verified',
  relationshipStatus: 'verified',
  provenance: {
    source: {
      url: 'https://example.invalid/test-fixture',
      edition: 'test fixture only',
      locator: 'unit test; not a Matrix reference'
    }
  },
  when: [{ path: 'matrix.nodes.northEast', operator: 'equals', value: 16 }],
  text: 'fixture overlay'
};
// Synthetic rule above exists only to test the resolver mechanics; it is not shipped as method content.
const withTestFixture = { ...approved, contextualRules: [testOnlyRule] };
assert.equal(engine.resolve(facts, [withTestFixture]).contextFragments[0].text, 'fixture overlay');
const combinationFixture = { ...testOnlyRule, id: 'test-only-combination-fixture', text: 'combination fixture' };
const withCombinationFixture = { ...approved, combinationRules: [combinationFixture] };
assert.equal(engine.resolve(facts, [withCombinationFixture]).combinationFragments[0].text, 'combination fixture');
assert.equal(engine.resolve({ matrix: { nodes: { center: 7, northEast: 3 } } }, [withTestFixture]).contextFragments.length, 0);
const unverifiedFixture = { ...testOnlyRule, id: 'unverified-fixture', verificationStatus: 'unverified' };
assert.equal(engine.resolve(facts, [{ ...approved, contextualRules: [unverifiedFixture] }]).contextFragments.length, 0);
assert.equal(engine.isSourceQualified({ ...testOnlyRule, provenance: { source: { url: 'http://example.invalid', edition: 'test', locator: 'test' } } }), false);
assert.equal(engine.matchesCondition(facts, { path: 'matrix.nodes.center', operator: 'equals', value: 7 }), true);
assert.equal(engine.matchesCondition(facts, { path: 'matrix.nodes.center', operator: 'oneOf', values: [7, 8] }), true);

console.log('PASS Matrix interpretation prototype: position binding, explicit provenance status, context gating, and immutable facts');
