'use strict';
// Run against a local build, or BASE_URL=https://aqeeq.astro for the published page.
let chromium;
try { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')); }
catch (_) { ({ chromium } = require('/usr/share/code/resources/app/node_modules/playwright-core')); }
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
const base = process.env.BASE_URL || 'http://127.0.0.1:8777';
const root = path.join(__dirname, '..');
(async () => {
  let server, browser;
  try {
    if (!process.env.BASE_URL) {
      server = spawn('python3', ['-m', 'http.server', '8777', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
      for (let i = 0; i < 40; i++) { try { if ((await fetch(base)).ok) break; } catch (_) { } await new Promise(r => setTimeout(r, 100)); }
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, timezoneId: 'Africa/Cairo' });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    // No account, profile writes or third-party traffic needed for synthetic chart checks.
    await page.route('**/*', r => r.request().url().startsWith(base) || r.request().url().startsWith('data:') ? r.continue() : r.abort());
    await page.goto(base + '/index.html#astro-maps');
    await page.locator('.vh-pre [data-g="pratyantar"]').waitFor({ state: 'visible' });
    await page.locator('.vh-pre [data-g="pratyantar"]').click();
    await page.locator('#eam-b-date + .aq-ds .aq-ds-d').selectOption('1');
    await page.locator('#eam-b-date + .aq-ds .aq-ds-m').selectOption('1');
    await page.locator('#eam-b-date + .aq-ds .aq-ds-y').selectOption('2000');
    await page.locator('#eam-b-time + .aq-dsx .aq-dsx-h').selectOption('12');
    await page.locator('#eam-b-time + .aq-dsx .aq-dsx-mi').selectOption('0');
    await page.locator('#eam-b-time + .aq-dsx .aq-dsx-ap').selectOption('pm');
    await page.locator('#eam-form .geo-q').fill('القاهرة');
    await page.locator('#eam-form .geo-res [role=option]').first().click();
    await page.locator('#eam-form button[type="submit"]').click();
    await page.locator('#eam-result[data-vh="pratyantar"] .vpd-list li').first().waitFor({ state: 'visible', timeout: 20000 });
    assert.equal(await page.locator('.vpd-list li').count(), 9);
    assert.equal(await page.locator('.vpd-list .is-current').count(), 1);
    assert.equal(await page.locator('.vpd-zone').inputValue(), 'Africa/Cairo');
    const before = await page.locator('.vpd-list').innerText();
    await page.locator('.vpd-maha').selectOption('0');
    await page.locator('.vpd-antar').selectOption('4');
    assert.notEqual(await page.locator('.vpd-list').innerText(), before);
    assert.equal(await page.locator('.vpd-list li').count(), 9);
    await page.locator('.vpd-zone').selectOption('UTC');
    assert.ok((await page.locator('.vpd-zone-note').innerText()).includes('UTC'));
    await page.locator('.vpd-now').click();
    assert.equal(await page.locator('.vpd-list .is-current').count(), 1);
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: width > 600 ? 900 : 844 });
      await page.locator('.vpd').evaluate(e => { const sec = e.closest('#astro-maps'), title = e.closest('details'); sec.scrollTo({top:sec.scrollTop+title.getBoundingClientRect().top-sec.getBoundingClientRect().top-95,behavior:'instant'}); });
      await page.waitForTimeout(450);
      await page.screenshot({ path: '/downloads/pratyantar-' + width + '.png', fullPage: false });
      for (const [pos,name] of [[4,'middle'],[8,'end']]) { await page.locator('.vpd-list li').nth(pos).scrollIntoViewIfNeeded(); await page.screenshot({path:'/downloads/pratyantar-'+name+'-'+width+'.png'}); }
      const metrics = await page.locator('.vpd').evaluate(e => ({ w: e.clientWidth, scroll: e.scrollWidth, screen: innerWidth, right: e.getBoundingClientRect().right }));
      assert.ok(metrics.scroll <= metrics.w + 1, 'no card horizontal overflow at ' + width + JSON.stringify(metrics));
      assert.ok(metrics.right <= width + 1, 'card inside viewport');
      console.log('PASS viewport', width, metrics);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    // Back to hub, then reopen via the post-calculation tile, not only the pre-form route.
    await page.locator('#eam-result .vh-back').click();
    await page.locator('#eam-result .vh-hub [data-g="pratyantar"]').click();
    assert.equal(await page.locator('.vpd-list li').count(), 9);
    await page.locator('#eam-result .vh-back').click();
    await page.locator('#eam-result .vh-hub [data-g="dasha"]').click();
    await page.locator('#eam-result details[data-vh-g="dasha year"] > summary').click();
    await page.locator('.vh-sheet .vh-tm-go').click();
    assert.equal(await page.locator('.vh-sheet .vh-tm-dash li').count(), 3, 'time machine still shows all three levels');
    const unknownWarning = await page.evaluate(() => { const old = window.AqVedic.last.ch.known; window.AqVedic.last.ch.known = false; const card = window.AqPratyantar.createCard(); window.AqVedic.last.ch.known = old; return card.querySelector('.vpd-warning').textContent; });
    assert.ok(unknownWarning.includes('وقت الميلاد غير معروف'));
    assert.equal(errs.length, 0, 'no JS errors: ' + errs.join('; '));
    console.log('PASS hierarchy, UTC toggle, current period, tile routes, time machine, zero JS errors');
  } finally { if (browser) await browser.close(); if (server) server.kill(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
