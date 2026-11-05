// نموذج استكمال الملف: أعمدة القاعدة الحقيقية + قوائم الدولة/المحافظة + زر الإغلاق.
const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:8765';
const STUB = `
const COLS = ['id','full_name','birth_date','birth_time','birth_city','sun_sign','ascendant','life_path_number','created_at','first_name','last_name','birth_country','birth_time_unknown','avatar_path','profile_completed_at','updated_at'];
const T = globalThis.__T = { upserts: [], selects: [] };
let row = null;
function bad(list) { return list.filter((c) => !COLS.includes(c.trim())); }
export function createClient() {
  const session = { access_token: 't', user: { id: 'u1', email: 'a@b.co', user_metadata: { full_name: 'سارة المنصور' } } };
  return {
    auth: {
      onAuthStateChange(cb) { setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      async getSession() { return { data: { session }, error: null }; },
      async updateUser() { return { data: {}, error: null }; }, async signOut() { return { error: null }; },
      async signInWithPassword() { return { data: {}, error: null }; },
    },
    storage: { from: () => ({ async upload() { return { error: null }; }, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    functions: { async invoke() { return { data: null, error: null }; } },
    rpc: async () => ({ data: null, error: null }),
    from(t) {
      const q = { _t: t, _cols: null, _up: null };
      q.select = (c) => { if (t === 'profiles') { q._cols = c; T.selects.push(c); } return q; };
      q.upsert = (p) => { q._up = p; T.upserts.push(p); return q; };
      q.eq = () => q; q.order = () => q; q.limit = () => q;
      const run = () => {
        if (t !== 'profiles') return { data: [], error: null };
        const keys = q._up ? Object.keys(q._up).concat((q._cols||'').split(',')) : (q._cols||'').split(',');
        const b = bad(keys.filter(Boolean)); if (b.length) return { data: null, error: { message: 'column ' + b[0] + ' does not exist' } };
        if (q._up) row = Object.assign({}, row || {}, q._up);
        return { data: row, error: null };
      };
      q.single = async () => run(); q.maybeSingle = async () => run();
      q.then = (r) => r(run());
      return q;
    },
  };
}`;
let fail = 0; const ok = (c, m) => { if (!c) fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.route('**/*', (r) => { const u = r.request().url(); if (u.startsWith(BASE)) return r.continue(); if (u.includes('cdn.jsdelivr.net')) return r.fulfill({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: STUB }); return r.abort(); });
    await p.goto(BASE + '/index.html'); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => location.hash === '#account'), w + ': form opens right after login');
    await p.waitForSelector('#profile-form-wrapper:not([hidden])');
    ok(await p.evaluate(() => document.getElementById('profile-birth-country').tagName === 'SELECT' && document.getElementById('profile-birth-city').tagName === 'SELECT'), w + ': country and region are selects');
    ok(await p.evaluate(() => document.getElementById('profile-birth-city').disabled), w + ': region disabled until country chosen');
    await p.selectOption('#profile-birth-country', 'مصر');
    const n = await p.evaluate(() => document.getElementById('profile-birth-city').options.length);
    ok(n > 25, w + ': egypt governorates listed (' + n + ')');
    await p.selectOption('#profile-birth-city', 'الفيوم');
    await p.fill('#profile-birth-date', '1999-09-25'); await p.check('#profile-time-unknown');
    await p.click('#profile-save'); await p.waitForTimeout(800);
    const T = await p.evaluate(() => JSON.parse(JSON.stringify(globalThis.__T)));
    const last = T.upserts[T.upserts.length - 1];
    ok(last && last.birth_country === 'مصر' && last.birth_city === 'الفيوم' && 'profile_completed_at' in last && !('profile_completed' in last) && !('avatar_url' in last), w + ': save payload uses real columns');
    ok(await p.evaluate(() => !document.getElementById('profile-msg').textContent.includes('تعذر')), w + ': no save error');
    ok(await p.evaluate(() => !document.getElementById('profile-summary-card').hidden), w + ': summary card shown after save');
    // edit mode + close
    await p.click('#profile-edit-btn');
    ok(await p.evaluate(() => document.getElementById('profile-birth-city').value === 'الفيوم'), w + ': saved place restored in selects');
    await p.click('#profile-close-btn'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => location.hash === '#home' && getComputedStyle(document.getElementById('account')).display === 'none'), w + ': X closes to home');
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), w + ': no horizontal scroll');
    ok(errs.length === 0, w + ': no JS errors ' + errs.join('|'));
    await p.close();
  }
  await b.close(); console.log(fail ? 'FAILED ' + fail : 'ALL PASS'); process.exit(fail ? 1 : 0);
})();
