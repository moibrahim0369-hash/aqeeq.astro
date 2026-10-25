// يختبر زر «اشترِ القراءة الكاملة» بنسخة محاكاة من supabase-js (cdn.jsdelivr محجوب في بيئة الاختبار).
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
const STUB = `
const T = globalThis.__sbTest = globalThis.__sbTest || {}; T.calls = []; T.invoke = null;
export function createClient() {
  let session = { access_token: 'tok-1', user: { id: 'u1', email: 'a@b.com' } };
  const subs = [];
  return {
    auth: {
      onAuthStateChange(cb) { subs.push(cb); setTimeout(() => cb('INITIAL_SESSION', globalThis.__noSession ? null : session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      async getSession() { return { data: { session }, error: null }; },
      async signOut() { return { error: null }; },
    },
    functions: { async invoke(name, o) { T.calls.push([name, o, session.access_token]); if (globalThis.__rec) globalThis.__rec(JSON.stringify([name, o, session.access_token])); return T.invoke ? T.invoke() : { data: { checkoutUrl: 'https://accept.paymob.com/unifiedcheckout/?publicKey=pk&clientSecret=cs' }, error: null }; } },
    from: () => ({ select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: null, error: null }; } }),
    rpc: async () => ({ data: null, error: null }),
  };
}`;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
async function open(b, noSession, invokeJs) {
  const p = await b.newPage(); const errs = []; const nav = []; const rec = [];
  await p.exposeFunction('__rec', (x) => rec.push(JSON.parse(x)));
  p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(`globalThis.__noSession=${!!noSession}`);
  await p.route('**/*', (r) => {
    const u = r.request().url();
    if (u.startsWith(BASE)) return r.continue();
    if (u.includes('cdn.jsdelivr.net')) return r.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: STUB + (invokeJs ? `\nglobalThis.__sbTest.invoke = ${invokeJs};` : '') });
    if (u.includes('paymob.com')) { nav.push(u); return r.fulfill({ status: 200, contentType: 'text/html', body: 'paymob' }); }
    return r.abort();
  });
  await p.goto(BASE + '/index.html#account'); await p.waitForTimeout(800);
  return { p, errs, nav, rec };
}
(async () => {
  const b = await chromium.launch();
  let t = await open(b, true);
  ok(!(await t.p.isVisible('#acct-buy')), 'signed out: buy button hidden');
  await t.p.close();

  t = await open(b, false);
  ok(await t.p.isVisible('#acct-buy'), 'signed in: buy button visible');
  await t.p.click('#acct-buy'); await t.p.waitForTimeout(1200);
  const calls = t.rec;
  ok(calls.length === 1 && calls[0][0] === 'create-checkout' && calls[0][1].body.product === 'full_report' && calls[0][2] === 'tok-1', 'invokes create-checkout with product full_report: ' + JSON.stringify(calls[0] && calls[0].slice(0, 3)));
  ok(t.nav.length === 1 && t.nav[0].startsWith('https://accept.paymob.com/unifiedcheckout/'), 'redirects to Paymob checkout: ' + t.nav[0]);
  ok(t.errs.length === 0, 'no JS errors ' + t.errs.join(';'));
  await t.p.close();

  t = await open(b, false, `async () => ({ data: { checkoutUrl: 'https://evil.example/pay' }, error: null })`);
  await t.p.click('#acct-buy'); await t.p.waitForTimeout(800);
  ok(t.nav.length === 0 && (await t.p.isVisible('#acct-buy-msg')) && (await t.p.isEnabled('#acct-buy')), 'untrusted checkout host rejected, message shown, button re-enabled');
  await t.p.close();

  t = await open(b, false, `async () => ({ data: null, error: { context: { json: async () => ({ error: 'الدفع غير مفعّل بعد.' }) } } })`);
  await t.p.click('#acct-buy'); await t.p.waitForTimeout(800);
  ok((await t.p.textContent('#acct-buy-msg')).includes('الدفع غير مفعّل بعد') && t.nav.length === 0, 'server error message shown to user');
  await t.p.close(); await b.close();
  console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
