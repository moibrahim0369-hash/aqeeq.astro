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
    await p.route('**/*', (r) => {
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

  /* ---------- A) نموذج الملف الحقيقي ---------- */
  {
    const cap = { upserts: [], row: null };
    const p = await stubbedPage(cap);
    /* التقاط مبكر للقسم: تعارض صفحة «أنت» يزيله خلال أجزاء من الثانية بعد الدخول */
    await p.addInitScript(() => {
      window.__capSec = null;
      const grab = () => { const s = document.getElementById('account-profile-completion'); if (s && !window.__capSec) window.__capSec = s; };
      new MutationObserver(grab).observe(document, { childList: true, subtree: true });
      grab();
    });
    await p.goto(BASE + '/' + PAGE);
    const t0 = Date.now();
    let hasSec = false;
    while (Date.now() - t0 < 20000) {
      hasSec = await p.evaluate(() => !!window.__capSec);
      if (hasSec) break;
      await p.waitForTimeout(400);
    }
    ok(hasSec, 'A: real profile completion section captured (race window)');
    if (hasSec) {
      await p.evaluate(() => {
        if (!document.getElementById('profile-completion-form')) (document.getElementById('acct-user') || document.body).appendChild(window.__capSec);
        const set = (id, v) => { const e = document.getElementById(id); if (!e) return; e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
        set('profile-first-name', 'سارة'); set('profile-last-name', 'المنصور');
        set('profile-birth-date', '1996-03-14'); set('profile-birth-time', '09:45');
        const unk = document.getElementById('profile-time-unknown'); if (unk) { unk.checked = false; unk.dispatchEvent(new Event('change', { bubbles: true })); }
        const ensureOpt = (sel, v) => { if (!sel) return; if (![...sel.options].some((o) => o.value === v)) { const o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); } sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); };
        ensureOpt(document.getElementById('profile-birth-country'), 'مصر');
        ensureOpt(document.getElementById('profile-birth-city'), 'القاهرة');
      });
      const valid = await p.evaluate(() => {
        const f = document.getElementById('profile-completion-form');
        return { ok: f.checkValidity(), invalid: [...f.querySelectorAll(':invalid')].map((e) => e.id) };
      });
      console.log('   A validity:', JSON.stringify(valid));
      await p.evaluate(() => document.getElementById('profile-completion-form').requestSubmit());
      let msgOk = false, msgTxt = '';
      for (let i = 0; i < 20 && !msgOk; i++) {
        const ms = await p.evaluate(() => { const m = document.getElementById('profile-msg'); return m ? { cls: m.className, txt: (m.textContent || '').trim() } : null; });
        if (ms && /ok/.test(ms.cls)) { msgOk = true; msgTxt = ms.txt; }
        else await p.waitForTimeout(150);
      }
      ok(msgOk, 'A: profile-msg got ok class (' + msgTxt.slice(0, 50) + ')');
      await p.waitForTimeout(1500); /* المزامنة والكاش يتمان بعد إظهار رسالة النجاح */
      const last = cap.upserts.find((u) => u.birth_date) || {};
      ok(last.first_name === 'سارة' && last.last_name === 'المنصور' && last.birth_date === '1996-03-14' &&
        String(last.birth_time || '').startsWith('09:45') && last.birth_time_unknown === false &&
        last.birth_country === 'مصر' && last.birth_city === 'القاهرة' && !!last.profile_completed_at,
        'A: upsert payload has all real columns with demo values ' + JSON.stringify(last).slice(0, 160));
      const c = await cache(p);
      ok(c && c.date === '1996-03-14' && c.time === '09:45' && c.city === 'القاهرة' && c.country === 'مصر', 'A: platform cache written');
      const f = await fields(p);
      console.log('   A fields:', JSON.stringify(f));
      ok(f.fName === 'سارة المنصور' && f.fDate === '1996-03-14' && f.fTime === '09:45' && f.zsys, 'A: natal form (western/vedic shared) autofilled (name/date/time)');
      ok(f.fCityText === 'القاهرة', 'A: natal city select resolved to atlas entry (' + JSON.stringify(f.fCityText) + ')');
      ok(f.lpDate === '1996-03-14' && f.mDate === '1996-03-14', 'A: lifepath + matrix date autofilled');
      await p.goto(BASE + '/' + PAGE + '#chart'); await p.waitForTimeout(1800);
      const f2 = await fields(p);
      console.log('   A fields@chart:', JSON.stringify(f2), 'hash:', await p.evaluate(() => location.hash));
      ok(f2.fName === 'سارة المنصور' && f2.fDate === '1996-03-14' && f2.fTime === '09:45', 'A: natal fields persist after navigating to #chart');
      const unknownA = p.errs.filter((e) => !e.includes('Cannot set properties of null'));
      if (p.errs.length !== unknownA.length) console.log('   KNOWN-ISSUE: repo race crashed account-profile init x' + (p.errs.length - unknownA.length) + ' (Cannot set properties of null)');
      ok(unknownA.length === 0, 'A: no JS errors beyond known repo race ' + unknownA.join('|').slice(0, 200));
    }
    await p.close();
  }

  /* ---------- B) رحلة أول دخول كاملة عبر الجسر ---------- */
  {
    const cap = { upserts: [], row: null };
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
      await p.waitForSelector('#aq-fr .fr-done-title', { timeout: 12000 }).catch(() => {});
      await p.waitForTimeout(1600);
      const done = await p.evaluate(() => (document.querySelector('#aq-fr .fr-done-title')?.textContent || '').trim());
      ok(done.includes('تم حفظ'), 'B: success screen shown after real-form ok (' + done + ')');
      const last = cap.upserts.find((u) => u.birth_date) || {};
      ok(last.first_name === 'سارة' && last.birth_date === '1996-03-14' && String(last.birth_time || '').startsWith('09:45') &&
        last.birth_country === 'مصر' && last.birth_city === 'القاهرة' && !!last.profile_completed_at,
        'B: journey saved through the real profile form ' + JSON.stringify(last).slice(0, 160));
      const c = await cache(p);
      console.log('   B cache:', JSON.stringify(c));
      ok(c && c.date === '1996-03-14' && c.time === '09:45' && c.city === 'القاهرة', 'B: platform cache written via journey');
      const f = await fields(p);
      console.log('   B fields:', JSON.stringify(f));
      ok(f.fDate === '1996-03-14' && f.fTime === '09:45' && f.mDate === '1996-03-14' && f.lpDate === '1996-03-14',
        'B: calculators autofilled after journey save');
      const unknownB = p.errs.filter((e) => !e.includes('Cannot set properties of null'));
      if (p.errs.length !== unknownB.length) console.log('   KNOWN-ISSUE: repo race crashed account-profile init x' + (p.errs.length - unknownB.length) + ' (Cannot set properties of null)');
      ok(unknownB.length === 0, 'B: no JS errors beyond known repo race ' + unknownB.join('|').slice(0, 200));
    }
    await p.close();
  }

  await b.close();
  console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
  process.exit(fail ? 1 : 0);
})();
