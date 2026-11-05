// نافذة الحساب: بصري فقط. يُختبر مع نسخة محاكاة من supabase-js (cdn محجوب).
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
const STUB = `
const T = globalThis.__T = { signIn: [], signUp: [], reset: [], oauth: [], signOut: 0, subs: [] };
export function createClient() {
  let session = null;
  const emit = (ev) => T.subs.forEach((cb) => cb(ev, session));
  globalThis.__emit = emit;
  return {
    auth: {
      onAuthStateChange(cb) { T.subs.push(cb); setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      async getSession() { return { data: { session }, error: null }; },
      async signInWithPassword(a) { T.signIn.push(a); await new Promise(r => setTimeout(r, 400)); if (a.password === 'wrongpass1') return { data: {}, error: { message: 'Invalid login credentials' } }; session = { access_token: 't', user: { id: 'u1', email: a.email } }; emit('SIGNED_IN'); return { data: { session }, error: null }; },
      async signUp(a) { T.signUp.push(a); await new Promise(r => setTimeout(r, 200)); return { data: { session: null }, error: null }; },
      async resetPasswordForEmail(e, o) { T.reset.push([e, o]); return { data: {}, error: null }; },
      async signInWithOAuth(a) { T.oauth.push(a); return { data: {}, error: null }; },
      async updateUser() { return { data: {}, error: null }; },
      async signOut() { T.signOut++; session = null; emit('SIGNED_OUT'); return { error: null }; },
    },
    functions: { async invoke() { return { data: null, error: null }; } },
    from: () => ({ select() { return this; }, eq() { return this; }, order() { return this; }, limit() { return this; }, async maybeSingle() { return { data: null, error: null }; }, then(r) { r({ data: [], error: null }); } }),
    rpc: async () => ({ data: null, error: null }),
  };
}`;
let fail = 0; const ok = (c, m) => { if (!c) fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
async function open(b, w, h) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.route('**/*', (r) => { const u = r.request().url(); if (u.startsWith(BASE)) return r.continue(); if (u.includes('cdn.jsdelivr.net')) return r.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: STUB }); return r.abort(); });
  await p.goto(BASE + '/index.html#account'); await p.waitForSelector('#acct-guest:not([hidden])', { timeout: 6000 }); await p.waitForTimeout(500);
  return { p, errs };
}
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { p, errs } = await open(b, w, h);
    const T = (k) => p.evaluate((k) => JSON.stringify(globalThis.__T[k]), k).then(JSON.parse);
    ok(await p.evaluate(() => document.getElementById('acx-title').textContent === 'مرحبًا بعودتك'), w + ': title');
    ok(await p.evaluate(() => { location.hash = '#home'; return getComputedStyle(document.getElementById('account')).display === 'none'; }), w + ': account overlay hidden on home');
    await p.evaluate(() => { location.hash = '#account'; });
    ok(await p.evaluate(() => getComputedStyle(document.getElementById('account')).position === 'fixed'), w + ': account is fixed overlay when opened');
    ok(await p.isVisible('#acct-google') && await p.isVisible('#acct-email') && await p.isVisible('#acct-pass') && await p.isVisible('#acct-submit') && await p.isVisible('#acct-forgot'), w + ': core controls visible');
    ok((await p.textContent('#acct-submit')).trim() === 'تسجيل الدخول', w + ': submit label');
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), w + ': no hscroll');
    ok((w > 820) === await p.isVisible('.acx-visual'), w + ': visual pane only on desktop');
    ok(await p.evaluate(() => { const r = document.querySelector('.acct-card-shell').getBoundingClientRect(); return r.bottom <= innerHeight + 140 || innerWidth > 820; }), w + ': modal not overly tall');
    /* إظهار/إخفاء كلمة المرور */
    await p.click('.acx-eye'); ok(await p.getAttribute('#acct-pass', 'type') === 'text', w + ': show password');
    await p.click('.acx-eye'); ok(await p.getAttribute('#acct-pass', 'type') === 'password', w + ': hide password');
    /* تحقق من الحقول */
    await p.click('#acct-submit'); ok(await p.isVisible('#acct-msg') && (await T('signIn')).length === 0, w + ': empty fields -> message, no request');
    /* خطأ بيانات */
    await p.fill('#acct-email', 'a@b.com'); await p.fill('#acct-pass', 'wrongpass1'); await p.click('#acct-submit');
    await p.waitForTimeout(80); ok(await p.isDisabled('#acct-submit'), w + ': submit disabled while loading (no double submit)');
    await p.waitForTimeout(700); ok((await p.textContent('#acct-msg')).includes('غير صحيحة') && (await T('signIn')).length === 1, w + ': wrong credentials -> Arabic error, single request');
    /* Google */
    await p.click('#acct-google'); await p.waitForTimeout(150); const oa = await T('oauth'); ok(oa.length === 1 && oa[0].provider === 'google', w + ': Google OAuth called');
    /* نسيت كلمة المرور */
    await p.click('#acct-forgot'); ok(await p.evaluate(() => document.getElementById('acx-title').textContent === 'استعادة كلمة المرور') && !(await p.isVisible('#acct-pass')) && await p.isVisible('#acx-back'), w + ': reset view');
    await p.fill('#acct-email', 'a@b.com'); await p.click('#acct-forgot'); await p.waitForTimeout(200);
    const rs = await T('reset'); ok(rs.length === 1 && rs[0][0] === 'a@b.com', w + ': reset email sent via Supabase');
    await p.click('#acx-back'); ok(await p.isVisible('#acct-pass') && await p.evaluate(() => document.getElementById('acx-title').textContent === 'مرحبًا بعودتك'), w + ': back to login');
    /* إنشاء حساب */
    await p.click('#acx-switch-btn'); ok(await p.isVisible('#acct-name') && await p.evaluate(() => document.getElementById('acx-title').textContent === 'إنشاء حساب جديد'), w + ': signup view (name field kept)');
    await p.fill('#acct-name', 'م'); await p.fill('#acct-email', 'n@b.com'); await p.fill('#acct-pass', 'goodpass99'); await p.click('#acct-submit'); await p.waitForTimeout(500);
    const su = await T('signUp'); ok(su.length === 1 && su[0].email === 'n@b.com' && su[0].options.data.full_name === 'م', w + ': signUp payload unchanged');
    await p.click('#acx-switch-btn');
    /* دخول ناجح + بقاء الجلسة */
    await p.fill('#acct-email', 'ok@b.com'); await p.fill('#acct-pass', 'goodpass99'); await p.click('#acct-submit'); await p.waitForSelector('#acct-user:not([hidden])', { timeout: 4000 }).catch(() => {});
    ok(await p.isVisible('#acct-user') && !(await p.isVisible('#acct-guest')), w + ': signed in -> user panel');
    ok(!(await p.isVisible('.acx-visual')), w + ': no visual pane when signed in');
    /* Esc */
    await p.keyboard.press('Escape'); await p.waitForTimeout(200); ok(await p.evaluate(() => location.hash) === '#home', w + ': Esc closes');
    ok(errs.length === 0, w + ': no JS errors ' + errs.join(';'));
    await p.close();
  }
  await b.close(); process.exit(fail ? 1 : 0);
})();
