/* حالة الدخول + خصوصية الخروج: عند تسجيل الخروج تُمسح بيانات هذا المتصفح (التعبئة التلقائية والمحفوظات المحلية والنشاط)
   وتبقى بيانات الحساب محفوظة على الخادم. تعرض أيضًا window.AqSession وحدث aq:session لبقية الواجهة. لا تمسّ منطق auth. */
(function () {
  'use strict';
  var KEYS = ['aqeeq_profile_cache_v1', 'aqeeq_preferred_name_v1', 'aqeeq_saved_readings_v1', 'aqeeq_activity_v1', 'aq-last-birth-v1', 'aq-gender'];
  var S = window.AqSession = { known: false, user: null, wipe: wipe };
  function wipe() { KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (_) {} }); }
  S.isAdmin = false;
  function checkAdmin(user) {
    S.isAdmin = false; document.documentElement.removeAttribute('data-admin');
    if (!user) return;
    try {
      window.aqeeqSupabase.rpc('is_app_admin').then(function (r) {
        if (r && r.data === true && S.user && S.user.id === user.id) {
          S.isAdmin = true; document.documentElement.setAttribute('data-admin', '1');
          if (!window.__aqPaywallOrig) { window.__aqPaywallOrig = window.openPaywallModal; window.openPaywallModal = function () {}; }
          document.dispatchEvent(new CustomEvent('aq:admin'));
        }
      }, function () {});
    } catch (_) {}
  }
  function apply(user) {
    S.known = true; S.user = user || null; checkAdmin(user);
    document.documentElement.setAttribute('data-auth', user ? 'in' : 'out');
    document.dispatchEvent(new CustomEvent('aq:session', { detail: { user: S.user } }));
  }
  function hook() {
    var sb = window.aqeeqSupabase;
    if (!sb || !sb.auth) return false;
    sb.auth.onAuthStateChange(function (ev, session) {
      var user = session && session.user ? session.user : null;
      if (ev === 'SIGNED_OUT') {
        wipe(); apply(null);
        try { location.hash = '#home'; } catch (_) {}
        setTimeout(function () { location.reload(); }, 60);
        return;
      }
      if (ev === 'INITIAL_SESSION' && !user) wipe();
      apply(user);
    });
    return true;
  }
  document.documentElement.setAttribute('data-auth', 'out');
  var n = 0, t = setInterval(function () { if (hook() || ++n > 60) clearInterval(t); }, 150);
})();
