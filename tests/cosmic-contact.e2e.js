// إزالة واتساب/التواصل + خلفية كونية (مجرات/كواكب/كوكبات) بدون شهب
const { chromium } = require('playwright');
const fetch_ = (u) => new Promise((res) => require('http').get(u, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(d)); }));
const BASE = 'http://127.0.0.1:8765';
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  await p.goto(BASE + '/index.html'); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    wa: document.querySelectorAll('[data-wa], a[href*="wa.me"]:not(#acct-whatsapp-support)').length,
    book: !!document.getElementById('book'), how: !!document.getElementById('how'),
    bnav: [...document.querySelectorAll('.bnav a')].map((a) => a.getAttribute('href')),
    card: [...document.querySelectorAll('.card')].some((c) => /تواصل معايا/.test(c.textContent)),
    hdr: /واتساب/.test(document.querySelector('header.top').textContent),
    cosmos: !!document.getElementById('cosmos-bg'), cw: document.getElementById('cosmos-bg') && document.getElementById('cosmos-bg').width,
    rings: document.querySelectorAll('#sky-layer .ring').length,
  }));
  ok(r.wa === 0 && !r.hdr && !r.card, 'no WhatsApp buttons / header button / contact card: ' + JSON.stringify(r));
  ok(!r.book && !r.how, '#book and #how sections removed');
  ok(!r.bnav.includes('#book') && r.bnav.length === 3, 'bottom nav without contact: ' + r.bnav);
  ok(r.cosmos && r.cw > 0 && r.rings === 0, 'cosmos canvas present, old orbit planets removed');
  // الكانفس فيه بكسلات فعلاً (مجرات/كواكب)
  await p.waitForTimeout(800);
  const painted = await p.evaluate(() => { const c = document.getElementById('cosmos-bg'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 10) n++; return n; });
  ok(painted > 200, 'cosmos canvas drew galaxies/planets: ' + painted);
  // الحركة: الكانفس لازم يتغير بوضوح خلال ثواني (كواكب ومجرات بتتحرك)
  const snap = () => p.evaluate(() => { const c = document.getElementById('cosmos-bg'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, out = []; for (let i = 3; i < d.length; i += 4 * 53) out.push(d[i]); return out; });
  const s1 = await snap(); await p.waitForTimeout(4000); const s2 = await snap();
  let diff = 0; for (let i = 0; i < s1.length; i++) if (Math.abs(s1[i] - s2[i]) > 6) diff++;
  ok(diff > 40, 'planets/galaxies actually move (changed samples: ' + diff + ')');
  // أسماء الكواكب مش بتتكتب في الخلفية
  ok(!/fillText/.test(await (await fetch_(BASE + '/assets/js/cosmic-background.js'))), 'no text drawn on the cosmos canvas');
  // لا شهب: ما فيش متغير shoot بيتولد ولا خطوط حركة
  ok(!(await p.evaluate(() => /shoot\s*=\s*\{/.test(document.documentElement.innerHTML))) , 'no shooting-star spawn code left');
  // كوكبات الأبراج
  const n = await p.evaluate(() => window.AqeeqCosmos.constellations.length);
  ok(n === 12, '12 constellations defined');
  await p.evaluate(() => { location.hash = '#signs'; }); await p.waitForTimeout(600);
  const names = [];
  for (let i = 0; i < 12; i++) {
    await p.evaluate((i) => document.querySelectorAll('#picker button')[i].click(), i); await p.waitForTimeout(150);
    names.push(await p.evaluate(() => { const t = document.querySelector('.const-bg .cb-name'); return [t && t.textContent, document.querySelectorAll('.const-bg .cb-star').length, document.querySelectorAll('.const-bg .cb-line').length]; }));
  }
  ok(names.every((x) => x[0] && x[1] >= 4 && x[2] >= 3), 'each sign shows its constellation: ' + names.map((x) => x[0]).join(' | '));
  const rulers = [];
  for (let i = 0; i < 12; i++) { await p.evaluate((i) => document.querySelectorAll('#picker button')[i].click(), i); await p.waitForTimeout(80); rulers.push(await p.evaluate(() => (document.querySelector('.const-bg .cb-ruler') || {}).dataset && document.querySelector('.const-bg .cb-ruler').dataset.ruler)); }
  ok(rulers.join(',') === 'mars,venus,mercury,moon,sun,mercury,venus,pluto,jupiter,saturn,uranus,neptune', 'ruling planet shown per sign: ' + rulers.join(','));
  ok((await p.textContent('#panel .const-cap')).includes('الكوكب الحاكم'), 'caption names the ruling planet');
  ok(names[4][0].includes('Leo') && names[7][0].includes('Scorpius'), 'Leo/Scorpius mapped correctly');
  // wheel click path
  await p.evaluate(() => { location.hash = '#home'; }); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelectorAll('.wg')[5].dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(500);
  ok((await p.textContent('.const-bg .cb-name')).includes('Virgo') && (await p.textContent('#panel .const-cap')).includes('Virgo'), 'tapping wheel sign (Virgo) shows its constellation + caption in panel');
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
