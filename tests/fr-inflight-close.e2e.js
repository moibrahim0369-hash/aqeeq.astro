// اختبار محلي بمكتبة supabase-js الحقيقية وتوقيتها الواقعي: جلسة مزروعة في localStorage
// وكل طلبات supabase.co تُعترض محليًا (لا يصل أي بايت للحساب الحي). بيانات خيالية.
// A) نموذج الملف الحقيقي → upsert + كاش المنصة + تعبئة حقول الحاسبات (f/lp/m).
// B) رحلة أول دخول (first-run.js) → جسر الحفظ عبر النموذج الحقيقي → نجاح + تعبئة.
let chromium;
try { chromium = require('playwright-core').chromium; } catch (e) { chromium = require(process.env.AQ_PW || '/tmp/node_modules/playwright-core').chromium; }
const fs = require('fs');
const BASE = process.env.AQ_BASE || 'http://127.0.0.1:8765';
const PAGE = process.env.AQ_PAGE || 'index.src.html'; // المصادر غير المحزومة: تطابق كود المستودع الحالي
const REF = 'trcveoewbxqzhhvzawxy';
const USER = {
  id: 'demo-user-1', aud: 'authenticated', role: 'authenticated', email: 'demo@example.com',
  email_confirmed_at: '2026-01-01T00:00:00Z', created_at: '2026-01-01T00:00:00Z',
  app_metadata: { provider: 'email' }, user_metadata: { full_name: 'سارة المنصور' }
};
const SESSION = {
  access_token: 'demo.' + Buffer.from('{"sub":"demo-user-1"}').toString('base64') + '.x',
  refresh_token: 'demo-refresh', token_type: 'bearer', expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600, user: USER
};
let fail = 0;
const ok = (c, m) => { if (!c) fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

(async () => {
  const b = await chromium.launch({ executablePath: process.env.AQ_CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });

  async function stubbedPage(captured) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    p.errs = [];
    p.on('pageerror', (e) => p.errs.push(e.message));
    await p.addInitScript(([k, s]) => { try { localStorage.setItem(k, JSON.stringify(s)); } catch (e) {} }, ['sb-' + REF + '-auth-token', SESSION]);
    await p.route('**/*', async (r) => {
      const u = r.request().url();
      /* تحميل واحد حقيقي: نخدم المصدر مع سطرَي الربط كما سيكون بعد الدمج، بلا حقن إضافي */
      if (u === BASE + '/' + PAGE) {
        let html = fs.readFileSync(require('path').join(__dirname, '..', PAGE), 'utf8');
        html = html.includes('assets/css/first-run.css') ? html : html.replace('<link rel="stylesheet" href="assets/css/onboard.css?v=1">', '<link rel="stylesheet" href="assets/css/onboard.css?v=1">\n<link rel="stylesheet" href="assets/css/first-run.css?v=1">');
        html = html.includes('assets/js/first-run.js') ? html : html.replace('<script src="assets/js/you-onboard.js?v=1" defer></script>', '<script src="assets/js/you-onboard.js?v=1" defer></script>\n<script src="assets/js/first-run.js?v=1" defer></script>');
        return r.fulfill({ status: 200, contentType: 'text/html', body: html });
      }
      if (u.startsWith(BASE) || u.includes('cdn.jsdelivr.net')) return r.continue();
      if (u.includes(REF + '.supabase.co')) {
        const req = r.request();
        const wantsObject = (req.headers()['accept'] || '').includes('vnd.pgrst.object+json');
        if (u.includes('/rest/v1/profiles')) {
          if (req.method() === 'GET' || req.method() === 'HEAD') {
            if (wantsObject) {
              return captured.row
                ? r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(captured.row) })
                : r.fulfill({ status: 406, contentType: 'application/json', body: '{"code":"PGRST116","message":"JSON object requested, multiple (or no) rows returned"}' });
            }
            return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'content-range': '0-0/1' }, body: captured.row ? JSON.stringify([captured.row]) : '[]' });
          }
          let body = null; try { body = req.postDataJSON(); } catch (e) { try { body = JSON.parse(req.postData() || 'null'); } catch (e2) {} }
          if (body && body.birth_date) { captured.requests = (captured.requests || 0) + 1; if (captured.hold) await new Promise(res => { captured.release = res; }); if (captured.delay) await new Promise(res=>setTimeout(res,captured.delay)); if (captured.fail) { captured.upserts.push(body); return r.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'test rejected'})}); } }
          if (body) { captured.upserts.push(body); captured.row = Object.assign({}, captured.row || { id: USER.id }, body); }
          return r.fulfill({ status: 201, contentType: 'application/json', body: wantsObject ? JSON.stringify(captured.row || {}) : JSON.stringify([captured.row || {}]) });
        }
        if (u.includes('/auth/v1/user')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) });
        if (u.includes('/auth/v1/token')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SESSION) });
        if (u.includes('/rest/v1/')) return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        if (u.includes('/functions/')) return r.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
        return r.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
      return r.abort();
    });
    return p;
  }
  const cache = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('aqeeq_profile_cache_v1') || 'null'));
  const fields = (p) => p.evaluate(() => ({
    fName: document.getElementById('f-name')?.value, fDate: document.getElementById('f-date')?.value,
    fTime: document.getElementById('f-time')?.value, fUnk: document.getElementById('f-unknown')?.checked,
    fCity: document.getElementById('f-city')?.value, fCityText: document.getElementById('f-city')?.selectedOptions[0]?.textContent, zsys: !!document.getElementById('f-zodiac-sys'),
    lpName: document.getElementById('lp-name')?.value, lpDate: document.getElementById('lp-date')?.value,
    mName: document.getElementById('m-name')?.value, mDate: document.getElementById('m-date')?.value
  }));
  async function waitForm(p, ms) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const st = await p.evaluate(() => {
        const f = document.getElementById('profile-first-name');
        return f ? { found: true, visible: !!f.offsetParent } : { found: false };
      });
      if (st.found) return st;
      await p.waitForTimeout(400);
    }
    return { found: false };
  }

  /* ---------- B) رحلة أول دخول كاملة عبر الجسر ---------- */
  for (const mode of ['inflight-close']) {
    const cap = { upserts: [], row: null, delay: mode==='late-success'?17000:0, hold: mode!=='late-success', fail:mode==='failure' };
    const p = await stubbedPage(cap);
    await p.goto(BASE + '/' + PAGE);
    /* الرحلة تفتح التعريف لأول مرة؛ نتخطاه أو نتقدمه حتى نموذج البيانات */
    const t0 = Date.now();
    let formOpen = false;
    while (Date.now() - t0 < 25000) {
      const st = await p.evaluate(() => ({
        form: !!document.getElementById('fr-save'),
        skip: !!document.getElementById('fr-skip') && !!document.getElementById('fr-skip').offsetParent,
        next: !!document.getElementById('fr-next')
      }));
      if (st.form) { formOpen = true; break; }
      if (st.skip) { await p.click('#fr-skip').catch(() => {}); await p.waitForTimeout(1000); continue; }
      if (st.next) { await p.click('#fr-next').catch(() => {}); await p.waitForTimeout(700); continue; }
      await p.waitForTimeout(700);
    }
    if (!formOpen) {
      const dbg = await p.evaluate(() => ({
        hash: location.hash, journey: sessionStorage.getItem('aq-fr-journey-v1'),
        aq: !!(window.AqSession && window.AqSession.user),
        frRoot: !!document.getElementById('aq-fr'),
        frEls: [...document.querySelectorAll('[id^="fr-"]')].map((e) => e.id).slice(0, 14),
        seen: localStorage.getItem('aq-fr-seen-v1')
      })).catch((e) => String(e));
      console.log('   B debug:', JSON.stringify(dbg));
    }
    ok(formOpen, 'B: journey data form opened');
    if (formOpen) {
      await p.evaluate(() => {
        const set = (id, v) => { const e = document.getElementById(id); if (!e) return; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
        set('fr-first', 'سارة'); set('fr-last', 'المنصور');
        set('fr-d', '14'); set('fr-m', '3'); set('fr-y', '1996');
        set('fr-h', '09'); set('fr-i', '45');
        const c = document.getElementById('fr-country'); if (c) { c.value = 'مصر'; c.dispatchEvent(new Event('change', { bubbles: true })); }
        const ci = document.getElementById('fr-city'); if (ci) { ci.value = 'القاهرة'; ci.dispatchEvent(new Event('change', { bubbles: true })); }
      });
      await p.waitForTimeout(300);
      await p.click('#fr-save');
      await p.evaluate(()=>{document.querySelector('#fr-save').click();document.querySelector('#profile-completion-form').requestSubmit()});
      for (let wait=0;wait<150 && !cap.requests;wait++) await p.waitForTimeout(20);
      ok(cap.requests===1,'pending: duplicate button/form submissions do not start a second request');
      if (mode==='failure') cap.release();
      if(mode==='late-success') {
        await p.waitForTimeout(15500);
        ok(await p.locator('#fr-save').isDisabled(),'late: button stays disabled after 15s');
        ok((await p.locator('#aq-fr').textContent()).includes('أطول من المعتاد'),'late: pending notice, not failure');
        ok(await p.locator('.fr-done-title').count()===0,'late: no premature success');
        await p.waitForSelector('.fr-done-title',{timeout:6000});
        ok(cap.upserts.filter(x=>x.birth_date).length===1,'late: exactly one upsert and eventual success');
      } else if(mode==='failure') {
        await p.waitForTimeout(1000);
        ok(!(await p.locator('#fr-save').isDisabled()),'failure: explicit rejection enables manual retry');
        ok(await p.locator('.fr-done-title').count()===0,'failure: no success screen');
        ok(cap.upserts.filter(x=>x.birth_date).length===1,'failure: one rejected attempt');
      } else {
        await p.waitForTimeout(400);await p.click('#fr-later');cap.release();await p.waitForTimeout(2200);
        ok(await p.locator('#aq-fr').getAttribute('hidden')!==null,'close: late completion does not reopen journey');
        ok(await p.locator('.fr-done-title').count()===0,'close: no stale success');
        ok(cap.upserts.filter(x=>x.birth_date).length===1,'close: single in-flight upsert');
      }
      ok(p.errs.length===0,mode+': no JavaScript errors '+p.errs.join('|'));
    }
    await p.close();
  }

  await b.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
