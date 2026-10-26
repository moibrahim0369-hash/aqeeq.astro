'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/swiss-ephemeris-houses.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const systems = ['placidus', 'whole', 'equal', 'porphyry'];
assert.equal(fixture.charts.length, 3);
for (const chart of fixture.charts) {
  assert.ok(Number.isFinite(chart.lat) && Number.isFinite(chart.lon) && chart.utc);
  for (const name of systems) {
    const cusps = chart.systems[name];
    assert.ok(Array.isArray(cusps) && cusps.length === 12, chart.id + '/' + name + ': 12 reference cusps');
    assert.ok(cusps.every(n => Number.isFinite(n) && n >= 0 && n < 360));
  }
  assert.equal(chart.systems.whole[0] % 30, 0, chart.id + ': Whole Sign starts on sign boundary');
  for (let i = 0; i < 12; i++) {
    assert.ok(Math.abs((((chart.systems.equal[(i+1)%12]-chart.systems.equal[i])%360)+360)%360 - 30) < 1e-5, chart.id + ': Equal House 30-degree spacing');
  }
}
for (const val of ['placidus', 'whole', 'equal', 'porphyry']) assert.match(html, new RegExp('value="' + val + '"'));
// The production inline engine is not exported to Node, so these fixtures establish references,
// not a claim that the site engine has passed comparison. Actual chart output must be wired into the comparator.
console.log('Swiss Ephemeris reference fixture integrity checks passed. Site-engine comparison is still pending.');
