/* عقيق أسترو · واجهة قراءة الساجو (تعتمد على saju-engine.js ومكتبة astronomy.min.js) */
(function () {
  "use strict";
  var S = window.AqSaju;
  if (!S) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var DM = [
    { n: "الشجرة الكبيرة", t: "خشب يانغ. تميل إلى الاستقامة والنمو الثابت، وتكره أن تُلوى أو تُقصّ. غالبًا ترى نفسك صاحب اتجاه، وتحمل غيرك دون أن تذكر ذلك. الاختبار عندك هو المرونة: الشجرة التي لا تنحني قد تنكسر، فاسأل نفسك أين يكفي أن تميل قليلًا دون أن تفقد جذرك.", q: "هل أتمسك بهذا الموقف لأنه صواب، أم لأنني تعبت من التراجع؟" },
    { n: "العشب والزهرة المتسلقة", t: "خشب يين. مرونة ولطف وقدرة على الالتفاف حول العقبات بدل مواجهتها. غالبًا تقرأ المكان قبل أن تتكلم، وتجد طريقك بين الناس بسهولة. الاختبار عندك هو الاتكاء: قد تتعلق بمن يحملك وتنسى أن لك جذرًا، فاسأل نفسك ما الذي تقدر أن تقف عليه وحدك.", q: "ما الذي أفعله لأنه يريح الآخرين فقط؟" },
    { n: "الشمس", t: "نار يانغ. دفء وحضور وكرم يظهر في المكان قبل أن تقول شيئًا. غالبًا تعطي بسخاء ولا تحب الخفاء. الاختبار عندك هو الإنهاك: الشمس تضيء الجميع ثم تغيب، فتعلّم أن تستريح دون أن تعتذر، وأن تنتبه لمن يأخذ ضوءك ولا يعطي.", q: "من أضيء له وهو لا يراني؟" },
    { n: "الشعلة والشمعة", t: "نار يين. ضوء هادئ مركز يضيء ما حوله من قرب، ويحتاج حماية من الريح. غالبًا ترى التفاصيل وتحس بالناس بعمق، وتميل إلى علاقات قليلة قوية. الاختبار عندك هو الاحتراق الصامت: تحمل أكثر مما يظهر، فاحتفظ بمساحة تشتعل فيها لنفسك.", q: "ما الذي أحمله ولم أقله لأحد؟" },
    { n: "الجبل", t: "أرض يانغ. ثبات وثقل وقدرة على أن يتكئ الناس عليك. غالبًا لا تتعجل، وتفضل أن ترى الأمور تنضج. الاختبار عندك هو الجمود: الجبل لا يتحرك ولو كان المكان خطأ، فاسأل نفسك هل ثباتك حكمة أم خوف من الحركة.", q: "أين يكلفني البقاء أكثر مما يعطيني؟" },
    { n: "الأرض الخصبة والبستان", t: "أرض يين. رعاية وتحمّل واحتضان لما يُزرع فيها. غالبًا تهتم بالتفاصيل وتحسن إنماء ما يُعهد إليك. الاختبار عندك هو أن تُستنزف: الأرض التي تعطي دائمًا ولا تُسقى تجف، فتعلّم أن تطلب وأن تقول لا دون شرح طويل.", q: "ما الذي زرعته في غير أرضه؟" },
    { n: "السيف والحديد الخام", t: "معدن يانغ. حسم ووضوح وصراحة، ورغبة في إنهاء ما يتعطل. غالبًا تكره المماطلة وتحترم من يقول ما يقصد. الاختبار عندك هو القسوة غير المقصودة: الحد القاطع يجرح من يلمسه، فاسأل نفسك هل تحتاج إلى الحسم أم إلى الاستماع في هذا الموقف.", q: "هل قطعت لأنني متأكد، أم لأنني تعبت من الانتظار؟" },
    { n: "الجوهرة", t: "معدن يين. دقة وذوق وحساسية للجمال والتفاصيل، مع رغبة في أن يُرى معدنك على حقيقته. غالبًا تحب الإتقان وتتألم من الإهمال. الاختبار عندك هو الحساسية للنقد: الجوهرة تُصقل بالاحتكاك، فميّز بين نقد يصقلك ونقد يريد فقط أن يخدشك.", q: "ما الذي أؤجله حتى يكتمل وقد يكفي أن أبدأ به؟" },
    { n: "المحيط", t: "ماء يانغ. اتساع وحركة وفضول وقدرة على عبور الحدود والأفكار. غالبًا تحب الاستكشاف وتتأقلم مع الجديد. الاختبار عندك هو التشتت: البحر بلا ضفاف يضيع، فاحتفظ بضفتين تحدان مجراك، مثل التزام واحد وهدف واحد.", q: "أي اتجاه أتخلى عنه لأمضي في اتجاه أعمق؟" },
    { n: "المطر والندى", t: "ماء يين. حدس ورقة وقدرة على التسلل إلى ما لا يدخله غيرك. غالبًا تلتقط الجو قبل أن يُقال، وتتأثر بما حولك. الاختبار عندك هو امتصاص مشاعر غيرك: فتعلّم أن تميز بين ما هو لك وما هو لسواك.", q: "هل هذا الشعور مني أنا أم التقطته من حولي؟" }
  ];
  var EL_STRONG = [
    "الخشب الكثير يعني دفعًا إلى النمو والتوسع وكثرة المشاريع. قد تحتاج إلى حد وإلى حصاد، فالنمو بلا قطف يتحول إلى تشتت.",
    "النار الكثيرة تعني حماسة وظهورًا وسرعة. قد تحتاج إلى ماء من الراحة والصمت كي لا تحرق الطاقة قبل الوصول.",
    "الأرض الكثيرة تعني ثباتًا وتحفظًا وميلًا إلى الاستقرار. قد تحتاج إلى تجديد وحركة كي لا يتحول الثبات إلى جمود.",
    "المعدن الكثير يعني انضباطًا ودقة ومعايير عالية. قد تحتاج إلى ليونة مع نفسك ومع الآخرين كي لا تتحول الجودة إلى قسوة.",
    "الماء الكثير يعني عمقًا وحدسًا وتفكيرًا متواصلًا. قد تحتاج إلى مجرى وخطوات عملية كي لا يغرقك التفكير."
  ];
  var EL_WEAK = [
    "الخشب غائب أو قليل. جرّب ما يغذيه: التعلم، والمشي في أماكن خضراء، وبدء شيء صغير جديد دون ضغط.",
    "النار غائبة أو قليلة. جرّب ما يغذيها: الحماس المشترك، والظهور أمام الناس بدرجة تناسبك، والأنشطة التي تُدخل الدفء إلى يومك.",
    "الأرض غائبة أو قليلة. جرّب ما يغذيها: روتين ثابت، ووجبات في وقتها، وأماكن تشعر فيها أنك على أرض صلبة.",
    "المعدن غائب أو قليل. جرّب ما يغذيه: الترتيب، ووضع حدود واضحة، وإنهاء ما يتراكم دون حسم.",
    "الماء غائب أو قليل. جرّب ما يغذيه: وقت للتأمل والهدوء، والقراءة، وشرب الماء في يوم مزدحم، ومساحة تسمع فيها نفسك."
  ];
  var ELCLS = ["wood", "fire", "earth", "metal", "water"];
  var ELHEX = ["#2f7d4f", "#b5443e", "#c9a55c", "#8d939c", "#2563a8"];
  var TONE = [2, 1, 0, 0, 2];
  var PIL = [["year", "السنة", "الجذور والبيئة الأولى"], ["month", "الشهر", "العمل والبيت الذي تنشأ فيه"], ["day", "اليوم", "ذاتك وعلاقتك القريبة"], ["hour", "الساعة", "ثمارك ومرحلة متأخرة"]];
  var ICO = {
    pil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="3.5" height="16" rx="1"/><rect x="10.2" y="4" width="3.5" height="16" rx="1"/><rect x="16.5" y="4" width="3.5" height="16" rx="1"/></svg>',
    dm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>',
    el: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9Z"/></svg>',
    how: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/></svg>'
  };

  function badge(num, label, tone) { return '<span class="aqm-badge-arcana aqm-tone-' + tone + '"><b class="aqm-bn">' + num + '</b><span class="aqm-bl">' + label + '</span></span>'; }
  function item(id, icon, title, sub, badges, inner, open) {
    return '<div class="aqm-acc-item' + (open ? " open" : "") + '" id="sj-sec-' + id + '">' +
      '<button class="aqm-acc-header" type="button" aria-expanded="' + (open ? "true" : "false") + '">' +
      '<div class="aqm-acc-header-left"><span class="aqm-acc-icon" aria-hidden="true">' + icon + '</span>' +
      '<div class="aqm-acc-title-group"><h3 class="aqm-acc-title">' + title + '</h3><p class="aqm-acc-subtitle">' + sub + '</p></div></div>' +
      '<div class="aqm-acc-badges">' + badges + '</div><span class="aqm-acc-chevron" aria-hidden="true">\u203a</span></button>' +
      '<div class="aqm-acc-body"><div class="aqm-content-grid"><section class="aqm-slot">' + inner + '</section></div></div></div>';
  }

  function render(r, box) {
    var P = r.pillars, dm = r.dayMaster, dmx = DM[S.STEMS.indexOf(dm)];
    /* لوحة الأعمدة */
    var cols = ["hour", "day", "month", "year"].map(function (k, i) {
      var p = P[k], lab = { year: "السنة", month: "الشهر", day: "اليوم", hour: "الساعة" }[k];
      if (!p) return '<div class="sj-col sj-col-empty"><span>' + lab + '</span><b>\u2014</b><small>تحتاج إلى وقت الميلاد</small></div>';
      return '<div class="sj-col' + (k === "day" ? " is-day" : "") + '"><span>' + lab + '</span>' +
        '<b class="sj-han sj-' + ELCLS[p.stemInfo.el] + '">' + p.stemInfo.han + '</b><small>' + S.ELEMENTS[p.stemInfo.el] + (p.stemInfo.yang ? " يانغ" : " يين") + '</small>' +
        '<b class="sj-han sj-' + ELCLS[p.branchInfo.el] + '">' + p.branchInfo.han + '</b><small>' + p.branchInfo.animal + ' \u00b7 ' + S.ELEMENTS[p.branchInfo.el] + '</small></div>';
    }).join("");
    var diagram = '<div class="sj-board"><div class="sj-cols">' + cols + '</div><p class="sj-board-note">تقرأ الأعمدة من اليمين إلى اليسار: السنة ثم الشهر ثم اليوم ثم الساعة. في كل عمود جذع سماوي فوق وفرع أرضي تحته. السنة الساجوية عندك: ' + r.sajuYear + '، وهي تبدأ عند ليتشون (حوالي 4 فبراير) وليس عند 1 يناير.</p></div>';
    var timeNote = r.hasTime ? "" : '<p class="aqm-g-p">لم تُدخل وقت الميلاد، فظهر ثلاثة أعمدة وستة حروف. أضف الساعة لتكتمل الأعمدة الأربعة.</p>';
    var late = r.lateZi ? '<p class="aqm-g-p">وُلدت بعد الساعة 23:00، وفي هذه الطريقة يبدأ اليوم الجديد عند 23:00، فحُسب عمود يومك على اليوم التالي. بعض المدارس تغيّر اليوم عند منتصف الليل، فقد يختلف عمود يومك عندها.</p>' : "";
    /* أعمدة */
    var pbadges = ["year", "month", "day", "hour"].map(function (k, i) {
      var p = P[k]; return p ? badge(p.stemInfo.han + p.branchInfo.han, PIL[i][1], TONE[p.stemInfo.el]) : "";
    }).join("");
    var pin = "";
    PIL.forEach(function (x) {
      var p = P[x[0]]; if (!p) return;
      pin += '<h6 class="aqm-g-h2">عمود ' + x[1] + ': ' + p.stemInfo.han + p.branchInfo.han + '</h6><p class="aqm-g-p">' +
        S.ELEMENTS[p.stemInfo.el] + (p.stemInfo.yang ? " يانغ" : " يين") + ' فوق ' + S.ELEMENTS[p.branchInfo.el] + ' (' + p.branchInfo.animal + '). ' + x[2] + '.</p>';
    });
    /* سيد اليوم */
    var dmIn = '<h6 class="aqm-g-h2">' + dmx.n + '</h6><p class="aqm-g-p">' + S.ELEMENTS[dm.el] + (dm.yang ? " يانغ" : " يين") + ' (' + dm.ko + '). جذع اليوم هو مركز قراءتك في الساجو، ويرمز إلى ذاتك. عندك: ' + S.ELEMENTS[dm.el] + (dm.yang ? " يانغ" : " يين") + '.</p><p class="aqm-g-p">' + dmx.t + '</p><blockquote class="aqm-g-q"><p>سؤال تأخذه معك: ' + dmx.q + '</p></blockquote>';
    /* عناصر */
    var max = Math.max.apply(null, r.elements) || 1;
    var bars = r.elements.map(function (c, i) {
      return '<div class="sj-bar"><span>' + S.ELEMENTS[i] + '</span><i><u style="width:' + Math.round(c / max * 100) + '%;background:' + ELHEX[i] + '"></u></i><b>' + c + '</b></div>';
    }).join("");
    var strong = [], weak = [];
    r.elements.forEach(function (c, i) { if (c >= 3) strong.push(i); if (c === 0) weak.push(i); });
    var notes = "";
    strong.forEach(function (i) { notes += '<p class="aqm-g-p"><strong>' + S.ELEMENTS[i] + ' بارز.</strong> ' + EL_STRONG[i] + '</p>'; });
    weak.forEach(function (i) { notes += '<p class="aqm-g-p"><strong>' + S.ELEMENTS[i] + ' لا يظهر في حروفك.</strong> ' + EL_WEAK[i] + '</p>'; });
    if (!notes) notes = '<p class="aqm-g-p">لا يوجد عنصر طاغٍ ولا عنصر غائب في حروفك الظاهرة. هذا يوصف عادة بتوزيع متوازن نسبيًا، لكن التوازن في الساجو يُقرأ مع قوة كل عمود وليس بالعدد وحده.</p>';
    var ebadges = r.elements.map(function (c, i) { return badge(c, S.ELEMENTS[i], TONE[i]); }).join("");
    var how = '<p class="aqm-g-p">الحساب فعلي بموضع الشمس: عمود السنة يتبدل عند ليتشون، وعمود الشهر بالمصطلحات الشمسية الاثني عشر، وعمود اليوم من دورة الستين يومًا، وعمود الساعة كل ساعتين.</p>' +
      '<p class="aqm-g-p">هذه قراءة رمزية للتأمل وليست حكمًا على حياتك أو علاقاتك أو صحتك. نظام الساجو يقرأ الأعمدة أيضًا بقوة الفصل وبالعلاقات بين الحروف، وهذه نسخة أولى تعرض الأعمدة والعناصر وسيد اليوم. الحساب بتوقيت الميلاد المحلي الذي أدخلته مع فرق التوقيت، ولا يتضمن تصحيح الوقت الشمسي الحقيقي للمدينة.</p>' +
      '<p class="aqm-g-p"><a href="#featured-content/saju-how-pillars-calculated">اقرأ: كيف تُحسب أعمدتك الأربعة؟</a></p>';
    box.innerHTML = diagram + '<p class="aqm-hint"><span>اضغط على أي قسم لعرض تفسيره</span></p><div class="aqm-accordion-container" id="sj-readings">' +
      item("pillars", ICO.pil, "أعمدتك الأربعة", "من أي لحظة تبدأ خريطتك؟", pbadges, timeNote + late + pin, true) +
      item("daymaster", ICO.dm, "سيد اليوم", dm.han + " \u00b7 " + dmx.n, badge(dm.han, S.ELEMENTS[dm.el], TONE[dm.el]), dmIn, false) +
      item("elements", ICO.el, "توازن العناصر", "أي العناصر الخمسة يظهر في حروفك؟", ebadges, '<div class="sj-bars">' + bars + '</div><p class="aqm-g-p">العدد من ' + r.total + ' حروف ظاهرة. عنصر ذاتك (' + S.ELEMENTS[dm.el] + ') يظهر ' + r.elements[dm.el] + (r.elements[dm.el] === 1 ? " مرة" : " مرات") + '.</p>' + notes, false) +
      item("how", ICO.how, "كيف حُسبت؟", "حدود الحساب وطريقته", "", how, false) + '</div>';
    box.querySelectorAll(".aqm-acc-header").forEach(function (h) {
      h.addEventListener("click", function () { var it = h.parentNode, o = !it.classList.contains("open"); it.classList.toggle("open", o); h.setAttribute("aria-expanded", o ? "true" : "false"); });
    });
  }

  function init() {
    var f = $("#sj-form"); if (!f) return;
    var out = $("#sj-result"), err = $("#sj-err");
    var tz = $("#sj-tz");
    if (tz && !tz.options.length) {
      var opts = [[2, "القاهرة (+2)"], [3, "الرياض / بغداد / الكويت / القاهرة صيفًا (+3)"], [4, "الإمارات / مسقط (+4)"], [1, "تونس / الجزائر (+1)"], [0, "المغرب / لندن (0)"], [9, "كوريا / اليابان (+9)"], [8, "الصين / سنغافورة (+8)"], [-5, "نيويورك (-5)"], [-8, "لوس أنجلوس (-8)"]];
      tz.innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join("");
    }
    var noTime = $("#sj-notime"), time = $("#sj-time");
    if (noTime && time) noTime.addEventListener("change", function () { time.disabled = noTime.checked; });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      err.hidden = true;
      try {
        if (!window.Astronomy) throw new Error("مكتبة الحساب لم تُحمّل بعد. أعد المحاولة بعد لحظات.");
        var d = ($("#sj-date").value || "").split("-").map(Number);
        if (d.length !== 3 || !d[0]) throw new Error("اكتب تاريخ الميلاد.");
        if (d[0] < 1900 || d[0] > 2100) throw new Error("التاريخ المتاح من 1900 إلى 2100.");
        var h = null, mi = 0;
        if (!(noTime && noTime.checked) && time.value) { var t = time.value.split(":").map(Number); h = t[0]; mi = t[1] || 0; }
        var r = S.compute(window.Astronomy, { year: d[0], month: d[1], day: d[2], hour: h, minute: mi, utcOffset: Number(tz.value) });
        render(r, out); out.hidden = false;
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (x) { err.textContent = x.message || "تعذر الحساب."; err.hidden = false; }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
