'use strict';
// Execute the exact Astro engine embedded in index.html against Swiss Ephemeris fixtures.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/swiss-ephemeris-houses.json'), 'utf8'));
const match = html.match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/);
assert.ok(match, 'could extract production Astro engine IIFE from index.html');
const sandbox = { module: { exports: {} }, console, Date, Math, Intl };
vm.runInNewContext(match[0] + '\nmodule.exports = Astro;', sandbox, { timeout: 5000 });
const Astro = sandbox.module.exports;
assert.equal(typeof Astro.chart, 'function');
const systems = ['placidus', 'whole', 'equal', 'porphyry'];
const TOLERANCE_DEG = Number(process.env.HOUSE_TOLERANCE_DEG || '0.1');
const circularError = (a, b) => Math.abs((((a - b + 540) % 360) + 360) % 360 - 180);
const errors = [];
for (const reference of fixture.charts) {
  const utcMs = Date.parse(reference.utc);
  assert.ok(Number.isFinite(utcMs), reference.id + ': valid UTC fixture timestamp');
  for (const system of systems) {
    const actual = Astro.chart({ utcMs, lat: reference.lat, lon: reference.lon, hs: system, known: true });
    assert.ok(Array.isArray(actual.cusps) && actual.cusps.length === 12, reference.id + '/' + system + ': engine returned 12 cusps');
    assert.notEqual(actual.hs, 'whole-fallback', reference.id + '/' + system + ': unexpected fallback to Whole Sign');
    const cuspErrors = actual.cusps.map((value, i) => circularError(value, reference.systems[system][i]));
    const maxCuspError = Math.max(...cuspErrors);
    const ascError = circularError(actual.asc, reference.asc);
    const mcError = circularError(actual.mc, reference.mc);
    errors.push({ chart: reference.id, system, ascError, mcError, maxCuspError });
    assert.ok(ascError <= TOLERANCE_DEG, reference.id + '/' + system + ': ASC error ' + ascError.toFixed(6) + '° > ' + TOLERANCE_DEG + '°');
    assert.ok(mcError <= TOLERANCE_DEG, reference.id + '/' + system + ': MC error ' + mcError.toFixed(6) + '° > ' + TOLERANCE_DEG + '°');
    assert.ok(maxCuspError <= TOLERANCE_DEG, reference.id + '/' + system + ': max cusp error ' + maxCuspError.toFixed(6) + '° > ' + TOLERANCE_DEG + '°');
  }
}
console.log('Swiss Ephemeris engine comparison passed; tolerance=' + TOLERANCE_DEG + '°');
for (const e of errors) console.log(e.chart + ' / ' + e.system + ': ASC=' + e.ascError.toFixed(6) + '°, MC=' + e.mcError.toFixed(6) + '°, max cusp=' + e.maxCuspError.toFixed(6) + '°');
