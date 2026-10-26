// عقيق أسترو — تسجيل الدخول (قسم «حسابي») وطلب القراءة الكاملة (من نتيجة الخريطة).
// يُحمَّل كـ <script type="module" src="auth.js"> ويعتمد على supabase-client.js.
// لا يوجد innerHTML بأي نص ديناميكي هنا: كل شيء يُبنى بـ textContent حتى لا يمكن حقن HTML من القراءة أو من الأخطاء.
import { supabase } from './supabase-client.js';

const MIN_PASSWORD = 8;

const $ = (s, r = document) => r.querySelector(s);

/* ---------- حالة الصفحة ---------- */
let session = null;
let mode = 'signin';          // signin | signup
let recovering = false;       // المستخدم جاي من رابط إعادة تعيين كلمة المرور

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
  google: $('#acct-google'),
  userEmail: $('#acct-user-email'),
  signout: $('#acct-signout'),
  buy: $('#acct-buy'),
  buyMsg: $('#acct-buy-msg'),
  generateReport: $('#acct-generate-report'),
  whatsapp: $('#acct-whatsapp-support'),
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
  if (ui.generateReport) ui.generateReport.hidden = !loggedIn || !sessionStorage.getItem('aq-paid-report-order');
  if (!loggedIn && ui.whatsapp) ui.whatsapp.hidden = true;
  if (loggedIn) refreshDeliveredReportSupport();
}

async function refreshDeliveredReportSupport() {
  if (!ui.whatsapp || !session?.user?.id) return;
  ui.whatsapp.hidden = true;
  try {
    const { data, error } = await supabase
      .from('report_deliveries')
      .select('order_id, delivery_channel, orders!inner(status, product_code)')
      .eq('user_id', session.user.id)
      .eq('status', 'delivered')
      .eq('orders.status', 'paid')
      .eq('orders.product_code', 'full_report')
      .limit(1);
    if (error) throw error;
    const delivered = Array.isArray(data) && data.some(row =>
      row && row.orders && row.orders.status === 'paid' && row.orders.product_code === 'full_report'
    );
    ui.whatsapp.hidden = !delivered;
    if (delivered) {
      const text = encodeURIComponent('مرحباً، أحتاج مساعدة بخصوص التقرير الفلكي الذي تم تسليمه لي في عقيق أسترو.');
      ui.whatsapp.href = 'https://wa.me/201143813559?text=' + text;
    }
  } catch (err) {
    // Fail closed: never expose the support link if delivery status cannot be verified.
    ui.whatsapp.hidden = true;
    console.error('Could not verify report delivery state');
  }
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

async function onGoogleSignIn() {
  say(ui.msg, '');
  busy(ui.google, true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl() },
    });
    if (error) throw error;
  } catch (err) {
    say(ui.msg, arError(err));
    busy(ui.google, false);
  }
}

function removeInstagramLinks() {
  document.querySelectorAll('#ig, #ig-top, [data-ig-link], a[href*="instagram.com"]')
    .forEach((el) => el.remove());
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

/* ---------- بدء الدفع ---------- */
const CHECKOUT_HOSTS = ['accept.paymob.com', 'uae.paymob.com', 'ksa.paymob.com', 'oman.paymob.com'];

function safeCheckoutUrl(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && CHECKOUT_HOSTS.includes(u.hostname) ? u.href : null;
  } catch { return null; }
}

async function onBuy() {
  say(ui.buyMsg, '');
  if (!session) return say(ui.buyMsg, 'سجّل دخولك الأول.');
  busy(ui.buy, true);
  let navigating = false;
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', { body: { product: 'full_report' } });
    if (error) {
      let msg = '';
      try { msg = (await error.context.json()).error || ''; } catch { /* no body */ }
      throw new Error(msg || 'تعذّر بدء الدفع. جرّب تاني بعد شوية.');
    }
    const url = safeCheckoutUrl(data && data.checkoutUrl);
    if (!url) throw new Error('رابط الدفع غير صالح. جرّب تاني.');
    navigating = true;
    location.assign(url);
    setTimeout(() => busy(ui.buy, false), 8000);   // لو المستخدم رجع بزر الرجوع
  } catch (err) {
    const m = err && err.message;
    say(ui.buyMsg, m && !/failed to fetch|network|load failed/i.test(m) ? m : arError(err));
  } finally {
    if (!navigating) busy(ui.buy, false);
  }
}

/* ---------- الرجوع من صفحة الدفع ---------- */
async function handleOrderReturn() {
  const q = new URLSearchParams(location.search);
  const id = q.get('order');
  if (!id) return;
  q.delete('order');
  const rest = q.toString();
  history.replaceState(null, '', location.pathname + (rest ? `?${rest}` : '') + '#account');
  if (!/^[0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}$/i.test(id)) return;
  say(ui.linkMsg, 'بنتأكد من الدفع…', true);
  for (let i = 0; i < 10; i++) {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) { say(ui.linkMsg, 'سجّل دخولك عشان نتأكد من حالة الدفع.'); return; }
    const { data, error } = await supabase.from('orders')
      .select('id,status,product_code,user_id')
      .eq('id', id).eq('user_id', s.user.id).maybeSingle();
    if (error) { say(ui.linkMsg, 'تعذر التحقق من الطلب حالياً. حدّث الصفحة بعد قليل.'); return; }
    if (data && data.status === 'paid') {
      if (data.product_code !== 'full_report') {
        say(ui.linkMsg, 'تم تأكيد الدفع، لكن الطلب ده مش طلب تقرير كامل.', true);
        return;
      }
      sessionStorage.setItem('aq-paid-report-order', data.id);
      refreshAccountUI();
      say(ui.linkMsg, 'تم تأكيد الدفع بنجاح. اضغط «تجهيز التقرير المدفوع» لإرسال التقرير إلى إيميل حسابك.', true);
      return;
    }
    if (data && data.status === 'cancelled') { say(ui.linkMsg, 'الدفع ماتمش. ماتم خصم أي مبلغ.'); return; }
    await new Promise((r) => setTimeout(r, 3000));
  }
  say(ui.linkMsg, 'لسه مستنيين تأكيد الدفع. لو اتخصم المبلغ هيتفعّل تلقائياً خلال دقايق، حدّث الصفحة.');
}

async function onGenerateReport() {
  if (!session || !ui.generateReport) return;
  const orderId = sessionStorage.getItem('aq-paid-report-order');
  if (!orderId) return say(ui.linkMsg, 'لازم نتحقق من طلب مدفوع الأول.');
  let draft;
  try { draft = JSON.parse(sessionStorage.getItem('aq-report-draft') || 'null'); } catch { draft = null; }
  if (!draft || !draft.chartData || !draft.birthData) {
    return say(ui.linkMsg, 'احسب خريطة الميلاد الأول من قسم «خريطة الميلاد»، وبعدها ارجع واضغط تجهيز التقرير.', false);
  }
  busy(ui.generateReport, true);
  say(ui.linkMsg, 'بنجهز التقرير وهنبعته على إيميل حسابك. ممكن ياخد شوية وقت…', true);
  try {
    const { data, error } = await supabase.functions.invoke('generate-astro-report', {
      body: { orderId, userName: draft.userName || '', birthData: draft.birthData, chartData: draft.chartData }
    });
    if (error) {
      let message = '';
      try { message = (await error.context.json()).error || ''; } catch (_) {}
      throw new Error(message || 'تعذر تجهيز التقرير الآن.');
    }
    if (!data || data.success !== true) throw new Error((data && data.error) || 'تعذر تجهيز التقرير الآن.');
    if (data.emailSent && data.deliveryMarked) {
      sessionStorage.removeItem('aq-paid-report-order');
      refreshAccountUI();
      await refreshDeliveredReportSupport();
      say(ui.linkMsg, 'التقرير اتجهز واتقبل للإرسال على إيميل حسابك. زر واتساب هيظهر بعد تأكيد حالة التسليم.', true);
    } else if (data.emailSent) {
      say(ui.linkMsg, 'التقرير اتبعت لمزود البريد، لكن حالة التسليم لسه ما اتأكدتش. زر واتساب هيفضل مخفي لحد ما الحالة تتسجل.', false);
    } else {
      say(ui.linkMsg, 'التقرير اتجهز، لكن البريد لم يؤكد الإرسال. لم يتم تسجيل التسليم، وزر واتساب سيظل مخفياً.', false);
    }
  } catch (err) {
    say(ui.linkMsg, arError(err));
  } finally {
    busy(ui.generateReport, false);
  }
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
  if (!ui.google && ui.form.parentNode) {
    ui.google = document.createElement('button');
    ui.google.type = 'button';
    ui.google.id = 'acct-google';
    ui.google.className = 'btn ghost';
    ui.google.setAttribute('aria-label', 'المتابعة باستخدام Google');
    ui.google.textContent = 'G  المتابعة باستخدام Google';
    ui.form.parentNode.insertBefore(ui.google, ui.form);
  }
  removeInstagramLinks();
  ui.form.addEventListener('submit', onSubmit);
  ui.google?.addEventListener('click', onGoogleSignIn);
  ui.forgot.addEventListener('click', onForgot);
  ui.recForm.addEventListener('submit', onRecovery);
  ui.signout.addEventListener('click', onSignOut);
  ui.buy.addEventListener('click', onBuy);
  if (ui.generateReport) ui.generateReport.addEventListener('click', onGenerateReport);

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
