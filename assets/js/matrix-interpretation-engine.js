/* Aqeeq Matrix interpretation resolver.
   Consumes already-calculated facts. It never calculates or changes a matrix. */
(function (root, factory) {
  'use strict';
  const api = factory();
  root.AqeeqMatrixInterpretation = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const VALID_COMPLETION = new Set(['empty', 'partial', 'prototype', 'complete']);
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

  function getPath(object, path) {
    return String(path).split('.').reduce((value, key) => value == null ? undefined : value[key], object);
  }
  function matchesCondition(facts, condition) {
    const actual = getPath(facts, condition.path);
    if (condition.operator === 'equals') return actual === condition.value;
    if (condition.operator === 'oneOf') return Array.isArray(condition.values) && condition.values.includes(actual);
    if (condition.operator === 'exists') return actual !== undefined && actual !== null;
    return false;
  }
  function matchesAll(facts, conditions) {
    return Array.isArray(conditions) && conditions.length > 0 && conditions.every(condition => matchesCondition(facts, condition));
  }
  function isSourceQualified(rule) {
    const source = rule && rule.provenance && rule.provenance.source;
    return rule?.verificationStatus === 'verified' &&
      rule?.relationshipStatus === 'verified' &&
      !!source && typeof source.url === 'string' && /^https:\/\//.test(source.url) &&
      !!source.locator && !!source.edition;
  }
  function validateEntry(entry) {
    const errors = [];
    if (!entry || entry.schemaVersion !== 1) errors.push('schemaVersion must be 1');
    if (!entry?.id || !Number.isInteger(entry.arcanaNumber) || entry.arcanaNumber < 1 || entry.arcanaNumber > 22) errors.push('id and arcanaNumber 1..22 are required');
    if (!entry?.position?.key || !entry?.position?.path) errors.push('position key and data path are required');
    if (!entry?.interpretation || !VALID_COMPLETION.has(entry.interpretation.completionStatus)) errors.push('interpretation completion status is invalid');
    if (!entry?.interpretation?.meaning || !Array.isArray(entry?.interpretation?.strengths) || !Array.isArray(entry?.interpretation?.challenges)) errors.push('interpretation meaning, strengths, and challenges are required');
    if (!entry?.referenceRule || !['verified', 'unverified', 'not-applicable'].includes(entry.referenceRule.verificationStatus)) errors.push('reference-rule verification status is required');
    if (!Array.isArray(entry?.contextualRules) || !Array.isArray(entry?.combinationRules)) errors.push('contextualRules and combinationRules must be arrays');
    return { valid: errors.length === 0, errors };
  }
  function resolve(facts, entries) {
    if (!facts || !Array.isArray(entries)) return null;
    const entry = entries.find(candidate => {
      const check = validateEntry(candidate);
      return check.valid && candidate.interpretation.reviewStatus === 'approved' && candidate.interpretation.completionStatus === 'complete' && candidate.position.path &&
        getPath(facts, candidate.position.path) === candidate.arcanaNumber;
    });
    if (!entry) return null;
    const collectVerified = rules => (rules || [])
      .filter(rule => isSourceQualified(rule) && matchesAll(facts, rule.when))
      .map(rule => ({ id: rule.id, text: rule.text, source: { ...rule.provenance.source } }));
    const contextFragments = collectVerified(entry.contextualRules);
    const combinationFragments = collectVerified(entry.combinationRules);
    return {
      entryId: entry.id,
      position: entry.position.key,
      arcanaNumber: entry.arcanaNumber,
      interpretation: JSON.parse(JSON.stringify(entry.interpretation)),
      contextFragments,
      combinationFragments,
      referenceRuleStatus: entry.referenceRule.verificationStatus,
      calculationBinding: entry.calculationBinding ? { ...entry.calculationBinding } : null,
      completeness: entry.interpretation.completionStatus
    };
  }
  return Object.freeze({ getPath, matchesCondition, matchesAll, isSourceQualified, validateEntry, resolve });
});
