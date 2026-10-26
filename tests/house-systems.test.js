'use strict';
// Lightweight regression checks for the built-in house-system implementation.
// Run: node tests/house-systems.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

for (const [value, label] of [
  ['placidus', 'Placidus'],
  ['whole', 'Whole Sign'],
  ['equal', 'Equal House'],
  ['porphyry', 'Porphyry'],
]) {
  assert.match(html, new RegExp('<option value="' + value + '">'));
  assert.match(html, new RegExp("hs === '" + value + "'"));
}
assert.match(html, /const equalCusps = asc => Array\.from\(\{ length: 12 \}, \(_, i\) => norm\(asc \+ 30 \* i\)\)/);
assert.match(html, /function porphyryCusps\(asc, mc\)/);
assert.match(html, /c\[q \* 3 \+ 1\] = norm\(start \+ arc \/ 3\)/);
assert.match(html, /c\[q \* 3 \+ 2\] = norm\(start \+ 2 \* arc \/ 3\)/);

// Independent geometric sanity checks for Equal and Porphyry cusp spacing.
const norm = x => ((x % 360) + 360) % 360;
const equal = asc => Array.from({length:12}, (_, i) => norm(asc + 30*i));
const porphyry = (asc, mc) => {
  const anchors = [norm(asc), norm(mc + 180), norm(asc + 180), norm(mc)];
  const c = new Array(12);
  for (let q = 0; q < 4; q++) {
    const start = anchors[q], end = anchors[(q + 1) % 4], arc = norm(end - start);
    c[q*3] = start; c[q*3+1] = norm(start+arc/3); c[q*3+2] = norm(start+2*arc/3);
  }
  return c;
};
const e = equal(17.25);
assert.equal(e.length, 12);
for (let i=0;i<12;i++) assert.ok(Math.abs(norm(e[(i+1)%12]-e[i])-30)<1e-9);
const p = porphyry(17.25, 281.4);
assert.equal(p.length, 12);
for (let q=0;q<4;q++) {
  const arc = norm(p[q*3+3 === 12 ? 0 : q*3+3] - p[q*3]);
  assert.ok(arc > 0 && arc < 180, 'each Porphyry quadrant has a positive arc');
  assert.ok(Math.abs(norm(p[q*3+1]-p[q*3])-arc/3)<1e-8);
  assert.ok(Math.abs(norm(p[q*3+2]-p[q*3+1])-arc/3)<1e-8);
}
console.log('House-system checks passed.');
