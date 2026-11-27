/* app.js */
/* Aqeq Astro: audited Life Path Synastry integration.
   Calculation source: engine.js. Content source: data.json.
   Static-hosting compatible; no payment/security claim is made by the preview unlock. */
(() => {
  "use strict";

  const form = document.getElementById("synastry-form");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const errorBox = $("syn-error");
  const output = $("syn-result");
  let DATA = null;
  let DATA_ERROR = null;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  const safeText = (value, fallback = "المحتوى غير متاح في هذه النسخة.") =>
    typeof value === "string" && value.trim() ? esc(value.trim()) : fallback;

  // Life Path comes from the single shared core (keeps 11/22/33).
  function pathFromDate(isoDate) {
    const core = window.AqeqLifePathCore;
    if (!core) throw new Error("aqeeq-lifepath-core.js لم يتم تحميله.");
    return core.fromISO(isoDate);
  }

  function dateDay(isoDate) {
    return Number(String(isoDate).split("-")[2]);
  }

  function localTodayISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function relationLabel(type) {
    return ({
      romantic: "علاقة عاطفية / زواج",
      family: "علاقة أسرية",
      business: "شراكة عمل"
    })[type] || "العلاقة";
  }

  function relationEngineType(type) {
    return type === "romantic" ? "love" : type;
  }

  function loadData() {
    if (!window.AqeqEngine) throw new Error("ملف engine.js لم يتم تحميله.");
    return fetch("./data.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`تعذر تحميل data.json (HTTP ${response.status}).`);
        return response.json();
      })
      .then((json) => {
        const audit = window.AqeqEngine.auditSynastryData(json);
        if (!audit.ok) throw new Error("فشل فحص بنية data.json. راجع ملف البيانات قبل النشر.");
        DATA = json;
        document.documentElement.dataset.aqeqDataStatus = "ready";
      });
  }

  const safeTextPlain = (value, fallback = "") => (typeof value === "string" && value.trim()) ? value.trim() : fallback;

  function para(value, fallback = "") {
    const valueText = typeof value === "string" ? value.trim() : "";
    return valueText ? `<p>${esc(valueText)}</p>` : (fallback ? `<p>${esc(fallback)}</p>` : "");
  }

  // Gender agreement (display only): feminine wording for a female partner, dual form for a shared paragraph of mixed genders.
  // Texts stay gender-neutral (no automatic inflection); copywriting handles wording.
  const gfix = (value) => (typeof value === "string" ? value.trim() : "");
  const gpara = (value) => para(gfix(value));
  const sharedCtx = () => ({});

  // One shared paragraph when both partners get the identical text; otherwise one paragraph per partner under their name.
  function dualParas(t1, t2, ctxA, ctxB, nameA, nameB, opts) {
    if (typeof t1 === "string" && t1.trim() && t1 === t2) {
      return gpara(t1, sharedCtx(ctxA.g, ctxB.g), opts);
    }
    const one = (name, t, ctx) => (t && String(t).trim()) ? `<h4>${esc(name)}</h4>${gpara(t, ctx, opts)}` : "";
    return one(nameA, t1, ctxA) + one(nameB, t2, ctxB);
  }

  function renderReport(nameA, nameB, report, relationType, genders = {}) {
    const { meta, free, premium } = report;
    const p1 = premium.path1 || {};
    const p2 = premium.path2 || {};
    // Family lenses store the partner-facing line as prescription_for_family.
    // Map it to the field the card reads. No text is written or changed.
    const withPartnerFallback = (lens) => {
      if (lens.prescription_for_partner || !lens.prescription_for_family) return lens;
      return { ...lens, prescription_for_partner: lens.prescription_for_family };
    };
    const lens1 = withPartnerFallback(p1.lens || {});
    const lens2 = withPartnerFallback(p2.lens || {});
    const daily = premium.dailyBridge || {};
    const bridge = premium.coreBridge || {};
    const attraction = premium.attractionFull || {};
    const attractionB = premium.attractionFullB || {};
    const isLove = relationType === "love";
    const ctxA = { g: genders.a || "" };
    const ctxB = { g: genders.b || "" };
    const sameNumber = Number(meta.path1) === Number(meta.path2);
    const shared = sharedCtx(ctxA.g, ctxB.g);
    const pairNames = `${nameA} و${nameB}`;
    const overlays = premium.masterOverlays || [];
    const karmic = premium.karmicDebts || [];
    const breakdown = meta.breakdown || {};

    // Keep composite formatting consistent for every result, including master 11.
    const compositeDisplay = `${meta.rawBaseSum} / الجذر ${meta.composite}`;


    const masterBadge = meta.isCompositeMaster
      ? `<p class="syn-master-badge" role="status"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg> تنبيه قدري: تم رصد طاقة ماستر كبرى (${esc(meta.composite)}) في العلاقة.</p>`
      : "";

    const sub = (title, html) => html ? `<h4>${esc(title)}</h4>${html}` : "";
    const overlayBody = overlays.map(item => {
      const sourceName = item.source === "composite" ? "المسار المشترك"
        : item.source === "partner1" ? nameA : nameB;
      return sub(`${sourceName} · ${item.number}`, para(item.text));
    }).join("");
    const karmicBody = karmic.map(item => {
      const sourceName = Number(item.person) === 1 ? nameA : nameB;
      return sub(`${sourceName} · يوم ${item.day} · ${item.code || item.key || "درس رمزي"}`,
        para(item.title) + para(item.old_wound) + para(item.liberation_key) + para(item.repair_statement));
    }).join("");

    // Attraction texts are written per direction (A->B and B->A); both are shown so the report never depends on input order.
    // Business/Family have no dedicated attraction texts yet, so that tile stays hidden for them.
    const attractionBlock = (a, fb) =>
      sub("شرارة الجذب", para(a.attraction_hook || (fb && fb.attraction))) +
      sub("السر البدائي للجذب", para(a.primal_secret || (fb && fb.primalSecret))) +
      sub("انطباع اللقاء الأول", para(a.first_meeting_vibe)) +
      sub("ليه ممكن تفضلوا مع بعض؟", para(a.why_they_stay));
    const sameAttraction = JSON.stringify(attraction) === JSON.stringify(attractionB);
    const attractionBody = !isLove ? "" : sameAttraction
      ? attractionBlock(attraction, free)
      : `<h3 class="cps-who">من منظور ${esc(nameA)}</h3>${attractionBlock(attraction, free)}
         <h3 class="cps-who">من منظور ${esc(nameB)}</h3>${attractionBlock(attractionB, null)}`;

    const actionsTitle = relationType === "business" ? "خطوة عملية للطرف ده" : "خطوة يقدر يعملها الطرف ده";
    const partnerTitle = relationType === "business" ? "إيه اللي الطرف الآخر يقدر يقدمه؟" : "إيه اللي الطرف الآخر يقدر يعمله؟";
    const personBody = (person, lens, ctx) => {
      const P = (v, o) => gpara(v, ctx, o);
      return sub("الاحتياج الأساسي", P(person.coreNeed)) + sub("نقطة حساسة", P(lens.hidden_wound || person.coreWound))
        + sub("الظل المحتمل", P(person.shadowSide)) + sub("المحفزات", P(person.triggers))
        + sub(partnerTitle, P(lens.prescription_for_partner, { third: true }));
    };
    const firstLine = (t) => { const x = String(t || "").trim(); const m = x.match(/^[^.!؟?]*[.!؟?]?/); return m ? m[0].trim() : x; };
    const dynamicsTitle = relationType === "love" ? "بتحبوا بعض إزاي ومحتاجين إيه؟"
      : relationType === "family" ? "بتتعاملوا مع بعض إزاي؟" : "بتشتغلوا مع بعض إزاي؟";
    const fixTitle = relationType === "business" ? "نعمل إيه عشان الشغل يمشي؟" : relationType === "family" ? "نعمل إيه عشان البيت يرتاح؟" : "نعمل إيه عشان العلاقة تنجح؟";
    const fixBody = sub("الجملة المشتركة اللي تفتح باب الإصلاح", para(bridge.repair_statement || free.healingLine))
      + (sameNumber
        ? sub(`اللي بيفرق مع ${pairNames}`, gpara(p1.magicKey, shared)) + sub(`خطوة عملية لـ ${pairNames}`, gpara(lens1.prescription_for_you, shared)) + sub(`الجملة العلاجية المناسبة لـ ${pairNames}`, gpara(lens1.healing_line, shared))
        : sub(`اللي بيفرق مع ${nameA}`, gpara(p1.magicKey, ctxA)) + sub(`خطوة عملية لـ ${nameA}`, gpara(lens1.prescription_for_you, ctxA)) + sub(`الجملة العلاجية المناسبة لـ ${nameA}`, gpara(lens1.healing_line, ctxA))
          + sub(`اللي بيفرق مع ${nameB}`, gpara(p2.magicKey, ctxB)) + sub(`خطوة عملية لـ ${nameB}`, gpara(lens2.prescription_for_you, ctxB)) + sub(`الجملة العلاجية المناسبة لـ ${nameB}`, gpara(lens2.healing_line, ctxB)))
      + sub("بروتوكول الإصلاح المشترك", para(bridge.healing_protocol));

    // Each section is rendered once; compat-ui.js turns these into cards that open a bottom sheet.
    const personTiles = sameNumber
      ? [{ id: "person", ic: "person", t: `قراءة ${pairNames}`, hook: firstLine(gfix(lens1.hook, shared)), b: [["مسار الحياة", meta.path1]], body: personBody(p1, lens1, shared) }]
      : [{ id: "personA", ic: "person", t: `قراءة ${nameA}`, hook: firstLine(gfix(lens1.hook, ctxA)), b: [["مساره", meta.path1]], body: personBody(p1, lens1, ctxA) },
         { id: "personB", ic: "personB", t: `قراءة ${nameB}`, hook: firstLine(gfix(lens2.hook, ctxB)), b: [["مساره", meta.path2]], body: personBody(p2, lens2, ctxB) }];
    const sections = [
      { grp: 1, id: "attraction", ic: "magnet", t: "إيه اللي شدّكم لبعض؟", hook: "الشرارة الأولى من منظور كل واحد فيكم", b: [["المساران", `${meta.path1} · ${meta.path2}`]], body: attractionBody },
      { grp: 1, id: "core", ic: "bridge", t: "الجسر اللي بينكم", hook: safeTextPlain(bridge.title, free.coreBridgeTitle || "جسر العلاقة"), b: [["الجسر الأساسي", meta.coreBridge]], body: para(bridge.power_dynamic) + sub("المحفز المشترك", para(bridge.hidden_trigger)) },
      { grp: 1, id: "daily", ic: "clock", t: "إيقاعكم كل يوم", hook: safeTextPlain(daily.title, "طريقة التفاعل اليومي"), b: [["الجسر اليومي", meta.dailyBridge]], body: para(daily.spark_dynamic) + sub("نقطة الاحتكاك اليومية", para(daily.daily_fuse)) + sub("اقتراح عملي", para(daily.daily_hack)) },
      { grp: 2, id: "dynamics", ic: "pair", t: dynamicsTitle, hook: "اللي بيحرك كل واحد جوه العلاقة", b: [["الرقم المشترك", meta.composite]], body: dualParas(lens1.diagnosis, lens2.diagnosis, ctxA, ctxB, nameA, nameB) },
      ...personTiles.map(x => ({ grp: 2, ...x })),
      { grp: 2, id: "clash", ic: "spark", t: "نقطة الصدام الخفية", hook: "اللي بيشعل الخناقة من غير ما تاخدوا بالكم", b: [["الجسر اليومي", meta.dailyBridge]], body: dualParas(lens1.daily_fuse, lens2.daily_fuse, ctxA, ctxB, nameA, nameB) },
      { grp: 2, id: "fix", ic: "compass", t: fixTitle, hook: "خطوات صغيرة بتفرق بجد", b: [["الجسر الأساسي", meta.coreBridge]], body: fixBody },
      { grp: 2, id: "master", ic: "star", t: "رسالة الأرقام الرئيسية", hook: "طاقة كبيرة موجودة في العلاقة", b: [], body: overlayBody },
      { grp: 2, id: "karmic", ic: "hourglass", t: "دروس تحتاج وعيًا", hook: "أنماط قديمة بتتكرر لحد ما نشوفها", b: [], body: karmicBody }
    ].filter(x => x.body && String(x.body).trim());

    const srcHtml = sections.map(x => `<section class="cpt-src" hidden data-grp="${x.grp}" data-id="${esc(x.id)}" data-ic="${esc(x.ic)}" data-title="${esc(x.t)}" data-hook="${esc(x.hook)}" data-badges="${esc(JSON.stringify(x.b))}">${x.body}</section>`).join("");

    Object.assign(output.dataset, { p1: meta.path1, p2: meta.path2, core: meta.coreBridge, daily: meta.dailyBridge, comp: meta.composite, na: nameA, nb: nameB });
    output.innerHTML = `${masterBadge}<div class="cpt-sources" hidden>${srcHtml}</div>`;

    output.hidden = false;
    output.style.display = "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    output.hidden = true;

    const nameA = $("syn-name-a").value.trim();
    const nameB = $("syn-name-b").value.trim();
    const dateA = $("syn-date-a").value;
    const dateB = $("syn-date-b").value;
    const selectedType = $("syn-type").value;

    if (!nameA || !nameB || !dateA || !dateB) {
      errorBox.textContent = "اكتب اسم وتاريخ ميلاد الطرفين الأول والتاني.";
      errorBox.hidden = false;
      return;
    }
    if (dateA > localTodayISO() || dateB > localTodayISO()) {
      errorBox.textContent = "تاريخ الميلاد لازم يكون النهارده أو قبله.";
      errorBox.hidden = false;
      return;
    }
    if (!window.AqeqEngine) {
      errorBox.textContent = "محرك التوافق لم يتم تحميله. تأكد إن engine.js موجود بجوار index.html.";
      errorBox.hidden = false;
      return;
    }
    if (!DATA) {
      errorBox.textContent = DATA_ERROR || "بيانات عقيق أسترو لسه بتتحمل. جرّب تاني بعد لحظة.";
      errorBox.hidden = false;
      return;
    }

    try {
      const pathA = pathFromDate(dateA);
      const pathB = pathFromDate(dateB);
      const result = window.AqeqEngine.calculateAqeqCompatibility(pathA, pathB, dateDay(dateA), dateDay(dateB));
      const report = window.AqeqEngine.buildReport(result, DATA, relationEngineType(selectedType));
      renderReport(nameA, nameB, report, relationEngineType(selectedType), { a: $("syn-gender-a")?.value || "", b: $("syn-gender-b")?.value || "" });
      Object.assign(output.dataset, {
        score: report.meta.score, label: report.meta.label?.label || "", rel: selectedType,
        d1: dateA, d2: dateB, g1: $("syn-gender-a")?.value || "", g2: $("syn-gender-b")?.value || ""
      });
      output.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Aqeq synastry calculation failed:", error);
      errorBox.textContent = "حصلت مشكلة أثناء تجهيز القراءة. راجع الملفات وتأكد من وجود data.json وengine.js.";
      errorBox.hidden = false;
    }
  });

  loadData().catch((error) => {
    console.error("Aqeq data load failed:", error);
    DATA_ERROR = error.message || "تعذر تحميل بيانات التوافق.";
    document.documentElement.dataset.aqeqDataStatus = "error";
  });
})();

;
/* assets/js/gender-language.js */
(() => {
  'use strict';
  const ADJECTIVES=[['محتاجة','محتاج'],['مستعدة','مستعد'],['عارفة','عارف'],['جاهزة','جاهز'],['حاسّة','حاسس'],['حساسة','حساس'],['مترددة','متردد'],['مسؤولة','مسؤول'],['قادرة','قادر'],['ناجحة','ناجح'],['قوية','قوي'],['ذكية','ذكي'],['عملية','عملي'],['اجتماعية','اجتماعي'],['عاطفية','عاطفي'],['متوازنة','متوازن'],['مبدعة','مبدع'],['منظمة','منظم'],['قيادية','قيادي'],['طموحة','طموح'],['مستقلة','مستقل'],['مخلصة','مخلص'],['حكيمة','حكيم'],['شجاعة','شجاع'],['صريحة','صريح'],['عميقة','عميق'],['صبورة','صبور'],['هادئة','هادئ'],['متميزة','متميز'],['مختلفة','مختلف'],['مولودة','مولود']];
  const POSSESSIVES=[['صاحبته','صاحبه'],['لديها','لديه'],['عقلها','عقله'],['داخلها','داخله'],['جسدها','جسده'],['ذاتها','ذاته'],['نفسها','نفسه'],['قلبها','قلبه'],['طاقتها','طاقته'],['قدرتها','قدرته']];
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function replaceWord(text,from,to){
    const re=new RegExp('(^|[^\\u0621-\\u064A])((?:(?:و|ف|ب|ل)?(?:ال)?))('+escape(from)+')(?=$|[^\\u0621-\\u064A])','g');
    return text.replace(re,(_,boundary,prefix)=>boundary+prefix+to);
  }
  function replaceAddressed(text,from,to){
    const subject='(?:و)?(?:أنت|انت|إنت|انتي|صاحبته)\\s+';
    const re=new RegExp('(^|[^\\u0621-\\u064A])('+subject+')('+escape(from)+')(?=$|[^\\u0621-\\u064A])','g');
    return text.replace(re,(_,boundary,subjectText)=>boundary+subjectText+to);
  }
  function transform(text,gender){
    if(!text||gender!=='female')return text;
    text=text.replace(/(^|[^\\u0621-\\u064A])يولد صاحب(?:ه|ة)(?=$|[^\\u0621-\\u064A])/g,'$1تولد صاحبته');
    text=text.replace(/(^|[^\\u0621-\\u064A])صاحبه(?=$|[^\\u0621-\\u064A])/g,'$1صاحبته');
    text=text.replace(/(^|[^\\u0621-\\u064A])يولد(?=$|[^\\u0621-\\u064A])/g,'$1تولد');
    for(const [f,m] of POSSESSIVES)text=replaceWord(text,m,f);
    for(const [f,m] of ADJECTIVES)text=replaceAddressed(text,m,f);
    return text;
  }
  function apply(root,gender){
    if(!root)return;
    if(!gender){delete root.dataset.reportGender;const old=root.querySelector(':scope > .gender-voice-note');if(old)old.remove();return;}
    root.dataset.reportGender=gender;
    let voice=root.querySelector('.gender-voice-note');if(!voice){voice=document.createElement('p');voice.className='gender-voice-note';root.insertBefore(voice,root.firstChild);}const voiceText=gender==='female'?'صياغة مؤنثة · هذا التقرير موجّه لكِ.':'صياغة مذكرة · هذا التقرير موجّه لك.';if(voice.textContent!==voiceText)voice.textContent=voiceText;
    const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
    while((node=walk.nextNode())){if(node.parentElement?.closest('script,style,textarea,input,select'))continue;const next=transform(node.nodeValue,gender);if(next!==node.nodeValue)node.nodeValue=next;}
  }
  const labels={male:'ذكر',female:'أنثى'};
  function init(){
    const selects=[...document.querySelectorAll('[data-gender-select]')];let saved='';try{saved=localStorage.getItem('aq-gender')||'';}catch(_){}
    selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>{if(saved)s.value=saved;});
    document.addEventListener('change',event=>{const select=event.target.closest('[data-gender-select]');if(!select||select.dataset.genderGroup!=='self')return;try{localStorage.setItem('aq-gender',select.value);}catch(_){}selects.filter(s=>s.dataset.genderGroup==='self').forEach(s=>s.value=select.value);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.AqeeqGender={apply,transform,labels};
})();
;
/* assets/js/personal-transits.js */
/* Aqeeq Astro: client-side transit dashboard. Requires the site's Astro.chart() engine. */
(() => {
  'use strict';
  const SIGNS = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  const BODY_AR = {Sun:'الشمس',Moon:'القمر',Mercury:'عطارد',Venus:'الزهرة',Mars:'المريخ',Jupiter:'المشتري',Saturn:'زحل',Uranus:'أورانوس',Neptune:'نبتون',Pluto:'بلوتو',TrueNode:'العقدة الشمالية',Chiron:'كيرون',Asc:'الطالع',MC:'منتصف السماء'};
  const ASPECTS = [{deg:0,key:'conjunction',name:'اقتران',harm:false},{deg:60,key:'sextile',name:'تسديس',harm:true},{deg:90,key:'square',name:'تربيع',harm:false},{deg:120,key:'trine',name:'تثليث',harm:true},{deg:180,key:'opposition',name:'مقابلة',harm:false}];
  const norm = x => ((Number(x)%360)+360)%360;
  const delta = (a,b) => ((a-b+540)%360)-180;
  const signInfo = lon => ({name:SIGNS[Math.floor(norm(lon)/30)],degree:norm(lon)%30});
  const round1 = x => Math.round(x*10)/10;
  const siteAstro = () => (typeof Astro !== 'undefined' ? Astro : window.Astro);
  const canonicalBodyKey = key => {
    const raw=String(key||''), lower=raw.toLowerCase();
    if(lower==='node'||lower==='lilith'||lower==='fortune') return null;
    return Object.keys(BODY_AR).find(k=>k.toLowerCase()===lower) || raw;
  };
  const fmtDeg = x => `${Math.floor(x)}°${String(Math.round((x%1)*60)%60).padStart(2,'0')}′`;
  const toDate = d => d instanceof Date ? d : new Date(d);
  function getChart(date, lat=30, lon=31) {
    const engine=siteAstro();
    if (!engine || typeof engine.chart !== 'function') throw new Error('تعذر العثور على محرك Astro.chart في الموقع.');
    return engine.chart({utcMs:date.getTime(),lat,lon,known:false});
  }
  function bodiesFromChart(chart) {
    return (chart?.bodies || []).flatMap(b => {
      const key=canonicalBodyKey(b.key);
      return key ? [{key, name:BODY_AR[key] || b.name || key, lon:norm(b.lon), speed:Number(b.speed)||0, retro:!!b.retro}] : [];
    });
  }
  // Meeus-style periodic true-node correction; useful for a live dashboard, not an ephemeris-grade node.
  function trueNodeApprox(date) {
    const jd=date.getTime()/86400000+2440587.5, T=(jd-2451545)/36525;
    const rad=Math.PI/180;
    const D=norm(297.85036+445267.111480*T-0.0019142*T*T+T*T*T/189474);
    const M=norm(357.52772+35999.050340*T-0.0001603*T*T-T*T*T/300000);
    const Mp=norm(134.96298+477198.867398*T+0.0086972*T*T+T*T*T/56250);
    const F=norm(93.27191+483202.017538*T-0.0036825*T*T+T*T*T/327270);
    const mean=125.04452-1934.136261*T+0.0020708*T*T+T*T*T/450000;
    const corr=-1.4979*Math.sin((2*D-2*F)*rad)-0.1500*Math.sin(M*rad)-0.1226*Math.sin(2*D*rad)+0.1176*Math.sin(2*F*rad)-0.0801*Math.sin((2*Mp-2*F)*rad);
    return norm(mean+corr);
  }
  function normalizeNatal(input) {
    return (input||[]).map(p=>{const key=canonicalBodyKey(p.key||p.name);return key?({key,name:p.name||BODY_AR[key]||key,lon:norm(p.lon ?? p.longitude),speed:Number(p.speed)||0,retro:!!p.retro}):null;}).filter(p=>p&&Number.isFinite(p.lon));
  }
  function calculateAspects(transits,natal,date) {
    natal=natal.filter(p=>!['Asc','MC'].includes(p.key));
    const later=new Date(date.getTime()+6*3600000), next=bodiesFromChart(getChart(later));
    if(!next.some(p=>p.key==='TrueNode')) next.push({key:'TrueNode',lon:trueNodeApprox(later)});   // احتياطي لو المحرك قديم
    const nextByKey=new Map(next.map(p=>[p.key,p.lon]));
    const slow=new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto','TrueNode','Chiron']);
    const out=[];
    for(const t of transits) for(const n of natal){
      const a=ASPECTS.map(x=>({...x,orb:Math.abs(Math.abs(delta(t.lon,n.lon))-x.deg)})).sort((x,y)=>x.orb-y.orb)[0];
      const limit=(t.key==='Sun'||t.key==='Moon'||n.key==='Sun'||n.key==='Moon')?5:3;
      if(a.orb>limit) continue;
      let state=nextByKey.has(t.key)?'Applying':'Uncertain';
      const nowOrb=a.orb, futureT=nextByKey.get(t.key);
      if(futureT!=null){const fut=Math.abs(Math.abs(delta(futureT,n.lon))-a.deg);state=fut<nowOrb-0.005?'Applying':fut>nowOrb+0.005?'Separating':'Applying';}
      out.push({transit:t,natal:n,...a,state,exact:a.orb<1});
    }
    return out.sort((a,b)=>a.orb-b.orb);
  }
  function calculateTransits(natalPlanets,currentDate=new Date(),opts={}) {
    const date=toDate(currentDate); if(Number.isNaN(date.getTime())) throw new Error('التاريخ غير صالح.');
    const chart=getChart(date,opts.lat??30,opts.lon??31), transits=bodiesFromChart(chart);
    if(!transits.some(p=>p.key==='Moon')) throw new Error('لم يُرجع محرك الموقع مواقع الكواكب المطلوبة.');
    const later=new Date(date.getTime()+6*3600000);
    // العقدة الحقيقية بتيجي دقيقة من محرك الموقع. التقريب بيُستخدم بس لو المحرك ما رجّعهاش.
    let node=null;
    if(!transits.some(p=>p.key==='TrueNode')){
      const nodeLon=trueNodeApprox(date), nodeSpeed=delta(trueNodeApprox(later),nodeLon)/0.25;
      node={key:'TrueNode',name:BODY_AR.TrueNode,lon:nodeLon,speed:nodeSpeed,retro:nodeSpeed<0,approximate:true};
    }
    // No two-body fallback for Chiron: timed readings require the verified table.
    const missingChiron=!transits.some(p=>p.key==='Chiron');
    if(node) transits.push(node);
    const natal=normalizeNatal(natalPlanets), aspects=calculateAspects(transits,natal,date);
    let phaseAngle=null,illumination=null;
    if(window.Astronomy){try{phaseAngle=window.Astronomy.MoonPhase(new window.Astronomy.AstroTime(date)); illumination=window.Astronomy.Illumination(window.Astronomy.Body.Moon,new window.Astronomy.AstroTime(date)).phase_fraction;}catch(_){}}
    const moon=transits.find(p=>p.key==='Moon');
    return {date,transits,natal,aspects,missingChiron,moon:{...moon,...signInfo(moon.lon),phaseAngle,illumination:illumination==null?null:Math.round(illumination*100),phaseName:phaseAngle==null?'':['محاق','هلال متزايد','تربيع أول','أحدب متزايد','بدر','أحدب متناقص','تربيع أخير','هلال متناقص'][Math.floor(((phaseAngle+22.5)%360)/45)]},chart};
  }
  const cardText = a => {
    const domain={Sun:'الهوية والاتجاه',Moon:'العاطفة والاحتياجات',Mercury:'التواصل والتفكير',Venus:'العلاقات والقيم',Mars:'الطاقة والمبادرة',Jupiter:'النمو والفرص',Saturn:'المسؤولية والحدود',Uranus:'التغيير والاستقلال',Neptune:'الخيال والحدس',Pluto:'التحول والعمق'}[a.transit.key]||'المجال الشخصي';
    return {domain,psych:a.harm?'قد يسهل هذا الاتصال الانسجام أو رؤية خيار جديد.':'قد يبرز توتراً أو حاجة إلى إعادة ضبط التوقعات.',advice:a.harm?'استثمر التوقيت في حوار واضح وخطوة عملية صغيرة.':'تأنّ قبل رد الفعل، وحدد ما يمكنك تغييره فعلاً.'};
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(root,data,onDate){
    const {transits,natal,aspects,moon,date,missingChiron}=data;
    const cx=180,cy=180,R=150, inner=105;
    const angle=lon=>(norm(lon)-90)*Math.PI/180;
    const pt=(lon,r)=>({x:cx+r*Math.cos(angle(lon)),y:cy+r*Math.sin(angle(lon))});
    const natalPlanets=natal.filter(p=>!['Asc','MC'].includes(p.key));
    const selected=root.dataset.selected||'';
    const active=aspects.filter(a=>!selected||a.transit.key===selected);
    const lines=active.map(a=>{const p1=pt(a.transit.lon,R-14),p2=pt(a.natal.lon,inner+12); return `<line class="aqt-line ${a.harm?'harm':'hard'}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/>`;}).join('');
    const transMarks=transits.map(p=>{const q=pt(p.lon,R-3);return `<g class="aqt-body transit ${selected&&selected!==p.key?'dim':''}" data-key="${esc(p.key)}" tabindex="0"><circle cx="${q.x}" cy="${q.y}" r="11"/><text x="${q.x}" y="${q.y+4}">${esc(({Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',TrueNode:'☊',Chiron:'⚷'})[p.key]||'•')}</text></g>`;}).join('');
    const natalMarks=natalPlanets.map(p=>{const q=pt(p.lon,inner);return `<g class="aqt-body natal"><circle cx="${q.x}" cy="${q.y}" r="9"/><text x="${q.x}" y="${q.y+4}">${esc(({Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇'})[p.key]||'•')}</text></g>`;}).join('');
    const scores=weatherScores(data), top=aspects.slice(0,5);
    root.innerHTML=`<section class="aqt-shell" dir="rtl"><header class="aqt-head"><div><span class="aqt-kicker">عقيق أسترو · العبور الشخصي</span><h2>طقس السماء وخريطتك</h2><p>${date.toLocaleString('ar-SA',{dateStyle:'medium',timeStyle:'short'})}</p></div><div class="aqt-moon"><b>☾ ${moon.name}</b><span>${moon.name} ${fmtDeg(moon.degree)} · ${esc(moon.phaseName||'طور القمر')}</span><span>الإضاءة ${moon.illumination==null?'—':moon.illumination+'%'}</span></div></header>
      <div class="aqt-layout"><div class="aqt-wheelbox"><svg viewBox="0 0 360 360" role="img" aria-label="العجلة المزدوجة لخريطة الميلاد والعبور"><circle class="aqt-ring outer" cx="180" cy="180" r="150"/><circle class="aqt-ring" cx="180" cy="180" r="125"/><circle class="aqt-ring inner" cx="180" cy="180" r="105"/><circle class="aqt-ring" cx="180" cy="180" r="78"/>${SIGNS.map((s,i)=>`<text class="aqt-sign" x="180" y="37" transform="rotate(${i*30+15} 180 180)">${s.slice(0,1)}</text>`).join('')}${lines}${natalMarks}${transMarks}</svg><div class="aqt-tooltip" hidden></div><div class="aqt-legend"><span>● عابر</span><span>○ ميلاد</span><span>━ منسجم</span><span>━ ضاغط</span></div><div class="aqt-time"><button data-step="-1">− يوم</button><button data-step="0">اليوم</button><button data-step="1">+ يوم</button><button data-step="7">+ أسبوع</button></div></div>
      <aside class="aqt-weather"><h3>مؤشرات الطاقة</h3>${missingChiron?'<p class="aqt-note" data-chiron-unavailable>كيرون غير معروض في التاريخ ده، لأنه خارج جدول الحساب المتحقق منه. ما استبدلناش موضعه بتقدير تقريبي.</p>':''}${transits.some(x=>x.approximate)?`<p class="aqt-note" data-approx-bodies="1">تنبيه: موضع ${esc(transits.filter(x=>x.approximate).map(x=>x.name).join(' و'))} تقريبي (قد يختلف بدرجة أو أكثر)، فاعتبر عبوره إشارة عامة لا موعداً دقيقاً.</p>`:''}${scores.map(s=>`<div class="aqt-score"><div><span>${s.name}</span><b>${s.value}%</b></div><i><em style="width:${s.value}%"></em></i></div>`).join('')}</aside></div>
      <div class="aqt-cards"><h3>العبورات الأبرز</h3>${top.length?top.map(a=>{const t=cardText(a);return `<article class="aqt-card"><b>عبور ${esc(a.transit.name)} ${a.name} ميلاد ${esc(a.natal.name)} <small>· أورب ${round1(a.orb)}°</small></b><div class="aqt-domain">${esc(t.domain)} · ${a.state==='Applying'?'متصل':a.state==='Separating'?'منفصل':'حالة الاقتراب غير متاحة'}</div><p>${esc(t.psych)}</p><p><strong>خطوة عملية:</strong> ${esc(t.advice)}</p></article>`}).join(''):'<p class="aqt-note">لا توجد اتصالات ضمن الأورب المحدد الآن.</p>'}</div>
      <details class="aqt-matrix"><summary>جدول الاتصالات للمحللين (${aspects.length})</summary><div class="aqt-scroll"><table><thead><tr><th>العابر</th><th>حركته</th><th>الدرجة / البرج</th><th>الاتصال</th><th>كوكب الميلاد</th><th>الأورب</th><th>الحالة</th></tr></thead><tbody>${aspects.map(a=>{const s=signInfo(a.transit.lon);return `<tr><td>${esc(a.transit.name)}</td><td>${a.transit.retro?'R · تراجع':'أمامية'}</td><td>${fmtDeg(s.degree)} ${s.name}</td><td>${a.name}</td><td>${esc(a.natal.name)}</td><td>${fmtDeg(a.orb)}</td><td>${a.orb<1?'Exact':a.state==='Applying'?'App':a.state==='Separating'?'Sep':'?'}</td></tr>`}).join('')}</tbody></table></div></details><footer class="aqt-foot">${transits.some(x=>x.approximate)?'النقاط المذكورة في التنبيه أعلاه محسوبة بنماذج احتياطية تقريبية أقل دقة؛ بقية المواضع من محرك الموقع.':'الحسابات من محرك الموقع. جدول كيرون مشتق من NASA/JPL Horizons مع الترميز والاستيفاء.'}</footer></section>`;
    const tip=root.querySelector('.aqt-tooltip');
    const show=g=>{if(!g)return;const k=g.dataset.key,p=transits.find(x=>x.key===k),s=signInfo(p.lon),aa=aspects.filter(a=>a.transit.key===k).slice(0,3);tip.hidden=false;tip.innerHTML=`<b>${esc(p.name)}</b> · ${s.name} ${fmtDeg(s.degree)}<br>${aa.length?aa.map(a=>`${a.name} ${esc(a.natal.name)} (${round1(a.orb)}°)`).join('<br>'):'لا اتصال ضمن الأورب'}`;};
    root.querySelectorAll('.aqt-body.transit').forEach(g=>{g.addEventListener('mouseenter',()=>show(g));g.addEventListener('focus',()=>show(g));g.addEventListener('mouseleave',()=>{tip.hidden=true});g.addEventListener('blur',()=>{tip.hidden=true});g.addEventListener('click',()=>{root.dataset.selected=root.dataset.selected===g.dataset.key?'':g.dataset.key;onDate(date,root.dataset.selected);});});
    root.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const n=Number(b.dataset.step),d=n===0?new Date():new Date(date.getTime()+n*86400000);onDate(d,selected);}));
  }
  function weatherScores(d){
    const weighted=(keys)=>d.aspects.filter(a=>keys.includes(a.transit.key)).reduce((sum,a)=>sum+(a.harm?8:-9)*Math.max(0,1-a.orb/6),0);
    const phase=d.moon.illumination??50;
    return [{name:'الوضوح الذهني',value:clamp(60+weighted(['Mercury','Sun']))},{name:'التوازن العاطفي',value:clamp(52+weighted(['Moon','Venus'])+(phase>35&&phase<75?5:0))},{name:'الفعل والمبادرة',value:clamp(55+weighted(['Mars','Jupiter']))}];
  }
  const clamp=x=>Math.max(15,Math.min(95,Math.round(x)));
  function currentNatal(){
    const dt=document.querySelector('#f-date')?.value,tm=document.querySelector('#f-time')?.value||'12:00';
    if(!dt)return null;
    const [y,m,d]=dt.split('-').map(Number),[hh,mm]=tm.split(':').map(Number);
    const engine=siteAstro(), citySel=document.querySelector('#f-city'), manual=citySel?.value==='manual';
    let lat=30,lon=31,utc;
    if(manual){lat=Number(document.querySelector('#f-lat')?.value);lon=Number(document.querySelector('#f-lon')?.value);utc=Date.UTC(y,m-1,d,hh,mm)-(Number(document.querySelector('#f-off')?.value)||0)*3600000;}
    else {const cities=typeof CITIES!=='undefined'?CITIES:[],c=cities[Number(citySel?.value)]||cities[0];if(c){lat=c.lat;lon=c.lon;utc=engine.localToUtcMs(y,m,d,hh,mm,c.tz);}else utc=Date.UTC(y,m-1,d,hh,mm);}
    const known=!document.querySelector('#f-unknown')?.checked;
    const chart=engine.chart({utcMs:utc,lat,lon,hs:document.querySelector('#f-hs')?.value||'placidus',known}), bodies=bodiesFromChart(chart);
    if(chart.asc!=null)bodies.push({key:'Asc',name:BODY_AR.Asc,lon:norm(chart.asc),speed:0});
    if(chart.mc!=null)bodies.push({key:'MC',name:BODY_AR.MC,lon:norm(chart.mc),speed:0});
    return {bodies,lat,lon,chart};
  }
  function mount(){
    const result=document.querySelector('#result'); if(!result||!siteAstro())return;
    const natal=currentNatal(); if(!natal)return;
    let host=result.querySelector('#aqeek-personal-transits');
    if(!host){host=document.createElement('div');host.id='aqeek-personal-transits';result.appendChild(host);}
    const renderAt=(date,selected='')=>{host.dataset.selected=selected;try{const data=calculateTransits(natal.bodies,date,{lat:natal.lat,lon:natal.lon});render(host,data,renderAt);host.dataset.ceInstant=String(date.getTime());window.dispatchEvent(new CustomEvent('aqeeq:chiron-transits',{detail:{date:date.getTime(),natal:natal.chart,current:data.chart}}));}catch(e){host.innerHTML=`<p class="aqt-error">${esc(e.message)}</p>`;}};
    renderAt(new Date());
  }
  window.AqeqPersonalTransits={calculateTransits,calculateAspects,mount};
  const start=()=>{mount();const r=document.querySelector('#result');if(r)new MutationObserver(()=>mount()).observe(r,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target.closest('#result button[type="submit"],#result .recalc'))setTimeout(mount,0);});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();


;
/* assets/js/life-path-data.js */
/* Life Path interpretive content for the existing classic-script interface. */
(function (global) {
  'use strict';
  const lifePathData = {
    1: {
      number: 1,
      psychosomatic: "تظهر طاقتك في جسدك كاندفاع للأمام: خطوة سريعة، وكتفان مرفوعان، ونظرة تسبق الكلام. وحين تحمل كل شيء وحدك وترفض المساعدة يتجمع الشد في رقبتك وفكك، ويصير نومك خفيفًا لأن عقلك لا يتوقف عن التخطيط. يريحك أن تحرك جسدك كل يوم بنشاط فيه تحدٍّ، وأن تترك مهمة واحدة لغيرك دون أن تراقبه، وأن تتنفس بعمق قبل أن ترد على من يعارضك.",
      title: "المبتكر الرائد وسيد الإرادة الفردية",
      cheatSheet: [
        { area: "التخطيط والعمل", balanced: "يبدأ بنسخة أولية قابلة للتجربة والتطوير المستمر", shadow: "يغرق في التخطيط النظري ويؤجل الاختبار الواقعي" },
        { area: "العلاقات والشراكة", balanced: "وضوح وصراحة واحترام كامل لاستقلالية الطرفين", shadow: "كلام معسول ووعود كبيرة يتبعها انسحاب أو استعلاء" },
        { area: "المال والإنجاز", balanced: "تحويل الأفكار إلى أصول ومشاريع ملموسة على الأرض", shadow: "احتقار الأرباح البسيطة وانتظار الصفقة الخارقة" }
      ],
      core: "مسار البدايات والسيادة المستقلة. يولد صاحب المسار 1 ببرمجة باطنية ترفض التبعية؛ غالباً ما عاش طفولة فرضت عليه الاعتماد الكامل على نفسه، أو شعر بوجود نموذج سلطوي قيد حريته، فقرر مبكراً أن نجاته تكمن في أن يقود لا أن يُقاد. وفي حياتك اليومية قد تلاحظ أنك تبدأ قبل أن يكتمل الإذن، وأنك تضيق بمن يشرح طويلًا، وأن أصعب جملة عليك هي «ساعدني». فالاستقلال عندك ليس اختيارًا فقط بل طريقة قديمة لحماية نفسك.",
      light: "شجاعة استثنائية في تدشين المسارات الجديدة، وضوح حاسم في الرؤية، ثقة بالنفس تلهم المحيطين، وقدرة على تحويل الأفكار المجردة إلى مبادرات واقعية رائدة دون تردد. في العمل تكون أول من يقترح وأول من يتحرك، وفي الأسرة تصير المرجع الذي يلجأ إليه الجميع حين يتعطل شيء.",
      shadow: "الاستبداد بالرأي، التعالي الدفاعي لإخفاء الخوف من الفشل، العزلة الناتجة عن صعوبة طلب المساعدة، وتصنيف العلاقات كمعارك نفوذ إما رابح أو خاسر. وفي العلاقات قد يشعر شريكك أنك تقرر وحدك، وقد تخسر صداقة لأنك اعتبرت الخلاف معركة لا حوارًا.",
      blueprint: [
        { challenge: "صعوبة العمل الجماعي والتفرد بالرأي", solution: "تدريب النفس على الاستماع النشط ومشاركة منصة النجاح مع الشركاء." },
        { challenge: "الهوس بإثبات القوة الدائمة", solution: "التصالح مع مشاعر التردد واعتبارها محطة تقييم طبيعية وليست هزيمة." },
        { challenge: "الاستنزاف العصبي الناتج عن التنافس", solution: "تحويل مفهوم النجاح من هزيمة الآخرين إلى التفوق المستمر على الذات." }
      ]
    },
    2: {
      number: 2,
      psychosomatic: "تظهر طاقتك في جسدك كحساسية عالية: تلتقط مزاج المكان قبل أن يتكلم أحد، ويتغير شعورك بتغير الوجوه حولك. وحين تبتلع رأيك لتحافظ على السلام يثقل صدرك، وتشعر بتعب لا تعرف مصدره بعد يوم مليء بالمجاملة. يريحك الماء والهدوء والموسيقى الناعمة، ووقت قصير كل يوم بعيدًا عن الناس، وأن تقول جملة صريحة واحدة بدل أن تحملها في صدرك.",
      title: "الدبلوماسي الحدسي ومهندس التناغم الإنساني",
      cheatSheet: [
        { area: "التواصل وإبداء الرأي", balanced: "تعبير هادئ وصريح عن الاحتياجات بوضوح وأمان", shadow: "صمت وكتمان وانتظار تخمين الآخرين ثم انفجار سلبي" },
        { area: "العلاقات والشراكة", balanced: "حدس عميق واحتواء دافئ مع حدود نفسية صحية", shadow: "إلغاء الحدود لإرضاء الشريك والاعتمادية المرضية" },
        { area: "حسم القرارات", balanced: "حسم الخيارات في موعد محدد بالثقة في الحدس الأولي", shadow: "تردد مزمن وطلب مشورة الجميع قبل أي خطوة صغيرة" }
      ],
      core: "مسار الاحتواء والوساطة الذكية. يولد بحساسية شعورية تلتقط التوتر غير المنطوق بين البشر، وغالباً ما برمجته طفولته ليكون صانع السلام داخل العائلة على حساب رغباته الخاصة، مما رسخ لديه خوفاً عميقاً من الصدام والرفض. وفي حياتك اليومية قد تلاحظ أنك تعرف مزاج الغرفة قبل أن تجلس، وأنك تعتذر عن أشياء لم تخطئ فيها، وأنك تؤجل طلبك حتى يرتاح الجميع. فالسلام عندك ضرورة، لكنه كثيرًا ما يُدفع من رصيدك.",
      light: "حدس اجتماعي فائق، قدرة مذهلة على تقريب وجهات النظر وفض النزاعات، ولاء عميق، وحضور دافئ يمنح الآخرين الأمان النفسي والانفتاح العاطفي التلقائي. في الأسرة تكون من يقرب بين المتخاصمين، وفي العمل تنجح في الأدوار التي تحتاج صبرًا وإصغاء وتنسيقًا بين الناس.",
      shadow: "إلغاء الحدود الذاتية لإرضاء الجميع، التردد المزمن والاعتمادية على آراء المحيطين، وتراكم الاستياء الصامت الذي ينفجر على هيئة هجوم سلبي غير مباشر. وفي العلاقات قد توافق على ما لا تريده ثم تبتعد بصمت، فيستغرب من حولك تغيرك دون أن يعرفوا السبب.",
      blueprint: [
        { challenge: "الخوف من الصدام وفقدان القبول", solution: "ممارسة قول 'لا' بحزم وهدوء كحق أصيل لحماية الطاقة النفسية." },
        { challenge: "التردد المزمن قبل القرارات", solution: "وضع سقف زمني محدد لحسم الخيارات والاعتماد على الحدس الأولي." },
        { challenge: "امتصاص طاقات ومشاكل الآخرين", solution: "بناء حاجز نفسي يفصل بوضوح بين التعاطف الصادق وتحمل مسؤولية مشاعر الغير." }
      ]
    },
    3: {
      number: 3,
      psychosomatic: "تظهر طاقتك في جسدك في الصوت واليدين والوجه: تتكلم بحماس وتضحك بسهولة وتملأ المكان حركة. وحين تكتم مشاعرك خلف المزاح تتعب من الداخل، ويتشتت تركيزك، وتتقلب طاقتك بين حماس كبير وفتور مفاجئ. يريحك أن تعبّر بالكتابة أو الغناء أو الرسم، وأن تنام في موعد ثابت، وأن تسمح لنفسك أن تحزن أمام شخص تثق به.",
      title: "المعبر المبدع وكيميائي البهجة الفكرية",
      cheatSheet: [
        { area: "الإبداع والتنفيذ", balanced: "تركيز الطاقة في مشروع رئيسي حتى بلوغ الاكتمال", shadow: "تشتت في عشرات البدايات والهروب من الروتين" },
        { area: "المشاعر والظهور", balanced: "تعبير حقيقي صادر من القلب ببهجة ودفء حقيقي", shadow: "قناع مرح ومبالغة درامية لإخفاء الفراغ أو الحزن" },
        { area: "العلاقات", balanced: "تواصل ذكي مرح وعمق إنساني ومشاركة أصيلة", shadow: "سطحية وسرعة ملل وسعي مستمر لاستجداء التصفيق" }
      ],
      core: "مسار الإبداع والتدفق التعبيري. يولد صاحب المسار 3 بدافع داخلي هائل للظهور والتأثير بالكلمة والصورة؛ ارتبطت طفولته بالحاجة لانتزاع التقدير عبر إبهار محيطه أو إسعادهم، مما ولد صراعاً بين قناعه المرح وحزنه الداخلي. وفي حياتك اليومية قد تلاحظ أنك نجم الجلسة، تحكي وتضحك وتخفف الثقل عن الجميع، ثم تعود وحدك فتشعر بفراغ لا يعرفه أحد. فالبهجة عندك موهبة حقيقية، لكنها أحيانًا ستار.",
      light: "ذكاء لغوي وتواصلي مبهر، خيال واسع يفكك المفاهيم المعقدة ويبسطها، كاريزما آسرة قادرة على رفع ترددات أي مكان، وموهبة طبيعية في التأثير الجماهيري والفنون. في العمل تنجح في الكلام والكتابة والتسويق والفن، وفي الأصدقاء تكون الروح التي تجمعهم.",
      shadow: "تشتت الطاقة في مشاريع متعددة دون إتمام، السطحية والهروب من الالتزامات العميقة، والمبالغة الدرامية للتغطية على مشاعر الفراغ أو الخوف من النقد. وفي حياتك قد تترك مشاريع جميلة في منتصفها حين يذهب الحماس، أو تتهرب من حديث جاد بنكتة.",
      blueprint: [
        { challenge: "تشتت التركيز وضعف الاستمرارية", solution: "اختيار مشروع إبداعي واحد رئيسي والالتزام بإكماله قبل الانتقال لغيره." },
        { challenge: "القناع الهزلي للهروب من الألم", solution: "تفريغ المشاعر الحقيقية بانتظام عبر الكتابة الحرة والتعبير غير المشروط." },
        { challenge: "التعلق المفرط باستحسان وتصفيق الناس", solution: "بناء الاستحقاق الذاتي من صدق التجربة والابتكار الداخلي لا من التفاعل الخارجي." }
      ]
    },
    4: {
      number: 4,
      psychosomatic: "تظهر طاقتك في جسدك كثبات وصلابة: وقفة مستقيمة، وحركة محسوبة، وقدرة على العمل ساعات طويلة. وحين تبالغ في التحمل وتعتبر الراحة كسلًا يتجمع الشد في ظهرك وكتفيك، ويصعب عليك الاسترخاء حتى في الإجازة. يريحك المشي في الطبيعة، وتمارين الإطالة، وأن تضع الراحة في جدولك كما تضع العمل، وأن تقبل أن يتغير شيء في خطتك دون أن تتوتر.",
      title: "حارس النظام ومهندس الواقع الصلب",
      cheatSheet: [
        { area: "العمل والتنظيم", balanced: "بناء سيستم محكم وأساسات متينة طويلة الأمد", shadow: "جمود فكري وعناد ومقاومة أي تغيير مفاجئ" },
        { area: "العلاقات والأسرة", balanced: "وفاء استثنائي وثبات وسند عملي موثوق", shadow: "جفاف عاطفي وتحويل المشاركة الأسرية لواجبات صارمة" },
        { area: "الراحة والاستمتاع", balanced: "توازن بين الكدح والاستمتاع بثمار الإنجاز", shadow: "إدمان الإنهاك ومتلازمة الأمان المشروط والشعور بالذنب" }
      ],
      core: "مسار التأسيس والأمان الراسخ. يولد صاحب المسار 4 ببرمجة باطنية تبحث عن اليقين وسط الفوضى؛ غالباً ما عاش طفولة غاب فيها الاستقرار أو فُرض عليه الشعور بالمسؤولية مبكراً، فقرر أن الأمان لا يُمنح بل يُبنى حجراً فوق حجر بعرق الجبين والانضباط. وفي حياتك اليومية قد تلاحظ أنك تراجع الخطة مرتين، وتغضب من الفوضى والتأخير، ولا تستريح إلا حين يكتمل العمل. فالنظام عندك ليس هواية بل شعور بالأمان صنعته بنفسك.",
      light: "صخرة يعتمد عليها الجميع، وفاء استثنائي بالعهود، عقل منهجي تفكيكي يحول الفوضى إلى هياكل تنظيمية محكمة، وصبر حديدي على الإنجاز طويل المدى وبناء الأصول المستقرة. في الأسرة يعتمد عليك الجميع في الأوراق والمواعيد والمال، وفي العمل تُسلَّم إليك المهام التي لا تحتمل الخطأ.",
      shadow: "الجمود الفكري والعناد الأعمى، مقاومة أي تغيير غير محسوب بالملليمتر، متلازمة الأمان المشروط (لا راحة إلا بعد اكتمال كل شيء)، وشح التعبير العاطفي وتحويل العلاقات إلى واجبات ثقيلة. وفي العلاقات قد يشعر من يحبك أنك تعطيه واجبات لا مشاعر، وقد ترفض فرصة جيدة لأنها لم تكن في الخطة.",
      blueprint: [
        { challenge: "الجمود ومقاومة التغيير المفاجئ", solution: "تدريب العقل على اعتبار المرونة شكلاً أعلى من أشكال القوة لا تهديداً للأمان." },
        { challenge: "اختزال الحياة في الواجب والكدح", solution: "جدولة أوقات للمتعة واللعب دون شعور بالذنب أو ربطها بإنهاء المهام." },
        { challenge: "الحكم القاسي على من يفتقر للنظام", solution: "تقبل اختلاف وتيرة الآخرين والتوقف عن قياس قيمتهم بمقدار إنتاجيتهم اليومية." }
      ]
    },
    5: {
      number: 5,
      psychosomatic: "تظهر طاقتك في جسدك كحركة لا تهدأ: تتنقل وتجرب وتمل بسرعة من الجلوس الطويل. وحين تهرب من الالتزام أو تفرط في السهر والسفر والمتع تتعب طاقتك وتتبعثر، ويختل إيقاع نومك وأكلك. يريحك قليل من الروتين يحمي حريتك: موعد نوم ثابت، ووجبات منتظمة، ورياضة فيها حركة ومغامرة، ووقت هادئ تراجع فيه ما عشته.",
      title: "المستكشف الحر وسفير التحول الديناميكي",
      cheatSheet: [
        { area: "التجربة والتجديد", balanced: "مرونة تكيف فائقة وشجاعة في التجديد الهادف", shadow: "تهور وهروب قهري من الالتزام عند أول إحساس بالملل" },
        { area: "العلاقات والشراكة", balanced: "شراكة حرة متجددة تلهم الطرفين بالتطور", shadow: "علاقات عابرة وخوف دائم من فقدان الحرية" },
        { area: "المال وإدارة الطاقة", balanced: "استثمار الفرص الذكية وتثبيت مصادر دخل مستقرة", shadow: "تبديد الموارد في مغامرات غير مدروسة وتشتت القوى" }
      ],
      core: "مسار كسر القيود والتجربة الحية. يولد صاحب المسار 5 بروح متمردة على الأقفاص؛ طفولته ارتبطت بالشعور بالاختناق من التوجيه الصارم أو الرتابة القاتلة، فتعلم أن التنفس الحقيقي يبدأ حين يفتح الباب ويركض نحو المجهول لاكتشاف اتساع العالم. وفي حياتك اليومية قد تلاحظ أنك تمل من نفس الطريق، وتغير خططك في آخر لحظة، وتشعر بالاختناق إن قيدك أحد بجدول. فالحرية عندك تنفس، والتجربة عندك طريقة لتعرف نفسك.",
      light: "مرونة تكيف خارقة في أي بيئة أو أزمة، كاريزما تجذب القلوب، فضول فكري خصب، قدرة آسرة على التواصل ونقل الأفكار، وشجاعة في إعادة ابتكار النفس باستمرار دون خوف من البدايات الجديدة. في العمل تنجح في السفر والتواصل والمبيعات وكل ما فيه حركة، وبين الأصدقاء تكون صاحب المغامرة والفكرة الجديدة.",
      shadow: "إدمان المثيرات والهروب من الالتزام والعمق، التشتت في عشرات البدايات دون ختام، التهور في استهلاك الطاقة والمال، والقلق المزمن من أن يفوته شيء خلف الأفق. وفي حياتك قد تنفق وقتك ومالك على ما يدهشك اليوم وتنساه غدًا، أو تهرب من علاقة حين تصير جادة.",
      blueprint: [
        { challenge: "الهروب القهري عند أول إحساس بالتقييد", solution: "التفريق بين الالتزام الناضج الذي يبني الأثر وبين السجن الحقيقي." },
        { challenge: "التشتت السطحي وضياع الطاقات", solution: "تبني استراتيجية 'العمق المختار' بتثبيت مشروعين أو ثلاثة والإصرار على إتمامها." },
        { challenge: "استنزاف الجسد بالقفزات المستمرة", solution: "ممارسة روتين تأريض جسدي يومي (مشي، رياضة واعية) لإعادة ربط الذهن بالأرض." }
      ]
    },
    6: {
      number: 6,
      psychosomatic: "تظهر طاقتك في جسدك كدفء وعطاء: يدان تمتدان للمساعدة، وعينان تلاحظان من يحتاج. وحين تحمل هموم الأسرة والأحبة وحدك وتنسى نفسك يثقل صدرك وكتفاك، وتتقلب شهيتك ونومك مع مزاج من تحب. يريحك أن تعتني بنفسك كما تعتني بهم، وأن تقول لا مرة دون اعتذار، وأن تحيط نفسك بالجمال والترتيب، وأن تأكل بهدوء لا على عجل.",
      title: "حارس التناغم والراعي الإنساني الأكبر",
      cheatSheet: [
        { area: "العطاء والرعاية", balanced: "احتواء رحيم ودعم ناضج دون فرض أو استنزاف", shadow: "عقدة المنقذ والتدخل المفرط واللعب بدور الضحية" },
        { area: "العلاقات والأسرة", balanced: "خلق بيئة محبة وأمان مع احترام مساحات الآخرين", shadow: "مثالية خانقة وشعور سري بالمرارة لعدم التقدير" },
        { area: "الاحتياج الشخصي", balanced: "طلب الدعم والاعتراف بالضعف واستقبال المحبة", shadow: "كبت الاحتياجات الذاتية واعتبار طلب العون عيباً" }
      ],
      core: "مسار الاحتواء والمسؤولية الأخلاقية. يولد بقلب يحمل هموم المحيطين قبل همومه؛ ارتبطت طفولته بلعب دور الأب البديل أو الملجأ العاطفي للأسرة، مما رسخ لديه قناعة بأن قيمته واستحقاقه للحب مشروطان بقدرته على إنقاذ وإصلاح الآخرين. وفي حياتك اليومية قد تلاحظ أنك أول من يتصل حين يمرض أحد، وأول من يحل مشكلة غيره، وآخر من يسأل عن نفسه. فالعطاء عندك صادق، لكنه أحيانًا طريقتك لتستحق الحب.",
      light: "طاقة شفائية دافئة تجمع الشتات، ذوق جمالي وفني راقٍ، كرم عاطفي غير محدود، وقدرة فطرية على خلق بيئات يسودها الأمان، الاحتضان، والعدالة الإنسانية. في البيت تكون قلبه وملجأه، وفي العمل تنجح في التعليم والرعاية والتصميم وكل ما يجمع بين الجمال والخدمة.",
      shadow: "عقدة المنقذ، التدخل المفرط في حياة الآخرين تحت مسمى النصيحة، الشعور السري بالمرارة والخذلان لأن العطاء لا يُقابل بالمثل، ولعب دور الضحية المقيدة بالواجب. وفي العلاقات قد تتدخل في قرارات من تحب بحجة الخوف عليه، ثم تحزن لأنه لم يقدّر ما فعلته.",
      blueprint: [
        { challenge: "استنزاف الذات في إنقاذ من لا يطلب الإنقاذ", solution: "التوقف عن فرض الرعاية، وتطبيق قاعدة: 'لا تدعم أحداً على حساب سلامتك الطاقية'." },
        { challenge: "المثالية الخانقة في البيوت والعلاقات", solution: "تقبل النقص والخطأ كجزء طبيعي من التجربة الإنسانية دون سعي للكمال المستحيل." },
        { challenge: "الخوف من طلب المقابل أو إظهار الحاجة", solution: "التعبير الصريح عن الاحتياج العاطفي وممارسة استقبال الدعم دون تردد." }
      ]
    },
    7: {
      number: 7,
      psychosomatic: "تظهر طاقتك في جسدك في العينين والصمت: نظرة تتأمل، وجلسة طويلة مع فكرة، ونفور من الزحام والضوضاء. وحين يغلبك التفكير المفرط وتنعزل أكثر من اللازم يسهر عقلك، ويقل تعرضك للشمس والحركة، فتشعر بثقل في رأسك وجسدك. يريحك المشي في النهار، والتأمل أو الصلاة بهدوء، وكتابة أفكارك قبل النوم، وجلسة صادقة مع شخص واحد يفهمك.",
      title: "الفيلسوف الباحث ومفكك شفرات الحقيقة",
      cheatSheet: [
        { area: "البحث والمعرفة", balanced: "ذكاء تحليلي نافذ وبصيرة تفكك أعمق الأسرار", shadow: "شك مرضي وشلل تحليلي وتعالٍ فكري" },
        { area: "العلاقات والتواصل", balanced: "انتقائية راقية وتواصل روحي عميق مع قلة موثوقة", shadow: "عزلة باردة وسوء ظن وتشريح المشاعر بالمنطق الجاف" },
        { area: "القرارات والواقع", balanced: "النزول من الرأس إلى الفعل المادي بعد جمع البيانات", shadow: "تردد في خوض الواقع المادي واعتصام بالأبراج النظرية" }
      ],
      core: "مسار البصيرة التحليلية والغوص في الأعماق. يولد بعقل راداري لا يقبل القشور؛ طفولته تميزت بالشعور بالغربة عن الأقران وسوء الفهم من المحيط، فاعتصم في محراب عقله وقراءاته، معتبراً أن المعرفة وحدها هي الحصن المنيع ضد زيف العالم. وفي حياتك اليومية قد تلاحظ أنك تسأل «لماذا» حيث يكتفي الناس بـ«ماذا»، وأنك تحتاج إلى وقت وحدك لتستعيد نفسك، وأن الأحاديث السطحية تتعبك أكثر من العمل. فالعمق عندك ليس ترفًا بل حاجة.",
      light: "ذكاء استقرائي نافذ، قدرة نادرة على كشف الخداع، حضور روحي وتأملي عميق، استقلالية فكرية صارمة، وبراعة في تفكيك أدق العلوم والأنظمة الخفية وتقديم حلول غير تقليدية. في العمل تنجح في البحث والتحليل والتخصص الدقيق، وفي الإيمان تبحث عن فهم حقيقي لا عن تقليد.",
      shadow: "الشك الدائم في نوايا الناس، الانعزال البارد والتعالي الفكري على بساطة البشر، الإفراط في تشريح المشاعر حتى تفقد حرارتها، والتردد في اتخاذ قرارات الواقع المادي. وفي العلاقات قد يشعر من يحبك أنك بعيد حتى وأنت جالس معه، وقد تحلل مشاعرك حتى لا يبقى منها شيء تعيشه.",
      blueprint: [
        { challenge: "الانفصال عن الجسد والعواطف بالتحليل المفرط", solution: "ممارسة النزول من الرأس إلى القلب بالتأمل الحسي والتعبير العفوي." },
        { challenge: "العزلة التدميرية وسوء الظن بالبشر", solution: "بناء دائرة مصغرة من الأصدقاء الموثوقين وتجربة مشاركة الضعف الإنساني معهم." },
        { challenge: "الشلل الفكري أمام خوض التجربة الواقعية", solution: "الاكتفاء بنسبة 70% من البيانات والبدء في الفعل العملي دون انتظار الفهم المطلق." }
      ]
    },
    8: {
      number: 8,
      psychosomatic: "تظهر طاقتك في جسدك كقوة وحضور: وقفة واثقة، وصوت حاسم، وقدرة على العمل تحت الضغط. وحين تربط قيمتك بالإنجاز والمال وتكتم تعبك لتبدو قويًا يتجمع الشد في فكك وكتفيك وظهرك، وتعمل حتى الإرهاق. يريحك أن تفرغ التوتر في رياضة قوية، وأن تمنح نفسك يومًا كاملًا بلا عمل، وأن تعترف لشخص قريب حين تتعب.",
      title: "خيميائي المادة والسيادة النفسية",
      cheatSheet: [
        { area: "الإدارة والمال", balanced: "بناء ثروة مستدامة ومنظومات قوية تحت مظلة العدالة", shadow: "سيطرة مطلقة واختزال الحياة في المصالح والصفقات" },
        { area: "المشاعر والهشاشة", balanced: "قوة ناضجة قادرة على إظهار الحنان ومشاركة الضعف", shadow: "قمع العاطفة واعتبار طلب المساعدة دليلاً على الانكسار" },
        { area: "الفريق والشركاء", balanced: "تفويض واعي وتمكين الآخرين من صناعة القرار", shadow: "تدقيق مجهري وشك في كفاءة الشركاء" }
      ],
      core: "مسار التمكين بعد الانهيار. يولد صاحبه وفي عقله الباطن قناعة مبكرة بأن العالم لا يرحم الضعفاء، بسبب صراع مبكر حول الموارد أو نموذج أبوي صارم فرض النضج المبكر. يمتلك عقلاً إستراتيجياً وبصيرة نادرة في إدارة المنظومات والناس. وفي حياتك اليومية قد تلاحظ أنك تحسب كل خطوة، وتكره أن يرى أحد ضعفك، وتشعر بالقلق حين يكون المال أو القرار في يد غيرك. فالقوة عندك درع تعلمته مبكرًا.",
      light: "صانع الوفرة المستدامة، صامد تحت الضغط، يحول الأزمات إلى خطط عمل محكمة، ويحكمه قانون الكارما والعدالة الصارمة في بناء الثروة والمكانة. في العمل تصل إلى مواقع القيادة والإدارة والمال، وفي الأسرة تصير السند الذي يحمل الأعباء الكبيرة.",
      shadow: "متلازمة السيطرة المطلقة، قمع الهشاشة العاطفية، واختزال العلاقات الإنسانية في المنفعة والصفقات والتبادل المادي. وفي العلاقات قد تعامل الحب كصفقة تُحسب، أو تكتم تعبك حتى ينفجر غضبًا في وقت غير مناسب.",
      blueprint: [
        { challenge: "الخوف من فقدان السيطرة", solution: "ممارسة التفويض الواعي ومنح الآخرين مساحة للتعلم." },
        { challenge: "الجفاف العاطفي الصارم", solution: "الاعتراف بالاحتياج ومشاركة لحظات الضعف بصدق." },
        { challenge: "إدمان العمل والإنجاز", solution: "وضع حدود صارمة للراحة واعتبارها أصلاً استثمارياً لكفاءة الجسد." }
      ]
    },
    9: {
      number: 9,
      psychosomatic: "تظهر طاقتك في جسدك كاتساع وتعاطف: تحمل هموم الناس وكأنها همومك، وتتأثر بالأخبار والقصص أكثر من غيرك. وحين تعطي حتى تفرغ وتؤجل احتياجاتك يثقل جسدك، وتشعر بإرهاق يشبه الحزن. يريحك أن تختم ما بدأته وتترك ما انتهى، وأن تعطي من فائضك لا من رصيدك، وأن تقضي وقتًا مع الماء أو الطبيعة لتستعيد صفاءك.",
      title: "الحكيم الكوني وسيد الإغلاق الواعي",
      cheatSheet: [
        { area: "العطاء الإنساني", balanced: "رحمة شاملة ملهمة وخدمة بلا شروط أو أحكام", shadow: "لعب دور الشهيد المضحي وإهمال الذات حتى الاحتراق" },
        { area: "العلاقات وفصول الحياة", balanced: "إغلاق واعي وتسليم حكيم لتدفق التغيير", shadow: "تعلق مرضي بالماضي وصعوبة إنهاء العلاقات المستنزفة" },
        { area: "الواقعية والأمل", balanced: "فعل صغير مؤثر يحفظ النور في محيطه", shadow: "مثالية رومانسية تصطدم بالواقع فتنقلب إلى مرارة وعدمية" }
      ],
      core: "مسار التكامل والوعي الشامل. يولد صاحب المسار 9 بروح قديمة محملة بتجارب كل الأرقام السابقة؛ طفولته شهدت فقداناً مبكراً أو تجارب اضطرته لوداع أشياء وأشخاص أحبهم، ليتعلم الدرس الأكبر: أن التعلق بالأشكال وهم، وأن القوة تكمن في التسليم والتدفق. وفي حياتك اليومية قد تلاحظ أنك تتأثر بخبر حزين عن غرباء كأنه يخصك، وأنك تعطي بلا حساب، وأنك تحمل ذكريات لا تستطيع تركها. فالرحمة عندك واسعة، والوداع عندك أصعب درس.",
      light: "رحمة إنسانية عابرة للحدود والأحكام، كرم روحي ملهم، قدرة ساحرة على إغلاق الفصول وإنهاء الأزمات، جاذبية فطرية تجمع الناس، وعين ترى الصورة الكبرى للكون والعدالة الإلهية. في العمل تنجح في الأعمال الإنسانية والتعليم والفن وكل ما يخدم الناس، وبين الأصدقاء تكون الحكيم الذي يُستشار.",
      shadow: "المثالية الرومانسية المفرطة التي تصطدم بقسوة الواقع، صعوبة الإفلات والتعلق بالماضي والذكريات، الدراما الداخلية ولعب دور الشهيد المضحي، والهروب من معالجة أزمات الذات بإصلاح أزمات العالم. وفي حياتك قد تنشغل بإصلاح هموم الآخرين لتهرب من همك، أو تبقى متعلقًا بعلاقة انتهت لأنك تحن إلى ما كانت عليه.",
      blueprint: [
        { challenge: "التعلق المرضي بالماضي وصعوبة إنهاء الفصول", solution: "ممارسة طقوس الإغلاق الواعي والاعتراف بأن كل مرحلة أدت دورها ورحلت." },
        { challenge: "لعب دور الشهيد الإنساني على حساب النفس", solution: "وضع حدود مقدسة للمساعدة والتأكد من امتلاء الكأس الشخصي أولاً قبل سكبه للآخرين." },
        { challenge: "الانحدار إلى المرارة عند خيبة الأمل", solution: "التركيز على الفعل الصغير المؤثر بدلاً من الشلل أمام حجم قسوة العالم." }
      ]
    },
    11: {
      number: 11,
      psychosomatic: "تظهر طاقتك في جسدك كحساسية شديدة: أعصاب يقظة، وحدس يلتقط ما لا يقال، وإلهام يأتي فجأة. وحين يزدحم عقلك بما تلتقطه من الناس ولا تجد له مخرجًا يتغير نومك، وتشعر بتوتر لا تعرف سببه. يريحك روتين ليلي هادئ، والابتعاد عن الشاشات قبل النوم، والتأمل أو الدعاء، وأن تختار بعناية من تسمح له بالاقتراب من مساحتك.",
      title: "الرائي الحسي وقناة الوعي الفائق",
      cheatSheet: [
        { area: "الحدس والإلهام", balanced: "بصيرة فورية وتنزيل معرفي ينير طريق الآخرين", shadow: "تشكيك مرضي في الكفاءة وأحلام يقظة" },
        { area: "الطاقة والجسد", balanced: "تأريض يومي في الطبيعة وحماية الهالة من الاستنزاف", shadow: "امتصاص طاقات المحيطين واحتراق عصبي وصداع مزمن" },
        { area: "الرسالة والواقع", balanced: "تحويل الرؤى العالية إلى مشاريع ملموسة وخطوات مجدولة", shadow: "تشتت بين الرؤية والواقع والهروب من العالم المادي" }
      ],
      core: "مسار الإلهام والحساسية الفائقة. يولد بحساسية عالية يلتقط ما وراء الكلمات منذ الطفولة، وعاش صدمة التشكيك بالحدس واتهامه بالمبالغة، ليتحمل مسؤولية عاطفية مبكرة لتهدئة محيطه الأسري. وفي حياتك اليومية قد تلاحظ أنك تعرف ما سيقوله الشخص قبل أن يقوله، وأنك تتعب من الأماكن المزدحمة، وأن أفكارك تأتي كإلهام مفاجئ لا كخطة. فالحساسية عندك هدية تحتاج إلى حماية.",
      light: "بصيرة فورية وتنزيل معرفي نادر، قراءة نوايا البشر في اللحظة الأولى، وقدرة ملهمة بالفطرة على تحفيز طاقات الآخرين ونقل الوعي المعقد في قوالب مفهومة. في العمل تنجح في الإلهام والتوجيه والإبداع، ويرتاح الناس لكلامك لأنك تفهمهم دون شرح.",
      shadow: "التردد والتشكيك القهري بالكفاءة، الإنهاك نتيجة امتصاص طاقات المحيطين، والهروب إلى أحلام اليقظة بعيداً عن متطلبات الواقع المادي. وفي حياتك قد تشك في نفسك رغم موهبتك، أو تهرب إلى الأحلام حين يطلب منك الواقع خطوة عملية.",
      blueprint: [
        { challenge: "التشبع بطاقات الآخرين", solution: "العزلة التطهيرية اليومية وممارسة التأريض في الطبيعة." },
        { challenge: "التردد والتشكيك بالحدس", solution: "اعتماد قاعدة الانطباع الأول (أول 3 ثوانٍ) دون تشريح منطقي زائد." },
        { challenge: "التشتت بين الفكرة والواقع", solution: "تثبيت الرؤية عبر كتابتها وتحويل الإلهام لخطوات عمل روتينية مجدولة." }
      ]
    },
    22: {
      number: 22,
      psychosomatic: "تظهر طاقتك في جسدك كقدرة على البناء والاحتمال: تحمل مشاريع كبيرة ومسؤوليات أكبر من سنك. وحين تحمل العالم على كتفيك وتؤجل حياتك حتى تكتمل الرؤية يثقل ظهرك وصدرك، ويصعب عليك أن تفصل بين العمل والراحة. يريحك أن تقسم الحلم إلى خطوات صغيرة، وأن تمشي وتتنفس كل يوم، وأن تفرح بما بنيته الآن لا بعد سنوات.",
      title: "البنّاء الأعظم ومهندس التحولات المادية الكبرى",
      cheatSheet: [
        { area: "البناء الإستراتيجي", balanced: "تجسيد مشاريع عملاقة ومؤسسات تخدم المجتمع لأجيال", shadow: "شلل فكري بسبب ضخامة الهدف والمثالية المرهقة" },
        { area: "القيادة والناس", balanced: "دمج البعد الإنساني مع النظام الإداري الصارم", shadow: "قسوة جافة في التعامل وتحميل النفس والآخرين فوق طاقتهم" },
        { area: "الصحة والجسد", balanced: "جدولة الراحة والرياضة كأولويات غير قابلة للتفاوض", shadow: "إنهاك كظري وهيكلي وإهمال الجسد حتى الانهيار المفاجئ" }
      ],
      core: "الرقم الماستر الثاني ومحور تجسيد الرؤى العملاقة على أرض الواقع (11 + 11 = 22 ⇒ 4). يجمع بين البصيرة الروحية الفائقة والانضباط المادي الواقعي الصارم؛ طفولته كانت محفوفة بضغوطات جعلته يشعر بمسؤوليات هائلة تفوق سنوات عمره. وفي حياتك اليومية قد تلاحظ أنك تفكر في مشاريع أكبر من ظروفك، وتشعر بمسؤولية تجاه عائلتك أو مجتمعك، وتقسو على نفسك حين يتأخر التنفيذ. فالحلم عندك كبير، ويحتاج صبرًا بحجمه.",
      light: "عبقرية تنظيمية نادرة قادرة على إدارة مشاريع عملاقة تمتد آثارها لأجيال، كفاءة هندسية تحول الأحلام المجردة لمؤسسات وأنظمة واقعية تخدم الإنسانية وتوفر الاستقرار. في العمل تنجح في البناء والإدارة والمشاريع الطويلة، ويثق بك الناس لأنك تجمع بين الرؤية والواقع.",
      shadow: "السقوط في الشلل الفكري بسبب ضخامة الأهداف والكمال المرهق، القسوة الصارمة على النفس والآخرين، أو الانتكاس إلى خمول تام خوفاً من عدم بلوغ الرؤية المنشودة. وفي حياتك قد تؤجل البدء لأن الخطة لم تكتمل، أو تحمّل نفسك وحدك ما يحتاج فريقًا كاملًا.",
      blueprint: [
        { challenge: "الرعب من ثقل المسؤولية وضخامة الرؤية", solution: "تقسيم الإمبراطورية المنشودة إلى مهام يومية صغيرة والتركيز على خطوة اليوم الحالية." },
        { challenge: "السيطرة الجافة وفقدان المرونة", solution: "دمج البعد الإنساني مع النظام الإداري وتقبل التعديلات المفاجئة كجزء من التطور." },
        { challenge: "إهمال الجسد والصحة لأجل الإنجاز", solution: "جدولة الرعاية الذاتية والتمارين الرياضية كأولويات غير قابلة للتفاوض داخل جدول البناء." }
      ]
    },
    33: {
      number: 33,
      psychosomatic: "تظهر طاقتك في جسدك كحنان يملأ المكان: تهدئ من حولك بحضورك، وتشعر بآلامهم كأنها لك. وحين تضحي حتى تنسى نفسك وتحمل مسؤولية شفاء الجميع يتعب جسدك وتثقل روحك، ويختل نومك وأكلك. يريحك أن تضع حدًّا واضحًا لعطائك، وأن تعتني بجسدك كأمانة، وأن تخصص وقتًا لنفسك لا يخدم فيه أحد.",
      title: "المعلم الأعظم وقناة الشفاء الكوني",
      cheatSheet: [
        { area: "الإرشاد والشفاء", balanced: "منارة محبة تنير بصيرة التائهين وتلهمهم للنمو الذاتي", shadow: "حمل صليب الآخرين واحتراق شفائي وشعور بالذنب الكوني" },
        { area: "الحدود الشخصية", balanced: "حماية الطاقة الذاتية وتغذية الروح أولاً قبل العطاء", shadow: "استباحة الحدود وإلغاء الذات لصالح إنقاذ العالم" },
        { area: "التوازن الروحي", balanced: "تسليم هادئ للقدر الإلهي وحضور حنون في اللحظة الآنية", shadow: "قلق وجودي مزمن ومحاولة فرض المعايير الأخلاقية بقسوة" }
      ],
      core: "الرقم الماستر الثالث والأعلى تردداً (11 + 22 = 33 ⇒ 6). يمثل ذروة تجسيد المحبة الواعية والخدمة الإنسانية؛ طفولته كانت بمثابة معمودية بالنار والمسؤوليات، حيث حمل على عاتقه أعباء وتحديات نفسية هائلة صنعت منه منارة ترشد التائهين. وفي حياتك اليومية قد تلاحظ أن الناس يحكون لك همومهم دون أن تطلب، وأنك تشعر بالذنب إذا استرحت، وأنك تحمل مسؤولية سعادة من حولك. فالحب عندك رسالة، لكنه يحتاج إلى حدود ليبقى.",
      light: "حضور شفائي طاغٍ يبعث السكينة بمجرد التواجد، قدرة استثنائية على الإرشاد والتأثير الروحي والفكري في الجماهير، حب غير مشروط، وتناغم نادر بين الفكرة الرفيعة والعمل التطبيقي الرحيم. في العمل تنجح في التعليم والإرشاد والرعاية، ويترك حضورك أثرًا في كل مكان تدخله.",
      shadow: "السقوط تحت وطأة ثقل الإيثار المطلق، إنهاك نفسي شديد بسبب استشعار كل آلام المحيط، الشعور بالذنب القاتل عند الاهتمام بالذات، أو الانتكاس إلى فرض المعايير الأخلاقية بقسوة. وفي حياتك قد تضحي حتى تنطفئ، أو تفرض على من تحب معاييرك الأخلاقية لأنك تريد له الأفضل.",
      blueprint: [
        { challenge: "الاحتراق الشفائي وحمل صليب الآخرين", solution: "إدراك أن لكل روح رحلتها ودروسها، وأن دورك هو إشعال النور لا السير في الطريق بدلاً عنهم." },
        { challenge: "إهمال الحدود والاحتياجات الجسدية الأساسية", solution: "اعتبار رعاية الجسد والنفس شرطاً مسبقاً لاستمرار الرسالة لا رفاهية أنانية." },
        { challenge: "الإحساس بالمسؤولية عن شقاء العالم", solution: "التسليم للقدر الإلهي وممارسة الحضور الهادئ في اللحظة الآنية بدلاً من القلق الكوني المستمر." }
      ]
    }
  };
  global.AqeeqLifePathData = Object.freeze(lifePathData);
})(window);