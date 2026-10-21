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

  // YYYY-MM-DD digit sum, preserving 11/22/33 as master Life Paths.
  function pathFromDate(isoDate) {
    const digits = String(isoDate).replace(/\D/g, "");
    let total = [...digits].reduce((sum, digit) => sum + Number(digit), 0);
    while (total > 9 && ![11, 22, 33].includes(total)) {
      total = [...String(total)].reduce((sum, digit) => sum + Number(digit), 0);
    }
    return total;
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

  function personLens(name, person, lens, relationType) {
    const label = relationType === "love" ? "قراءة العلاقة العاطفية"
      : relationType === "family" ? "قراءة العلاقة الأسرية" : "قراءة الشراكة العملية";
    const actionsTitle = relationType === "business" ? "خطوة عملية للطرف ده" : "خطوة يقدر يعملها الطرف ده";
    const partnerTitle = relationType === "business" ? "إيه اللي الطرف الآخر يقدر يقدمه؟" : "إيه اللي الطرف الآخر يقدر يعمله؟";
    return `
      <article class="syn-result-card">
        <h3>${esc(name)} · ${esc(label)}</h3>
        <p class="syn-kpi">${safeText(person.identity, "مسار الحياة")}</p>
        ${para(lens.hook)}
        <h4>زاوية الفهم</h4>${para(lens.diagnosis)}
        <h4>الاحتياج الأساسي</h4>${para(person.coreNeed)}
        <h4>نقطة حساسة</h4>${para(lens.hidden_wound || person.coreWound)}
        <h4>الظل المحتمل</h4>${para(person.shadowSide)}
        <h4>المحفزات</h4>${para(person.triggers)}
        <h4>${esc(actionsTitle)}</h4>${para(lens.prescription_for_you)}
        <h4>${esc(partnerTitle)}</h4>${para(lens.prescription_for_partner)}
        <h4>جملة تساعد على الإصلاح</h4>${para(lens.healing_line)}
      </article>`;
  }

  function renderReport(nameA, nameB, report, relationType) {
    const { meta, free, premium } = report;
    const p1 = premium.path1 || {};
    const p2 = premium.path2 || {};
    const lens1 = p1.lens || {};
    const lens2 = p2.lens || {};
    const daily = premium.dailyBridge || {};
    const bridge = premium.coreBridge || {};
    const attraction = premium.attractionFull || {};
    const overlays = premium.masterOverlays || [];
    const karmic = premium.karmicDebts || [];
    const breakdown = meta.breakdown || {};

    // Keep composite formatting consistent for every result, including master 11.
    const compositeDisplay = `${meta.rawBaseSum} / الجذر ${meta.composite}`;

    const scoreDetails = `
      <div class="syn-score-breakdown">
        <p>الأساس: <strong>${breakdown.base ?? 50}</strong></p>
        <p>توافق العائلات: <strong>${breakdown.familyBonus ?? 0}</strong></p>
        <p>الجسر الأساسي: <strong>${breakdown.coreBridgeBonus ?? 0}</strong></p>
        <p>الجسر اليومي: <strong>${breakdown.dailyBridgeBonus ?? 0}</strong></p>
        <p>مكافأة المسار المشترك: <strong>${breakdown.compositeBonus ?? 0}</strong></p>
        <p>الأرقام الرئيسية: <strong>${breakdown.masterBonus ?? 0}</strong></p>
        <p>الدرس الكارمي: <strong>${breakdown.karmicPenalty ?? 0}</strong></p>
        <p>المجموع قبل الحد: <strong>${meta.rawScore ?? meta.score}</strong></p>
      </div>`;

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

    const relationshipDynamics = relationType === "love" ? "ديناميكية الحب والاحتياج"
      : relationType === "family" ? "ديناميكية العلاقة الأسرية" : "ديناميكية الشراكة والعمل";
    const relationshipSummary = `${safeText(lens1.diagnosis, "")}<br><br>${safeText(lens2.diagnosis, "")}`;
    const masterBadge = meta.isCompositeMaster
      ? `<p class="syn-master-badge" role="status">🌟 تنبيه قدري: تم رصد طاقة ماستر كبرى (${esc(meta.rawBaseSum)}) في رابط هذا الثنائي!</p>`
      : "";
    const attractionHook = attraction.attraction_hook || free.attraction || "اكتشفوا تفاصيل الجذب والتفاعل بينكم.";

    output.innerHTML = `
      <article class="syn-result-card syn-score-card">
        <div class="syn-gauge" style="--score-angle:${meta.score * 3.6}deg"><strong>${meta.score}%</strong></div>
        <p class="center syn-kpi">مؤشر التوافق الرمزي</p>
        <h3 class="center">${safeText(meta.label?.label, "قراءة التوافق")}</h3>
        <p class="center syn-score-note">${esc(nameA)} · ${esc(nameB)} · ${esc(relationLabel(relationType === "love" ? "romantic" : relationType))}</p>
        ${masterBadge}
        <p class="syn-insight center">${safeText(attractionHook, "اكتشفوا تفاصيل الجذب والتفاعل في الكروت التالية.")}</p>
      </article>

      <div class="syn-result-grid">
        <article class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameA)}</div><div class="syn-value">${meta.path1}</div><h4>${safeText(p1.identity, "مسار الحياة")}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameB)}</div><div class="syn-value">${meta.path2}</div><h4>${safeText(p2.identity, "مسار الحياة")}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">المسار المشترك Composite</div><div class="syn-value">${esc(compositeDisplay)}</div><h4>${meta.isCompositeMaster ? "مسار رئيسي في العلاقة" : "جذر المسار المشترك"}</h4></article>
        <article class="syn-result-card"><div class="syn-kpi">الجسر الأساسي Core Bridge</div><div class="syn-value">${meta.coreBridge}</div><h4>${safeText(bridge.title, free.coreBridgeTitle || "جسر العلاقة")}</h4><p>${safeText(bridge.power_dynamic, "")}</p></article>
        <article class="syn-result-card"><div class="syn-kpi">الجسر اليومي Daily Bridge</div><div class="syn-value">${meta.dailyBridge}</div><h4>${safeText(daily.title, "طريقة التفاعل اليومي")}</h4><p>${safeText(daily.spark_dynamic, "")}</p><h4>نقطة الاحتكاك اليومية</h4><p>${safeText(daily.daily_fuse, "")}</p><h4>اقتراح عملي</h4><p>${safeText(daily.daily_hack, "")}</p></article>
      </div>

      <h3 class="syn-section-heading">كروت الجذب الأربعة</h3>
      <div class="syn-result-grid syn-attraction-grid">
        ${card("شرارة الجذب", safeText(attraction.attraction_hook || free.attraction, ""))}
        ${card("السر البدائي للجذب", safeText(attraction.primal_secret || free.primalSecret, ""))}
        ${card("انطباع اللقاء الأول", safeText(attraction.first_meeting_vibe, ""))}
        ${card("ليه ممكن تفضلوا مع بعض؟", safeText(attraction.why_they_stay, ""))}
      </div>
      <h3 class="syn-section-heading">الجسر الأساسي وطريقة الإصلاح</h3>
      <div class="syn-result-grid">
        ${card("جسر العلاقة الأساسي", `<p>${safeText(bridge.hidden_trigger, "")}</p><h4>بروتوكول الإصلاح</h4><p>${safeText(bridge.healing_protocol, "")}</p><h4>جملة الإصلاح المشتركة</h4><p>${safeText(bridge.repair_statement || free.healingLine, "")}</p>`)}
      </div>

      <article class="syn-premium locked" id="syn-premium">
        <div class="syn-premium-content">
          <h3>التقرير المتعمق للشراكة</h3>
          <div class="syn-result-grid">
            ${personLens(nameA, p1, lens1, relationType)}
            ${personLens(nameB, p2, lens2, relationType)}
            ${card(relationshipDynamics, relationshipSummary)}
            ${card("نقطة الصدام الخفية", `<p>${safeText(lens1.daily_fuse, "")}</p><p>${safeText(lens2.daily_fuse, "")}</p><h4>المحفز المشترك</h4><p>${safeText(bridge.hidden_trigger, "")}</p>`)}
            ${card(relationType === "business" ? "روشتة الشراكة العملية" : relationType === "family" ? "روشتة إصلاح العلاقة الأسرية" : "روشتة الحل بينكم", `
              <h4>الجملة المشتركة اللي تفتح باب الإصلاح</h4>${para(bridge.repair_statement)}
              <h4>${esc(nameA)} · مفتاح مساره</h4>${para(p1.magicKey, "مفتاح المسار غير متاح في البيانات الحالية.")}
              <h4>خطوة عملية لـ ${esc(nameA)}</h4>${para(lens1.prescription_for_you)}
              <h4>الجملة العلاجية المناسبة لـ ${esc(nameA)}</h4>${para(lens1.healing_line)}
              <h4>${esc(nameB)} · مفتاح مساره</h4>${para(p2.magicKey, "مفتاح المسار غير متاح في البيانات الحالية.")}
              <h4>خطوة عملية لـ ${esc(nameB)}</h4>${para(lens2.prescription_for_you)}
              <h4>الجملة العلاجية المناسبة لـ ${esc(nameB)}</h4>${para(lens2.healing_line)}
              <h4>بروتوكول الإصلاح المشترك</h4>${para(bridge.healing_protocol)}
            `)}
            ${card("تفاصيل الحساب", scoreDetails)}
          </div>
          ${overlayHtml}
          ${karmicHtml}
          <p class="syn-note">قراءة رمزية للتأمل والحوار، وليست تشخيصًا نفسيًا أو ضمانًا لنجاح العلاقة.</p>
        </div>
        <div class="syn-lock-overlay">
          <div style="font-size:2rem">✦</div>
          <h3>التقرير الكامل</h3>
          <p>المعاينة الكاملة هنا تجريبية. زر العرض لا يمثل نظام دفع فعليًا.</p>
          <button class="btn" type="button" id="syn-unlock">عرض التقرير التفصيلي</button>
        </div>
      </article>
      <p class="syn-note">الحسابات تتم داخل المتصفح. درجة التوافق مؤشر داخل منهج عقيق أسترو وليست قياسًا علميًا للعلاقة.</p>`;

    output.hidden = false;
    const unlock = $("syn-unlock");
    if (unlock) unlock.addEventListener("click", () => {
      const premium = $("syn-premium");
      premium.classList.remove("locked");
      premium.classList.add("unlocked");
    });
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
      renderReport(nameA, nameB, report, relationEngineType(selectedType));
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
