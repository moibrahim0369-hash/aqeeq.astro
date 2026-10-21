'use strict';

/**
 * Aqeq Astro compatibility engine
 * Rules: aqeq_rules_v1, finalized in the conversation on 2026-10-21.
 * CommonJS + browser global. No external dependencies.
 */

const MASTER_NUMBERS = Object.freeze([11, 22, 33]);
const KARMIC_DAYS = Object.freeze([13, 14, 16, 19]);
const VALID_PATHS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]);
const KARMIC_KEYS = Object.freeze({ 13: '13_4', 14: '14_5', 16: '16_7', 19: '19_1' });
const RELATION_TYPES = Object.freeze(['love', 'family', 'business']);

function assertIntegerInRange(value, min, max, name) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new TypeError(`${name} must be an integer from ${min} to ${max}. Received: ${value}`);
  }
  return n;
}

/** Reduce a positive integer to 1-9, preserving 11/22/33 only when the input itself is a master number. */
function reduceToRoot(n) {
  let value = Number(n);
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`reduceToRoot expects a non-negative integer. Received: ${n}`);
  }
  if (MASTER_NUMBERS.includes(value)) return value;
  while (value > 9) {
    value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
}

/** Always reduce to a single digit, even when the input is 11/22/33. */
function reduceToSingleDigit(n) {
  let value = Number(n);
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`reduceToSingleDigit expects a non-negative integer. Received: ${n}`);
  }
  while (value > 9) {
    value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
}

/** Force master numbers to their base roots: 11->2, 22->4, 33->6. */
function getBase(path) {
  const n = Number(path);
  if (!VALID_PATHS.includes(n)) {
    throw new TypeError(`path must be one of ${VALID_PATHS.join(', ')}. Received: ${path}`);
  }
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function getFamily(base) {
  const n = Number(base);
  if (!Number.isInteger(n) || n < 1 || n > 9) return 'unknown';
  if (n === 9) return 'universal';
  if ([1, 5, 7].includes(n)) return 'mental';
  if ([2, 3, 6].includes(n)) return 'emotional';
  if ([4, 8].includes(n)) return 'practical';
  return 'unknown';
}

function getFamilyCompatibility(base1, base2) {
  const family1 = getFamily(base1);
  const family2 = getFamily(base2);
  if (family1 === 'universal' || family2 === 'universal') {
    return { family1, family2, familyType: 'universal', familyBonus: 20 };
  }
  if (family1 === family2) {
    return { family1, family2, familyType: 'same', familyBonus: 25 };
  }
  const complementary =
    (family1 === 'mental' && family2 === 'practical') ||
    (family1 === 'practical' && family2 === 'mental') ||
    (family1 === 'emotional' && family2 === 'practical') ||
    (family1 === 'practical' && family2 === 'emotional');
  if (complementary) {
    return { family1, family2, familyType: 'complementary', familyBonus: 15 };
  }
  return { family1, family2, familyType: 'opposite', familyBonus: 8 };
}

function getCoreBridgeBonus(coreBridge) {
  const table = { 0: 14, 1: 12, 2: 14, 3: 12, 4: 6, 5: 8, 6: 14, 7: 8, 8: 6 };
  if (!Object.prototype.hasOwnProperty.call(table, coreBridge)) throw new RangeError(`Invalid core bridge: ${coreBridge}`);
  return table[coreBridge];
}

function getDailyBridgeBonus(dailyBridge) {
  if (!Number.isInteger(dailyBridge) || dailyBridge < 0 || dailyBridge > 8) {
    throw new RangeError(`Invalid daily bridge: ${dailyBridge}`);
  }
  if (dailyBridge === 0 || dailyBridge === 2) return 10;
  if (dailyBridge <= 4) return 7;
  return 4;
}

function getCompositeBonus(compositeRoot) {
  if ([2, 6, 9].includes(compositeRoot)) return 4;
  if ([1, 5, 8].includes(compositeRoot)) return 2;
  return 0;
}

function getKarmicDebtDetails(day1, day2, karmicData = {}) {
  const debts = [];
  for (const [person, rawDay] of [[1, day1], [2, day2]]) {
    const day = Number(rawDay);
    if (!KARMIC_DAYS.includes(day)) continue;
    const key = KARMIC_KEYS[day];
    const entry = karmicData && karmicData[key];
    if (entry && typeof entry === 'object') debts.push({ person, day, key, ...entry });
    else debts.push({ person, day, key, missingData: true });
  }
  return debts;
}

/**
 * Score rule: master bonus +3 once if either individual path is a master.
 * Composite master has a text overlay only, no additional score bonus.
 */
function calculateAqeqCompatibility(path1, path2, day1, day2) {
  path1 = assertIntegerInRange(path1, 1, 33, 'path1');
  path2 = assertIntegerInRange(path2, 1, 33, 'path2');
  if (!VALID_PATHS.includes(path1) || !VALID_PATHS.includes(path2)) {
    throw new TypeError(`Paths must be from: ${VALID_PATHS.join(', ')}`);
  }
  day1 = assertIntegerInRange(day1, 1, 31, 'day1');
  day2 = assertIntegerInRange(day2, 1, 31, 'day2');

  const base1 = getBase(path1);
  const base2 = getBase(path2);
  const reducedDay1 = reduceToSingleDigit(day1);
  const reducedDay2 = reduceToSingleDigit(day2);
  const coreBridge = Math.abs(base1 - base2);
  const dailyBridge = Math.abs(reducedDay1 - reducedDay2);
  const family = getFamilyCompatibility(base1, base2);

  const rawBaseSum = base1 + base2;
  const compositeRoot = reduceToSingleDigit(rawBaseSum);
  // Since base roots are 1-9, rawBaseSum can only be 2-18; 11 is the only possible composite master sum.
  const isCompositeMaster = MASTER_NUMBERS.includes(rawBaseSum);
  const hasMasterPath = MASTER_NUMBERS.includes(path1) || MASTER_NUMBERS.includes(path2);
  const hasKarmicDebt = KARMIC_DAYS.includes(day1) || KARMIC_DAYS.includes(day2);

  const breakdown = {
    base: 50,
    familyBonus: family.familyBonus,
    coreBridgeBonus: getCoreBridgeBonus(coreBridge),
    dailyBridgeBonus: getDailyBridgeBonus(dailyBridge),
    compositeBonus: getCompositeBonus(compositeRoot),
    masterBonus: hasMasterPath ? 3 : 0,
    karmicPenalty: hasKarmicDebt ? -3 : 0
  };
  const rawScore = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const score = Math.max(55, Math.min(rawScore, 95));

  return {
    score,
    rawScore,
    path1, path2, day1, day2,
    base1, base2,
    family1: family.family1,
    family2: family.family2,
    reducedDay1, reducedDay2,
    coreBridge, dailyBridge,
    rawBaseSum,
    composite: compositeRoot,
    compositeRoot,
    isCompositeMaster,
    isMaster: isCompositeMaster, // compatibility alias; means composite master, not an individual master
    hasMasterPath,
    hasMaster: hasMasterPath, // compatibility alias
    isUniversal: family.familyType === 'universal',
    familyType: family.familyType,
    hasKarmicDebt,
    breakdown
  };
}

function getCompatibilityLabel(score) {
  if (score >= 90) return { label: 'تناغم أسطوري', color: 'gold' };
  if (score >= 80) return { label: 'توافق عميق', color: 'emerald' };
  if (score >= 70) return { label: 'توافق قوي', color: 'teal' };
  if (score >= 60) return { label: 'توافق واعد', color: 'blue' };
  return { label: 'تحدي كارمي', color: 'amber' };
}

function getMasterOverlays(path1, path2, rawBaseSum, masterData = {}) {
  const overlays = [];
  for (const [source, path] of [['partner1', Number(path1)], ['partner2', Number(path2)]]) {
    if (MASTER_NUMBERS.includes(path) && masterData[String(path)]) {
      overlays.push({ source, number: path, text: masterData[String(path)] });
    }
  }
  if (MASTER_NUMBERS.includes(Number(rawBaseSum)) && masterData[String(rawBaseSum)]) {
    overlays.push({ source: 'composite', number: Number(rawBaseSum), text: masterData[String(rawBaseSum)] });
  }
  return overlays;
}

function getAttractionSecretSafe(base1, base2, attractionData = {}) {
  const cell = attractionData?.[`row_${base1}`]?.[`${base1}_${base2}`];
  if (!cell || typeof cell !== 'object') return null;
  const result = {};
  for (const key of ['attraction_hook', 'primal_secret', 'first_meeting_vibe', 'why_they_stay']) {
    result[key] = typeof cell[key] === 'string' ? cell[key].trim() : '';
  }
  return result;
}

function buildReport(result, data, relationType = 'love') {
  if (!result || typeof result !== 'object') throw new TypeError('result must be a calculation result object');
  if (!data || typeof data !== 'object') throw new TypeError('data must be the parsed data.json object');
  if (!RELATION_TYPES.includes(relationType)) throw new TypeError(`relationType must be one of: ${RELATION_TYPES.join(', ')}`);

  const paths = data.individual_paths || {};
  const coreBridges = data.core_bridges || {};
  const dailyBridges = data.daily_spark_bridges || {};
  const masterData = data.master_overlays || {};
  const karmicData = data.karmic_debts || {};
  const attractionData = data.attraction_secrets || {};

  const path1Data = paths[`path_${result.path1}`] || {};
  const path2Data = paths[`path_${result.path2}`] || {};
  const coreBridgeData = coreBridges[`bridge_${result.coreBridge}`] || {};
  const dailyBridgeData = dailyBridges[`bridge_${result.dailyBridge}`] || {};
  const karmicDebts = getKarmicDebtDetails(result.day1, result.day2, karmicData);
  const attractionCell = getAttractionSecretSafe(result.base1, result.base2, attractionData);
  const masterOverlays = getMasterOverlays(result.path1, result.path2, result.rawBaseSum, masterData);
  const personalMasterOverlays = masterOverlays.filter(item => item.source !== 'composite');
  const compositeMasterOverlay = masterOverlays.find(item => item.source === 'composite') || null;

  const lens1 = path1Data[`${relationType}_lens`] || {};
  const lens2 = path2Data[`${relationType}_lens`] || {};

  return {
    meta: {
      score: result.score,
      rawScore: result.rawScore,
      label: getCompatibilityLabel(result.score),
      relationType,
      path1: result.path1,
      path2: result.path2,
      base1: result.base1,
      base2: result.base2,
      coreBridge: result.coreBridge,
      dailyBridge: result.dailyBridge,
      composite: result.compositeRoot,
      isCompositeMaster: result.isCompositeMaster,
      familyType: result.familyType,
      breakdown: { ...result.breakdown }
    },
    free: {
      attraction: attractionCell?.attraction_hook || '',
      primalSecret: attractionCell?.primal_secret || '',
      coreBridgeTitle: coreBridgeData.title || '',
      healingLine: coreBridgeData.repair_statement || ''
    },
    premium: {
      path1: { identity: path1Data.core_identity || '', lens: lens1, magicKey: path1Data.magic_key || '' },
      path2: { identity: path2Data.core_identity || '', lens: lens2, magicKey: path2Data.magic_key || '' },
      coreBridge: coreBridgeData,
      dailyBridge: dailyBridgeData,
      masterOverlays,
      personalMasterOverlays,
      compositeMasterOverlay,
      karmicDebts,
      attractionFull: attractionCell
    }
  };
}

function auditSynastryData(jsonData) {
  const report = {
    ok: false,
    attraction: { totalCells: 0, expectedCells: 81, missingCells: [], missingKeys: [], emptyFields: [], invalidFields: [] },
    paths: { missing: [] },
    coreBridges: { missing: [] },
    dailyBridges: { missing: [] },
    masterOverlays: { missing: [] },
    karmicDebts: { missing: [] },
    schemaErrors: []
  };
  if (!jsonData || typeof jsonData !== 'object') {
    report.schemaErrors.push('data.json must be a parsed object');
    return report;
  }

  const requiredAttractionKeys = ['attraction_hook', 'primal_secret', 'first_meeting_vibe', 'why_they_stay'];
  for (let i = 1; i <= 9; i++) {
    const row = jsonData.attraction_secrets?.[`row_${i}`];
    for (let j = 1; j <= 9; j++) {
      const cellId = `${i}_${j}`;
      const cell = row?.[cellId];
      if (!cell || typeof cell !== 'object') {
        report.attraction.missingCells.push(cellId);
        continue;
      }
      report.attraction.totalCells++;
      for (const key of requiredAttractionKeys) {
        if (!Object.prototype.hasOwnProperty.call(cell, key)) report.attraction.missingKeys.push(`${cellId} -> ${key}`);
        else if (typeof cell[key] !== 'string') report.attraction.invalidFields.push(`${cellId} -> ${key} must be a string`);
        else if (!cell[key].trim()) report.attraction.emptyFields.push(`${cellId} -> ${key}`);
      }
    }
  }

  for (const path of VALID_PATHS) {
    if (!jsonData.individual_paths?.[`path_${path}`]) report.paths.missing.push(`path_${path}`);
  }
  for (let i = 0; i <= 8; i++) {
    if (!jsonData.core_bridges?.[`bridge_${i}`]) report.coreBridges.missing.push(`bridge_${i}`);
    if (!jsonData.daily_spark_bridges?.[`bridge_${i}`]) report.dailyBridges.missing.push(`bridge_${i}`);
  }
  for (const n of MASTER_NUMBERS) {
    if (!jsonData.master_overlays?.[String(n)]) report.masterOverlays.missing.push(String(n));
  }
  for (const key of Object.values(KARMIC_KEYS)) {
    if (!jsonData.karmic_debts?.[key]) report.karmicDebts.missing.push(key);
  }

  report.ok = report.attraction.missingCells.length === 0 &&
    report.attraction.missingKeys.length === 0 &&
    report.attraction.emptyFields.length === 0 &&
    report.attraction.invalidFields.length === 0 &&
    report.paths.missing.length === 0 &&
    report.coreBridges.missing.length === 0 &&
    report.dailyBridges.missing.length === 0 &&
    report.masterOverlays.missing.length === 0 &&
    report.karmicDebts.missing.length === 0 &&
    report.schemaErrors.length === 0;
  return report;
}

function runTests() {
  const tests = [
    { name: '5 + 6, days 15 + 15', args: [5, 6, 15, 15], expected: 84, checks: r => r.isCompositeMaster && r.compositeRoot === 2 },
    { name: '1 + 1 mirror', args: [1, 1, 1, 1], expected: 95, checks: r => r.rawScore === 103 },
    { name: '9 + 1 universal', args: [9, 1, 9, 1], expected: 82, checks: r => r.isUniversal && r.familyType === 'universal' },
    { name: '11 + 22 masters', args: [11, 22, 11, 22], expected: 95, checks: r => r.hasMasterPath && r.breakdown.masterBonus === 3 },
    { name: '4 + 5, karmic day 13', args: [4, 5, 13, 5], expected: 85, checks: r => r.hasKarmicDebt && r.breakdown.karmicPenalty === -3 }
  ];
  const results = tests.map(test => {
    try {
      const actual = calculateAqeqCompatibility(...test.args);
      const passed = actual.score === test.expected && test.checks(actual);
      return { name: test.name, expected: test.expected, actual: actual.score, rawScore: actual.rawScore, passed, breakdown: actual.breakdown };
    } catch (error) {
      return { name: test.name, expected: test.expected, passed: false, error: error.message };
    }
  });
  return { passed: results.filter(r => r.passed).length, total: results.length, ok: results.every(r => r.passed), results };
}

const AqeqEngine = {
  reduceToRoot,
  reduceToSingleDigit,
  getBase,
  getFamily,
  getFamilyCompatibility,
  getCoreBridgeBonus,
  getDailyBridgeBonus,
  getCompositeBonus,
  getKarmicDebtDetails,
  calculateAqeqCompatibility,
  getCompatibilityLabel,
  getMasterOverlays,
  getAttractionSecretSafe,
  buildReport,
  auditSynastryData,
  runTests
};

if (typeof module !== 'undefined' && module.exports) module.exports = AqeqEngine;
if (typeof window !== 'undefined') window.AqeqEngine = AqeqEngine;
