const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const sectionsDir = path.join(root, 'assets', 'data', 'matrix', 'sections');
const loaderSource = fs.readFileSync(path.join(root, 'assets', 'js', 'matrix-loader.js'), 'utf8');

const NAMES = ['center', 'talents', 'love_line', 'money_line', 'father_line', 'mother_line',
  'ancestral_programs', 'purposes', 'children_line', 'transformation_rx', 'composite_programs'];
const read = name => JSON.parse(fs.readFileSync(path.join(sectionsDir, name + '.json'), 'utf8'));

function makeLoader() {
  const requested = [];
  const context = {
    window: {},
    fetch: async url => {
      requested.push(url);
      const m = /sections\/([a-z_]+)\.json/.exec(url);
      if (!m || !NAMES.includes(m[1])) return { ok: false, status: 404, json: async () => ({}) };
      return { ok: true, json: async () => read(m[1]) };
    }
  };
  vm.runInNewContext(loaderSource, context);
  return { api: context.window.AqeeqMatrix, requested };
}

for (const name of NAMES) {
  const d = read(name);
  assert.equal(d.schemaVersion, 2, name + ' schemaVersion');
  assert.equal(d.section, name, name + ' section');
  const missing = d.missingIds || [];
  if (name === 'composite_programs') {
    assert.ok(d.entries.length > 0 && d.entries.every(e => /^\d+-\d+-\d+$/.test(e.code)), name + ' codes');
    continue;
  }
  const expected = Array.from({ length: 22 }, (_, i) => i + 1).filter(n => !missing.includes(n));
  assert.deepEqual(d.entries.map(e => e.id), expected, name + ' ids match 22 minus missingIds');
  for (const e of d.entries) {
    assert.ok(e.summary && e.summary.trim(), `${name}/${e.id} summary`);
    assert.ok(e.deep && typeof e.deep === 'object', `${name}/${e.id} deep`);
    assert.ok(!/[<>]/.test(JSON.stringify(e)), `${name}/${e.id} has no HTML tags`);
    if (e.genderDynamic) {
      assert.ok(e.genderDynamic.female && e.genderDynamic.male, `${name}/${e.id} genderDynamic has both voices`);
    }
  }
}

// الأقسام المؤلَّفة بعد المراجعة: review (مش draft) وتفضل مصنفة authored.
for (const name of ['father_line', 'mother_line']) {
  assert.ok(read(name).entries.every(e => e.meta.status === 'ready' && e.meta.source === 'authored'), name + ' is a ready authored section');
}

(async () => {
  const { api, requested } = makeLoader();
  assert.equal(requested.length, 0, 'nothing is fetched before an accordion opens');

  const center = await api.section('center');
  assert.equal(center.section, 'center');
  assert.deepEqual(requested.length, 1, 'one request for the first section');
  await api.section('center');
  assert.equal(requested.length, 1, 'section() is cached per file');

  const e9 = await api.sectionEntry('center', 9);
  assert.equal(e9.id, 9);
  const anc17 = await api.sectionEntry('ancestral_programs', 17);
  assert.equal(anc17 && anc17.id, 17, 'ancestral_programs covers arcana 17');
  assert.equal((await api.sectionEntry('purposes', 17)).id, 17, 'purposes covers arcana 17');
  assert.equal((await api.sectionEntry('children_line', 22)).id, 22, 'children_line covers arcana 22');
  assert.equal(await api.sectionEntry('composite_programs', 22), null, 'an id with no entry resolves to null, not an error');

  await assert.rejects(() => api.section('../core'), err => /قسم غير معروف/.test(err.message), 'only whitelisted section names are loadable');
  // الـ RangeError بييجي من context تاني (vm)، فنقارن بالاسم مش بالـ instanceof.
  await assert.rejects(() => api.sectionEntry('center', 23), err => err.name === 'RangeError', 'arcana id must be 1..22');
  console.log('matrix sections wiring: ok');
})().catch(err => { console.error(err); process.exit(1); });
