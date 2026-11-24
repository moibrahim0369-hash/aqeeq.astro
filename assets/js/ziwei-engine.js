/* عقيق أسترو · محرك زي وي دو شو (الخريطة البنفسجية) — حساب فعلي من تاريخ الميلاد.
   - التقويم القمري الصيني: جدول 1900–2100 (طول كل شهر وشهر الكبس) مولّد من التقويم الصيني الرسمي ومفحوص يوميًا مقابل مكتبتين مرجعيتين.
   - سنة الميلاد (الجذع والفرع) من السنة القمرية (رأس السنة الصينية)، وشهر الكبس: بعد اليوم 15 يُحسب للشهر التالي (المعتاد).
   - فرع الساعة: كل ساعتين فرع، 23:00 فما فوق فرع «زي» ويُحسب يومه اليوم التالي.
   - بيت النفس من الشهر والساعة، البيوت الاثنا عشر عكس عقارب الساعة، دورة العنصر (الجو) من جذع وفرع بيت النفس، وموضع نجمة زي وي من اليوم القمري ودورة العنصر. */
(function (root) {
  "use strict";
  var LT = [19416,19168,42352,21717,53856,55632,91476,22176,39632,21970,19168,42422,42192,53840,119381,46400,54944,44450,38320,84343,18800,42160,46261,27216,27968,109396,11104,38256,21234,18800,25958,54432,59984,92821,23248,11104,100067,37600,116951,51536,54432,120998,46416,22176,107956,9680,37584,53938,43344,46423,27808,46416,86869,19872,42416,83315,21168,43432,59728,27296,44710,43856,19296,43748,42352,21088,62051,55632,23383,22176,38608,19925,19152,42192,54484,53840,54616,46400,46752,103846,38320,18864,43380,42160,45690,27216,27968,44870,43872,38256,19189,18800,25776,29859,59984,27480,23232,43872,38613,37600,51552,55636,54432,55888,30034,22176,43959,9680,37584,51893,43344,46240,47780,44368,21977,19360,42416,86390,21168,43312,31060,27296,44368,23378,19296,42726,42208,53856,60005,54576,23200,30371,38608,19195,19152,42192,118966,53840,54560,56645,46496,22224,21938,18864,42359,42160,43600,111189,27936,44448,84835,37744,18936,18800,25776,92326,59984,27424,108228,43744,37600,53987,51552,54615,54432,55888,23893,22176,42704,21972,21200,43448,43344,46240,46758,44368,21920,43940,42416,21168,45683,26928,29495,27296,44368,84821,19296,42352,21732,53600,59752,54560,55968,92838,22224,19168,43476,41680,53584,62034,54560];
  var BR = {"紫微":"PMWWDWMMWWDW","天机":"MXDWLPMXDWLP","太阳":"XBWMWWWDDPBX","武曲":"WMDLMPWMDLMP","天同":"WBLPPMXBWPPM","廉贞":"PLMPLXPLMPLX","天府":"MMMDMDWMDWMD","太阴":"MMWXXXBBLWWM","贪狼":"WMPLMXWMPLMX","巨门":"WBMMXWWBMMXW","天相":"MMMXDDMDMXDD","天梁":"MWMMMXMWXDMX","七杀":"WMMWMPWMMWMP","破军":"MWDXWPMWDXWP"};
  var STEMS = "甲乙丙丁戊己庚辛壬癸", BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
  function mod(a, n) { return ((a % n) + n) % n; }
  function leapMonth(y) { return LT[y - 1900] & 15; }
  function leapDays(y) { return leapMonth(y) ? ((LT[y - 1900] & 0x10000) ? 30 : 29) : 0; }
  function monthDays(y, m) { return (LT[y - 1900] & (0x10000 >> m)) ? 30 : 29; }
  function yearDays(y) { var s = 348, i; for (i = 0x8000; i > 0x8; i >>= 1) s += (LT[y - 1900] & i) ? 1 : 0; return s + leapDays(y); }
  function utcDays(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
  /* solar (y,m,d) -> {year, month, leap, day} */
  function toLunar(y, m, d) {
    var off = utcDays(y, m, d) - utcDays(1900, 1, 31);
    if (off < 0) return null;
    var ly = 1900, n;
    while (ly <= 2100 && off >= (n = yearDays(ly))) { off -= n; ly++; }
    if (ly > 2100) return null;
    var lm = leapMonth(ly), leap = false, mo = 1;
    while (mo <= 12) {
      var dd = monthDays(ly, mo);
      if (off < dd) return { year: ly, month: mo, leap: false, day: off + 1 };
      off -= dd;
      if (lm === mo) { var ld = leapDays(ly); if (off < ld) return { year: ly, month: mo, leap: true, day: off + 1 }; off -= ld; }
      mo++;
    }
    return null;
  }
  var STAR_ORDER_Z = [["紫微", 0], ["天机", -1], ["太阳", -3], ["武曲", -4], ["天同", -5], ["廉贞", -8]];
  var STAR_ORDER_F = [["天府", 0], ["太阴", 1], ["贪狼", 2], ["巨门", 3], ["天相", 4], ["天梁", 5], ["七杀", 6], ["破军", 10]];
  var PALACES = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "仆役", "官禄", "田宅", "福德", "父母"];
  var HUA = { 甲: ["廉贞", "破军", "武曲", "太阳"], 乙: ["天机", "天梁", "紫微", "太阴"], 丙: ["天同", "天机", "文昌", "廉贞"], 丁: ["太阴", "天同", "天机", "巨门"], 戊: ["贪狼", "太阴", "右弼", "天机"], 己: ["武曲", "贪狼", "天梁", "文曲"], 庚: ["太阳", "武曲", "太阴", "天同"], 辛: ["巨门", "太阳", "文曲", "文昌"], 壬: ["天梁", "紫微", "左辅", "武曲"], 癸: ["破军", "巨门", "太阴", "贪狼"] };
  var HUA_NAMES = ["禄", "权", "科", "忌"];
  var KUIYUE = { 甲: [1, 7], 戊: [1, 7], 庚: [1, 7], 乙: [0, 8], 己: [0, 8], 丙: [11, 9], 丁: [11, 9], 壬: [3, 5], 癸: [3, 5], 辛: [6, 2] };
  var LUCUN = { 甲: 2, 乙: 3, 丙: 5, 戊: 5, 丁: 6, 己: 6, 庚: 8, 辛: 9, 壬: 11, 癸: 0 };
  function group(b) { return [0, 8, 4].indexOf(b) >= 0 ? 0 : [2, 6, 10].indexOf(b) >= 0 ? 1 : [5, 9, 1].indexOf(b) >= 0 ? 2 : 3; } /* 申子辰, 寅午戌, 巳酉丑, 亥卯未 */
  var HUO = [[2, 10], [1, 3], [3, 10], [9, 10]], LING = null;
  function starPos(table, group_) { return table[group_]; }
  var HUOSTART = [2, 1, 3, 9], LINGSTART = [10, 3, 10, 10];
  var TIANMA = [2, 8, 11, 5];
  function bureauOf(stem, branch) {
    var sv = Math.floor(stem / 2) + 1, bv = [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3][branch];
    var s = sv + bv; if (s > 5) s -= 5;
    return [null, { n: 3, el: 0 }, { n: 4, el: 3 }, { n: 2, el: 4 }, { n: 6, el: 1 }, { n: 5, el: 2 }][s];
  }
  function ziweiPos(day, n) {
    var x = 0; while ((day + x) % n !== 0) x++;
    var q = (day + x) / n, p = mod(2 + q - 1, 12);
    return x % 2 ? mod(p - x, 12) : mod(p + x, 12);
  }
  function brightness(star, b) { var s = BR[star]; return s ? s.charAt(b) : ""; }

  /* o: year, month, day (solar), hour (0-23) | null, female (bool) */
  function compute(o) {
    var hasTime = o.hour != null && !isNaN(o.hour);
    var y = o.year, m = o.month, d = o.day, hb = 0;
    if (hasTime) { hb = Math.floor(mod(o.hour + 1, 24) / 2); if (o.hour >= 23) { var nx = new Date(Date.UTC(y, m - 1, d + 1)); y = nx.getUTCFullYear(); m = nx.getUTCMonth() + 1; d = nx.getUTCDate(); } }
    var L = toLunar(y, m, d); if (!L) return null;
    var lm = L.month; if (L.leap && L.day > 15) lm = lm + 1; if (lm > 12) lm = 1;
    var ys = mod(L.year - 4, 10), yb = mod(L.year - 4, 12), yStem = STEMS.charAt(ys);
    var ming = mod(2 + (lm - 1) - hb, 12), shen = mod(2 + (lm - 1) + hb, 12);
    var yinStem = [2, 4, 6, 8, 0][ys % 5];
    var pal = [], i;
    for (i = 0; i < 12; i++) pal.push({ branch: i, stem: mod(yinStem + mod(i - 2, 12), 10), name: null, major: [], minor: [] });
    for (i = 0; i < 12; i++) pal[mod(ming - i, 12)].name = PALACES[i];
    pal[shen].isBody = true;
    var bu = bureauOf(pal[ming].stem, ming);
    var zp = ziweiPos(L.day, bu.n), tf = mod(4 - zp, 12);
    STAR_ORDER_Z.forEach(function (s) { pal[mod(zp + s[1], 12)].major.push({ id: s[0] }); });
    STAR_ORDER_F.forEach(function (s) { pal[mod(tf + s[1], 12)].major.push({ id: s[0] }); });
    pal.forEach(function (p) { p.major.forEach(function (s) { s.br = brightness(s.id, p.branch); }); });
    function put(star, pos) { pal[mod(pos, 12)].minor.push({ id: star }); }
    put("左辅", 4 + lm - 1); put("右弼", 10 - (lm - 1)); put("文昌", 10 - hb); put("文曲", 4 + hb);
    put("天魁", KUIYUE[yStem][0]); put("天钺", KUIYUE[yStem][1]);
    var lc = LUCUN[yStem]; put("禄存", lc); put("擎羊", lc + 1); put("陀罗", lc - 1);
    var g = group(yb); put("火星", HUOSTART[g] + hb); put("铃星", LINGSTART[g] + hb);
    put("地空", 11 - hb); put("地劫", 11 + hb); put("天马", TIANMA[g]);
    /* الأربع تحولات */
    var hua = HUA[yStem].map(function (st, k) {
      var found = null;
      pal.forEach(function (p) { p.major.concat(p.minor).forEach(function (s) { if (s.id === st) { s.hua = HUA_NAMES[k]; found = p.branch; } }); });
      return { star: st, type: HUA_NAMES[k], branch: found };
    });
    /* الدورات العشرية */
    var yang = ys % 2 === 0, fwd = (yang && !o.female) || (!yang && o.female);
    for (i = 0; i < 12; i++) { var bi = mod(fwd ? ming + i : ming - i, 12); pal[bi].decade = [bu.n + 10 * i, bu.n + 10 * i + 9]; }
    return { lunar: L, lunarMonthUsed: lm, yearStem: ys, yearBranch: yb, hourBranch: hb, hasTime: hasTime, ming: ming, shen: shen, bureau: bu, ziwei: zp, tianfu: tf, palaces: pal, hua: hua, decadeForward: fwd, late: hasTime && o.hour >= 23, female: !!o.female };
  }
  /* السنة القمرية الجارية لتاريخ ما + حركة السنة */
  function flowYear(chart, y, m, d) {
    var L = toLunar(y, m, d); if (!L) return null;
    var ys = mod(L.year - 4, 10), yb = mod(L.year - 4, 12), yStem = STEMS.charAt(ys);
    var hua = HUA[yStem].map(function (st, k) {
      var found = null;
      chart.palaces.forEach(function (p) { p.major.concat(p.minor).forEach(function (s) { if (s.id === st) found = p.branch; }); });
      return { star: st, type: HUA_NAMES[k], branch: found };
    });
    return { lunarYear: L.year, stem: ys, branch: yb, hua: hua, ageLunar: L.year - chart.lunar.year + 1 };
  }
  var api = { compute: compute, toLunar: toLunar, flowYear: flowYear, STEMS: STEMS, BRANCHES: BRANCHES, PALACES: PALACES, HUA_NAMES: HUA_NAMES, brightness: brightness };
  root.AqZiwei = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
