// عقيق أسترو — تسجيل الدخول (قسم «حسابي») وطلب القراءة الكاملة (من نتيجة الخريطة).
// يُحمَّل كـ <script type="module" src="auth.js"> ويعتمد على supabase-client.js.
// لا يوجد innerHTML بأي نص ديناميكي هنا: كل شيء يُبنى بـ textContent حتى لا يمكن حقن HTML من القراءة أو من الأخطاء.
import { supabase } from './supabase-client.js';

const REPORT_FN = 'generate-astro-report';
const CHECKOUT_FN = 'create-checkout';
const MIN_PASSWORD = 8;

const $ = (s, r = document) => r.querySelector(s);

/* ---------- حالة الصفحة ---------- */
let session = null;
let mode = 'signin';          // signin | signup
let recovering = false;       // المستخدم جاي من رابط إعادة تعيين كلمة المرور
let payload = null;           // آخر خريطة اتحسبت (من الصفحة)
let payloadVersion = 0;
let boxKey = '';
let running = false;

/* ---------- عناصر قسم الحساب ---------- */
const ui = {
  fallback: $('#acct-fallback'),
  guest: $('#acct-guest'),
  user: $('#acct-user'),
  recovery: $('#acct-recovery'),
  form: $('#acct-form'),
  nameField: $('#acct-name-field'),
  name: $('#acct-name'),
  email: $('#acct-email'),
  pass: $('#acct-pass'),
  msg: $('#acct-msg'),
  submit: $('#acct-submit'),
  forgot: $('#acct-forgot'),
  userEmail: $('#acct-user-email'),
  signout: $('#acct-signout'),
  recForm: $('#acct-recovery-form'),
  newPass: $('#acct-newpass'),
  recMsg: $('#acct-recovery-msg'),
  linkMsg: $('#acct-link-msg'),
};

/* ---------- أدوات صغيرة ---------- */
const AR_ERRORS = [
  [/invalid login credentials/i, 'الإيميل أو كلمة المرور غير صحيحة.'],
  [/email not confirmed/i, 'لازم تأكد الإيميل الأول. شوف رسالة التأكيد (وفولدر Spam).'],
  [/already (been )?registered|user already/i, 'الإيميل ده مسجّل قبل كده. جرّب «دخول».'],
  [/password.*(at least|short|weak|characters)/i, `كلمة المرور ضعيفة. استخدم ${MIN_PASSWORD} حروف أو أرقام على الأقل.`],
  [/same.*password|different from the old/i, 'اختار كلمة مرور مختلفة عن القديمة.'],
  [/rate limit|too many|security purposes/i, 'محاولات كتير في وقت قصير. استنى دقيقة وجرّب تاني.'],
  [/failed to fetch|network|load failed/i, 'مشكلة في الاتصال. تأكد من الإنترنت وجرّب تاني.'],
];

function arError(err) {
  const m = String((err && err.message) || err || '');
  for (const [re, text] of AR_ERRORS) if (re.test(m)) return text;
  return 'حصلت مشكلة. جرّب تاني بعد شوية.';
}

function say(el, text, ok = false) {
  if (!el) return;
  el.textContent = text || '';
  el.hidden = !text;
  el.classList.toggle('acct-ok', !!text && ok);
  el.classList.toggle('ferr', !!text && !ok);
}

function h(tag, attrs, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'text') n.textContent = v;
    else if (k === 'class') n.className = v;
    else n.setAttribute(k, v);
  }
  n.append(...children);
  return n;
}

const redirectUrl = () => location.origin + location.pathname;
const goAccount = () => { if (location.hash !== '#account') location.hash = '#account'; };

/* ---------- قسم الحساب ---------- */
function setMode(m) {
  mode = m;
  document.querySelectorAll('.acct-tabs button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.mode === m));
  });
  ui.nameField.hidden = m !== 'signup';
  ui.pass.setAttribute('autocomplete', m === 'signup' ? 'new-password' : 'current-password');
  ui.submit.textContent = m === 'signup' ? 'إنشاء حساب' : 'دخول';
  ui.forgot.hidden = m === 'signup';
  say(ui.msg, '');
}

function refreshAccountUI() {
  const loggedIn = !!session;
  ui.guest.hidden = loggedIn || recovering;
  ui.user.hidden = !loggedIn || recovering;
  ui.recovery.hidden = !recovering;
  if (loggedIn && session.user) ui.userEmail.textContent = session.user.email || '';
  renderReportBox(false);
}

function busy(button, on) {
  if (button) button.disabled = on;
}

async function onSubmit(e) {
  e.preventDefault();
  say(ui.msg, '');
  const email = ui.email.value.trim();
  const password = ui.pass.value;
  if (!email || !password) return say(ui.msg, 'اكتب الإيميل وكلمة المرور.');
  if (mode === 'signup' && password.length < MIN_PASSWORD) {
    return say(ui.msg, `كلمة المرور لازم تكون ${MIN_PASSWORD} حروف أو أرقام على الأقل.`);
  }
  busy(ui.submit, true);
  try {
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      ui.pass.value = '';
    } else {
      const fullName = ui.name.value.trim().slice(0, 80);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: redirectUrl() },
      });
      if (error) throw error;
      ui.pass.value = '';
      if (!data.session) {
        say(ui.msg, 'تمام. لو الإيميل صحيح هيوصلك رابط تأكيد خلال دقايق (شوف فولدر Spam كمان). بعد ما تأكد، ارجع هنا واعمل «دخول».', true);
      }
    }
  } catch (err) {
    say(ui.msg, arError(err));
  } finally {
    busy(ui.submit, false);
  }
}

async function onForgot() {
  say(ui.msg, '');
  const email = ui.email.value.trim();
  if (!email) return say(ui.msg, 'اكتب الإيميل الأول وبعدين اضغط «نسيت كلمة المرور».');
  busy(ui.forgot, true);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
    // نخفي هل الإيميل موجود ولا لا، إلا لو المشكلة محاولات كتير.
    if (error && /rate limit|too many|security purposes/i.test(error.message)) throw error;
    say(ui.msg, 'لو الإيميل ده مسجّل عندنا، هيوصلك رابط لإعادة تعيين كلمة المرور خلال دقايق. افتح الرابط من نفس المتصفح اللي طلبت منه.', true);
  } catch (err) {
    say(ui.msg, arError(err));
  } finally {
    busy(ui.forgot, false);
  }
}

async function onRecovery(e) {
  e.preventDefault();
  say(ui.recMsg, '');
  const password = ui.newPass.value;
  if (password.length < MIN_PASSWORD) {
    return say(ui.recMsg, `كلمة المرور لازم تكون ${MIN_PASSWORD} حروف أو أرقام على الأقل.`);
  }
  const btn = ui.recForm.querySelector('button[type=submit]');
  busy(btn, true);
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    ui.newPass.value = '';
    recovering = false;
    say(ui.linkMsg, 'تم تغيير كلمة المرور. إنت داخل بحسابك دلوقتي.', true);
    refreshAccountUI();
  } catch (err) {
    say(ui.recMsg, arError(err));
  } finally {
    busy(btn, false);
  }
}

async function onSignOut() {
  busy(ui.signout, true);
  try {
    await supabase.auth.signOut();
  } finally {
    busy(ui.signout, false);
  }
}

/* ---------- زر القراءة الكاملة (داخل نتيجة الخريطة) ---------- */
async function functionError(error) {
  const status = error && error.context && error.context.status;
  if (status === 401) return 'انتهت جلسة الدخول. سجّل دخولك من جديد وجرّب تاني.';
  try {
    const body = await error.context.json();
    if (body && typeof body.error === 'string' && body.error) return body.error;
  } catch (_) { /* الرد مش JSON */ }
  return 'تعذر إنشاء القراءة دلوقتي. جرّب مرة تانية بعد شوية.';
}

async function requestReport(button, status, out, note) {
  if (running || !payload) return;
  running = true;
  button.disabled = true;
  out.hidden = true;
  out.textContent = '';
  note.hidden = true;
  say(status, 'بنكتب قراءتك… ممكن تاخد لحد دقيقة ونص. ماتقفلش الصفحة.', true);
  try {
    const { data, error } = await supabase.functions.invoke(REPORT_FN, { body: payload });
    if (error && error.context && error.context.status === 402) {   // محتاج يشتري القراءة الأول
      say(status, '');
      await showBuy(note);
      return;
    }
    if (error) throw new Error(await functionError(error));
    if (!data || typeof data.report !== 'string' || !data.report.trim()) {
      throw new Error('تعذر إنشاء القراءة دلوقتي. جرّب مرة تانية بعد شوية.');
    }
    out.textContent = data.report;            // textContent: أي HTML في النص يظهر كنص عادي
    out.hidden = false;
    say(status, '');
    note.textContent = data.emailSent
      ? 'اتبعتت نسخة من القراءة على إيميلك.'
      : 'ماقدرناش نبعت نسخة على الإيميل. احتفظ بالنص اللي فوق.';
    note.hidden = false;
  } catch (err) {
    say(status, err && err.message ? err.message : 'حصلت مشكلة. جرّب تاني.');
  } finally {
    running = false;
    button.disabled = false;
  }
}

/* ---------- الشراء (Paymob) ---------- */
function money(cents, cur) {
  const v = cents / 100;
  return `${Number.isInteger(v) ? v : v.toFixed(2)} ${cur === 'EGP' ? 'جنيه' : cur}`;
}

async function showBuy(note) {
  note.hidden = false;
  note.textContent = 'بنجهّز تفاصيل الشراء…';
  const { data: p } = await supabase.from('products')
    .select('name_ar,amount_cents,currency,active').eq('code', 'full_report').maybeSingle();
  if (!p || !p.active || !p.amount_cents) {
    note.textContent = 'القراءة الكاملة هتتاح للشراء قريب.';
    return;
  }
  note.replaceChildren();
  const buy = h('button', { class: 'btn', type: 'button', text: `اشتري القراءة الكاملة — ${money(p.amount_cents, p.currency)}` });
  const msg = h('span', { class: 'ai-status', role: 'status', 'aria-live': 'polite' });
  buy.addEventListener('click', async () => {
    buy.disabled = true;
    say(msg, 'بنحوّلك لصفحة الدفع…', true);
    try {
      const { data, error } = await supabase.functions.invoke(CHECKOUT_FN, { body: { product: 'full_report' } });
      if (error) throw new Error(await functionError(error));
      let u;
      try { u = new URL(data && data.checkoutUrl); } catch (_) { u = null; }
      if (!u || u.protocol !== 'https:' || !/(^|\.)paymob\.com$/.test(u.hostname)) {
        throw new Error('رابط الدفع غير صالح. جرّب تاني.');
      }
      location.assign(u.href);
      setTimeout(() => { buy.disabled = false; }, 8000);   // لو رجع بالـ back والصفحة اتحفظت
    } catch (err) {
      say(msg, err && err.message ? err.message : 'حصلت مشكلة. جرّب تاني.');
      buy.disabled = false;
    }
  });
  note.append(h('span', { text: `${p.name_ar}. بعد الدفع ارجع واضغط «اكتب قراءتي الكاملة» تاني. ` }), buy, ' ', msg);
}

async function handleOrderReturn() {
  const q = new URLSearchParams(location.search);
  const id = q.get('order');
  if (!id) return;
  q.delete('order');
  const rest = q.toString();
  history.replaceState(null, '', location.pathname + (rest ? `?${rest}` : '') + '#account');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  say(ui.linkMsg, 'بنتأكد من الدفع…', true);
  for (let i = 0; i < 10; i++) {                    // الـ webhook ممكن يتأخر ثواني
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) { say(ui.linkMsg, 'سجّل دخولك عشان نتأكد من حالة الدفع.'); return; }
    const { data } = await supabase.from('orders').select('status').eq('id', id).maybeSingle();
    if (data && data.status === 'paid') {
      say(ui.linkMsg, 'تم الدفع بنجاح. ارجع للخريطة واضغط «اكتب قراءتي الكاملة».', true);
      return;
    }
    if (data && data.status === 'cancelled') { say(ui.linkMsg, 'الدفع ماتمش. ماتم خصم أي مبلغ.'); return; }
    await new Promise((r) => setTimeout(r, 3000));
  }
  say(ui.linkMsg, 'لسه مستنيين تأكيد الدفع. لو اتخصم المبلغ هيتفعّل تلقائياً خلال دقايق، حدّث الصفحة.');
}

function renderReportBox(force) {
  const host = $('#ai-report-box');
  if (!host) return;
  const key = `${session ? 'in' : 'out'}:${payloadVersion}`;
  if (!force && key === boxKey && host.childElementCount) return;   // لا نمسح القراءة المعروضة عند تجديد التوكن
  boxKey = key;
  host.replaceChildren();
  if (!payload) return;

  host.append(
    h('h4', { text: 'قراءتك الكاملة بالذكاء الاصطناعي' }),
    h('p', {
      class: 'ai-note',
      text: 'قراءة مطوّلة مكتوبة على خريطتك بالتحديد بمنهج عقيق أسترو. بتتكتب بمساعدة الذكاء الاصطناعي، وهي للتأمل والتطوير الذاتي، مش تشخيص ولا تنبؤ مؤكد.',
    }),
  );

  if (!session) {
    host.append(
      h('p', { text: 'محتاج حساب عشان نبعتلك القراءة على إيميلك.' }),
      h('a', { class: 'btn', href: '#account', text: 'سجّل دخولك أو أنشئ حساب' }),
    );
    return;
  }

  const consent = h('input', { type: 'checkbox' });
  const label = h(
    'label',
    { class: 'chk' },
    consent,
    ' أوافق إن بيانات خريطتي (تاريخ ووقت ومكان الميلاد ومواقع الكواكب) تتبعت لسيرفر عقيق ولخدمة ذكاء اصطناعي خارجية (Google Gemini) عشان تكتب القراءة، وإن نسخة منها تتبعت لإيميلي. عقيق مابتخزنش بيانات ميلادك عندها.',
  );
  const button = h('button', { class: 'btn', type: 'button', text: 'اكتب قراءتي الكاملة' });
  button.disabled = true;
  const status = h('p', { class: 'ai-status', role: 'status', 'aria-live': 'polite', hidden: '' });
  const out = h('div', { class: 'ai-report', dir: 'rtl', hidden: '' });
  const note = h('p', { class: 'ai-note', hidden: '' });

  consent.addEventListener('change', () => { button.disabled = running || !consent.checked; });
  button.addEventListener('click', () => requestReport(button, status, out, note));

  host.append(label, button, status, out, note);
}

/* ---------- ربط كل ده بالصفحة ---------- */
function handleLinkErrors() {
  const q = new URLSearchParams(location.search);
  if (!q.has('error') && !q.has('error_description')) return;
  say(ui.linkMsg, 'الرابط انتهت صلاحيته أو اتستخدم قبل كده. اطلب رابط جديد من «نسيت كلمة المرور» أو سجّل من جديد.');
  q.delete('error'); q.delete('error_code'); q.delete('error_description');
  const rest = q.toString();
  history.replaceState(null, '', location.pathname + (rest ? `?${rest}` : '') + '#account');
  goAccount();
}

function init() {
  let linkPending = new URLSearchParams(location.search).has('code');   // جاي من رابط إيميل (تأكيد/استرجاع)

  ui.fallback.hidden = true;
  setMode('signin');

  document.querySelectorAll('.acct-tabs button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.dataset.mode));
  });
  ui.form.addEventListener('submit', onSubmit);
  ui.forgot.addEventListener('click', onForgot);
  ui.recForm.addEventListener('submit', onRecovery);
  ui.signout.addEventListener('click', onSignOut);

  window.addEventListener('aqeeq:chart-rendered', (e) => {
    payload = e.detail || null;
    payloadVersion += 1;
    renderReportBox(true);
  });
  if (window.__aqeeqChartPayload) {        // الخريطة اتحسبت قبل ما الملف يخلص تحميل
    payload = window.__aqeeqChartPayload;
    payloadVersion += 1;
  }

  // مهم: لا نستدعي أي دالة Supabase تانية جوه الـ callback ده.
  supabase.auth.onAuthStateChange((event, s) => {
    session = s;
    if (event === 'PASSWORD_RECOVERY') { recovering = true; goAccount(); }
    else if (event === 'SIGNED_OUT') { recovering = false; say(ui.linkMsg, ''); }
    else if (event === 'SIGNED_IN' && linkPending && !recovering) {
      linkPending = false;                    // مرة واحدة فقط، حتى لا نرجّعه لقسم الحساب كل ما يفتح التبويب
      say(ui.linkMsg, 'تم تأكيد الإيميل. إنت داخل بحسابك دلوقتي.', true);
      goAccount();
    }
    refreshAccountUI();
  });

  handleLinkErrors();
  refreshAccountUI();
  handleOrderReturn();
}

init();
