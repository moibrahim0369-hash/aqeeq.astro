/* الدفع اليدوي: محفظة / إنستاباي / PayPal. العميل يسجّل رقم العملية، والمالك يراجع ويوافق (يفعّل نفس مسار تسليم التقرير). */
(function () {
  var CFG = { product: 'full_report', phone: '01143813559', paypal: 'https://www.paypal.me/elbr1mo' };
  var METHODS = {
    wallet: { label: 'محفظة إلكترونية', hint: 'حوّل على رقم المحفظة', value: CFG.phone, ref: 'رقم العملية من رسالة التأكيد' },
    instapay: { label: 'إنستاباي', hint: 'حوّل على رقم الموبايل', value: CFG.phone, ref: 'الرقم المرجعي للتحويل' },
    paypal: { label: 'PayPal', hint: 'ادفع بالدولار من حسابك', link: CFG.paypal, ref: 'رقم المعاملة (Transaction ID)' }
  };
  var STATUS = { pending: 'قيد المراجعة', approved: 'تم التأكيد', rejected: 'مرفوض' };
  var $ = function (id) { return document.getElementById(id); };
  var sb = function () { return window.aqeeqSupabase; };
  var chosen = 'wallet', busy = false;

  function say(id, t, ok) { var e = $(id); if (!e) return; e.hidden = !t; e.textContent = t || ''; e.classList.toggle('ok', !!ok); }
  function fmtPrice(c, cur) { return (c / 100) + ' ' + (cur === 'EGP' ? 'ج.م' : cur); }

  function renderMethod() {
    var m = METHODS[chosen];
    document.querySelectorAll('#pay [data-pm]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pm') === chosen)); });
    $('pay-detail-hint').textContent = m.hint;
    var val = $('pay-detail-val'), copy = $('pay-copy'), go = $('pay-paypal');
    if (m.link) { val.textContent = 'paypal.me/elbr1mo'; copy.hidden = true; go.hidden = false; go.href = m.link; }
    else { val.textContent = m.value; copy.hidden = false; go.hidden = true; }
    $('pay-ref-label').textContent = m.ref;
    $('pay-note-egp').hidden = !!m.link; $('pay-note-usd').hidden = !m.link;
  }

  function loadPrice() {
    if (!sb()) return;
    sb().from('products').select('amount_cents,currency,name_ar').eq('code', CFG.product).maybeSingle().then(function (r) {
      var d = r && r.data; if (!d) return;
      $('pay-price').textContent = fmtPrice(d.amount_cents, d.currency);
      if (d.name_ar) $('pay-prod').textContent = d.name_ar;
    }, function () {});
  }

  function loadMine() {
    if (!sb()) return;
    sb().from('manual_payments').select('id,method,status,created_at').order('created_at', { ascending: false }).limit(8).then(function (r) {
      var rows = (r && r.data) || [], box = $('pay-mine'), list = $('pay-mine-list');
      list.textContent = ''; box.hidden = !rows.length;
      rows.forEach(function (x) {
        var li = document.createElement('li');
        var a = document.createElement('span'); a.textContent = (METHODS[x.method] || { label: x.method }).label + ' · ' + new Date(x.created_at).toLocaleDateString('ar-EG');
        var b = document.createElement('b'); b.className = 'st-' + x.status; b.textContent = STATUS[x.status] || x.status;
        li.appendChild(a); li.appendChild(b); list.appendChild(li);
      });
      var pend = rows.some(function (x) { return x.status === 'pending'; });
      $('pay-form').hidden = pend; $('pay-pending').hidden = !pend;
    }, function () {});
  }

  function refresh() {
    if (location.hash !== '#pay' || !sb() || !sb().auth) return;
    sb().auth.getSession().then(function (r) {
      var signed = !!(r && r.data && r.data.session);
      $('pay-guest').hidden = signed; $('pay-main').hidden = !signed;
      if (signed) { loadPrice(); loadMine(); }
    });
  }

  function errText(e) {
    var m = String((e && e.message) || '');
    if (/already_pending/.test(m)) return 'عندك طلب قيد المراجعة بالفعل.';
    if (/bad_reference/.test(m)) return 'اكتب رقم العملية (3 حروف أو أرقام على الأقل).';
    if (/not_authenticated/.test(m)) return 'سجّل دخولك الأول.';
    return 'تعذّر إرسال الطلب. جرّب تاني بعد شوية.';
  }

  function submit(ev) {
    ev.preventDefault(); if (busy) return;
    var ref = $('pay-ref').value.trim();
    if (ref.length < 3) return say('pay-msg', 'اكتب رقم العملية (3 حروف أو أرقام على الأقل).');
    busy = true; $('pay-send').disabled = true; say('pay-msg', '');
    sb().rpc('submit_manual_payment', { p_product: CFG.product, p_method: chosen, p_reference: ref }).then(function (r) {
      if (r.error) throw r.error;
      $('pay-ref').value = ''; say('pay-msg', 'وصلنا طلبك. هنراجع التحويل ونفعّل تقريرك في أقرب وقت.', true); loadMine();
    }).catch(function (e) { say('pay-msg', errText(e)); }).then(function () { busy = false; $('pay-send').disabled = false; });
  }

  function copyNum() {
    var v = METHODS[chosen].value, b = $('pay-copy'), t = b.querySelector('span');
    var done = function () { t.textContent = 'تم النسخ'; setTimeout(function () { t.textContent = 'نسخ الرقم'; }, 1800); };
    try { navigator.clipboard.writeText(v).then(done, done); } catch (e) { done(); }
  }

  /* ---- صفحة المراجعة (للمالك فقط، والتحقق في القاعدة) ---- */
  function loadAdmin() {
    if (location.hash !== '#admin-pay' || !sb()) return;
    var list = $('adm-list'), msg = $('adm-msg'); list.textContent = ''; say('adm-msg', 'جارٍ التحميل...');
    sb().rpc('admin_list_manual_payments').then(function (r) {
      if (r.error) { say('adm-msg', 'هذه الصفحة للمالك فقط. سجّل دخولك بحساب المالك.'); return; }
      var rows = r.data || []; say('adm-msg', rows.length ? '' : 'لا توجد طلبات بعد.');
      rows.forEach(function (x) {
        var li = document.createElement('li'); li.className = 'adm-row';
        var h = document.createElement('div'); h.className = 'adm-info';
        [['', (x.full_name || '') + ' · ' + x.email], ['', (METHODS[x.method] || { label: x.method }).label + ' · ' + fmtPrice(x.amount_cents, x.currency)], ['ltr', x.reference], ['', new Date(x.created_at).toLocaleString('ar-EG')]].forEach(function (p, i) {
          var s = document.createElement(i === 0 ? 'strong' : 'span'); if (p[0]) s.dir = p[0]; s.textContent = p[1]; h.appendChild(s);
        });
        li.appendChild(h);
        var act = document.createElement('div'); act.className = 'adm-act';
        if (x.status === 'pending') {
          [['approve', true, 'تأكيد'], ['reject', false, 'رفض']].forEach(function (a) {
            var b = document.createElement('button'); b.type = 'button'; b.className = 'adm-btn ' + a[0]; b.textContent = a[2];
            b.addEventListener('click', function () {
              if (!window.confirm(a[1] ? 'تأكيد الدفعة وتفعيل التقرير؟' : 'رفض هذه الدفعة؟')) return;
              b.disabled = true;
              sb().rpc('admin_review_manual_payment', { p_id: x.id, p_approve: a[1] }).then(function (rr) {
                if (rr.error) say('adm-msg', 'تعذّر تنفيذ الإجراء.'); loadAdmin();
              });
            });
            act.appendChild(b);
          });
        } else { var st = document.createElement('b'); st.className = 'st-' + x.status; st.textContent = STATUS[x.status]; act.appendChild(st); }
        li.appendChild(act); list.appendChild(li);
      });
    });
  }

  function init() {
    if (!$('pay')) return;
    document.querySelectorAll('#pay [data-pm]').forEach(function (b) { b.addEventListener('click', function () { chosen = b.getAttribute('data-pm'); renderMethod(); }); });
    $('pay-form').addEventListener('submit', submit);
    $('pay-copy').addEventListener('click', copyNum);
    renderMethod();
    window.addEventListener('hashchange', function () { refresh(); loadAdmin(); });
    /* عميل Supabase يُعرَّف من وحدة module قد تتأخر عن هذا السكربت */
    var tries = 0, t = setInterval(function () {
      if (sb() && sb().auth) {
        clearInterval(t);
        sb().auth.onAuthStateChange(function () { refresh(); loadAdmin(); });
        refresh(); loadAdmin();
      } else if (++tries > 100) clearInterval(t);
    }, 100);
  }
  /* بوابة Paymob غير مفعّلة حاليًا: زر الشراء القديم يفتح صفحة الدفع. للعودة لـ Paymob عرّف window.AQEEQ_PAYMOB_ENABLED = true قبل هذا السكربت. */
  document.addEventListener('click', function (e) {
    if (!window.AQEEQ_PAYMOB_ENABLED && e.target.closest && e.target.closest('#acct-buy')) { e.preventDefault(); e.stopImmediatePropagation(); location.hash = '#pay'; }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
