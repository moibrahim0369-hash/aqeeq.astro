const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../assets/js/aqeeq-lifepath-core.js');
const P = require('../pinnacles_challenges.js');
const root = path.resolve(__dirname, '..');

// جدول التواريخ المعتمد في docs/life-path-method-specification.md
[['1995-01-15', 4], ['1988-11-03', 4], ['1980-01-19', 11], ['2002-09-09', 22], ['1975-10-19', 33], ['1995-05-22', 33], ['1984-11-06', 3], ['1930-01-06', 2], ['1930-01-08', 22]]
  .forEach(([d, e]) => assert.equal(C.fromISO(d), e, d));

// لا نسخ محلية للحساب: كل الصفحات تستدعي الدالة المرجعية
const mustUseCore = ['assets/js/inline/page-06.js', 'assets/js/numerology-matrix.js', 'assets/js/aqeeq-platform.js', 'assets/js/you-page.js'];
mustUseCore.forEach(f => assert.ok(fs.readFileSync(path.join(root, f), 'utf8').includes('AqeqLifePathCore'), f + ' must call AqeqLifePathCore'));

// القمة الثالثة: جذرا P1 وP2 (11→2، 22→4)
let r = P.calculatePinnaclesChallenges(2, 9, 1980, 5); // P1=11, P2=11 → P3 = 2+2 = 4
assert.deepEqual(r.pinnacles.map(p => p.value), [11, 11, 4, 9]);
r = P.calculatePinnaclesChallenges(14, 4, 1992, 5); // 9, 8 → 17 → 8
assert.equal(r.pinnacles[2].value, 8);
console.log('PASS lifepath-core: spec dates, single source, P3 roots');
