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
