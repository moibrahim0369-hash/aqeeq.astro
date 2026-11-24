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
  function what(t) { return '<div class="sj-what"><strong>ما معنى هذا؟</strong> ' + t + '</div>'; }
  var PLAIN = { year: "عمود السنة بيحكي عن بيئتك الأولى وعيلتك وجذورك: إزاي بدأت.", month: "عمود الشهر بيحكي عن البيت اللي نشأت فيه وعن شغلك ومسارك العملي.", day: "عمود اليوم بيحكي عنك أنت: طبعك الحقيقي وعلاقتك القريبة، وشريك الحياة.", hour: "عمود الساعة بيحكي عن ثمارك: أولادك وأعمالك والمرحلة المتأخرة من العمر." };
  function item(title, inner) {
    return '<details class="sj-acc"><summary><span class="sj-acc-t">' + title + '</span><span class="sj-acc-ch" aria-hidden="true"></span></summary><div class="sj-acc-body">' + inner + '</div></details>';
  }


  /* ===== برجك الصيني وتفاصيل الخريطة (من الأعمدة المحسوبة + الجداول التقليدية) ===== */
  var ANI = [
    "ذكاء وسرعة بديهة وقدرة على التأقلم.",
    "صبر وثبات وميل إلى البناء البطيء.",
    "جرأة وحماسة وميل إلى القيادة.",
    "لطف وذوق وميل إلى تهدئة الأجواء.",
    "حضور قوي وطموح وخيال واسع.",
    "تأمل وعمق وحدس، وتفكير طويل قبل الكلام.",
    "طاقة وحب للحركة والناس، وضيق من الروتين الطويل.",
    "رقة وخيال وحس فني.",
    "ذكاء وخفة ظل وحب للتجربة.",
    "دقة واهتمام بالتفاصيل ووضوح في الرأي.",
    "وفاء وصدق وحس بالعدل.",
    "كرم وطيبة وحب للراحة."
  ];
  var YEL = [
    "ميلًا إلى النمو والتعلم.",
    "دفئًا وحماسة.",
    "ثباتًا واهتمامًا بمن حولك.",
    "حزمًا ووضوحًا.",
    "مرونة وعمقًا."
  ];
  var HID = [[9], [5, 9, 7], [0, 2, 4], [1], [4, 1, 9], [2, 4, 6], [3, 5], [5, 3, 1], [6, 8, 4], [7], [4, 7, 3], [8, 0]];
  var TRI = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
  var SIX = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  var PEACH = { 0: 9, 1: 0, 2: 3, 3: 6 };
  var TRAVEL = { 0: 2, 1: 5, 2: 8, 3: 11 };
  function triOf(b) { for (var i = 0; i < 4; i++) if (TRI[i].indexOf(b) > -1) return i; return 0; }
  var NOBLE = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 8: [5, 3], 9: [5, 3], 7: [2, 6] };
  var COLORS = ["الأخضر والفيروزي", "الأحمر والبرتقالي والبنفسجي", "الأصفر والبيج والبني", "الأبيض والفضي والذهبي والرمادي", "الأزرق الداكن والأسود"];
  var WALLET = ["أخضر داكن", "أحمر داكن", "بني جملي", "أبيض أو فضي", "أزرق داكن"];
  var DIRS = ["الشرق", "الجنوب", "المركز", "الغرب", "الشمال"];
  var NUMS = ["3 و8", "2 و7", "5 و10", "4 و9", "1 و6"];
  /* الآلهة العشرة: [العائلة، الاسم، الصيني، المعنى] حسب العلاقة العنصرية (0..4) والقطبية (0 نفس القطبية، 1 مختلفة) */
  var FAM = ["الأنداد", "التعبير", "الثروة", "السلطة", "المعرفة"];
  var TG = [
    [["النِّد", "比肩", "نظير لك في الطبع، ويعبّر عن استقلالك وعلاقتك بأقرانك."], ["الشريك المنافس", "劫財", "مشاركة الموارد والمنافسة مع الأقران."]],
    [["التعبير الهادئ", "食神", "الموهبة والتذوق والعطاء دون استعجال."], ["التعبير الحاد", "傷官", "الإبداع والجرأة في الكلام والنقد."]],
    [["الثروة المتحركة", "偏財", "التعامل مع الفرص والمال المتغير والعلاقات الواسعة."], ["الثروة الثابتة", "正財", "الدخل المنتظم والمسؤولية العملية."]],
    [["الضغط والتحدي", "七殺", "المواجهة واختبار القدرة تحت الضغط."], ["النظام والمسؤولية", "正官", "القواعد والمكانة والالتزام."]],
    [["المعرفة غير التقليدية", "偏印", "الفضول والاهتمام بما هو خارج المألوف."], ["المعرفة الراعية", "正印", "التعلم والحماية ومن يرعاك."]]
  ];
  function god(dm, st) { var rel = (st.el - dm.el + 5) % 5, pol = st.yang === dm.yang ? 0 : 1; return { fam: rel, g: TG[rel][pol] }; }
  function yearsOf(b) { var o = []; for (var y = 1972; y <= 2031; y++) if (((y - 4) % 12 + 12) % 12 === b) o.push(y); return o.join("، "); }
  var POSN = { year: "السنة", month: "الشهر", day: "اليوم", hour: "الساعة" };

  function compat(Y) {
    var tri = TRI[triOf(Y)].filter(function (b) { return b !== Y; });
    var six = 0; SIX.forEach(function (p2) { if (p2[0] === Y) six = p2[1]; else if (p2[1] === Y) six = p2[0]; });
    function line(b) { return "<strong>" + S.BRANCHES[b].animal + "</strong> (" + yearsOf(b) + ")"; }
    return '<p class="sj-p"><strong>التحالف الثلاثي:</strong> ' + tri.map(line).join(" و") + '.</p>' +
      '<p class="sj-p"><strong>الاقتران السداسي:</strong> ' + line(six) + '.</p>' +
      '<p class="sj-p"><strong>المقابل (التصادم):</strong> ' + line((Y + 6) % 12) + '.</p>';
  }

  function signSections(r, dm, dmx) {
    var P = r.pillars, yp = P.year, ks = ["year", "month", "day", "hour"], amb = r.amb || {};
    var out = "";
    /* 1) البرج */
    if (amb.year) {
      var a0 = r.ambYear[0], a1 = r.ambYear[1];
      out += item("برجك الصيني",
        '<p class="sj-p">يوم ميلادك هو يوم بداية السنة الساجوية (ليتشون)، ووقت الميلاد غير مُدخل، فلا يمكن الجزم بحيوانك. هناك احتمالان: قبل اللحظة <strong>' + a0.stemInfo.han + a0.branchInfo.han + ' (' + a0.branchInfo.animal + ')</strong>، وبعدها <strong>' + a1.stemInfo.han + a1.branchInfo.han + ' (' + a1.branchInfo.animal + ')</strong>. أضف وقت ميلادك ليتحدد.</p>');
      out += item("الحيوانات المتوافقة معك", '<p class="sj-p">تظهر بعد تحديد حيوانك. أضف وقت الميلاد.</p>');
    } else {
      var Y = yp.branch, aniName = yp.branchInfo.animal, polar = yp.stemInfo.yang ? "يانغ" : "يين";
      var early = r.gy && r.gy !== r.sajuYear ? '<p class="sj-p">وُلدت قبل بداية السنة الساجوية (ليتشون، حوالي 4 فبراير)، فبرجك هو حيوان سنة ' + r.sajuYear + ' وليس سنة ' + r.gy + '.</p>' : "";
      out += item("برجك الصيني",
        '<p class="sj-p">عمود سنتك ' + yp.stemInfo.han + yp.branchInfo.han + '، وحيوانك هو <strong>' + aniName + '</strong>، وعنصر سنتك <strong>' + S.ELEMENTS[yp.stemInfo.el] + ' ' + polar + '</strong>.</p>' + early +
        '<p class="sj-p">يرتبط ' + aniName + ' بـ' + ANI[Y] + ' ويضيف عنصر ' + S.ELEMENTS[yp.stemInfo.el] + ' ' + YEL[yp.stemInfo.el] + '</p>');
      out += item("الحيوانات المتوافقة معك", what("التحالف الثلاثي: ثلاثة حيوانات بينها انسجام في الدائرة الصينية. الاقتران السداسي: حيوان واحد بيتجمع معاك في زوج. المقابل: الحيوان اللي على الجهة المعاكسة في الدائرة، يعني على بُعد ستة حيوانات منك.") + compat(Y) +
        '<p class="sj-p">هذه علاقات بين فروع السنوات في الجداول التقليدية. السنوات المذكورة سنوات ساجوية من 1972 إلى 2031، وكل واحدة تبدأ عند ليتشون (حوالي 4 فبراير) وتنتهي عند ليتشون التالي.</p>' +
        '<p class="sj-p">لو بتحاول تفهم علاقتك بشخص معيّن، ابدأ من اتفاقاتكم وطريقة اختلافكم، مش من سنة ميلاده وحدها.</p>');
    }
    if (amb.year || amb.month) {
      out += item("أبواب شخصيتك (الآلهة العشرة)", '<p class="sj-p">يوم ميلادك هو يوم انتقال بين فترتين شمسيتين، ووقت الميلاد غير مُدخل، فيتغير عمود ' + (amb.year ? "السنة والشهر" : "الشهر") + ' بحسب الساعة. أضف وقت ميلادك لحساب الآلهة العشرة والنجوم.</p>');
    } else {
      /* 3) الآلهة العشرة: كل جذع ظاهر وكل جذع مخفي بدوره وموقعه */
      var cnt = [0, 0, 0, 0, 0], seen = {}, body = "";
      ks.forEach(function (k) {
        var p = P[k]; if (!p) return;
        var parts = [];
        if (k === "day") parts.push("الجذع الظاهر " + p.stemInfo.han + ": سيد يومك (مرجع القياس)");
        if (k !== "day") { var g0 = god(dm, p.stemInfo); cnt[g0.fam]++; seen[g0.g[1]] = g0.g; parts.push("الجذع الظاهر " + p.stemInfo.han + ": " + g0.g[0] + " (" + g0.g[1] + ")"); }
        var hs = HID[p.branch].map(function (si, j) { var st = S.STEMS[si], g1 = god(dm, st); cnt[g1.fam]++; seen[g1.g[1]] = g1.g; return st.han + " = " + g1.g[0] + " (" + g1.g[1] + ")" + (j === 0 ? " [رئيسي]" : ""); });
        parts.push("المخفي في " + p.branchInfo.han + ": " + hs.join("، "));
        body += '<h4 class="sj-h4">عمود ' + POSN[k] + ': ' + p.stemInfo.han + p.branchInfo.han + '</h4><p class="sj-p">' + parts.join(". ") + '.</p>';
      });
      var mx = Math.max.apply(null, cnt), gh = '<div class="sj-bars">' + cnt.map(function (c, i) {
        return '<div class="sj-bar"><span>' + FAM[i] + '</span><i><u style="width:' + Math.round(c / (mx || 1) * 100) + '%;background:#c9a55c"></u></i><b>' + c + '</b></div>';
      }).join("") + '</div>';
      var mean = "";
      Object.keys(seen).forEach(function (k) { mean += '<p class="sj-p"><strong>' + seen[k][0] + ' (' + k + '):</strong> ' + seen[k][2] + '</p>'; });
      out += item("أبواب شخصيتك (الآلهة العشرة)",
        what("كل حرف في خريطتك له علاقة بسيد يومك: هل هو شبهك، أو ناتج منك، أو يتحكم فيك، أو يغذيك. الأسماء (النِّد، التعبير، الثروة، السلطة، المعرفة) هي أسماء هذه العلاقات وليست أحكامًا عليك. والحروف المخفية هي حروف صغيرة مستترة داخل كل فرع أرضي.") + '<p class="sj-p">في الساجو يُقرأ كل جذع بعلاقته بسيد يومك (' + dm.han + ') من حيث العنصر والقطبية. هذه الأدوار في خريطتك:</p>' + body +
        '<p class="sj-p">عدّ الأدوار مجمّعة في خمس عائلات (عدّ للحروف وليس قياسًا للقوة، فالقوة تعتمد على الفصل والجذور):</p>' + gh + mean +
        '<p class="sj-p">سؤال تأخذه معك: لما يبقى قدامك رأيان، بتتمسك بقرارك ولا بتغيره عشان تحافظ على القرب؟ احكِ موقفًا حصل، بدل ما تختار الصفة اللي تعجبك.</p>');
    }
    /* 4) جدول العناصر */
    var d = dm.el, ye = yp.stemInfo.el;
    var rows = "";
    [d].concat(ye !== d && !amb.year ? [ye] : []).forEach(function (e) {
      rows += '<h4 class="sj-h4">' + S.ELEMENTS[e] + (e === d ? " (عنصر سيد يومك)" : " (عنصر سنتك)") + '</h4><p class="sj-p"><strong>الألوان:</strong> ' + COLORS[e] + '. <strong>الاتجاه:</strong> ' + DIRS[e] + '. <strong>الأرقام (جدول هو تو):</strong> ' + NUMS[e] + '.</p>';
    });
    out += item("ألوان عنصرك واتجاهه وأرقامه",
      what("كل عنصر في التقليد الصيني له ألوان واتجاه وأرقام مرتبطة به. هنا بنعرض اللي يخص عنصر سيد يومك وعنصر سنتك.") + '<p class="sj-p">هذه مراسلات العناصر في الجداول التقليدية، مأخوذة من عنصر سيد يومك وعنصر سنتك.</p>' + rows +
      '<p class="sj-p">لم نحدد لك عنصرًا نافعًا واحدًا، لأن ذلك يحتاج قراءة فصل الميلاد وقوة سيد اليوم، وهذه النسخة لا تحسبهما.</p>');
    out += item("لون محفظتك",
      what("لون المحفظة هنا مأخوذ من جدول ألوان عنصر ذاتك، تختاره لو حبّيته.") + '<p class="sj-p"><strong>لون محفظتك بحسب عنصر ذاتك (' + S.ELEMENTS[d] + '):</strong> ' + WALLET[d] + '.</p>' +
      '<p class="sj-p">هذا أول لون في جدول عنصر سيد يومك: ' + COLORS[d] + '.</p>');
    /* 5) النجوم */
    if (!(amb.year || amb.month)) {
      var found = function (br) { var f = []; ks.forEach(function (k) { if (P[k] && P[k].branch === br) f.push(k); }); return f; };
      var nm = function (f) { return f.map(function (k) { return "عمود " + POSN[k]; }).join(" و"); };
      var missNote = r.hasTime ? "" : "؛ عمود الساعة غير محسوب";
      var peach = [], trav = [];
      [["year", yp.branch], ["day", P.day.branch]].forEach(function (b) {
        var g = triOf(b[1]);
        var f1 = found(PEACH[g]); if (f1.length) peach.push("بحسب فرع " + POSN[b[0]] + " في " + nm(f1));
        var f2 = found(TRAVEL[g]); if (f2.length) trav.push("بحسب فرع " + POSN[b[0]] + " في " + nm(f2));
      });
      var nob = [];
      [["day", P.day.stem], ["year", yp.stem]].forEach(function (b) {
        var f = []; NOBLE[b[1]].forEach(function (br) { found(br).forEach(function (k) { if (f.indexOf(k) < 0) f.push(k); }); });
        if (f.length) nob.push("بحسب جذع " + POSN[b[0]] + " في " + nm(f));
      });
      var st = function (title, arr, desc) {
        return '<p class="sj-p"><strong>' + title + ':</strong> ' + (arr.length ? "موجودة، " + arr.join("، ") + ". " + desc : "لم نجدها في الأعمدة المتاحة" + missNote + ".") + '</p>';
      };
      out += item("نجومك في الخريطة", what("النجوم في الساجو علامات بتظهر لما يوجد حيوان معين في أعمدتك. كل نجمة بتتكلم عن جانب: الجاذبية، أو الحركة والسفر، أو من يدعمك. وجودها أو غيابها وصف لما في الأعمدة بحسب الجدول.") +
        st("نجمة الجاذبية (تاو هوا)", peach, "ترتبط بالحضور والذوق وجاذبية الشخص.") +
        st("نجمة الحركة والسفر (يي ما)", trav, "ترتبط بالتنقل وتغيير المكان أو العمل.") +
        st("نجمة النبيل (تيان يي)", nob, "ترتبط بمن يدعم ويرشد.") +
        '<p class="sj-p">سؤال تأخذه معك: مين الشخص اللي تقدر تسأله عن خطوة مش واضحة؟ حضّر له سؤالًا محددًا بدل ما تنتظر إنه يعرف احتياجك وحده.</p>' +
        '<p class="sj-p">المطابقة هنا بحسب جدول واحد معتمد، وتختلف بعض المدارس في نجمة النبيل.</p>');
    }
    /* 6) الخلاصة */
    if (!amb.year) {
      var sum = '<p class="sj-p">حيوانك ' + yp.branchInfo.animal + '، وعنصر سنتك ' + S.ELEMENTS[yp.stemInfo.el] + ' ' + (yp.stemInfo.yang ? "يانغ" : "يين") + '، وسيد يومك ' + dmx.n + ' (' + dm.han + ').</p>';
      out += item("الخلاصة", sum);
    }
    return out.replace(/[\u4e00-\u9fff]+/g, "<bdi>$&</bdi>");
  }

  function render(r, box, name, meta) {
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
    var timeNote = r.hasTime ? "" : '<p class="sj-p">لم تُدخل وقت الميلاد، فظهر ثلاثة أعمدة وستة حروف. أضف الساعة لتكتمل الأعمدة الأربعة.</p>';
    var ambn = (r.amb && (r.amb.year || r.amb.month)) ? '<p class="sj-p">يوم ميلادك هو يوم انتقال بين فترتين شمسيتين، والأعمدة المعروضة محسوبة على ظهر اليوم. أضف وقت الميلاد لتحديد عمود ' + (r.amb.year ? 'السنة والشهر' : 'الشهر') + '.</p>' : "";
    var late = r.lateZi ? '<p class="sj-p">وُلدت بعد الساعة 23:00، وفي هذه الطريقة يبدأ اليوم الجديد عند 23:00، فحُسب عمود يومك على اليوم التالي. بعض المدارس تغيّر اليوم عند منتصف الليل، فقد يختلف عمود يومك عندها.</p>' : "";
    /* أعمدة */
    var pin = "";
    PIL.forEach(function (x) {
      var p = P[x[0]]; if (!p) return;
      pin += '<h4 class="sj-h4">عمود ' + x[1] + ': ' + p.stemInfo.han + p.branchInfo.han + '</h4><p class="sj-p">' +
        S.ELEMENTS[p.stemInfo.el] + (p.stemInfo.yang ? " يانغ" : " يين") + ' فوق ' + S.ELEMENTS[p.branchInfo.el] + ' (' + p.branchInfo.animal + '). ' + x[2] + '.</p>' + '<p class="sj-p">' + PLAIN[x[0]] + '</p>';
    });
    /* سيد اليوم */
    var dmIn = '<h4 class="sj-h4">' + dmx.n + '</h4><p class="sj-p">' + S.ELEMENTS[dm.el] + (dm.yang ? " يانغ" : " يين") + ' (' + dm.ko + '). جذع اليوم هو مركز قراءتك في الساجو، ويرمز إلى ذاتك. عندك: ' + S.ELEMENTS[dm.el] + (dm.yang ? " يانغ" : " يين") + '.</p><p class="sj-p">' + dmx.t + '</p><blockquote class="sj-q"><p>سؤال تأخذه معك: ' + dmx.q + '</p></blockquote>';
    /* عناصر */
    var max = Math.max.apply(null, r.elements) || 1;
    var bars = r.elements.map(function (c, i) {
      return '<div class="sj-bar"><span>' + S.ELEMENTS[i] + '</span><i><u style="width:' + Math.round(c / max * 100) + '%;background:' + ELHEX[i] + '"></u></i><b>' + c + '</b></div>';
    }).join("");
    var strong = [], weak = [];
    r.elements.forEach(function (c, i) { if (c >= 3) strong.push(i); if (c === 0) weak.push(i); });
    var notes = "";
    strong.forEach(function (i) { notes += '<p class="sj-p"><strong>' + S.ELEMENTS[i] + ' بارز.</strong> ' + EL_STRONG[i] + '</p>'; });
    weak.forEach(function (i) { notes += '<p class="sj-p"><strong>' + S.ELEMENTS[i] + ' لا يظهر في حروفك.</strong> ' + EL_WEAK[i] + '</p>'; });
    if (!notes) notes = '<p class="sj-p">لا يوجد عنصر طاغٍ ولا عنصر غائب في حروفك الظاهرة. هذا يوصف عادة بتوزيع متوازن نسبيًا، لكن التوازن في الساجو يُقرأ مع قوة كل عمود وليس بالعدد وحده.</p>';
    var how = '<p class="sj-p">الحساب فعلي بموضع الشمس: عمود السنة يتبدل عند ليتشون، وعمود الشهر بالمصطلحات الشمسية الاثني عشر، وعمود اليوم من دورة الستين يومًا، وعمود الساعة كل ساعتين.</p>' +
      '<p class="sj-p">كل ما في هذه الصفحة محسوب من أعمدتك الأربعة ومن الجداول التقليدية للساجو. هو قراءة لطبعك وميولك، وليس وعدًا بنتيجة ولا رأيًا طبيًا أو ماليًا. الحساب يشمل الأعمدة الأربعة والعناصر وسيد اليوم والبرج والآلهة العشرة والنجوم الثلاث. لا يشمل قوة سيد اليوم ولا العنصر النافع ولا فترات العمر، فهذه تحتاج قراءة الفصل. يبدأ اليوم الجديد عند الساعة 23:00. الحساب بتوقيت الميلاد المحلي الذي أدخلته مع فرق التوقيت، ولا يتضمن تصحيح الوقت الشمسي الحقيقي للمدينة.</p>' +
      '<p class="sj-p"><a href="#featured-content/saju-how-pillars-calculated">اقرأ: كيف تُحسب أعمدتك الأربعة؟</a></p>';
    meta = meta || {};
    var chip = function (l, v) { return '<div class="sj-chip"><small>' + l + '</small><b>' + esc(v) + '</b></div>'; };
    var card = '<div class="sj-rcard"><div class="sj-rtop"><h3>' + (name ? "ساجو " + esc(name) : "قراءة الساجو") + '</h3><p>أعمدتك الأربعة وتفاصيلها</p></div>' +
      '<div class="sj-chips">' + chip("تاريخ الميلاد", meta.date || "") + chip("وقت الميلاد", meta.time || "") + chip("فرق التوقيت", meta.tz || "") + '</div>' +
      '<div class="sj-tools"><button type="button" class="sj-tool" data-sj-edit>تعديل البيانات</button><button type="button" class="sj-tool" data-sj-save>حفظ</button></div></div>';
    box.innerHTML = card + '<div class="sj-accs">' +
      item("أعمدتك الأربعة", diagram + what("كل عمود فيه حرفان. الحرف اللي فوق هو الجذع السماوي، والحرف اللي تحته هو الفرع الأرضي، وهو الحيوان. ولكل حرف عنصر (خشب، نار، أرض، معدن، ماء) وطاقة: يانغ يعني طاقة ظاهرة ونشطة، ويين يعني طاقة هادئة وداخلية. فلما تقرأ «أرض يين فوق خشب (الأرنب)» معناها: الجذع من الأرض بطاقة يين، وتحته الأرنب وعنصره خشب. الأعمدة الأربعة هي السنة والشهر واليوم والساعة، وكل واحد بيتكلم عن جانب من حياتك.") + timeNote + ambn + late + pin) +
      item("سيد اليوم", dmIn) +
      item("توازن العناصر", '<div class="sj-bars">' + bars + '</div><p class="sj-p">العدد من ' + r.total + ' حروف ظاهرة. عنصر ذاتك (' + S.ELEMENTS[dm.el] + ') يظهر ' + r.elements[dm.el] + (r.elements[dm.el] === 1 ? " مرة" : " مرات") + '.</p>' + notes) +
      signSections(r, dm, dmx) +
      item("كيف حُسبت؟", how) + '</div>';
    var ttl = (name ? "ساجو " + name : "قراءة الساجو");
    box.querySelector("[data-sj-save]").addEventListener("click", function () {
      var txt = ttl + "\n" + (meta.date || "") + " | " + (meta.time || "") + " | " + (meta.tz || "") + "\n";
      box.querySelectorAll(".sj-acc").forEach(function (a) {
        txt += "\n== " + a.querySelector(".sj-acc-t").textContent + " ==\n" + a.querySelector(".sj-acc-body").innerText.replace(/\n{3,}/g, "\n\n") + "\n";
      });
      txt += "\nعقيق أسترو";
      try {
        var bl = new Blob(["\ufeff" + txt], { type: "text/plain;charset=utf-8" }), u = URL.createObjectURL(bl), el = document.createElement("a");
        el.href = u; el.download = "saju-reading.txt"; document.body.appendChild(el); el.click(); el.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      } catch (e) { }
    });
    box.querySelector("[data-sj-edit]").addEventListener("click", function () {
      var sec = document.getElementById("saju");
      box.hidden = true; box.innerHTML = ""; if (sec) { sec.classList.remove("sj-view-result"); try { sec.scrollTo({ top: 0 }); } catch (e) { sec.scrollTop = 0; } }
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
        r.gy = d[0];
        if (h === null) {
          var q0 = S.compute(window.Astronomy, { year: d[0], month: d[1], day: d[2], hour: 0, minute: 0, utcOffset: Number(tz.value) }).pillars, q1 = S.compute(window.Astronomy, { year: d[0], month: d[1], day: d[2], hour: 22, minute: 59, utcOffset: Number(tz.value) }).pillars;
          var ay = q0.year.stem !== q1.year.stem || q0.year.branch !== q1.year.branch, am = q0.month.stem !== q1.month.stem || q0.month.branch !== q1.month.branch;
          if (ay || am) { r.amb = { year: ay, month: am }; r.ambYear = [q0.year, q1.year]; }
        }
        var tzo = tz.options[tz.selectedIndex];
        render(r, out, (($("#sj-name") || {}).value || "").trim(), { date: d[0] + "/" + (d[1] < 10 ? "0" : "") + d[1] + "/" + (d[2] < 10 ? "0" : "") + d[2], time: h === null ? "غير معروف" : (h < 10 ? "0" : "") + h + ":" + (mi < 10 ? "0" : "") + mi, tz: tzo ? tzo.textContent : "" });
        out.hidden = false;
        var secEl = document.getElementById("saju"); if (secEl) { secEl.classList.add("sj-view-result"); try { secEl.scrollTo({ top: 0 }); } catch (e2) { secEl.scrollTop = 0; } }
      } catch (x) { err.textContent = x.message || "تعذر الحساب."; err.hidden = false; }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
