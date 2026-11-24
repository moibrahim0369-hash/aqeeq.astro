/* Clear result expectations before birth data. No purchase or access changes. */
(function () {
  'use strict';
  var ITEMS = {
    cform: ['خريطة ميلادك، قبل أن تبدأ', 'رسم الخريطة ومواضع الكواكب والقراءات المتاحة لها. اختر النظام الغربي أو الفيدي من النموذج.', 'تاريخ الميلاد، والمدينة، والوقت إن كنت تعرفه. إن لم تعرف الوقت اختر ذلك، ولا نعتمد طالعًا أو بيوتًا دقيقة.'],
    mform: ['ماذا ستقرأ في مصفوفتك؟', "مخطط المصفوفة وأرقام مواضعها، ثم القراءات المتاحة لكل موضع.", 'تاريخ الميلاد. الاسم اختياري، ولا تحتاج ساعة الميلاد.'],
    lpform: ['ماذا يعطيك مسار الحياة؟', 'رقم مسار الحياة وقراءته، مع قراءة الاسم إذا أدخلته. هذا مسار مختلف عن الخريطة الفلكية.', 'تاريخ الميلاد، والاسم إن أردت قراءة اسمه.'],
    'synastry-form': ['قبل مقارنة مساريكما', "رقما مسار الحياة وقراءة المقارنة بينهما.", 'تاريخ ميلاد كل طرف. الأسماء اختيارية.'],
    'mxc-form': ['قبل قراءة مصفوفة الشراكة', 'مصفوفة مشتركة وقراءات مواضعها المتاحة. ليست درجة نجاح للعلاقة ولا قرارًا بالبقاء أو الانفصال.', 'تاريخا الميلاد. لا تحتاج وقت الولادة.'],
    'mxk-form': ['قبل قراءة مصفوفة الطفل', "مصفوفة الطفل وقراءة موجهة للأهل. لا تشخّص الطفل ولا تحدد قدرته أو مستقبله.", 'تاريخ ميلاد الطفل. الاسم اختياري.'],
    'eam-form': ['ما الذي ستجده في الخرائط الفيدية؟', 'أدوات الخرائط والتقسيمات والفترات الفيدية المتاحة في هذه الصفحة. اختر الأداة التي تريدها بعد الحساب.', 'تاريخ ووقت ومكان الميلاد. راجع الإحداثيات والمنطقة الزمنية قبل الحساب.'],
    'cp-form': ['قبل مقارنة الخريطتين', "خريطتا الميلاد والاتصالات المتبادلة والخريطة المركبة. ", 'تاريخ ووقت ومدينة ميلاد كل طرف، أو تحديد أن وقت الميلاد غير معروف.'],
    'kt-form': ['قبل قراءة الذيل الكارمي', "أرقام الذيل من مصفوفة الميلاد والقراءة المتاحة لها. ", 'تاريخ الميلاد. لا تحتاج وقت الولادة.'],
    'swc-form': ['ماذا تحسب هذه الأداة؟', 'صورة للسماء بحسب الوقت والمكان المحددين، وليست خريطة ميلاد شخصية.', 'الوقت والمكان اللذان تريد استكشافهما.']
  };
  function node(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
  function addBrief(form, data) {
    if (!form || document.getElementById('service-' + form.id)) return;
    var box = node('aside', 'svc-brief'); box.id = 'service-' + form.id;
    var title = node('h3', '', data[0]); title.id = box.id + '-title'; box.setAttribute('aria-labelledby', title.id); box.appendChild(title);
    box.appendChild(node('p', '', data[1]));
    var need = node('p', 'svc-need'); need.appendChild(node('strong', '', 'تحتاج إلى: ')); need.appendChild(document.createTextNode(data[2])); box.appendChild(need);
    var info = node('details', 'svc-details'); info.appendChild(node('summary', '', 'ما المجاني؟ وماذا عن التقرير الكامل؟'));
    info.appendChild(node('p', '', 'الحساب والنتيجة المعروضة من هذا النموذج لا يتطلبان شراءً. لا يُنشأ طلب ولا يُخصم مبلغ بمجرد إدخال بياناتك.'));
    if (form.id === 'cform') info.appendChild(node('p', '', 'التقرير الشخصي الكامل منتج منفصل عن نتيجة الحاسبة، ويُجهّز من بيانات خريطتك بعد تأكيد طلبه. لا يعني شراءه فتح كل منتجات عقيق.'));
    else info.appendChild(node('p', '', 'التقرير الكامل، إن عُرض للشراء، له منتج ووصف مستقلان. لا نفترض أن شراء تقرير يفتح كل أداة أو كل قراءة في الموقع.'));
    var link = node('a', '', 'كيف تختار وتراجع طلبك؟'); link.href = '#service-guide'; info.appendChild(link); box.appendChild(info);
    form.prepend(box);
  }
  function personalCTA() {
    var box = node('aside', 'svc-personal'); box.setAttribute('data-svc-personal', ''); box.appendChild(node('h3', '', 'برجك بداية، وخريطتك أوسع'));
    box.appendChild(node('p', '', 'هذه قراءة عامة بحسب البرج أو موضع الكوكب، وليست مبنية على بيانات ميلادك كاملة. خريطة الميلاد تجمع المواضع في صورة شخصية، مع حدود ما نعرفه من وقت ولادتك.'));
    var a = node('a', 'svc-link', 'ابدأ خريطة ميلادك المجانية'); a.href = '#chart'; box.appendChild(a); return box;
  }
  function syncPersonal() {
    ['#panel', '#fc-card'].forEach(function (s) { var el = document.querySelector(s); if (el && el.children.length && !el.querySelector('[data-svc-personal]')) el.appendChild(personalCTA()); });
  }
  function makeGuide() {
    if (document.getElementById('service-guide')) return;
    var sec = node('section', 'sec alt svc-guide'); sec.id = 'service-guide';
    var wrap = node('div', 'wrap'); var close = node('a', 'sheet-x', '×'); close.href = '#home'; close.setAttribute('aria-label', 'العودة للرئيسية'); wrap.appendChild(close); wrap.appendChild(node('span', 'eyebrow', 'عقيق · قبل أن تختار')); wrap.appendChild(node('h2', '', 'إزاي القراءة والطلب بيشتغلوا؟'));
    [['ابدأ بالنتيجة المتاحة', "افتح الأداة واقرأ ما تعطيه قبل كتابة بياناتك. يمكنك حساب النتيجة بدون إنشاء طلب شراء. "], ['اختر منتجًا بعينه', 'راجع اسم التقرير ومحتواه والسعر والعملة المعروضين له، وليس اسم الأداة وحده. لا تفترض أن تقريرًا واحدًا يشمل كل تقارير عقيق.'], ['قبل أي تحويل', 'راجع طريقة التسليم ومدة التجهيز وشروط الاسترداد الخاصة بالمنتج. إذا لم تظهر هذه التفاصيل، اطلب توضيحها قبل الدفع؛ لا نستبدل غيابها بوعد بتسليم فوري أو استرداد مضمون.'], ['تسليم التقرير الشخصي الكامل', 'في المسار الحالي، يتبع تأكيد الدفع تجهيز التقرير من قسم حسابك وإرساله إلى بريد الحساب. تأكيد التحويل وتجهيز التقرير ووصول البريد خطوات مختلفة. لا يوجد هنا موعد تسليم محدد معلن.']].forEach(function (item) { var art = node('article', 'svc-step'); art.appendChild(node('h3', '', item[0])); art.appendChild(node('p', '', item[1])); wrap.appendChild(art); });
    var back = node('a', 'svc-link', 'ارجع لاختيار القراءة'); back.href = '#invest'; wrap.appendChild(back); sec.appendChild(wrap); document.querySelector('main').appendChild(sec);
    var pay = document.querySelector('#pay .pay-head'); if (pay) { var note = node('aside', 'svc-brief svc-payment'); note.appendChild(node('h3', '', 'قبل التحويل')); note.appendChild(node('p', '', 'سعر الطلب وعملته يظهران بعد تسجيل الدخول. إذا لم يظهر سعر واضح، لا تحوّل مبلغًا تقديريًا. تأكد أيضًا من مدة التجهيز وشروط الاسترداد قبل الدفع.')); var a = node('a', '', 'اقرأ خطوات الطلب والتسليم'); a.href = '#service-guide'; note.appendChild(a); pay.after(note); }
  }
  function init() {
    Object.keys(ITEMS).forEach(function (id) { addBrief(document.getElementById(id), ITEMS[id]); }); makeGuide(); syncPersonal();
    var panel = document.getElementById('panel'); if (panel) new MutationObserver(syncPersonal).observe(panel, { childList: true });
    document.addEventListener('click', function () { setTimeout(syncPersonal, 0); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
