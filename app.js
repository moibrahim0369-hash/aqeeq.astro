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

  function card(title, content, extraClass = "") {
    return `<article class="syn-result-card ${extraClass}"><h4>${esc(title)}</h4><div class="syn-insight">${content || " "}</div></article>`;
  }

  function para(value, fallback = "") {
    const valueText = typeof value === "string" ? value.trim() : "";
    return valueText ? `<p>${esc(valueText)}</p>` : (fallback ? `<p>${esc(fallback)}</p>` : "");
  }

  // Gender agreement (display only): feminine wording for a female partner, dual form for a shared paragraph of mixed genders.
  const gfix = (value, ctx, opts) => {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text || !window.AqeqGender) return text;
    return window.AqeqGender.fix(text, ctx.g, { ...opts, both: !!ctx.both });
  };
  const gpara = (value, ctx, opts) => para(gfix(value, ctx, opts));
  const sharedCtx = (gA, gB) => {
    const fa = gA === "female", fb = gB === "female";
    return fa && fb ? { g: "female" } : (fa || fb ? { g: "female", both: true } : { g: "" });
  };

  // One shared paragraph when both partners get the identical text; otherwise one paragraph per partner under their name.
  function dualParas(t1, t2, ctxA, ctxB, nameA, nameB, opts) {
    if (typeof t1 === "string" && t1.trim() && t1 === t2) {
      return gpara(t1, sharedCtx(ctxA.g, ctxB.g), opts);
    }
    const one = (name, t, ctx) => (t && String(t).trim()) ? `<h4>${esc(name)}</h4>${gpara(t, ctx, opts)}` : "";
    return one(nameA, t1, ctxA) + one(nameB, t2, ctxB);
  }

  function personLens(name, person, lens, relationType, ctx) {
    const label = relationType === "love" ? "قراءة العلاقة العاطفية"
      : relationType === "family" ? "قراءة العلاقة الأسرية" : "قراءة الشراكة العملية";
    const actionsTitle = relationType === "business" ? "خطوة عملية للطرف ده" : "خطوة يقدر يعملها الطرف ده";
    const partnerTitle = relationType === "business" ? "إيه اللي الطرف الآخر يقدر يقدمه؟" : "إيه اللي الطرف الآخر يقدر يعمله؟";
    const P = (v, o) => gpara(v, ctx, o);
    return `
      <article class="syn-result-card">
        <h3>${esc(name)} · ${esc(label)}</h3>
        <p class="syn-kpi">${safeText(person.identity, "مسار الحياة")}</p>
        ${P(lens.hook)}
        <h4>زاوية الفهم</h4>${P(lens.diagnosis)}
        <h4>الاحتياج الأساسي</h4>${P(person.coreNeed)}
        <h4>نقطة حساسة</h4>${P(lens.hidden_wound || person.coreWound)}
        <h4>الظل المحتمل</h4>${P(person.shadowSide)}
        <h4>المحفزات</h4>${P(person.triggers)}
        <h4>${esc(actionsTitle)}</h4>${P(lens.prescription_for_you)}
        <h4>${esc(partnerTitle)}</h4>${P(lens.prescription_for_partner, { third: true })}
        <h4>جملة تساعد على الإصلاح</h4>${P(lens.healing_line)}
      </article>`;
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


    const overlayHtml = overlays.length ? `
      <article class="syn-result-card">
        <h3>رسالة الأرقام الرئيسية</h3>
        ${overlays.map(item => {
          const sourceName = item.source === "composite" ? "المسار المشترك"
            : item.source === "partner1" ? nameA : nameB;
          return `<h4>${esc(sourceName)} · ${esc(item.number)}</h4>${para(item.text)}`;
        }).join("")}
      </article>` : "";

    const karmicHtml = karmic.length ? `
      <article class="syn-result-card">
        <h3>دروس تحتاج وعيًا</h3>
        ${karmic.map(item => {
          const sourceName = Number(item.person) === 1 ? nameA : nameB;
          return `<h4>${esc(sourceName)} · يوم ${esc(item.day)} · ${esc(item.code || item.key || "درس رمزي")}</h4>
            ${para(item.title)}
            ${para(item.old_wound)}
            ${para(item.liberation_key)}
            ${para(item.repair_statement)}`;
        }).join("")}
      </article>` : "";

    const relationshipDynamics = relationType === "love" ? "بتحبوا بعض إزاي ومحتاجين إيه؟"
      : relationType === "family" ? "بتتعاملوا مع بعض إزاي؟" : "بتشتغلوا مع بعض إزاي؟";
    const relationshipSummary = dualParas(lens1.diagnosis, lens2.diagnosis, ctxA, ctxB, nameA, nameB);
    const masterBadge = meta.isCompositeMaster
      ? `<p class="syn-master-badge" role="status"><svg class="aq-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg> تنبيه قدري: تم رصد طاقة ماستر كبرى (${esc(meta.rawBaseSum)}) في رابط هذا الثنائي!</p>`
      : "";

    // Attraction texts are written per direction (A->B and B->A). Show both so the report never depends on input order.
    // Business/Family have no dedicated attraction texts yet, so the romantic section stays hidden for them.
    const attractionCards = (a, fb) => `
      <div class="syn-result-grid syn-attraction-grid">
        ${card("شرارة الجذب", safeText(a.attraction_hook || (fb && fb.attraction), ""))}
        ${card("السر البدائي للجذب", safeText(a.primal_secret || (fb && fb.primalSecret), ""))}
        ${card("انطباع اللقاء الأول", safeText(a.first_meeting_vibe, ""))}
        ${card("ليه ممكن تفضلوا مع بعض؟", safeText(a.why_they_stay, ""))}
      </div>`;
    const sameAttraction = JSON.stringify(attraction) === JSON.stringify(attractionB);
    const attractionHTML = !isLove ? "" : sameAttraction
      ? `<h3 class="syn-section-heading">كروت الجذب الأربعة</h3>${attractionCards(attraction, free)}`
      : `<h3 class="syn-section-heading">من منظور ${esc(nameA)}</h3>${attractionCards(attraction, free)}
         <h3 class="syn-section-heading">من منظور ${esc(nameB)}</h3>${attractionCards(attractionB, null)}`;

    Object.assign(output.dataset, { p1: meta.path1, p2: meta.path2, core: meta.coreBridge, daily: meta.dailyBridge, comp: meta.composite, na: nameA, nb: nameB });
    output.innerHTML = `
      <article class="syn-result-card syn-score-card">
        <div class="syn-gauge" style="--score-angle:${meta.score * 3.6}deg"><strong>${meta.score}%</strong></div>
        <p class="center syn-kpi">مؤشر التوافق الرمزي</p>
        <h3 class="center">${safeText(meta.label?.label, "قراءة التوافق")}</h3>
        <p class="center syn-score-note">${esc(nameA)} · ${esc(nameB)} · ${esc(relationLabel(relationType === "love" ? "romantic" : relationType))}</p>
        ${masterBadge}
      </article>

      <div class="syn-result-grid">
        <article class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameA)}</div><div class="syn-value">${meta.path1}</div><h4>${safeText(p1.identity, "مسار الحياة")}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameB)}</div><div class="syn-value">${meta.path2}</div><h4>${safeText(p2.identity, "مسار الحياة")}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">الرقم المشترك</div><div class="syn-value">${esc(compositeDisplay)}</div><h4>${meta.isCompositeMaster ? "مسار رئيسي في العلاقة" : "جذر المسار المشترك"}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">الجسر الأساسي</div><div class="syn-value">${meta.coreBridge}</div><h4>${safeText(bridge.title, free.coreBridgeTitle || "جسر العلاقة")}</h4><p>${safeText(bridge.power_dynamic, "")}</p></article>
        <article class="syn-result-card"><div class="syn-kpi">الجسر اليومي</div><div class="syn-value">${meta.dailyBridge}</div><h4>${safeText(daily.title, "طريقة التفاعل اليومي")}</h4><p>${safeText(daily.spark_dynamic, "")}</p><h4>نقطة الاحتكاك اليومية</h4><p>${safeText(daily.daily_fuse, "")}</p><h4>اقتراح عملي</h4><p>${safeText(daily.daily_hack, "")}</p></article>
      </div>

      ${attractionHTML}
      <h3 class="syn-section-heading">الجسر الأساسي وطريقة الإصلاح</h3>
      <div class="syn-result-grid">
        ${card("جسر العلاقة الأساسي", `<p>${safeText(bridge.hidden_trigger, "")}</p><h4>بروتوكول الإصلاح</h4><p>${safeText(bridge.healing_protocol, "")}</p><h4>جملة الإصلاح المشتركة</h4><p>${safeText(bridge.repair_statement || free.healingLine, "")}</p>`)}
      </div>

      <article class="syn-premium unlocked" id="syn-premium">
        <div class="syn-premium-content">
          <h3>إزاي بتفهموا بعض من جوه؟</h3>
          <div class="syn-result-grid">
            ${sameNumber
              ? personLens(pairNames, p1, lens1, relationType, shared)
              : personLens(nameA, p1, lens1, relationType, ctxA) + personLens(nameB, p2, lens2, relationType, ctxB)}
            ${card(relationshipDynamics, relationshipSummary)}
            ${card("نقطة الصدام الخفية", `${dualParas(lens1.daily_fuse, lens2.daily_fuse, ctxA, ctxB, nameA, nameB)}<h4>المحفز المشترك</h4><p>${safeText(bridge.hidden_trigger, "")}</p>`)}
            ${card(relationType === "business" ? "نعمل إيه عشان الشغل يمشي؟" : relationType === "family" ? "نعمل إيه عشان البيت يرتاح؟" : "نعمل إيه عشان العلاقة تنجح؟", `
              <h4>الجملة المشتركة اللي تفتح باب الإصلاح</h4>${para(bridge.repair_statement)}
              ${sameNumber ? `
              <h4>اللي بيفرق مع ${esc(pairNames)}</h4>${gpara(p1.magicKey, shared)}
              <h4>خطوة عملية لـ ${esc(pairNames)}</h4>${gpara(lens1.prescription_for_you, shared)}
              <h4>الجملة العلاجية المناسبة لـ ${esc(pairNames)}</h4>${gpara(lens1.healing_line, shared)}` : `
              <h4>اللي بيفرق مع ${esc(nameA)}</h4>${gpara(p1.magicKey, ctxA)}
              <h4>خطوة عملية لـ ${esc(nameA)}</h4>${gpara(lens1.prescription_for_you, ctxA)}
              <h4>الجملة العلاجية المناسبة لـ ${esc(nameA)}</h4>${gpara(lens1.healing_line, ctxA)}
              <h4>اللي بيفرق مع ${esc(nameB)}</h4>${gpara(p2.magicKey, ctxB)}
              <h4>خطوة عملية لـ ${esc(nameB)}</h4>${gpara(lens2.prescription_for_you, ctxB)}
              <h4>الجملة العلاجية المناسبة لـ ${esc(nameB)}</h4>${gpara(lens2.healing_line, ctxB)}`}
              <h4>بروتوكول الإصلاح المشترك</h4>${para(bridge.healing_protocol)}
            `)}
          </div>
          ${overlayHtml}
          ${karmicHtml}
        </div>
      </article>`;

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
