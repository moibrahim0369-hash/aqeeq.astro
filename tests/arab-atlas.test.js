'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const atlas = JSON.parse(fs.readFileSync(path.join(root, 'data/atlas/cities-arab-review-sample.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(atlas.cities.length >= 15, 'review sample should include representative Arab cities');
assert.match(html, /f-city-search/);
assert.match(html, /data\/atlas\/cities-arab\.json/);
assert.match(html, /cities-arab-review-sample\.json/);
const keys = new Set();
for (const city of atlas.cities) {
  assert.ok(city.name && city.country && city.timezone, 'city name, country and timezone are required');
  assert.ok(Number.isFinite(city.lat) && city.lat >= -90 && city.lat <= 90, city.name + ': latitude range');
  assert.ok(Number.isFinite(city.lon) && city.lon >= -180 && city.lon <= 180, city.name + ': longitude range');
  assert.ok(city.timezone.includes('/'), city.name + ': IANA timezone format');
  keys.add(city.countryCode);
}
for (const country of ['EG', 'SA', 'IQ']) assert.ok(keys.has(country), country + ' must be represented');
const cairo = atlas.cities.find(c => c.nameLatin === 'Cairo');
assert.ok(cairo);
assert.ok(Math.abs(cairo.lat - 30.0444) < 0.01 && Math.abs(cairo.lon - 31.2357) < 0.01, 'Cairo coordinates within sample tolerance');
console.log('Arab atlas sample checks passed (' + atlas.cities.length + ' cities).');
