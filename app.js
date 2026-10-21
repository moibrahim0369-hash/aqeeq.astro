/* Aqeq Astro: Life Path Synastry integration.
   Source of truth: engine.js + data.json. Designed for static hosting (GitHub Pages). */
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

  function pathFromDate(isoDate) {
    const digits = isoDate.replace(/\D/g, "");
    let total = [...digits].reduce((sum, digit) => sum + Number(digit), 0);
    while (total > 9 && ![11, 22, 33].includes(total)) {
      total = [...String(total)].reduce((sum, digit) => sum + Number(digit), 0);
    }
    return total;
  }

  function dateDay(isoDate) {
    return Number(isoDate.split("-")[2]);
  }

  function relationLabel(type) {
    return ({ romantic: "علاقة عاطفية / زواج", family: "علاقة أسرية", business: "شراكة عمل" })[type] || "العلاقة";
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

  function fieldCard(title, content) {
    return `<article class="syn-result-card"><h4>${esc(title)}</h4><p class="syn-insight">${content || " "}</p></article>`;
  }

  function renderReport(nameA, nameB, report, result, type) {
    const { meta, free, premium } = report;
    const p1 = premium.path1;
    const p2 = premium.path2;
    const lens1 = p1.lens || {};
    const lens2 = p2.lens || {};
    const label = meta.label || {};
    const attraction = premium.attractionFull || {};
    const bridge = premium.coreBridge || {};
    const daily = premium.dailyBridge || {};
    const overlays = premium.masterOverlays || [];
    const karmic = premium.karmicDebts || [];
    const breakdown = meta.breakdown || {};

    const lensFields = [
      ["زاوية الفهم", "diagnosis"],
      ["الجرح الخفي", "hidden_wound"],
      ["مفتاح التعامل", "prescription_for_you"],
      ["رسالة للطرف الآخر", "prescription_for_partner"],
      ["جملة الإصلاح", "healing_line"]
    ];
    const personLens = (name, lens) => `
      <article class="syn-result-card">
        <h3>قراءة ${esc(name)}</h3>
        <p class="syn-insight">${safeText(lens.hook || lens.diagnosis)}</p>
        ${lensFields.map(([title, key]) => lens[key] ? `<h4>${esc(title)}</h4><p class="syn-insight">${safeText(lens[key])}</p>` : "").join("")}
      </article>`;

    const masterHtml = overlays.length
      ? `<article class="syn-result-card"><h3>مؤشرات الأرقام الرئيسية</h3>${overlays.map(item =>
          `<p class="syn-insight"><strong>${item.source === "composite" ? "المسار المشترك" : item.source === "partner1" ? esc(nameA) : esc(nameB)} · ${esc(item.number)}</strong><br>${safeText(item.text)}</p>`
        ).join("")}</article>`
      : "";

    const karmicHtml = karmic.length
      ? `<article class="syn-result-card"><h3>دروس تحتاج وعيًا</h3>${karmic.map(item =>
          `<p class="syn-insight"><strong>${item.person === "person1" ? esc(nameA) : esc(nameB)} · يوم ${esc(item.day)}</strong><br>${safeText(item.title || item.description || item.lesson || "مؤشر رمزي للتأمل.")}</p>`
        ).join("")}</article>`
      : "";

    output.innerHTML = `
      <article class="syn-result-card">
        <div class="syn-gauge" style="--score-angle:${meta.score * 3.6}deg"><strong>${meta.score}%</strong></div>
        <p class="center syn-kpi">مؤشر التوافق الرمزي</p>
        <h3 class="center">${safeText(label.label, "قراءة التوافق")}</h3>
        <p class="center syn-score-note">${esc(nameA)} · ${esc(nameB)} · ${esc(relationLabel(type))}</p>
        <p class="syn-insight center">${safeText(free.attraction, "تظهر قراءة الجذب في التفاصيل التالية.")}</p>
        <div class="syn-result-grid">
          <div class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameA)}</div><div class="syn-value">${meta.path1}</div><p>${safeText(p1.identity)}</p></div>
          <div class="syn-result-card"><div class="syn-kpi">مسار ${esc(nameB)}</div><div class="syn-value">${meta.path2}</div><p>${safeText(p2.identity)}</p></div>
          <div class="syn-result-card"><div class="syn-kpi">المسار المشترك</div><div class="syn-value">${meta.composite}${meta.isCompositeMaster ? " · رقم رئيسي" : ""}</div><p>${safeText(free.coreBridgeTitle, "جسر العلاقة")}</p></div>
          <div class="syn-result-card"><div class="syn-kpi">الجسر اليومي</div><div class="syn-value">${meta.dailyBridge}</div><p>${safeText(daily.title, "طريقة التفاعل اليومي")}</p><p class="syn-insight">${safeText(daily.daily_fuse || daily.spark_dynamic || daily.daily_hack, "")}</p></div>
        </div>
      </article>
      <div class="syn-result-grid">
        ${fieldCard("سر الجذب", safeText(attraction.primal_secret || free.primalSecret, ""))}
        ${fieldCard("انطباع اللقاء الأول", safeText(attraction.first_meeting_vibe, ""))}
        ${fieldCard("ليه ممكن تفضلوا مع بعض؟", safeText(attraction.why_they_stay, ""))}
        ${fieldCard("جسر العلاقة الأساسي", `<strong>${safeText(bridge.title, "الجسر الأساسي")}</strong><br>${safeText(bridge.power_dynamic, "")}<br><br><strong>خطوة إصلاح:</strong> ${safeText(free.healingLine || bridge.repair_statement, "")}`)}
      </div>
      <article class="syn-premium locked" id="syn-premium">
        <div class="syn-premium-content">
          <h3>التقرير المتعمق للشراكة</h3>
          <div class="syn-result-grid">
            ${personLens(nameA, lens1)}
            ${personLens(nameB, lens2)}
            ${fieldCard("ديناميكية الجسر اليومي", safeText(daily.spark_dynamic || daily.daily_fuse, "") + "<br><br>" + safeText(daily.daily_hack, ""))}
            ${fieldCard("مفتاح العلاقة", safeText(p1.magicKey, "") + "<br><br>" + safeText(p2.magicKey, ""))}
            ${fieldCard("تفاصيل الحساب", `الأساس: ${breakdown.base ?? 50}<br>العائلة: ${breakdown.familyBonus ?? 0}<br>الجسر الأساسي: ${breakdown.coreBridgeBonus ?? 0}<br>الجسر اليومي: ${breakdown.dailyBridgeBonus ?? 0}<br>المسار المشترك: ${breakdown.compositeBonus ?? 0}<br>الأرقام الرئيسية: ${breakdown.masterBonus ?? 0}<br>الدرس الكارمي: ${breakdown.karmicPenalty ?? 0}`)}
          </div>
          ${masterHtml}${karmicHtml}
          <p class="syn-note">قراءة رمزية للتأمل والحوار، وليست تشخيصًا نفسيًا أو ضمانًا لنجاح العلاقة.</p>
        </div>
        <div class="syn-lock-overlay"><div style="font-size:2rem">✦</div><h3>التقرير الكامل</h3><p>المعاينة الكاملة هنا تجريبية. فتح المحتوى لا يمثل نظام دفع فعليًا.</p><button class="btn" type="button" id="syn-unlock">عرض التقرير التفصيلي</button></div>
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
    const type = $("syn-type").value;

    if (!nameA || !nameB || !dateA || !dateB) {
      errorBox.textContent = "اكتب اسم وتاريخ ميلاد الطرفين الأول والتاني.";
      errorBox.hidden = false;
      return;
    }
    if (dateA > new Date().toISOString().slice(0, 10) || dateB > new Date().toISOString().slice(0, 10)) {
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
      const relationType = type === "romantic" ? "love" : type === "family" ? "family" : "business";
      const report = window.AqeqEngine.buildReport(result, DATA, relationType);
      renderReport(nameA, nameB, report, result, type);
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
