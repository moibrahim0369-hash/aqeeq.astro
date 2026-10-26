'use strict';
// Run: node tests/swiss-house-fixtures.test.js
// This loads the actual Astro IIFE from index.html and compares its real outputs
// against reference cusps generated with Swiss Ephemeris. It does not bundle Swiss Ephemeris.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/swiss-ephemeris-houses.json'), 'utf8'));
const systems = ['placidus', 'whole', 'equal', 'porphyry'];
const marker = '})();\nif (typeof module !== \'undefined\') module.exports = Astro;';
const start = html.indexOf('const Astro = (() => {');
assert.notEqual(start, -1, 'Astro engine IIFE must exist in index.html');
const end = html.indexOf(marker, start);
assert.notEqual(end, -1, 'Astro engine IIFE must have its expected closing marker');
const engineSource = html.slice(start, end + 4) + '\nmodule.exports = Astro;';
const sandbox = { module: { exports: {} } };
vm.runInNewContext(engineSource, sandbox, { filename: 'index.html#Astro-engine' });
const Astro = sandbox.module.exports;
assert.equal(typeof Astro.chart, 'function', 'actual Astro.chart must be exposed by the extracted engine');

const angularError = (actual, expected) => Math.abs(((actual - expected + 540) % 360) - 180);
const toleranceDegrees = 0.001; // 3.6 arcseconds, comfortably above fixture rounding precision
const failures = [];
let comparisons = 0;

assert.equal(fixture.charts.length, 3, 'expected three reference charts');
for (const chart of fixture.charts) {
  assert.ok(Number.isFinite(chart.lat) && Number.isFinite(chart.lon) && chart.utc);
  for (const hs of systems) {
    const expected = chart.systems[hs];
    assert.ok(Array.isArray(expected) && expected.length === 12, chart.id + '/' + hs + ': 12 reference cusps');
    const actual = Astro.chart({
      utcMs: Date.parse(chart.utc),
      lat: chart.lat,
      lon: chart.lon,
      hs,
      known: true,
    });
    assert.equal(actual.hs, hs, chart.id + '/' + hs + ': engine must use requested system without fallback');
    for (const [label, got, want] of [
      ['ASC', actual.asc, chart.asc],
      ['MC', actual.mc, chart.mc],
      ...actual.cusps.map((value, i) => ['cusp ' + (i + 1), value, expected[i]]),
    ]) {
      comparisons++;
      const error = angularError(got, want);
      if (!Number.isFinite(error) || error > toleranceDegrees) {
        failures.push({ chart: chart.id, system: hs, point: label, actual: got, expected: want, errorDegrees: error });
      }
    }
  }
}
for (const val of systems) assert.match(html, new RegExp('value="' + val + '"'));
if (failures.length) {
  console.error(JSON.stringify({ comparisons, toleranceDegrees, failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log('Swiss Ephemeris comparison passed: ' + comparisons + ' ASC/MC/cusp comparisons across ' + fixture.charts.length + ' charts and ' + systems.length + ' house systems; tolerance ±' + toleranceDegrees + '°.');
}
