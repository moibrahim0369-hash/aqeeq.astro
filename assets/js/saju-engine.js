/* عقيق أسترو · محرك الساجو (الأعمدة الأربعة) — حساب فعلي من تاريخ الميلاد وليس نصًا ثابتًا.
   - عمود السنة يتبدل عند «ليتشون» (لحظة وصول الشمس إلى 315° تقريبًا 4 فبراير)، لا عند 1 يناير.
   - عمود الشهر يتبع المصطلحات الشمسية الاثني عشر (كل 30° من الطول الفلكي للشمس) وتحسب لحظتها بمكتبة Astronomy.
   - عمود اليوم من الدورة الستينية للأيام (يوم 2000-01-01 هو وو-أو).
   - عمود الساعة: كل ساعتين فرع، وساعة 23:00 تنقل اليوم إلى اليوم التالي (الطريقة التقليدية الصينية). */
(function (root) {
  "use strict";
  var STEMS = [
    { han: "甲", ko: "갑", ar: "جاب", el: 0, yang: true },
    { han: "乙", ko: "을", ar: "أول", el: 0, yang: false },
    { han: "丙", ko: "병", ar: "بينغ", el: 1, yang: true },
    { han: "丁", ko: "정", ar: "جونغ", el: 1, yang: false },
    { han: "戊", ko: "무", ar: "مو", el: 2, yang: true },
    { han: "己", ko: "기", ar: "غي", el: 2, yang: false },
    { han: "庚", ko: "경", ar: "غيونغ", el: 3, yang: true },
    { han: "辛", ko: "신", ar: "شين", el: 3, yang: false },
    { han: "壬", ko: "임", ar: "إيم", el: 4, yang: true },
    { han: "癸", ko: "계", ar: "غيه", el: 4, yang: false }
  ];
  var BRANCHES = [
    { han: "子", ko: "자", animal: "الفأر", el: 4 },
    { han: "丑", ko: "축", animal: "الثور", el: 2 },
    { han: "寅", ko: "인", animal: "النمر", el: 0 },
    { han: "卯", ko: "묘", animal: "الأرنب", el: 0 },
    { han: "辰", ko: "진", animal: "التنين", el: 2 },
    { han: "巳", ko: "사", animal: "الأفعى", el: 1 },
    { han: "午", ko: "오", animal: "الحصان", el: 1 },
    { han: "未", ko: "미", animal: "الماعز", el: 2 },
    { han: "申", ko: "신", animal: "القرد", el: 3 },
    { han: "酉", ko: "유", animal: "الديك", el: 3 },
    { han: "戌", ko: "술", animal: "الكلب", el: 2 },
    { han: "亥", ko: "해", animal: "الخنزير", el: 4 }
  ];
  var ELEMENTS = ["خشب", "نار", "أرض", "معدن", "ماء"];

  function mod(a, n) { return ((a % n) + n) % n; }

  function sunLongitude(astro, date) {
    var v = astro.SunPosition(date);
    return v.elon;
  }
  /* لحظة وصول الشمس إلى طول فلكي معين في السنة المعطاة (UTC) */
  function termTime(astro, lon, year) {
    var start = new Date(Date.UTC(year, 0, 1));
    var t = astro.SearchSunLongitude(lon, start, 400);
    return t ? t.date : null;
  }
  /* فهرس الشهر الشمسي 0..11 (0 = شهر النمر، يبدأ عند 315°) ولحظة بدايته */
  function solarMonth(astro, date) {
    var lon = sunLongitude(astro, date);
    var idx = Math.floor(mod(lon - 315, 360) / 30);
    return idx;
  }
  /* السنة الساجوية: قبل لحظة ليتشون تُحسب السنة السابقة */
  function sajuYear(astro, date) {
    var y = date.getUTCFullYear();
    var lichun = termTime(astro, 315, y);
    return date < lichun ? y - 1 : y;
  }
  function julianDayNumber(y, m, d) {
    var a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }
  function pillar(stemIdx, branchIdx) { return { stem: stemIdx, branch: branchIdx, stemInfo: STEMS[stemIdx], branchInfo: BRANCHES[branchIdx] }; }

  /* year, month(1-12), day, hour(0-23)|null, minute, utcOffsetHours */
  function compute(astro, o) {
    var hasTime = o.hour != null && !isNaN(o.hour);
    var h = hasTime ? o.hour : 12, mi = hasTime ? (o.minute || 0) : 0;
    var off = o.utcOffset == null ? 0 : o.utcOffset;
    var utc = new Date(Date.UTC(o.year, o.month - 1, o.day, h, mi) - off * 3600000);
    var yr = sajuYear(astro, utc);
    var yearP = pillar(mod(yr - 4, 10), mod(yr - 4, 12));
    var mIdx = solarMonth(astro, utc);
    var monthBranch = mod(2 + mIdx, 12);
    var monthStem = mod((yearP.stem % 5) * 2 + 2 + mIdx, 10);
    var monthP = pillar(monthStem, monthBranch);
    /* اليوم: بالتوقيت المحلي المُدخل. بدون ساعة نحسب بمنتصف اليوم. 23:00 فما فوق تحسب لليوم التالي */
    var dY = o.year, dM = o.month, dD = o.day;
    var late = hasTime && h >= 23;
    var jdn = julianDayNumber(dY, dM, dD) + (late ? 1 : 0);
    var di = mod(jdn + 49, 60);
    var dayP = pillar(di % 10, di % 12);
    var hourP = null;
    if (hasTime) {
      var hb = Math.floor(mod(h + 1, 24) / 2);
      hourP = pillar(mod((dayP.stem % 5) * 2 + hb, 10), hb);
    }
    var pillars = { year: yearP, month: monthP, day: dayP, hour: hourP };
    var count = [0, 0, 0, 0, 0], total = 0;
    ["year", "month", "day", "hour"].forEach(function (k) {
      var p = pillars[k]; if (!p) return;
      count[p.stemInfo.el]++; count[p.branchInfo.el]++; total += 2;
    });
    return { pillars: pillars, elements: count, total: total, hasTime: hasTime, sajuYear: yr, dayMaster: dayP.stemInfo, lateZi: late };
  }
  var api = { STEMS: STEMS, BRANCHES: BRANCHES, ELEMENTS: ELEMENTS, compute: compute, julianDayNumber: julianDayNumber };
  root.AqSaju = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
