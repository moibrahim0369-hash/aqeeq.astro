/* اختيار مكان الميلاد: دولة ← محافظة/ولاية + بحث عربي/إنجليزي.
   يشتغل فوق القوائم الحالية (#f-city, #cp1-city, #cp2-city) من غير ما يلمس محركات الحساب:
   بيختار/يضيف عنصر في CITIES ويطلق حدث change على القائمة الأصلية. */
(function () {
  "use strict";
  /* الدولة|English|العاصمة|Capital|lat|lon|tz  (إحداثيات العاصمة، وتُستخدم تقريبًا للمحافظات اللي ملهاش إحداثيات) */
  var C = ("مصر|Egypt|القاهرة|Cairo|30.0444|31.2357|Africa/Cairo;المملكة العربية السعودية|Saudi Arabia|الرياض|Riyadh|24.7136|46.6753|Asia/Riyadh;الإمارات العربية المتحدة|United Arab Emirates|أبوظبي|Abu Dhabi|24.4539|54.3773|Asia/Dubai;الكويت|Kuwait|مدينة الكويت|Kuwait City|29.3759|47.9774|Asia/Kuwait;قطر|Qatar|الدوحة|Doha|25.2854|51.531|Asia/Qatar;البحرين|Bahrain|المنامة|Manama|26.2285|50.586|Asia/Bahrain;عمان|Oman|مسقط|Muscat|23.588|58.3829|Asia/Muscat;الأردن|Jordan|عمّان|Amman|31.9454|35.9284|Asia/Amman;لبنان|Lebanon|بيروت|Beirut|33.8938|35.5018|Asia/Beirut;سوريا|Syria|دمشق|Damascus|33.5138|36.2765|Asia/Damascus;العراق|Iraq|بغداد|Baghdad|33.3152|44.3661|Asia/Baghdad;فلسطين|Palestine|القدس|Jerusalem|31.7683|35.2137|Asia/Hebron;اليمن|Yemen|صنعاء|Sanaa|15.3694|44.191|Asia/Aden;السودان|Sudan|الخرطوم|Khartoum|15.5007|32.5599|Africa/Khartoum;ليبيا|Libya|طرابلس|Tripoli|32.8872|13.1913|Africa/Tripoli;تونس|Tunisia|تونس|Tunis|36.8065|10.1815|Africa/Tunis;الجزائر|Algeria|الجزائر|Algiers|36.7538|3.0588|Africa/Algiers;المغرب|Morocco|الرباط|Rabat|34.0209|-6.8416|Africa/Casablanca;موريتانيا|Mauritania|نواكشوط|Nouakchott|18.0735|-15.9582|Africa/Nouakchott;الصومال|Somalia|مقديشو|Mogadishu|2.0469|45.3182|Africa/Mogadishu;جيبوتي|Djibouti|جيبوتي|Djibouti|11.5721|43.1456|Africa/Djibouti;جزر القمر|Comoros|موروني|Moroni|-11.7172|43.2473|Indian/Comoro;تركيا|Turkey|أنقرة|Ankara|39.9334|32.8597|Europe/Istanbul;إيران|Iran|طهران|Tehran|35.6892|51.389|Asia/Tehran;إسرائيل|Israel|القدس|Jerusalem|31.7683|35.2137|Asia/Jerusalem;قبرص|Cyprus|نيقوسيا|Nicosia|35.1856|33.3823|Asia/Nicosia;أثيوبيا|Ethiopia|أديس أبابا|Addis Ababa|9.03|38.74|Africa/Addis_Ababa;كينيا|Kenya|نيروبي|Nairobi|-1.2921|36.8219|Africa/Nairobi;نيجيريا|Nigeria|أبوجا|Abuja|9.0765|7.3986|Africa/Lagos;جنوب أفريقيا|South Africa|بريتوريا|Pretoria|-25.7479|28.2293|Africa/Johannesburg;غانا|Ghana|أكرا|Accra|5.6037|-0.187|Africa/Accra;السنغال|Senegal|داكار|Dakar|14.7167|-17.4677|Africa/Dakar;تنزانيا|Tanzania|دودوما|Dodoma|-6.163|35.7516|Africa/Dar_es_Salaam;أوغندا|Uganda|كمبالا|Kampala|0.3476|32.5825|Africa/Kampala;الجزائر_|x|x|x|0|0|x;المملكة المتحدة|United Kingdom|لندن|London|51.5074|-0.1278|Europe/London;أيرلندا|Ireland|دبلن|Dublin|53.3498|-6.2603|Europe/Dublin;فرنسا|France|باريس|Paris|48.8566|2.3522|Europe/Paris;ألمانيا|Germany|برلين|Berlin|52.52|13.405|Europe/Berlin;إيطاليا|Italy|روما|Rome|41.9028|12.4964|Europe/Rome;إسبانيا|Spain|مدريد|Madrid|40.4168|-3.7038|Europe/Madrid;البرتغال|Portugal|لشبونة|Lisbon|38.7223|-9.1393|Europe/Lisbon;هولندا|Netherlands|أمستردام|Amsterdam|52.3676|4.9041|Europe/Amsterdam;بلجيكا|Belgium|بروكسل|Brussels|50.8503|4.3517|Europe/Brussels;سويسرا|Switzerland|برن|Bern|46.948|7.4474|Europe/Zurich;النمسا|Austria|فيينا|Vienna|48.2082|16.3738|Europe/Vienna;السويد|Sweden|ستوكهولم|Stockholm|59.3293|18.0686|Europe/Stockholm;النرويج|Norway|أوسلو|Oslo|59.9139|10.7522|Europe/Oslo;الدنمارك|Denmark|كوبنهاغن|Copenhagen|55.6761|12.5683|Europe/Copenhagen;فنلندا|Finland|هلسنكي|Helsinki|60.1699|24.9384|Europe/Helsinki;بولندا|Poland|وارسو|Warsaw|52.2297|21.0122|Europe/Warsaw;اليونان|Greece|أثينا|Athens|37.9838|23.7275|Europe/Athens;روسيا|Russia|موسكو|Moscow|55.7558|37.6173|Europe/Moscow;أوكرانيا|Ukraine|كييف|Kyiv|50.4501|30.5234|Europe/Kyiv;رومانيا|Romania|بوخارست|Bucharest|44.4268|26.1025|Europe/Bucharest;بلغاريا|Bulgaria|صوفيا|Sofia|42.6977|23.3219|Europe/Sofia;هنغاريا|Hungary|بودابست|Budapest|47.4979|19.0402|Europe/Budapest;الجمهورية التشيكية|Czechia|براغ|Prague|50.0755|14.4378|Europe/Prague;صربيا|Serbia|بلغراد|Belgrade|44.7866|20.4489|Europe/Belgrade;كرواتيا|Croatia|زغرب|Zagreb|45.815|15.9819|Europe/Zagreb;ألبانيا|Albania|تيرانا|Tirana|41.3275|19.8187|Europe/Tirane;البوسنة والهرسك|Bosnia and Herzegovina|سراييفو|Sarajevo|43.8563|18.4131|Europe/Sarajevo;أيسلندا|Iceland|ريكيافيك|Reykjavik|64.1466|-21.9426|Atlantic/Reykjavik;مالطا|Malta|فاليتا|Valletta|35.8989|14.5146|Europe/Malta;الولايات المتحدة|United States|واشنطن العاصمة|Washington DC|38.9072|-77.0369|America/New_York;كندا|Canada|أوتاوا|Ottawa|45.4215|-75.6972|America/Toronto;المكسيك|Mexico|مكسيكو سيتي|Mexico City|19.4326|-99.1332|America/Mexico_City;البرازيل|Brazil|برازيليا|Brasilia|-15.7939|-47.8828|America/Sao_Paulo;الأرجنتين|Argentina|بوينس آيرس|Buenos Aires|-34.6037|-58.3816|America/Argentina/Buenos_Aires;تشيلي|Chile|سانتياغو|Santiago|-33.4489|-70.6693|America/Santiago;كولومبيا|Colombia|بوغوتا|Bogota|4.711|-74.0721|America/Bogota;بيرو|Peru|ليما|Lima|-12.0464|-77.0428|America/Lima;فنزويلا|Venezuela|كاراكاس|Caracas|10.4806|-66.9036|America/Caracas;كوبا|Cuba|هافانا|Havana|23.1136|-82.3666|America/Havana;الصين|China|بكين|Beijing|39.9042|116.4074|Asia/Shanghai;اليابان|Japan|طوكيو|Tokyo|35.6762|139.6503|Asia/Tokyo;كوريا الجنوبية|South Korea|سيول|Seoul|37.5665|126.978|Asia/Seoul;الهند|India|نيودلهي|New Delhi|28.6139|77.209|Asia/Kolkata;باكستان|Pakistan|إسلام آباد|Islamabad|33.6844|73.0479|Asia/Karachi;بنغلاديش|Bangladesh|دكا|Dhaka|23.8103|90.4125|Asia/Dhaka;أفغانستان|Afghanistan|كابول|Kabul|34.5553|69.2075|Asia/Kabul;أندونيسيا|Indonesia|جاكرتا|Jakarta|-6.2088|106.8456|Asia/Jakarta;ماليزيا|Malaysia|كوالالمبور|Kuala Lumpur|3.139|101.6869|Asia/Kuala_Lumpur;سنغافورة|Singapore|سنغافورة|Singapore|1.3521|103.8198|Asia/Singapore;تايلاند|Thailand|بانكوك|Bangkok|13.7563|100.5018|Asia/Bangkok;فيتنام|Vietnam|هانوي|Hanoi|21.0278|105.8342|Asia/Ho_Chi_Minh;فيلبيني|Philippines|مانيلا|Manila|14.5995|120.9842|Asia/Manila;كازاخستان|Kazakhstan|أستانا|Astana|51.1694|71.4491|Asia/Almaty;أوزبكستان|Uzbekistan|طشقند|Tashkent|41.2995|69.2401|Asia/Tashkent;أذربيجان|Azerbaijan|باكو|Baku|40.4093|49.8671|Asia/Baku;أرمينيا|Armenia|يريفان|Yerevan|40.1792|44.4991|Asia/Yerevan;جورجيا|Georgia|تبليسي|Tbilisi|41.7151|44.8271|Asia/Tbilisi;أستراليا|Australia|كانبرا|Canberra|-35.2809|149.13|Australia/Sydney;نيوزيلندا|New Zealand|ويلينغتون|Wellington|-41.2866|174.7756|Pacific/Auckland").split(";").map(function (s) { var p = s.split("|"); return { ar: p[0], en: p[1], capAr: p[2], capEn: p[3], lat: +p[4], lon: +p[5], tz: p[6] }; }).filter(function (c) { return c.en !== "x"; });
  var BYAR = {}; C.forEach(function (c) { BYAR[c.ar] = c; });
  /* أسماء معيبة في ملف الأقسام الإدارية */
  var FIX = { "ديك رومى": "تركيا", "فيلبيني": "الفلبين", "تيمور قراءة": "تيمور الشرقية", "جمع شمل": "ريونيون", "عمان": "سلطنة عمان" };
  /* محافظات/مناطق بإحداثيات حقيقية (مراكزها الإدارية) */
  function T(s, tz) { var o = {}; s.split(";").forEach(function (r) { var p = r.split("|"); o[p[0]] = { lat: +p[1], lon: +p[2], tz: tz, n: p[3] || p[0] }; }); return o; }
  var R = {
    "مصر": T("أسوان|24.0889|32.8998;أسيوط|27.1809|31.1837;الأقصر|25.6872|32.6396;الإسكندرية|31.2001|29.9187;الإسماعيلية|30.5965|32.2715;البحر الأحمر|27.2579|33.8116|الغردقة;البحيرة|31.0341|30.4682|دمنهور;الجيزة|30.0131|31.2089;الدقهلية|31.0409|31.3785|المنصورة;السويس|29.9668|32.5498;الشرقية|30.5877|31.502|الزقازيق;الغربية|30.7865|31.0004|طنطا;الفيوم|29.3084|30.8428;القاهرة|30.0444|31.2357;القليوبية|30.466|31.1848|بنها;المنوفية|30.5972|30.9876|شبين الكوم;المنيا|28.1099|30.7503;الوادي الجديد|25.439|30.5586|الخارجة;بني سويف|29.0661|31.0994;بورسعيد|31.2653|32.3019;جنوب سيناء|28.241|33.6222|الطور;دمياط|31.4165|31.8133;سوهاج|26.5591|31.6957;شمال سيناء|31.1316|33.7984|العريش;قنا|26.1551|32.716;كفر الشيخ|31.1107|30.9388;مطروح|31.3543|27.2373", "Africa/Cairo"),
    "المملكة العربية السعودية": T("الباحة|20.0129|41.4677;الجوف|29.9697|40.2064|سكاكا;الحدود الشمالية|30.9753|41.0381|عرعر;الرياض|24.7136|46.6753;القصيم|26.326|43.975|بريدة;المدينة المنورة|24.5247|39.5692;المنطقة الشرقية|26.4207|50.0888|الدمام;تبوك|28.3838|36.555;جيزان|16.8892|42.5511;عسير|18.2164|42.5053|أبها;مكة المكرمة|21.3891|39.8579;منطقة حائل|27.5114|41.7208|حائل;نجران|17.4933|44.1277", "Asia/Riyadh"),
    "الإمارات العربية المتحدة": T("أبو ظبي|24.4539|54.3773;أم القيوين|25.5647|55.5534;الشارقة|25.3463|55.4209;الفجيرة|25.1288|56.3265;دبي|25.2048|55.2708;رأس الخيمة|25.7895|55.9432;عجمان|25.4052|55.5136", "Asia/Dubai")
  };
  /* أسماء إنجليزية للبحث (مدن/محافظات شائعة) */
  var EN = { "القاهرة": "cairo", "الجيزة": "giza", "الإسكندرية": "alexandria", "المنصورة": "mansoura", "طنطا": "tanta", "الزقازيق": "zagazig", "أسوان": "aswan", "الأقصر": "luxor", "أسيوط": "asyut assiut", "بورسعيد": "port said", "السويس": "suez", "الإسماعيلية": "ismailia", "دمياط": "damietta", "الفيوم": "fayoum faiyum", "المنيا": "minya", "سوهاج": "sohag", "قنا": "qena", "بني سويف": "beni suef", "كفر الشيخ": "kafr el sheikh", "الغردقة": "hurghada", "البحر الأحمر": "red sea", "مطروح": "matrouh marsa matruh", "جنوب سيناء": "south sinai sharm", "شمال سيناء": "north sinai arish", "الوادي الجديد": "new valley", "الشرقية": "sharqia", "الغربية": "gharbia", "الدقهلية": "dakahlia", "البحيرة": "beheira", "المنوفية": "monufia", "القليوبية": "qalyubia", "الرياض": "riyadh", "جدة": "jeddah", "مكة المكرمة": "mecca makkah", "المدينة المنورة": "medina madinah", "الدمام": "dammam", "دبي": "dubai", "أبو ظبي": "abu dhabi", "أبوظبي": "abu dhabi", "الشارقة": "sharjah", "بغداد": "baghdad", "البصرة": "basra", "أربيل": "erbil", "الموصل": "mosul", "دمشق": "damascus", "حلب": "aleppo", "بيروت": "beirut", "عمّان": "amman", "القدس": "jerusalem", "غزة": "gaza", "صنعاء": "sanaa", "عدن": "aden", "الخرطوم": "khartoum", "طرابلس": "tripoli", "بنغازي": "benghazi", "تونس": "tunis", "الجزائر": "algiers", "الدار البيضاء": "casablanca", "الرباط": "rabat", "مراكش": "marrakech", "الدوحة": "doha", "الكويت": "kuwait", "المنامة": "manama", "مسقط": "muscat", "لندن": "london", "باريس": "paris", "برلين": "berlin", "إسطنبول": "istanbul", "نيويورك": "new york", "لوس أنجلوس": "los angeles", "تورونتو": "toronto" };
  function norm(s) { return String(s || "").toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/^(محافظه|منطقه|ولايه)\s+/, "").replace(/\s+/g, " ").trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var GEO = (window.AQEEQ_GEO || []).map(function (g) { return { name: FIX[g.name] || g.name, raw: g.name, regions: g.regions }; });
  function order(a, b) { var ia = C.findIndex(function (c) { return c.ar === a.name; }), ib = C.findIndex(function (c) { return c.ar === b.name; }); if (ia < 0 && ib < 0) return 0; if (ia < 0) return 1; if (ib < 0) return -1; return ia - ib; }
  GEO = GEO.slice().sort(function (a, b) { var ka = BYAR[a.name] ? 0 : 1, kb = BYAR[b.name] ? 0 : 1; return ka !== kb ? ka - kb : (ka === 0 ? order(a, b) : a.name.localeCompare(b.name, "ar")); });

  function countryOf(name) { return BYAR[name] || BYAR[FIX[name]] || null; }

  /* يرجّع فهرس مدينة جاهز في CITIES (أو يضيفها) للدولة/المنطقة المختارة. approx=true لو الإحداثيات تقريبية. */
  function resolve(country, region) {
    var c = countryOf(country.name), cities = window.__aqCITIES();
    var rt = R[country.name] && R[country.name][region || ""];
    var hit = null, approx = false, label = region || (c && c.capAr) || country.name;
    var nr = norm(region);
    if (rt) { hit = { lat: rt.lat, lon: rt.lon, tz: rt.tz, n: rt.n }; }
    if (!hit && region) { var m = cities.find(function (x) { return norm(x.n) === nr; }); if (m && m.tz) hit = { lat: m.lat, lon: m.lon, tz: m.tz, n: m.n }; }
    if (!hit && c) { hit = { lat: c.lat, lon: c.lon, tz: c.tz, n: region || c.capAr }; approx = !!region; }
    if (!hit) return null;
    var key = hit.n + "|" + country.name;
    var idx = cities.findIndex(function (x) { return x.__gk === key; });
    if (idx < 0) {
      var exist = cities.findIndex(function (x) { return norm(x.n) === norm(hit.n) && Math.abs(x.lat - hit.lat) < 0.5 && Math.abs(x.lon - hit.lon) < 0.5 && x.tz; });
      if (exist >= 0 && !approx) return { idx: exist, approx: false };
      cities.push({ n: hit.n, lat: hit.lat, lon: hit.lon, tz: hit.tz, g: country.name, __gk: key, __gn: country.name + (region ? " — " + region : "") });
      idx = cities.length - 1;
    }
    return { idx: idx, approx: approx };
  }

  function attach(sel, opts) {
    if (!sel || sel.__geo) return; sel.__geo = 1; opts = opts || {};
    var host = document.createElement("div"); host.className = "geo-pk";
    host.innerHTML = '<div class="geo-srch"><input type="search" class="geo-q" autocomplete="off" placeholder="اكتب اسم بلدك أو محافظتك أو مدينتك"><ul class="geo-res" role="listbox" hidden></ul></div>' +
      '<div class="geo-row"><label><span>الدولة</span><select class="geo-c"></select></label><label><span>المحافظة / المنطقة</span><select class="geo-r"></select></label></div>' +
      '<small class="geo-note" aria-live="polite"></small>';
    sel.parentNode.insertBefore(host, sel); sel.style.display = "none";
    var lbl = sel.parentNode.querySelector('label[for="' + sel.id + '"]'); if (lbl) lbl.style.display = "none";
    var q = host.querySelector(".geo-q"), res = host.querySelector(".geo-res"), cs = host.querySelector(".geo-c"), rs = host.querySelector(".geo-r"), note = host.querySelector(".geo-note");
    cs.innerHTML = GEO.map(function (g, i) { return '<option value="' + i + '">' + esc(g.name) + "</option>"; }).join("");
    function fillRegions(ci, pick) {
      var g = GEO[ci]; var c = countryOf(g.name);
      var regs = g.regions.slice(); if (R[g.name]) regs = Object.keys(R[g.name]);
      var html = ""; if (c && !regs.some(function (r) { return norm(r) === norm(c.capAr); })) html += '<option value="">' + esc(c.capAr) + " (العاصمة)</option>";
      regs.forEach(function (r) { html += '<option value="' + esc(r) + '">' + esc(r) + "</option>"; });
      rs.innerHTML = html; if (pick != null) rs.value = pick; else if (c) { var cap = regs.find(function (r) { return norm(r) === norm(c.capAr) || (R[g.name] && R[g.name][r] && norm(R[g.name][r].n) === norm(c.capAr)); }); rs.value = cap != null ? cap : ""; }
    }
    function apply() {
      if (cs.value === "manual") { sel.value = "manual"; sel.dispatchEvent(new Event("change", { bubbles: true })); note.textContent = "اكتب خط العرض والطول وفرق التوقيت يدويًا."; return; }
      var g = GEO[+cs.value], r = resolve(g, rs.value || "");
      if (!r) { note.textContent = "لم نجد هذا المكان، اكتب اسم أقرب مدينة كبيرة."; return; }
      var cities = window.__aqCITIES(), ct = cities[r.idx];
      if (!sel.querySelector('option[value="' + r.idx + '"]')) { var o = document.createElement("option"); o.value = r.idx; o.textContent = ct.n; sel.appendChild(o); }
      sel.value = String(r.idx); sel.dispatchEvent(new Event("change", { bubbles: true }));
      note.textContent = "تم اختيار: " + ct.n + (g.name && norm(g.name) !== norm(ct.n) ? " — " + g.name : "");
    }
    cs.addEventListener("change", function () { if (cs.value === "manual") { rs.innerHTML = ""; apply(); return; } fillRegions(+cs.value); apply(); });
    rs.addEventListener("change", apply);
    function index() {
      var out = [];
      GEO.forEach(function (g, gi) { var c = countryOf(g.name);
        out.push({ t: g.name, sub: "دولة", k: norm(g.name) + " " + norm((c && c.en) || ""), gi: gi, r: "" });
        if (c && !(R[g.name] ? Object.keys(R[g.name]) : g.regions).some(function (r) { return norm(r) === norm(c.capAr); })) out.push({ t: c.capAr, sub: g.name + " — العاصمة", k: norm(c.capAr) + " " + norm(c.capEn) + " عاصمه " + norm(g.name) + " capital " + norm(c.en), gi: gi, r: "" });
        var regs = R[g.name] ? Object.keys(R[g.name]) : g.regions;
        regs.forEach(function (r) { var disp = R[g.name] ? R[g.name][r].n : r; out.push({ t: disp, sub: g.name + (disp !== r ? " — " + r : ""), k: norm(r) + " " + norm(disp) + " " + norm(EN[r] || "") + " " + norm(EN[disp] || ""), gi: gi, r: r }); });
      });
      (window.__aqCITIES() || []).forEach(function (ct, ci) { if (ct.__gk || !ct.n) return; out.push({ t: ct.n, sub: ct.g || "", k: norm(ct.n) + " " + norm(ct.g || ""), ci: ci }); });
      return out;
    }
    var IDX = null;
    function search() {
      var v = norm(q.value); if (v.length < 2) { res.hidden = true; return; }
      IDX = IDX || index(); var seen = {}, hits = [];
      for (var i = 0; i < IDX.length && hits.length < 12; i++) { var it = IDX[i]; if (it.k.indexOf(v) < 0) continue; var key = it.t + it.sub; if (seen[key]) continue; seen[key] = 1; hits.push(it); }
      hits.sort(function (a, b) { return (norm(a.t).indexOf(v) === 0 ? 0 : 1) - (norm(b.t).indexOf(v) === 0 ? 0 : 1); });
      res.innerHTML = hits.length ? hits.map(function (h, i) { return '<li role="option" data-i="' + i + '"><b>' + esc(h.t) + "</b><small>" + esc(h.sub) + "</small></li>"; }).join("") : '<li class="geo-none">مفيش نتيجة — جرّب اسم تاني أو اختار من القوائم</li>';
      res.__hits = hits; res.hidden = false;
    }
    q.addEventListener("input", search);
    q.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); var f = res.querySelector("li[data-i]"); if (f) f.dispatchEvent(new Event("mousedown", { bubbles: true })); } });
    res.addEventListener("mousedown", function (e) { var li = e.target.closest("li[data-i]"); if (!li) return; e.preventDefault(); var h = res.__hits[+li.dataset.i];
      if (h.ci != null) { if (!sel.querySelector('option[value="' + h.ci + '"]')) { var o2 = document.createElement("option"); o2.value = h.ci; o2.textContent = h.t; sel.appendChild(o2); } sel.value = String(h.ci); sel.dispatchEvent(new Event("change", { bubbles: true })); q.value = h.t; note.textContent = "تم اختيار: " + h.t + (h.sub ? " — " + h.sub : ""); res.hidden = true; return; }
      cs.value = String(h.gi); fillRegions(h.gi, h.r); apply(); q.value = h.t; res.hidden = true; });
    document.addEventListener("click", function (e) { if (!host.contains(e.target)) res.hidden = true; });
    sel.addEventListener("change", function () {
      var o = sel.options[sel.selectedIndex]; if (!o || sel.value === "manual") return;
      var ct = window.__aqCITIES()[+sel.value]; if (ct && document.activeElement !== q) { q.value = ct.n; note.textContent = "تم اختيار: " + ct.n + (ct.g ? " — " + ct.g : ""); }
    });
    /* افتراضي: مصر / القاهرة (أو اللي اتحفظ) */
    fillRegions(0, "القاهرة"); apply();
  }
  window.AqeeqGeoPicker = { attach: attach };
  function boot() { ["f-city", "cp1-city", "cp2-city", "y27-city", "eam-b-city"].forEach(function (id) { attach(document.getElementById(id)); }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 0); }); else setTimeout(boot, 0);
  setTimeout(boot, 1500);
})();
