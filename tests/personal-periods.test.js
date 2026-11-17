const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const sandbox = { console, document: { head: { appendChild() {} }, createElement() { return { style: {}, appendChild() {} }; } }, fetch: () => Promise.reject(new Error('no net')) };
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'name_readings.js'), 'utf8'), sandbox);
const N = sandbox.window.AqeqNameReadings;
assert.equal(typeof N.calculatePersonalMonth, 'function');

// السنة الشخصية 2026 لمواليد 15-6: 15+6+(2+0+2+6) = 31 → 4
assert.equal(N.calculatePersonalYear(15, 6, 2026).value, 4);
// الشهر الشخصي = السنة الشخصية + الشهر الميلادي: 4 + 11 = 15 → 6
let pm = N.calculatePersonalMonth(15, 6, 2026, new Date(2026, 10, 17));
assert.equal(pm.value, 6); assert.equal(pm.rawTotal, 15);
// اليوم الشخصي = الشهر الشخصي + اليوم: 6 + 17 = 23 → 5
assert.equal(N.calculatePersonalDay(15, 6, 2026, new Date(2026, 10, 17)).value, 5);
// حفظ 11: سنة شخصية 2 + شهر 9 = 11
const py2 = (() => { for (let d = 1; d < 29; d++) for (let m = 1; m <= 12; m++) if (N.calculatePersonalYear(d, m, 2026).value === 2) return [d, m]; })();
assert.equal(N.calculatePersonalMonth(py2[0], py2[1], 2026, new Date(2026, 8, 1)).value, 11);
// 22 ممكن كيوم شخصي: شهر شخصي 4 + يوم 18
let found22 = false;
for (let d = 1; d < 29 && !found22; d++) for (let m = 1; m <= 12 && !found22; m++) { const v = N.calculatePersonalDay(d, m, 2026, new Date(2026, 0, 18)).value; if (v === 22) found22 = true; }
assert.ok(found22, '22 must be reachable');
// نطاق النتائج: 1–9 و11 و22 فقط
const allowed = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]);
for (let m = 1; m <= 12; m++) for (let d = 1; d <= 28; d++) for (let by = 0; by < 3; by++) {
  const ref = new Date(2026, (m + by) % 12, d);
  assert.ok(allowed.has(N.calculatePersonalMonth(d, m, 2026, ref).value));
  assert.ok(allowed.has(N.calculatePersonalDay(d, m, 2026, ref).value));
}
// الخانات الفارغة جاهزة في name_data.json
const data = JSON.parse(fs.readFileSync(path.join(root, 'name_data.json'), 'utf8'));
['personal_months', 'personal_days'].forEach(k => assert.deepEqual(Object.keys(data[k].numbers), ['1','2','3','4','5','6','7','8','9','11','22'], k));
assert.ok(data.maturity_extra.numbers['33']);
console.log('PASS personal-periods: month/day math, master 11/22 keep, empty slots');
