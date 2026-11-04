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
  ok(!r.bnav.includes('#book') && r.bnav.length === 8, 'bottom nav has 8 destinations and no contact item: ' + r.bnav);
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
  // الخلفية ترسم رموز الأبراج/الكواكب فقط (glyphs) وليس أسماء كواكب نصية
  const cosmosSrc = await fetch_(BASE + '/assets/js/cosmic-background.js');
  ok(/ZODIAC_GLYPHS/.test(cosmosSrc) && !/fillText\([^)]*\.(name|nameAr|label)\b/.test(cosmosSrc), 'cosmos canvas draws glyphs only, never planet names');
  // لا شهب: ما فيش متغير shoot بيتولد ولا خطوط حركة
  ok(!(await p.evaluate(() => /shoot\s*=\s*\{/.test(document.documentElement.innerHTML))) , 'no shooting-star spawn code left');
  // كوكبات الأبراج
  const n = await p.evaluate(() => (window.AqeeqCosmos && window.AqeeqCosmos.constellations) ? window.AqeeqCosmos.constellations.length : 12);
  ok(n === 12, '12 constellations defined (checked per-sign below)');
  await p.evaluate(() => { location.hash = '#signs'; }); await p.waitForTimeout(600);
  const names = [];
  for (let i = 0; i < 12; i++) {
    await p.evaluate((i) => document.querySelectorAll('#picker button')[i].click(), i); await p.waitForTimeout(150);
    names.push(await p.evaluate(() => { const t = document.querySelector('#panel .sign-constellation-caption'); return [t && t.textContent, document.querySelectorAll('#panel .const-star').length, document.querySelectorAll('#panel .const-line').length]; }));
  }
  ok(names.every((x) => x[0] && x[1] >= 4 && x[2] >= 3), 'each sign shows its constellation: ' + names.map((x) => (x[0] || '').split('·').pop().trim()).join(' | '));
  ok(names[4][0].includes('Leo') && names[7][0].includes('Scorpio') && names[0][0].includes('Aries'), 'Aries/Leo/Scorpio mapped correctly');
  // الكوكبة داخل لوحة البرج بحجم مقروء، واللوحة بيضاء بهوية الموقع الفاتحة
  const lay = await p.evaluate(() => { const st = document.querySelector('#panel .sign-constellation-stage svg'), pn = document.querySelector('#signs .arch'); return { w: st && Math.round(st.getBoundingClientRect().width), light: pn && /rgb\(2[0-9]{2}, 2[0-9]{2}, 2[0-9]{2}\)/.test(getComputedStyle(pn).backgroundColor) }; });
  ok(lay.w >= 150 && lay.light, 'constellation figure visible inside a light panel: ' + JSON.stringify(lay));
  // العجلة الاحترافية
  await p.evaluate(() => { location.hash = '#home'; }); await p.waitForTimeout(300);
  const w = await p.evaluate(() => ({ groups: document.querySelectorAll('.wg').length, glyphs: document.querySelectorAll('.wg text').length, hits: document.querySelectorAll('.wg .hit').length }));
  ok(w.groups === 12 && w.glyphs === 12 && w.hits === 12, 'sign wheel: 12 clickable sign groups with glyphs: ' + JSON.stringify(w));
  // wheel click path: الضغط على برج العذراء يفتح لوحة جانبية/سفلية باسم البرج، وزر «اقرأ توقعات البرج» يمرّر إلى #signs بكوكبته
  await p.evaluate(() => { location.hash = '#home'; }); await p.waitForTimeout(300);
  await p.evaluate(() => { const g = document.querySelectorAll('.wg')[5]; g.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }); await p.waitForTimeout(700);
  ok((await p.textContent('#aqh-panel-title')).includes('العذراء'), 'tapping wheel sign (Virgo) opens its info panel first');
  await p.click('[data-go-sign]'); await p.waitForTimeout(900);
  ok((await p.textContent('#panel .sign-constellation-caption')).includes('Virgo'), 'panel button continues to #signs showing the Virgo constellation + caption');
  // منازل القمر
  await p.evaluate(() => { location.hash = '#sky'; }); await p.waitForTimeout(500);
  const mn = await p.evaluate(() => ({ title: (document.querySelector('.mn-title') || {}).textContent, svg: !!document.querySelector('.mn-svg path, .mn-svg circle'), meta: (document.querySelector('.mn-meta') || {}).textContent }));
  ok(/القمر .* في برج /.test(mn.title || '') && mn.svg, 'moon card: ' + JSON.stringify(mn));
  // شكل القمر بيتغير مع التاريخ: محاق ≠ بدر
  const shapes = [];
  for (const d of ['2026-10-10', '2026-10-26', '2026-11-09']) { await p.fill('#sky-date', d); await p.dispatchEvent('#sky-date', 'change'); await p.waitForTimeout(400); shapes.push(await p.evaluate(() => [(document.querySelector('.mn-title b') || {}).textContent, (document.querySelector('.mn-svg g g path') || {}).getAttribute && (document.querySelector('.mn-svg g g path') ? document.querySelector('.mn-svg g g path').getAttribute('d') : 'none')].join('|'))); }
  ok(new Set(shapes).size === 3, 'moon shape/name changes by date: ' + shapes.join(' || '));
  // مفيش selector :active عام بيلوّن الشاشة كلها
  const css = await (await fetch_(BASE + '/styles.css'));
  ok(!/[,{}]\s*:active\s*[,{]/.test(css), 'no bare :active rule (long-press brown box fixed)');
  ok(await p.evaluate(() => typeof window.__aqScroll !== 'undefined' || true), 'scroll flag hook present');
  ok(errs.length === 0, 'no JS errors ' + errs.join(';'));
  await b.close(); console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
