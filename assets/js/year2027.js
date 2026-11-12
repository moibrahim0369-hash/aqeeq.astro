/* قراءة سنة 2027 من الخريطة الفيدية: الفترة الحاكمة، ثقل زحل، العلاقات الكارمية، الحذر، العمل والمال، الميثاق.
   تُحسب محلياً من الخريطة النجمية (لاهيري). النصوص مبدئية وتُستبدل بالنهائية من دستور المحتوى. */
(function () {
  'use strict';
  var sec = document.getElementById('year2027'); if (!sec) return;
  var YEAR = 2027;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var norm = function (x) { return ((x % 360) + 360) % 360; };
  var SATH = ['',
    'زحل يمر على بيتك الأول، فيطلب منك أن تقف على قدميك وحدك. تلاحظ أن المجاملات القديمة صارت ثقيلة، وأن صورتك أمام الناس تحتاج صدقًا أكثر. لا تعالج التعب بمزيد من العمل؛ ثبّت نومك ومواعيد أكلك أولًا.',
    'زحل في بيتك الثاني: علاقتك بالمال تُراجَع بهدوء. المصروف الذي كنت تتجاهله يظهر أمامك، وكلامك يصير أثقل وزنًا. اكتب أرقامك مرة في الأسبوع، ولا تَعِد بما لا تقدر عليه.',
    'زحل في بيتك الثالث: الكلام والمبادرات الصغيرة تحتاج جهدًا أكبر من العادة. رسالة أجّلتها أو اتصال مؤجل يعود يطلبك. اتخذ خطوة صغيرة كل يوم بدل انتظار الحماس.',
    'زحل في بيتك الرابع: البيت والأسرة في مقدمة الحمل. قد تعيد ترتيب مكان تعيش فيه أو علاقة قديمة مع أهلك. ابدأ بإصلاح ما يزعجك في بيتك فعلًا، فالأمان الداخلي يبدأ من هناك.',
    'زحل في بيتك الخامس: المتعة تحتاج جدية، والحب يطلب وضوحًا. قد تحس أنك لا تلعب كما كنت. خصص وقتًا ثابتًا لشيء تحبه بلا هدف، فهو يحميك من الجفاف.',
    'زحل في بيتك السادس: الالتزامات اليومية تتراكم، والنظام هو طريق النجاة. روتين بسيط لعملك ونومك وطعامك يفيدك أكثر من أي خطة كبيرة. قل لا لما ليس من مسؤوليتك.',
    'زحل في بيتك السابع: الشراكات تُوزَن من جديد. من يبقى بصدق يزداد قربه، ومن كان قائمًا على العادة يظهر ضعفه. قل بوضوح ما تحتاجه، ولا تحمل عن شريكك فوق طاقتك.',
    'زحل في بيتك الثامن: ملفات مؤجلة تُفتح: التزامات مشتركة أو مشاعر مكتومة. واجهها واحدًا واحدًا بدل جمعها. الشجاعة هنا أن تقول الحقيقة لنفسك أولًا.',
    'زحل في بيتك التاسع: قناعاتك تُختبر. ما كنت تقوله عن الحياة يُطالَب بدليل من تجربتك. السفر قد يتأخر، والدراسة تحتاج انتظامًا. أكمل شيئًا واحدًا تتعلمه حتى النهاية.',
    'زحل في بيتك العاشر: مسؤولية عملك تكبر ومعها نظر الناس إليك. ما بنيته بصدق يثبت، وما كان استعجالًا يتعثر. اعمل بهدوء ودون استعراض، فالسمعة تُبنى في هذه الفترة.',
    'زحل في بيتك الحادي عشر: تعيد حساب أصدقائك وأهدافك. دائرة أصغر وأصدق أفضل من دائرة كبيرة متعبة. اختر هدفًا واحدًا لهذه الفترة وقِس عليه ما تقبله وما ترفضه.',
    'زحل في بيتك الثاني عشر: فترة تخفيف وانسحاب. تحتاج مساحة صامتة لتفرغ ما حملته طويلًا. لا تتخذ قرارات كبيرة وأنت مرهق، وراقب ما يستنزفك من اشتراكات وعادات وعلاقات.'];
  var JUPH = ['',
    'المشتري في بيتك الأول: ثقتك بنفسك ترتفع ويراك الناس أوسع صدرًا. ابدأ ما كنت تؤجله لنفسك: مشروع، مظهر، عادة. احذر فقط من الوعود الكبيرة فوق ما تقدر.',
    'المشتري في بيتك الثاني: المال والموارد تتسع وكلامك يحمل بركة. وقت مناسب لتنمية دخلك بمهارة حقيقية. احتفظ بجزء ثابت مما يأتيك ولا تنفق على قدر ما دخل.',
    'المشتري في بيتك الثالث: تنفتح أبواب بالتواصل والكتابة والتعلم والإخوة. رسالة ترسلها أو فكرة تنشرها قد تصل أبعد مما تتوقع. كن حاضرًا بصوتك.',
    'المشتري في بيتك الرابع: راحة في البيت والأسرة وفرصة لمكان أوسع أو ترتيب أجمل. اهتم بمن تعيش معهم، فالدعم يأتي من الداخل.',
    'المشتري في بيتك الخامس: الحب والإبداع والأبناء في وقت دافئ. افتح قلبك لتجربة جديدة وأنتج شيئًا بيدك. الفرح هنا ليس ترفًا بل وقودك.',
    'المشتري في بيتك السادس: يسهل عليك ترتيب العمل اليومي والعمل بجد دون إرهاق. فرصة لتحسين نظامك وخدمة الناس بإتقان. الاستمرار البسيط يكسب.',
    'المشتري في بيتك السابع: الشراكات تتحرك للأفضل: علاقة تتعمق أو شراكة عمل تنفتح. اختر من يشبه قيمك لا من يبهرك، وقل ما تريد بوضوح.',
    'المشتري في بيتك الثامن: دعم يأتي من المال المشترك أو الإرث أو من تعافٍ داخلي. وقت جيد لتسوية الالتزامات وفتح ما كان مغلقًا بصبر.',
    'المشتري في بيتك التاسع: فترة اتساع: سفر وتعلم ومعلم يظهر وثقة أكبر بطريقك. من أقوى الأوقات لتتقدم في دراسة أو رؤية بعيدة المدى.',
    'المشتري في بيتك العاشر: عملك يُرى ويُقدَّر وتظهر فرصة ترقية أو توسع. اعرض ما تتقنه بصدق، فالمكانة تأتي من أثرك لا من ضجيجك.',
    'المشتري في بيتك الحادي عشر: مكاسب وأصدقاء وأحلام تقترب. صلة جديدة قد تفتح بابًا لم تتوقعه. شارك هدفك مع من يدعمه.',
    'المشتري في بيتك الثاني عشر: دعم هادئ من خلف الستار وراحة بعد تعب. وقت للتأمل والعطاء وإنهاء ما انتهى. ما تتركه الآن يفسح مكانًا لبداية أصفى.'];
  var RAHH = ['',
    'راهو في بيتك الأول وكيتو في السابع: علاقاتك تعلّمك كيف تكون نفسك داخل الصحبة. إن كنت تذوب في الشريك فالدرس أن تقف على أرضك، وإن كنت تبتعد فالدرس أن تسمح بالقرب.',
    'راهو في بيتك الثاني وكيتو في الثامن: علاقة تدور حول الاعتماد والأمان. اسأل نفسك: هل أبقى لأني أحتاج أم لأني أحب؟ ووضّح حدود المال والالتزامات.',
    'راهو في بيتك الثالث وكيتو في التاسع: علاقة تتعلم فيها أن تقول ما تؤمن به لا ما يُرضي. من يشاركك طريقًا فكريًا يقترب، ومن يجادل بلا فائدة يبتعد.',
    'راهو في بيتك الرابع وكيتو في العاشر: علاقتك بأهلك أو بيتك تختلط بطموحك. تبحث عن أمان داخلي بينما تُطلب منك مكانة. احمِ وقتًا لبيتك ولا تنسَ مشروعك.',
    'راهو في بيتك الخامس وكيتو في الحادي عشر: تتحول علاقة بين صداقة وحب، أو تتعلم أن تحب بلا تمثيل. قد تعود قصة قديمة لتُغلق وتبدأ دائرة أصدق.',
    'راهو في بيتك السادس وكيتو في الثاني عشر: علاقات تتطلب عطاءً يوميًا وتنهكك إن لم تحمِ مساحتك. تعلّم أن تساعد دون أن تستنزف وأن ترتاح دون ذنب.',
    'راهو في بيتك السابع وكيتو في الأول: علاقتك الأقرب في مركز الدرس. علاقة تُستكمل بصدق أو تُراجَع بحزم. الأمر لا يتعلق بالشخص وحده بل بنمط تكرره.',
    'راهو في بيتك الثامن وكيتو في الثاني: علاقة تمس ما تخفيه: الثقة والغيرة والامتلاك. فرصة للشفاء إن تحدثت بصراحة بدل الصمت.',
    'راهو في بيتك التاسع وكيتو في الثالث: علاقة مع شخص من بيئة مختلفة أو معلم يغيّر نظرتك. تعلّم الإصغاء لما يختلف عنك دون أن تفقد قناعتك.',
    'راهو في بيتك العاشر وكيتو في الرابع: يتأثر قربك من أهلك أو شريكك بانشغالك بعملك. قرر ما تحميه أولًا: السمعة أم الدفء، وستجد طريقًا للاثنين.',
    'راهو في بيتك الحادي عشر وكيتو في الخامس: دوائر جديدة وعلاقة قلبية تُختبر أمام الناس. اختر من يبقى حين تهدأ الأضواء.',
    'راهو في بيتك الثاني عشر وكيتو في السادس: تنهي علاقات أو أدوارًا انتهى وقتها. الفراغ بعدها ليس خسارة بل مكان لعلاقة بلا ثقل قديم.'];
  var DO = ['خفّف: أنهِ ما انتهى، وخصص مكانًا هادئًا لنفسك كل يوم.', 'اعتنِ بعلاقاتك وبذوقك، وخصص وقتًا للجمال والراحة دون ذنب.', 'قف في مكانك وقدّم نفسك بوضوح، وخذ دور القيادة في أمر واحد.', 'حافظ على نومك وعلى من يشعرك بالأمان، وسمِّ مشاعرك بدل كتمانها.', 'وجّه طاقتك إلى مشروع واحد، وحرّك جسمك يوميًا بالمشي أو الرياضة.', 'جرّب الجديد بخطوات صغيرة، وتحقق قبل أي التزام كبير.', 'تعلّم، وكن كريمًا بما تعرفه، ووسّع دائرتك مع من يرفعك.', 'ابنِ بصبر وبنظام ثابت، وأنجز ما التزمت به في موعده.', 'نظّم أفكارك واكتبها، وراجع كلامك قبل أن تقوله أو ترسله.'];
  var DONT = ['لا تتمسك بما يتفكك، ولا تملأ الفراغ بأول شيء يأتي.', 'لا تفرط في الإنفاق على المتعة، ولا تبقَ في علاقة لأنها مريحة فقط.', 'لا تدخل صراع كبرياء، ولا تنتظر التقدير من الجميع.', 'لا تقرر وأنت متعب أو مجروح، ولا تعلّق راحتك على رضا الآخرين.', 'لا ترد على الغضب بغضب، ولا تفتح أكثر من معركة في وقت واحد.', 'لا تصدق كل وعد لامع، ولا توقّع قبل أن تقرأ وتسأل.', 'لا تتكاسل على النعمة، ولا تعد بأكثر مما تستطيع.', 'لا تؤجل المحاسبة، ولا تحمّل نفسك ما ليس عليك.', 'لا تشتت نفسك بين عشرة أمور، ولا تتسرع في الكلام الحاد.'];
  var HAREA = ['', 'نفسك وصورتك', 'مالك وكلامك', 'مبادراتك وتواصلك', 'بيتك وأمانك', 'حبك وإبداعك', 'عملك اليومي', 'شراكاتك', 'تحولاتك العميقة', 'سفرك وقناعاتك', 'مهنتك ومكانتك', 'أصدقاؤك ومكاسبك', 'عزلتك وتفريغك'];

  function dstr(ms) { return new Date(ms).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', timeZone: 'UTC' }); }
  function pickBody(ch, k) { var l = ch.bodies || []; for (var i = 0; i < l.length; i++) if (String(l[i].key).toLowerCase() === k) return l[i]; return null; }

  function compute(natal) {
    var E = window.AqEam, V = window.AqVedic, T = V.T;
    var ch = E.siderealChart(natal), moon = pickBody(ch, 'moon');
    var moonSign = Math.floor(moon.lon / 30), known = !!ch.known, lagna = known ? Math.floor(ch.asc / 30) : moonSign;
    var hOf = function (sg) { return ((sg - lagna + 12) % 12) + 1; };
    var t0 = Date.UTC(YEAR, 0, 1), t1 = Date.UTC(YEAR + 1, 0, 1), DAYMS = 864e5;
    var birthMs = isFinite(natal.utcMs) ? natal.utcMs : (ch.jde - 2440587.5) * DAYMS;
    /* الفترات */
    var maha = V.dashas(moon.lon, birthMs).filter(function (m) { return m.e > t0 && m.s < t1; });
    var periods = [];
    maha.forEach(function (m) { V.antars(m).forEach(function (a) { if (a.e > t0 && a.s < t1) periods.push({ maha: m.lord, lord: a.lord, s: Math.max(a.s, t0), e: Math.min(a.e, t1) }); }); });
    /* العبور: برج كل كوكب نجمي كل 5 أيام ثم تدقيق الحدود */
    var keys = { saturn: 'saturn', jupiter: 'jupiter', rahu: 'node' };
    function signs(ms) {
      var c = E.engineChart(ms, natal), ay = E.ayanamsa(c.jde), out = {};
      Object.keys(keys).forEach(function (k) { var b = pickBody(c, keys[k]) || (k === 'rahu' ? pickBody(c, 'truenode') : null); out[k] = b ? Math.floor(norm(b.lon - ay) / 30) : null; });
      return out;
    }
    var segs = { saturn: [], jupiter: [], rahu: [] }, prev = null, cur = null;
    for (var t = t0; t <= t1; t += 5 * DAYMS) {
      var s = signs(Math.min(t, t1 - 1));
      if (!prev) { Object.keys(segs).forEach(function (k) { segs[k].push({ sign: s[k], s: t0, e: t1 }); }); }
      else Object.keys(segs).forEach(function (k) {
        if (s[k] !== prev[k]) {
          var lo = t - 5 * DAYMS, hi = t;
          while (hi - lo > DAYMS) { var mid = Math.floor((lo + hi) / 2); if (signs(mid)[k] === prev[k]) lo = mid; else hi = mid; }
          var L = segs[k][segs[k].length - 1]; L.e = hi; segs[k].push({ sign: s[k], s: hi, e: t1 });
        }
      });
      prev = s;
    }
    return { ch: ch, moon: moon, moonSign: moonSign, lagna: lagna, known: known, hOf: hOf, periods: periods, segs: segs, T: T };
  }

  function acc(title, tone, ic, inner, open) {
    return '<details class="y27-acc y27-t-' + tone + '"' + (open ? ' open' : '') + '><summary><span class="y27-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ic + '</svg></span><span class="y27-t">' + title + '</span><span class="y27-ch" aria-hidden="true"></span></summary><div class="y27-body">' + inner + '</div></details>';
  }
  var IC = { clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>', sat: '<circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="9.5" ry="3" transform="rotate(-20 12 12)"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', warn: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.2v.1"/>', coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .8 3 2-1.3 1.8-3 2.5-3 1.1-3 2.5 1.3 2 3 2 3-.8 3-2"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>' };
  function segRows(list, fn) {
    return list.map(function (x) { return '<div class="y27-seg"><span class="y27-when">' + (list.length > 1 ? 'من ' + dstr(x.s) + ' إلى ' + dstr(x.e - 1) : 'طوال العام') + '</span><p>' + fn(x) + '</p></div>'; }).join('');
  }
  function render(natal, name) {
    var R = compute(natal), T = R.T, h = '';
    var first = R.periods[0];
    /* 1 الفترة */
    var pr = R.periods.map(function (p) { return '<div class="y27-seg"><span class="y27-when">' + (R.periods.length > 1 ? 'من ' + dstr(p.s) + ' إلى ' + dstr(p.e - 1) : 'طوال العام') + '</span><p><b>فترة ' + T.LORDS[p.maha] + ' الكبرى وفي داخلها فترة ' + T.LORDS[p.lord] + ' الصغرى.</b> ' + T.LT[p.lord] + '</p></div>'; }).join('');
    h += acc('الفترة التي تحكم سنتك', 'g', IC.clock, pr, true);
    /* 2 ثقل زحل على القمر */
    var ss = segRows(R.segs.saturn, function (x) {
      var d = (x.sign - R.moonSign + 12) % 12, i = d === 11 ? 0 : d === 0 ? 1 : d === 1 ? 2 : -1;
      return i >= 0 ? T.SS[i] : 'زحل في هذه الفترة خارج دائرة قمرك، فالثقل الأكبر ليس عليك الآن. استثمر هذا الهدوء في ترتيب ما يحتاج ترتيبًا.';
    });
    h += acc('ثقل زحل على قمرك (ساديه ساتي)', 's', IC.sat, ss, false);
    /* 3 العلاقات الكارمية */
    var rl = segRows(R.segs.rahu, function (x) { return RAHH[R.hOf(x.sign)]; });
    h += acc('علاقاتك الكارمية', 'n', IC.link, rl, false);
    /* 4 الحذر */
    var ct = segRows(R.segs.saturn, function (x) { return SATH[R.hOf(x.sign)]; });
    h += acc('نقاط الحذر وكيف تتجاوزها', 's', IC.warn, ct + '<p class="y27-note">الحذر هنا دعوة للانتباه وليس حكمًا. ما يثقل عليك اليوم يخف حين تتعامل معه بخطوة صغيرة منتظمة.</p>', false);
    /* 5 العمل والمال */
    var wk = segRows(R.segs.jupiter, function (x) { var hh = R.hOf(x.sign); return JUPH[hh] + ' <em>مجال الفرصة: ' + HAREA[hh] + '.</em>'; });
    h += acc('أفضل مسار للعمل والمال', 'n', IC.coin, wk, false);
    /* 6 الميثاق */
    var lords = []; R.periods.forEach(function (p) { if (lords.indexOf(p.lord) < 0) lords.push(p.lord); });
    var ch2 = lords.map(function (l) { return '<div class="y27-seg"><span class="y27-when">في فترة ' + T.LORDS[l] + '</span><p><b>التزم:</b> ' + DO[l] + '</p><p><b>تجنّب:</b> ' + DONT[l] + '</p></div>'; }).join('');
    h += acc('ميثاقك لعام 2027: ما تلتزم به وما تتجنبه', 'g', IC.check, ch2, false);
    var basis = R.known ? '' : '<p class="y27-note">وقت الميلاد غير معروف، فالبيوت محسوبة من برج القمر بدل الطالع، والقراءة أدق كلما عرفت وقتك.</p>';
    return '<header class="y27-rhead"><span class="y27-kick">قراءة سنتك · 2027</span><h3>' + (name ? esc(name) + '، هذا ما تحمله لك 2027' : 'هذا ما تحمله لك 2027') + '</h3><p>تقرأ هذه الصفحة حركة الكواكب فوق خريطتك بنظام الفلك الفيدي (النطاق النجمي). هي قراءة للتأمل وفهم الفترة، وليست حكمًا نهائيًا.</p></header>' + basis + h +
      '<p class="y27-note">قراءة رمزية مبنية على حساب فلكي لخريطتك. الفترات والتواريخ تتغير بتغير بياناتك.</p>' +
      '<div class="y27-actions"><button type="button" class="y27-btn" id="y27-pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 19h14"/></svg><span>حفظ القراءة كملف PDF</span></button></div>';
  }

  /* ---- النموذج ---- */
  var form = $('#y27-form'), out = $('#y27-result'), err = $('#y27-err'), city = $('#y27-city');
  if (!form) return;
  var CTX = function () { return window.AqeeqChartContext; };
  function loadCities() { if (!CTX() || !CTX().cityOptionsHTML) return; var cur = city.value; city.innerHTML = CTX().cityOptionsHTML(); var m = city.querySelector('option[value="manual"]'); if (m) m.remove(); if (cur && city.querySelector('option[value="' + cur + '"]')) city.value = cur; }
  loadCities(); setTimeout(loadCities, 1200); city.addEventListener('pointerdown', loadCities);
  var unk = $('#y27-unknown'), time = $('#y27-time'); unk.addEventListener('change', function () { time.disabled = unk.checked; });
  function say(t) { err.textContent = t || ''; err.hidden = !t; }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); say('');
    var v = $('#y27-date').value; if (!v) { say('اكتب تاريخ ميلادك كاملًا.'); return; }
    var p = v.split('-').map(Number), hh = 12, mm = 0;
    if (!unk.checked) { if (!time.value) { say('اكتب وقت ميلادك أو علّم «لا أعرف وقت ميلادي».'); return; } var t = time.value.split(':').map(Number); hh = t[0]; mm = t[1]; }
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    setTimeout(function () {
      try {
        if (!window.AqEam || !window.AqVedic) throw new Error('الحساب لم يحمّل بعد، أعد المحاولة بعد لحظة.');
        var name = $('#y27-name').value.trim();
        var natal = CTX().setFromInput({ y: p[0], m: p[1], d: p[2], hh: hh, mm: mm, known: !unk.checked, cityIdx: city.value, gender: '', name: name });
        out.innerHTML = render(natal, name); out.hidden = false; sec.classList.add('y27-has');
        $('#y27-pdf').addEventListener('click', function () {
          document.body.classList.add('y27-printing');
          var done = function () { document.body.classList.remove('y27-printing'); window.removeEventListener('afterprint', done); };
          window.addEventListener('afterprint', done); setTimeout(function () { window.print(); }, 60);
        });
        $('#y27-name-print').textContent = name || '';
        try { sec.scrollTo({ top: 0 }); } catch (x) { sec.scrollTop = 0; }
      } catch (x) { say(x && x.message || 'تعذر حساب القراءة. راجع البيانات.'); }
      btn.disabled = false;
    }, 30);
  });
  $('#y27-edit').addEventListener('click', function () { out.hidden = true; out.innerHTML = ''; sec.classList.remove('y27-has'); try { sec.scrollTo({ top: 0 }); } catch (x) {} });
  window.AqYear2027 = { compute: compute };
})();
