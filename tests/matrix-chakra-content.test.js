'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dataDir = path.join(__dirname, '..', 'assets', 'data', 'matrix');
const aspects = ['physicsPsychology', 'energyPsychology', 'emotionsPsychology'];
for (let id = 1; id <= 22; id += 1) {
  const entry = JSON.parse(fs.readFileSync(path.join(dataDir, `arcana-${String(id).padStart(2, '0')}.json`), 'utf8'));
  assert.equal(entry.id, id, `Arcana ID for chakra text ${id}`);
  for (const chakraKey of ['sahasrara', 'ajna', 'vishuddha', 'anahata', 'manipura']) {
    assert.equal(entry.meta?.chakraContent?.[chakraKey]?.status, 'partial-review');
    assert.equal(entry.meta?.chakraContent?.[chakraKey]?.authorship, 'aqeeq-original');
    assert.equal(entry.meta?.chakraContent?.[chakraKey]?.referenceRuleStatus, 'unverified');
    assert.equal(entry.meta?.chakraContent?.[chakraKey]?.bodySymbolStatus, 'omitted-no-verified-rule');
  }
  for (const chakraKey of ['sahasrara', 'ajna', 'vishuddha', 'anahata']) {
    for (const key of aspects) {
      assert.equal(typeof entry.chakras?.[chakraKey]?.[key], 'string', `${chakraKey} ${key} for Arcana ${id}`);
      assert.ok(entry.chakras[chakraKey][key].trim().length >= 45, `${chakraKey} ${key} has a developed draft for Arcana ${id}`);
    }
  }
  for (const chakraKey of ['svadhisthana', 'muladhara']) {
    for (const key of aspects) assert.equal(entry.chakras?.[chakraKey]?.[key] || '', '', `${chakraKey} remains unfilled for Arcana ${id}`);
  }
}

const loaderSource = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'matrix-loader.js'), 'utf8');
async function readWithStatuses(statuses, chakraKey) {
  const core = { arcana: Array.from({ length: 22 }, (_, index) => ({ id: index + 1, name: { ar: 'أركانا ' + (index + 1) } })), chakras: Array.from({ length: 22 }, () => ({})) };
  const fields = {
    psychology: 'نص عام للمراجعة.',
    physicsPsychology: 'نص الجسد الرمزي المنشور.',
    energyPsychology: 'نص الطاقة الرمزي المنشور.',
    emotionsPsychology: 'نص المشاعر الرمزي المنشور.'
  };
  const record = {
    id: 7,
    meta: { chakraContent: Object.fromEntries(Object.entries(statuses).map(([key, status]) => [key, { status }])) },
    chakras: Object.fromEntries(Object.keys(statuses).map(key => [key, fields]))
  };
  const context = {
    window: {},
    fetch: async url => ({
      ok: true,
      json: async () => url.includes('core.json') ? core : record
    })
  };
  vm.runInNewContext(loaderSource, context);
  return context.window.AqeeqMatrix.chakraText(7, chakraKey);
}
(async () => {
  const statuses = { sahasrara: 'published', ajna: 'partial-review', vishuddha: 'partial-review', anahata: 'partial-review', manipura: 'partial-review' };
  const hiddenVishuddha = await readWithStatuses(statuses, 'vishuddha');
  assert.equal(hiddenVishuddha.empty, true, 'Vishuddha draft remains hidden while unpublished even if Sahasrara is published');
  assert.equal(Object.keys(hiddenVishuddha.fields).length, 0);

  const publishedVishuddha = await readWithStatuses({ ...statuses, vishuddha: 'published' }, 'vishuddha');
  assert.equal(publishedVishuddha.empty, false, 'Vishuddha loads only after its own explicit publication');
  assert.equal(publishedVishuddha.fields.physicsPsychology, 'نص الجسد الرمزي المنشور.');
  assert.equal(publishedVishuddha.fields.energyPsychology, 'نص الطاقة الرمزي المنشور.');
  assert.equal(publishedVishuddha.fields.emotionsPsychology, 'نص المشاعر الرمزي المنشور.');

  const hiddenManipura = await readWithStatuses(statuses, 'manipura');
  assert.equal(hiddenManipura.empty, true, 'Manipura draft remains hidden while unpublished');
  const publishedManipura = await readWithStatuses({ ...statuses, manipura: 'published' }, 'manipura');
  assert.equal(publishedManipura.empty, false, 'Manipura loads only after its own explicit publication');
  console.log('Matrix chakra contract passed: all five reviewed chakra drafts contain the three required aspects; publication remains independently gated per chakra.');
})().catch(error => { console.error(error); process.exitCode = 1; });
