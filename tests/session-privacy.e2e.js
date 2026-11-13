// خصوصية الخروج + شريط لك/أنت + حساب المالك. يستخدم عميل Supabase وهميًا.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8765';
let fail = 0; const ok = (c, m) => { if (!c) fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const INIT = (admin, signedIn) => `
window.__cbs=[];
window.aqeeqSupabase={auth:{onAuthStateChange(cb){window.__cbs.push(cb);setTimeout(()=>cb('INITIAL_SESSION',${signedIn}?{user:{id:'u1',email:'x@y.z'}}:null),0);return{data:{subscription:{unsubscribe(){}}}}},getSession:async()=>({data:{session:${signedIn}?{user:{id:'u1',email:'x@y.z'}}:null}})},rpc:async(n)=>({data:n==='is_app_admin'?${admin}:null,error:null}),from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})})};`;
(async () => {
  const b = await chromium.launch();
  /* 1) مسجل دخول + مالك */
  let c = await b.newContext({ viewport: { width: 412, height: 900 }, isMobile: true }); let p = await c.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(INIT(true, true));
  await p.goto(BASE + '/index.html#home'); await p.waitForTimeout(1500);
  const order = await p.$$eval('#aqn-bnav .bnav-item', (e) => e.map((x) => x.textContent.trim()));
  ok(JSON.stringify(order) === JSON.stringify(['الرئيسية', 'اكتشف ذاتك', 'حسابي']), 'logged in bar order: ' + order.join(','));
  ok(await p.evaluate(() => document.documentElement.getAttribute('data-admin') === '1'), 'admin flag set');
  ok((await p.textContent('.aqh-join span')).trim() === 'حسابي', 'join button becomes account');
  await p.evaluate(() => { localStorage.setItem('aqeeq_profile_cache_v1', '{"date":"1990-01-01"}'); localStorage.setItem('aqeeq_saved_readings_v1', '[1]'); localStorage.setItem('aqeeq_activity_v1', '[1]'); });
  const nav = p.waitForNavigation({ timeout: 4000 }).catch(() => null);
  await p.evaluate(() => window.__cbs.forEach((cb) => cb('SIGNED_OUT', null)));
  await nav; await p.waitForTimeout(800);
  ok(await p.evaluate(() => !localStorage.getItem('aqeeq_profile_cache_v1') && !localStorage.getItem('aqeeq_saved_readings_v1') && !localStorage.getItem('aqeeq_activity_v1')), 'sign-out wipes local data');
  await c.close();
  /* 2) زائر */
  c = await b.newContext({ viewport: { width: 412, height: 900 }, isMobile: true }); p = await c.newPage();
  await p.addInitScript(INIT(false, false)); p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('aqeeq_profile_cache_v1', '{"date":"1990-01-01"}'); });
  await p.goto(BASE + '/index.html#home'); await p.waitForTimeout(1500);
  const o2 = await p.$$eval('#aqn-bnav .bnav-item', (e) => e.map((x) => x.textContent.trim()));
  ok(JSON.stringify(o2) === JSON.stringify(['الرئيسية', 'أنت', 'اكتشف ذاتك', 'حسابي']), 'guest bar order: ' + o2.join(','));
  ok(await p.evaluate(() => !localStorage.getItem('aqeeq_profile_cache_v1')), 'guest has no leftover profile cache');
  await p.click('#aq-you-item'); await p.waitForTimeout(500);
  ok(await p.isVisible('.aq-you-sheet .aq-you-cta'), 'guest sheet shows login CTA');
  await p.keyboard.press('Escape'); await p.evaluate(() => document.querySelector('[data-you-close]').click()); await p.waitForTimeout(400);
  await p.click('#aq-bell'); await p.waitForTimeout(500);
  ok(await p.locator('.aq-notif .aq-n-i').count() >= 2, 'bell lists items for guest');
  ok(await p.evaluate(() => !document.querySelector('.aq-autofill-bar') || getComputedStyle(document.querySelector('.aq-autofill-bar')).display === 'none'), 'autofill hidden for guest');
  ok(errs.length === 0, 'no js errors ' + errs.slice(0, 2));
  await b.close(); process.exit(fail ? 1 : 0);
})();
