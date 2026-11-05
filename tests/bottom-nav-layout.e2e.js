'use strict';
// الشريط السفلي (موبايل/تابلت <1100px): شريط ملتصق بعرض الشاشة كاملًا، 5 وجهات، أيقونة + عنوان متمركزان.
// على الديسكتوب (>=1100px) الشريط مخفي. التحقق على الواجهة الحالية (aqeeq-design-system.css §3).
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765/index.html';

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [
      { width: 320, height: 740 },
      { width: 360, height: 800 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 820, height: 1180 },
      { width: 1100, height: 800 },
      { width: 1280, height: 900 }
    ]) {
      const page = await browser.newPage({ viewport });
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);
      const nav = page.locator('nav.bnav');

      if (viewport.width >= 1100) {
        assert.equal(await nav.isVisible(), false, `Bottom nav must be hidden on desktop (${viewport.width}px)`);
        assert.deepEqual(pageErrors, [], 'No JS errors');
        await page.close();
        continue;
      }

      await nav.waitFor({ state: 'visible' });
      const box = await nav.boundingBox();
      assert.ok(box, 'Bottom navigation must have a rendered box');
      assert.ok(Math.abs(box.x) <= 1 && Math.abs(box.width - viewport.width) <= 1,
        `Bottom nav must span the full viewport width at ${viewport.width}px (x=${box.x}, w=${box.width})`);
      assert.ok(Math.abs(viewport.height - (box.y + box.height)) <= 1, 'Bottom nav must be docked to the viewport bottom');
      assert.ok(box.height <= viewport.height * 0.15, 'Bottom nav must not exceed 15% of the viewport height');
      const st = await nav.evaluate(el => ({ position: getComputedStyle(el).position, z: getComputedStyle(el).zIndex }));
      assert.equal(st.position, 'fixed', 'Bottom nav must remain fixed');
      assert.equal(st.z, '130', 'Bottom nav must keep the design-system stacking order');

      const pg = await page.evaluate(() => ({
        sb: getComputedStyle(document.documentElement).scrollBehavior,
        pb: Number.parseFloat(getComputedStyle(document.body).paddingBottom)
      }));
      assert.equal(pg.sb, 'smooth', 'Page scrolling must remain smooth');
      assert.ok(pg.pb >= 64, 'Page must reserve at least the nav height below its content');

      const links = nav.locator('.bnav-item');
      assert.equal(await links.count(), 5, 'Exactly five navigation destinations');
      for (let i = 0; i < 5; i += 1) {
        const link = links.nth(i);
        const lb = await link.boundingBox();
        assert.ok(lb.x >= -1 && lb.x + lb.width <= viewport.width + 1, `Nav item ${i} must be inside the viewport`);
        const icon = link.locator('svg'), label = link.locator('.bnav-label');
        assert.ok(await icon.isVisible(), 'Each item keeps its icon');
        assert.ok(await label.isVisible(), 'Each item keeps its label');
        const ib = await icon.boundingBox(), tb = await label.boundingBox();
        assert.ok(Math.abs((ib.x + ib.width / 2) - (tb.x + tb.width / 2)) <= 1.5, 'Icon and label share a center line');
        assert.ok(tb.x >= lb.x - 1 && tb.x + tb.width <= lb.x + lb.width + 1, `Label ${i} must not overflow its item at ${viewport.width}px`);
      }

      assert.deepEqual(pageErrors, [], 'Page must not emit uncaught JavaScript errors');
      await page.close();
    }
    console.log('Bottom navigation E2E passed at 320/360/390/430/820 (docked bar) and 1280 (hidden).');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
