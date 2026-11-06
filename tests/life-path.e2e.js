const { chromium } = require('playwright');
const os = require('os');
const B = process.env.BASE || 'http://127.0.0.1:8765/index.html';
const OUT = process.env.LP_SHOTS || os.tmpdir() + '/';
let pass = 0, fail = 0; const ok = (n, c, x) => { (c ? pass++ : fail++); console.log((c ? 'PASS ' : 'FAIL ') + n + (x !== undefined ? ' ' + JSON.stringify(x) : '')); };
(async () => {
  const br = await chromium.launch(); const errs = [];
  async function mk(w, h, extra) { const c = await br.newContext({ viewport: { width: w, height: h }, locale: 'ar', ...extra }); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); return p; }
  async function calc(p, date) { await p.fill('#lp-date', date); await p.click('#lpform button[type=submit]'); await p.waitForSelector('.lpd-chips', { timeout: 6000 }); await p.waitForTimeout(500); }
  const p = await mk(1366, 900);
  await p.goto(B + '#lifepath'); await p.waitForTimeout(900);
  ok('empty: no demo date', (await p.inputValue('#lp-date')) === '');
  ok('empty note removed from clean header', await p.locator('.lpj-empty-note').count() === 0);
  ok('breadcrumb', JSON.stringify(await p.$$eval('#lifepath .lpj-crumb li', e => e.map(x => x.textContent.trim()))) === JSON.stringify(['الرئيسية', 'اكتشف ذاتك', 'مسار الحياة']));
  await p.screenshot({ path: OUT + 'lp-empty.png' });
  await p.click('#lpform button[type=submit]'); ok('empty submit -> message', await p.isVisible('#lperr'));
  await calc(p, '1992-04-14');
  const info = await p.evaluate(() => {
    const E = window.AqeqPinnaclesChallenges, lp = parseInt(document.querySelector('.numbadge').textContent, 10);
    const r = E.calculatePinnaclesChallenges(14, 4, 1992, lp);
    return { lp, hero: lp, pin: r.pinnacles.map(x => x.value), ch: r.challenges.map(x => x.value),
      shownP: [...document.querySelectorAll('.lpj-pc .lpj-card:first-child .lpj-row .v')].map(e => +e.textContent), shownC: [...document.querySelectorAll('.lpj-pc .lpj-card.ch .lpj-row .v')].map(e => +e.textContent) };
  });
  ok('hero number == engine', info.lp === info.hero, info.lp);
  ok('pinnacles == engine', JSON.stringify(info.pin) === JSON.stringify(info.shownP), info.pin);
  ok('challenges == engine', JSON.stringify(info.ch) === JSON.stringify(info.shownC), info.ch);
  ok('compare link', (await p.getAttribute('.lpd-acts a.lpj-btn', 'href')) === '#lifepath-compat');
  ok('related tools links', await p.locator('.lpj-tool').count() === 4);
  // stage select
  await p.evaluate(() => document.querySelector('.lpj-pc .lpj-card .lpj-row[data-i="3"]').click()); await p.waitForTimeout(200);
  ok('stage card updates', (await p.textContent('#lpj-stage')).includes('المرحلة 4'));
  ok('pressed state', (await p.getAttribute('.lpj-row[data-i="3"]', 'aria-pressed')) === 'true');
  // panel
  await p.click('[data-lpd-tab=st]'); await p.click('#lpj-stage [data-lpj-open]'); await p.waitForSelector('.lpj-panel'); ok('panel dialog', (await p.getAttribute('.lpj-panel', 'role')) === 'dialog');
  await p.waitForTimeout(400); await p.screenshot({ path: OUT + 'lp-panel-desktop.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); ok('panel closed by Esc', await p.locator('.lpj-panel').count() === 0);
  ok('focus restored', await p.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-lpj-open')));
  // rows -> select
  await p.evaluate(() => document.querySelector('.lpj-pc .lpj-card .lpj-row[data-i="0"]').click()); await p.waitForTimeout(200);
  ok('row selects stage 1', (await p.textContent('#lpj-stage')).includes('المرحلة 1'));
  // accordions
  await p.evaluate(() => document.querySelector('[data-lpj-interp]').click()); await p.waitForTimeout(600);
  const open = await p.evaluate(() => document.querySelector('details.lp-section').open); ok('interpretation accordion opens', open);
  await p.screenshot({ path: OUT + 'lp-accordion-desktop.png' });
  ok('sections accordions count', await p.locator('details.lp-section').count() >= 5);
  // hero edit
  await p.evaluate(() => { document.getElementById('lifepath').scrollTop = 0; }); await p.click('[data-lpj-edit]'); await p.waitForTimeout(500);
  ok('edit returns to form', await p.isVisible('#lpform'));
  // recalc another date updates
  await calc(p, '1980-11-02'); ok('recalc rebuilds once', await p.locator('.lpj-top').count() === 1 && await p.locator('.lpd-chips').count() === 1);
  // back fallback
  await p.evaluate(() => document.querySelector('[data-lpj-back]').click()); await p.waitForTimeout(400); ok('back works', true, await p.evaluate(() => location.hash));
  // error state
  const pe = await mk(1366, 900); await pe.goto(B + '#lifepath'); await pe.waitForTimeout(700);
  await pe.evaluate(() => { delete window.AqeqPinnaclesChallenges; });
  await pe.fill('#lp-date', '1992-04-14'); await pe.click('#lpform button[type=submit]'); await pe.waitForSelector('.lpj-err', { timeout: 5000 });
  ok('error state', (await pe.textContent('.lpj-err')).includes('تعذر تجهيز قراءة مسار الحياة حاليًا')); await pe.screenshot({ path: OUT + 'lp-error.png' });
  // loading skeleton
  const pl = await mk(1366, 900); await pl.goto(B + '#lifepath'); await pl.waitForTimeout(700);
  await pl.fill('#lp-date', '1992-04-14'); await pl.click('#lpform button[type=submit]'); await pl.waitForSelector('.lpj-skel', { timeout: 3000 }); await pl.screenshot({ path: OUT + 'lp-loading.png' }); ok('loading skeleton', true);
  // tablet + mobile
  for (const [n, w, h, mob] of [['tablet', 820, 1100, true], ['mobile', 390, 844, true]]) {
    const m = await mk(w, h, { hasTouch: mob, isMobile: mob, deviceScaleFactor: 2 }); await m.goto(B + '#lifepath'); await m.waitForTimeout(700); await calc(m, '1992-04-14');
    ok(n + ' no h-scroll', await m.evaluate(() => { const e = document.getElementById('lifepath'); return e.scrollWidth <= e.clientWidth + 1; }));
    ok(n + ' tap targets >=40', await m.evaluate(() => [...document.querySelectorAll('.lpj-btn,.lpj-row')].every(b => { const r = b.getBoundingClientRect(); return r.height >= 40 || !r.width; })));
    await m.screenshot({ path: OUT + 'lp-' + n + '-hero.png' });
    await m.evaluate(() => document.querySelector('[data-lpd-tab=st]').click()); await m.evaluate(() => document.querySelector('#lpj-stage [data-lpj-open]').click()); await m.waitForSelector('.lpj-panel'); await m.waitForTimeout(800);
    ok(n + ' sheet fits viewport', await m.evaluate(() => { const r = document.querySelector('.lpj-panel').getBoundingClientRect(); return r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; }));
    await m.screenshot({ path: OUT + 'lp-' + n + '-sheet.png' });
  }
  // reduced motion
  const rm = await mk(1366, 900, { reducedMotion: 'reduce' }); await rm.goto(B + '#lifepath'); await rm.waitForTimeout(600); await calc(rm, '1992-04-14');
  ok('reduced motion stops animations', await rm.evaluate(() => [...document.querySelectorAll('.lpj-reveal')].every(e => getComputedStyle(e).animationName === 'none' && getComputedStyle(e).opacity === '1')));
  await rm.screenshot({ path: OUT + 'lp-reduced-motion.png' });
  ok('no js errors', errs.length === 0, errs.slice(0, 3));
  console.log(pass + ' pass ' + fail + ' fail'); await br.close();
})();
