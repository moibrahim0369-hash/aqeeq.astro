const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
const mk = (signed, admin) => `
const T = globalThis.__T = { rpc: [] };
let mine = [];
export function createClient() {
  const session = ${signed} ? { access_token: 't', user: { id: 'u1', email: 'a@b.co', user_metadata: {} } } : null;
  const q = (t) => { const o = { select: () => o, eq: () => o, order: () => o, limit: () => o,
    maybeSingle: async () => ({ data: t === 'products' ? { amount_cents: 2000, currency: 'EGP', name_ar: 'القراءة الكاملة' } : { id: 'u1', first_name: 'س', last_name: 'م', birth_date: '1999-09-25', birth_time_unknown: true, birth_city: 'القاهرة', birth_country: 'مصر', profile_completed_at: 'x' }, error: null }),
    then: (r) => r({ data: t === 'manual_payments' ? mine : [], error: null }) }; return o; };
  return {
    auth: { onAuthStateChange(cb) { setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      async getSession() { return { data: { session }, error: null }; }, async updateUser() { return { data: {}, error: null }; }, async signOut() { return { error: null }; } },
    from: (t) => q(t), storage: { from: () => ({}) }, functions: { async invoke() { return { data: null, error: null }; } },
    async rpc(n, a) { T.rpc.push([n, a]);
      if (n === 'submit_manual_payment') { mine = [{ id: 'p1', method: a.p_method, status: 'pending', created_at: new Date().toISOString() }]; return { data: 'p1', error: null }; }
      if (n === 'admin_list_manual_payments') return ${admin} ? { data: [{ id: 'p1', email: 'c@d.co', full_name: 'عميل', product_code: 'full_report', method: 'wallet', amount_cents: 2000, currency: 'EGP', reference: 'REF123', status: 'pending', created_at: new Date().toISOString() }], error: null } : { data: null, error: { message: 'forbidden' } };
      return { data: 'approved', error: null }; },
  };
}`;
let fail = 0; const ok = (c, m) => { if (!c) fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
async function open(b, w, h, signed, admin, hash) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => d.accept());
  await p.route('**/*', (r) => { const u = r.request().url(); if (u.startsWith(BASE)) return r.continue(); if (u.includes('cdn.jsdelivr.net')) return r.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: mk(signed, admin) }); return r.abort(); });
  await p.goto(BASE + '/index.html#' + hash); await p.waitForTimeout(1300); return { p, errs };
}
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    let { p, errs } = await open(b, w, h, false, false, 'pay');
    ok(await p.evaluate(() => !document.getElementById('pay-guest').hidden && document.getElementById('pay-main').hidden), w + ': guest sees login prompt');
    await p.close();
    ({ p, errs } = await open(b, w, h, true, false, 'pay'));
    ok(await p.evaluate(() => getComputedStyle(document.getElementById('pay')).position === 'fixed'), w + ': pay is standalone overlay');
    ok(await p.evaluate(() => document.getElementById('pay-price').textContent.includes('20')), w + ': price shown');
    ok(await p.evaluate(() => document.getElementById('pay-detail-val').textContent === '01143813559'), w + ': wallet number shown');
    await p.click('[data-pm=paypal]');
    ok(await p.evaluate(() => document.getElementById('pay-paypal').href === 'https://www.paypal.me/elbr1mo' && document.getElementById('pay-copy').hidden), w + ': paypal link shown');
    await p.click('[data-pm=instapay]');
    await p.click('#pay-send'); ok(await p.evaluate(() => !document.getElementById('pay-msg').hidden), w + ': empty reference rejected');
    await p.fill('#pay-ref', 'ABC12345'); await p.click('#pay-send'); await p.waitForTimeout(600);
    const T = await p.evaluate(() => globalThis.__T.rpc);
    ok(T.some((x) => x[0] === 'submit_manual_payment' && x[1].p_method === 'instapay' && x[1].p_reference === 'ABC12345' && x[1].p_product === 'full_report'), w + ': submit rpc payload');
    ok(await p.evaluate(() => document.getElementById('pay-form').hidden && !document.getElementById('pay-pending').hidden), w + ': pending state shown');
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), w + ': no hscroll');
    ok(errs.length === 0, w + ': no js errors ' + errs.join('|'));
    await p.close();
    ({ p, errs } = await open(b, w, h, true, true, 'admin-pay'));
    ok(await p.evaluate(() => document.querySelectorAll('.adm-row').length === 1), w + ': admin sees pending');
    await p.click('.adm-btn.approve'); await p.waitForTimeout(500);
    ok((await p.evaluate(() => globalThis.__T.rpc)).some((x) => x[0] === 'admin_review_manual_payment' && x[1].p_approve === true && x[1].p_id === 'p1'), w + ': approve rpc');
    ok(errs.length === 0, w + ': admin no js errors'); await p.close();
    ({ p, errs } = await open(b, w, h, true, false, 'admin-pay'));
    ok(await p.evaluate(() => document.getElementById('adm-msg').textContent.includes('للمالك')), w + ': non-owner blocked'); await p.close();
  }
  await b.close(); console.log(fail ? 'FAILED ' + fail : 'ALL PASS'); process.exit(fail ? 1 : 0);
})();
