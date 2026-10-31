const assert = require('node:assert/strict');
const map = require('../assets/js/matrix-report-map.js');
const required = [
  'الشخصية والصفات','المواهب','القدر ومراحل العمر','المال والوفرة',
  'العلاقات والشريك المثالي','الكارما والبرامج المركبة','خطوط الأب والأم والأسلاف',
  'الأطفال والمواهب المرتبطة بهم','الشاكرات','الغاية ومحاورها',
  'الإرشادات الحياتية','التوقعات السنوية','العلامة الشخصية','التوافق بين المصفوفات'
];
assert.equal(map.schemaVersion, 1);
assert.equal(map.reference.sourceUrl, null);
assert.equal(map.reference.edition, null);
assert.equal(map.reference.excerptsAvailable, false);
assert.equal(map.groups.length, required.length);
assert.deepEqual(map.groups.map(x => x.ownerTopicLabel), required);
assert.equal(new Set(map.groups.map(x => x.id)).size, map.groups.length);
for (const group of map.groups) {
  assert.ok(group.id && group.projectState && group.missingEvidence, group.id);
  assert.ok(['partial','missing','separate'].includes(group.implementationStatus), group.id);
  assert.equal(group.referenceTerm, null, group.id + ' must not claim an unverified source heading');
}
for (const term of map.termsFromBrief) assert.equal(term.exactSourceHeadingVerified, false, term.term);
assert.equal(map.termsFromBrief.length, 11);
assert.ok(map.contentModel.levels.some(x => x.includes('تفسير أصلي لعقيق أسترو')));
console.log('PASS Matrix report source map: 14 checklist topics, 11 unverified brief terms, stable IDs and explicit evidence gaps');
