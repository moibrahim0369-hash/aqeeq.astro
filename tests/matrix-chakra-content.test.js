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
  assert.equal(entry.meta?.chakraContent?.status, 'partial-review');
  assert.equal(entry.meta?.chakraContent?.authorship, 'aqeeq-original');
  assert.equal(entry.meta?.chakraContent?.referenceRuleStatus, 'unverified');
  assert.equal(entry.meta?.chakraContent?.bodySymbolStatus, 'omitted-no-verified-rule');
  for (const key of aspects) {
    assert.equal(typeof entry.chakras?.sahasrara?.[key], 'string', `Sahasrara ${key} for Arcana ${id}`);
    assert.ok(entry.chakras.sahasrara[key].trim().length >= 45, `Sahasrara ${key} has a developed draft for Arcana ${id}`);
  }
  for (const chakraKey of ['ajna', 'vishuddha', 'anahata', 'manipura', 'svadhisthana', 'muladhara']) {
    for (const key of aspects) assert.equal(entry.chakras?.[chakraKey]?.[key] || '', '', `${chakraKey} remains unfilled for Arcana ${id}`);
  }
}

const loaderSource = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'matrix-loader.js'), 'utf8');
async function readWithStatus(status) {
  const core = { arcana: Array.from({ length: 22 }, (_, index) => ({ id: index + 1, name: { ar: 'أركانا ' + (index + 1) } })), chakras: Array.from({ length: 22 }, () => ({})) };
  const record = {
    id: 7,
    meta: { chakraContent: { status } },
    chakras: { sahasrara: {
      psychology: 'نص عام منشور.',
      physicsPsychology: 'نص الجسد المنشور.',
      energyPsychology: 'نص الطاقة المنشور.',
      emotionsPsychology: 'نص المشاعر المنشور.'
    } }
  };
  const context = {
    window: {},
    fetch: async url => ({
      ok: true,
      json: async () => url.includes('core.json') ? core : record
    })
  };
  vm.runInNewContext(loaderSource, context);
  return context.window.AqeeqMatrix.chakraText(7, 'sahasrara');
}
(async () => {
  const review = await readWithStatus('partial-review');
  assert.equal(review.empty, true, 'review-only content is hidden from the UI loader');
  assert.equal(Object.keys(review.fields).length, 0);

  const published = await readWithStatus('published');
  assert.equal(published.empty, false);
  assert.equal(published.fields.psychology, 'نص عام منشور.', 'legacy generic fields remain supported after publication');
  assert.equal(published.fields.physicsPsychology, 'نص الجسد المنشور.');
  assert.equal(published.fields.energyPsychology, 'نص الطاقة المنشور.');
  assert.equal(published.fields.emotionsPsychology, 'نص المشاعر المنشور.');
  console.log('Matrix chakra contract passed: 22 review-only Sahasrara drafts; unpublished text remains hidden; published legacy and aspect fields resolve correctly.');
})().catch(error => { console.error(error); process.exitCode = 1; });
