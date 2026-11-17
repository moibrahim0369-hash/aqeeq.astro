/* مطابقة الجنس في نصوص التوافق (عرض فقط، لا يغيّر data.json).
   AqeqGender.fix(text, 'female'|'male'|'', opts)
   - opts.third: النص عن الشخص بصيغة الغائب (مثل prescription_for_partner)، فتُؤنَّث الأفعال والضمائر أيضًا.
   - opts.both: النص مشترك بين طرفين مختلفي الجنس، فتُكتب الصيغة المزدوجة (محتاج/ة).
   الجنس غير المحدد أو الذكر: النص كما هو. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.AqeqGender = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var AR = 'ء-ي';
  /* صفات وأفعال ثابتة: المذكر ← المؤنث (تُطبَّق على الكلمة كاملة، مع بادئة واو/فاء/ب/ل اختيارية) */
  var ADJ = ['محتاج', 'عايز', 'عاوز', 'عارف', 'مبسوط', 'حاسس', 'خايف', 'شايف', 'زعلان', 'واثق', 'وحيد', 'مشغول', 'قادر', 'مستعد', 'مرتبط', 'عنيد',
    'مقدر', 'مسؤول', 'محبوس', 'هربان', 'متمرد', 'مبدع', 'ملهم', 'مطمئن', 'مخلص', 'محترم', 'مجروح', 'متضايق', 'متأكد', 'متعود', 'مضغوط', 'تعبان',
    'مقتنع', 'سطحي', 'ضعيف', 'قوي', 'حر', 'غضبان', 'متعلق', 'مستقل', 'مهموم', 'مرهق', 'منهك', 'متوتر', 'قلقان', 'مكسور', 'مظلوم', 'ملتزم', 'منفتح', 'مشتت', 'مُحبط', 'محبط'];
  var FEM = {};
  ADJ.forEach(function (w) { FEM[w] = w + 'ة'; });
  FEM['حاسس'] = 'حاسة'; FEM['شايف'] = 'شايفة'; FEM['قوي'] = 'قوية'; FEM['حر'] = 'حرة';
  var PRON = { 'إنت': 'إنتي', 'انت': 'إنتي', 'أنت': 'إنتي' };
  /* ضمائر الغائب المتصلة (للنص عن الشخص نفسه فقط) */
  var THIRD = { 'معاه': 'معاها', 'إنه': 'إنها', 'انه': 'إنها', 'أنه': 'أنها', 'له': 'لها', 'منه': 'منها', 'عنده': 'عندها', 'بيه': 'بيها', 'ليه': 'ليها', 'جواه': 'جواها', 'اسأله': 'اسألها', 'سيبه': 'سيبها', 'ساعده': 'ساعدها', 'ادعمه': 'ادعمها', 'شجعه': 'شجعها', 'طمنه': 'طمنها', 'فهمه': 'فهمها', 'اسمعه': 'اسمعها', 'احتويه': 'احتويها', 'قاطعه': 'قاطعها', 'ضغط عليه': 'ضغط عليها', 'نفسه': 'نفسها', 'قلبه': 'قلبها', 'مشاعره': 'مشاعرها', 'وقته': 'وقتها', 'ظروفه': 'ظروفها', 'مساحته': 'مساحتها', 'حاجته': 'حاجتها', 'عليه': 'عليها' };
  var NOT_VERB = /^(يوم|يعني|ياريت|يا|يمين|يسار|يد|يدك|يدي|يقين|يوميا|يومي|يوميًا|يمكن)$/;

  function bound(re) { return new RegExp('(^|[^' + AR + '])((?:و|ف|ب|ل)?)(' + re + ')(?![' + AR + '])', 'g'); }
  function slash(w, f) { return f.indexOf(w) === 0 ? w + '/' + f.slice(w.length) : w + '/' + f; }
  function apply(text, map, both) {
    var keys = Object.keys(map).sort(function (a, b) { return b.length - a.length; });
    return text.replace(bound(keys.join('|')), function (m, pre, cl, w) {
      var f = map[w]; if (!f) return m;
      return pre + cl + (both ? slash(w, f) : f);
    });
  }
  function fix(text, gender, opts) {
    opts = opts || {};
    if (typeof text !== 'string' || !text) return text;
    if (!opts.both && gender !== 'female') return text;
    var t = apply(text, FEM, opts.both);
    t = apply(t, PRON, opts.both);
    if (opts.third) {
      t = apply(t, THIRD, opts.both);
      /* أفعال المضارع بصيغة الغائب: يضحك ← تضحك، بيضحك ← بتضحك، هيضحك ← هتضحك */
      t = t.replace(new RegExp('(^|[^' + AR + '])((?:و|ف)?)((?:بي|هي|ي)([' + AR + ']{2,}))(?![' + AR + '])', 'g'), function (m, pre, cl, w, rest) {
        if (NOT_VERB.test(w)) return m;
        var f = w.indexOf('بي') === 0 ? 'بت' + w.slice(2) : w.indexOf('هي') === 0 ? 'هت' + w.slice(2) : 'ت' + w.slice(1);
        return pre + cl + (opts.both ? w + '/' + f : f);
      });
    }
    return t;
  }
  return { fix: fix };
});
