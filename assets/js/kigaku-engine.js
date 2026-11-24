/* عقيق أسترو · محرك تسع النجوم اليابانية (كيو سي كيغاكو) — حساب فعلي من تاريخ الميلاد.
   - سنة النجوم تبدأ عند ليتشون (الشمس عند 315°)، وشهرها يتبع المصطلحات الشمسية الاثني عشر (كل 30°).
   - بدون وقت ميلاد يُحسب آخر اليوم، فيدخل يوم التحول في الشهر الجديد كما في الجداول اليابانية (حسب التاريخ).
   - النجمة الأساسية (هونمي): مجموع أرقام السنة يُختزل إلى رقم واحد r. الرجل: 11 - r، والمرأة: r + 4، ثم يُطوى إلى 1..9 (الطريقة اليابانية التقليدية).
   - نجمة الشهر (غتسوميي) تُحسب من نجمة السنة العامة (التي تدور في مركز لوح السنة) ولا تتبع الجنس:
     سنة 1/4/7 يبدأ شهرها الأول (فبراير) بالرقم 8، و2/5/8 بالرقم 2، و3/6/9 بالرقم 5، ثم تنقص نجمة كل شهر بواحد. */
(function (root) {
  "use strict";
  function mod(a, n) { return ((a % n) + n) % n; }
  function red(n) { n = Math.abs(n); while (n > 9) { var s = 0; String(n).split("").forEach(function (c) { s += +c; }); n = s; } return n; }
  function fold(n) { n = mod(n - 1, 9) + 1; return n; }
  function universalYearStar(y) { return fold(11 - red(y)); }
  function principal(y, female) { return fold(female ? red(y) + 4 : 11 - red(y)); }
  function monthStar(yearUniv, mIdx) { var base = [8, 2, 5][(yearUniv - 1) % 3]; return fold(base - mIdx); }
  function sunLon(astro, d) { return astro.SunPosition(d).elon; }
  function termTime(astro, lon, year) { var t = astro.SearchSunLongitude(lon, new Date(Date.UTC(year, 0, 1)), 400); return t ? t.date : null; }
  function kiYear(astro, utc) { var y = utc.getUTCFullYear(); return utc < termTime(astro, 315, y) ? y - 1 : y; }
  function monthIdx(astro, utc) { return Math.floor(mod(sunLon(astro, utc) - 315, 360) / 30); }
  /* palace of star X in a board whose center holds star C: flight order center, NW, W, NE, S, N, SW, E, SE */
  var FLIGHT = ["center", "NW", "W", "NE", "S", "N", "SW", "E", "SE"];
  function palaceOf(x, c) { return FLIGHT[mod(x - c, 9)]; }
  /* o: year, month, day, hour|null, minute, utcOffset, female(bool); now: Date for the current-year board */
  function compute(astro, o) {
    var hasTime = o.hour != null && !isNaN(o.hour);
    var h = hasTime ? o.hour : 23, mi = hasTime ? (o.minute || 0) : 59, off = o.utcOffset == null ? 0 : o.utcOffset;
    var utc = new Date(Date.UTC(o.year, o.month - 1, o.day, h, mi) - off * 3600000);
    var ky = kiYear(astro, utc), mi0 = monthIdx(astro, utc);
    var uni = universalYearStar(ky);
    var pr = principal(ky, !!o.female), ch = monthStar(uni, mi0);
    return { kiYear: ky, monthIdx: mi0, universalYear: uni, principal: pr, character: ch, hasTime: hasTime, female: !!o.female };
  }
  /* لوح السنة: النجمة التي في المركز في سنة ki معينة وموضع نجمة الشخص فيها */
  function yearBoard(y, star) { var c = universalYearStar(y); return { year: y, center: c, palace: palaceOf(star, c) }; }
  var api = { compute: compute, universalYearStar: universalYearStar, principal: principal, monthStar: monthStar, yearBoard: yearBoard, palaceOf: palaceOf, red: red };
  root.AqKigaku = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
