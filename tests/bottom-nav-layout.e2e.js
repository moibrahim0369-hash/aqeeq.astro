'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
      const page = await browser.newPage({ viewport });
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });

      const nav = page.locator('nav.bnav');
      await nav.waitFor({ state: 'visible' });
      const navBox = await nav.boundingBox();
      assert.ok(navBox, 'Bottom navigation must have a rendered box');
      assert.ok(navBox.width < viewport.width, 'Bottom navigation must float with side margins');
      assert.ok(Math.abs((navBox.x + navBox.width / 2) - viewport.width / 2) <= 1,
        'Bottom navigation must be horizontally centered');
      assert.ok(viewport.height - (navBox.y + navBox.height) >= 10,
        'Bottom navigation must sit above the viewport bottom');

      const links = nav.locator('a');
      assert.equal(await links.count(), 3, 'All three existing navigation destinations must remain');
      for (let index = 0; index < await links.count(); index += 1) {
        const link = links.nth(index);
        const icon = link.locator('svg');
        const label = link.locator('.bnav-label');
        assert.ok(await icon.isVisible(), 'Each navigation item must retain its icon');
        assert.ok(await label.isVisible(), 'Each navigation item must retain its label');
        const iconBox = await icon.boundingBox();
        const labelBox = await label.boundingBox();
        assert.ok(Math.abs((iconBox.x + iconBox.width / 2) - (labelBox.x + labelBox.width / 2)) <= 1,
          'Navigation icon and label must share a center line');
      }

      const firstCard = page.locator('a.card:visible').first();
      if (await firstCard.count()) {
        await firstCard.scrollIntoViewIfNeeded();
        const cardBox = await firstCard.boundingBox();
        const iconBox = await firstCard.locator('.ic').boundingBox();
        assert.ok(cardBox && iconBox, 'Tool card and icon must be rendered');
        assert.ok(Math.abs((cardBox.x + cardBox.width / 2) - (iconBox.x + iconBox.width / 2)) <= 2,
          'Tool-card icon must be horizontally centered');
        const iconMarginBottom = await firstCard.locator('.ic').evaluate(element =>
          Number.parseFloat(getComputedStyle(element).marginBottom)
        );
        assert.equal(iconMarginBottom, 0, 'Tool-card icon must not be pushed down by a bottom margin');
      }

      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const footerCopy = page.locator('.foot .copy');
      if (await footerCopy.count()) {
        const footerIsClear = await page.evaluate(() => {
          const copy = document.querySelector('.foot .copy');
          const dock = document.querySelector('nav.bnav');
          if (!copy || !dock) return true;
          return copy.getBoundingClientRect().bottom <= dock.getBoundingClientRect().top;
        });
        assert.ok(footerIsClear,
          'Footer copyright text must not be covered by the floating navigation');
      }

      assert.deepEqual(pageErrors, [], 'Page must not emit uncaught JavaScript errors');
      await page.close();
    }
    console.log('Bottom navigation and tool-card alignment E2E passed at 390px and 1280px.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
