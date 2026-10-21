/* Aqeq Astro · Name Reading Cards
   Loads name_data.json, calculates three name numbers, and renders all 9 reading cards.
   GitHub Pages friendly: no server-side code required.
*/
(function (root) {
  "use strict";

  let dataPromise;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(new URL("name_data.json", window.location.href).href, {
        cache: "no-cache"
      }).then(function (response) {
        if (!response.ok) throw new Error("تعذر تحميل name_data.json (" + response.status + ")");
        return response.json();
      }).then(function (json) {
        if (!json || !json.groups) throw new Error("تنسيق ملف قراءات الاسم غير صحيح.");
        return json;
      });
    }
    return dataPromise;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function contentToHTML(value) {
    const text = String(value || "").replace(/\r\n?/g, "\n").trim();
    if (!text) return "";
    return text.split(/\n{2,}/).map(function (block) {
      const lines = block.split("\n");
      if (lines.every(function (line) { return /^\s*[•●▪◦*-]\s+/.test(line); })) {
        return "<ul>" + lines.map(function (line) {
          return "<li>" + escapeHTML(line.replace(/^\s*[•●▪◦*-]\s+/, "")) + "</li>";
        }).join("") + "</ul>";
      }
      return "<p>" + lines.map(escapeHTML).join("<br>") + "</p>";
    }).join("");
  }

  const GROUPS = [
    { key: "soul_urge", calcKey: "soulUrge", label: "رغبة الروح", sub: "إيه اللي بيحرّكك من جوا" },
    { key: "personality", calcKey: "personality", label: "الشخصية الظاهرة", sub: "الانطباع اللي بتسيبه عند الناس" },
    { key: "expression", calcKey: "expression", label: "التعبير والقدر", sub: "مواهبك وطريقتك في تحويلها لفعل" }
  ];

  function numberLabel(result) {
    if (!result || result.value == null) return "غير متاح";
    return String(result.value) + (result.isMaster ? " · رقم رئيسي" : "");
  }

  async function render(name, resultRoot) {
    if (!resultRoot) return;
    const old = resultRoot.querySelector(".aqeq-name-readings");
    if (old) old.remove();

    const section = document.createElement("section");
    section.className = "aqeq-name-readings";
    section.setAttribute("aria-live", "polite");
    section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسمك</h3><p>تلات زوايا بتكمل قراءة مسار حياتك: الدافع الداخلي، صورتك قدام الناس، وطريقة التعبير عن مواهبك.</p></div><p class="aqeq-name-status">جاري تجهيز كروت الاسم…</p>';
    resultRoot.appendChild(section);

    const cleanName = String(name || "").trim();
    if (!cleanName) {
      section.querySelector(".aqeq-name-status").textContent =
        "اكتب اسمك في خانة الاسم عشان تظهر قراءة رغبة الروح والشخصية الظاهرة والتعبير والقدر.";
      section.classList.add("is-empty");
      return;
    }

    try {
      if (!root.AqeqNameEngine || typeof root.AqeqNameEngine.calculateNameNumbers !== "function") {
        throw new Error("محرك حساب الاسم غير محمّل. تأكد من إضافة name_engine.js.");
      }
      const [nameData, calculation] = await Promise.all([
        loadData(),
        Promise.resolve(root.AqeqNameEngine.calculateNameNumbers(cleanName))
      ]);

      // Avoid a stale async response overwriting a newer result.
      if (!section.isConnected) return;

      const groupsHTML = GROUPS.map(function (group) {
        const calculated = calculation[group.calcKey];
        const number = calculated && calculated.value != null ? String(calculated.value) : "";
        const entry = nameData.groups[group.key] &&
          nameData.groups[group.key].numbers &&
          nameData.groups[group.key].numbers[number];

        if (!entry || !Array.isArray(entry.cards)) {
          return '<article class="aqeq-name-group aqeq-name-missing"><header><div><h4>' +
            escapeHTML(group.label) + '</h4><p>' + escapeHTML(group.sub) +
            '</p></div><span class="aqeq-name-number">—</span></header><p class="aqeq-name-error">ملقيناش قراءة للرقم ده في ملف البيانات.</p></article>';
        }

        const cardsHTML = entry.cards.map(function (card, index) {
          return '<article class="aqeq-reading-card"><div class="aqeq-reading-card-top"><span class="aqeq-card-index">0' +
            (index + 1) + '</span><h5>' + escapeHTML(card.title || ("الكارت " + (index + 1))) +
            '</h5></div><div class="aqeq-reading-content">' + contentToHTML(card.content) +
            '</div></article>';
        }).join("");

        return '<article class="aqeq-name-group"><header><div><h4>' +
          escapeHTML(nameData.groups[group.key].label || group.label) +
          '</h4><p>' + escapeHTML(group.sub) + '</p></div><span class="aqeq-name-number">' +
          escapeHTML(numberLabel(calculated)) + '</span></header><div class="aqeq-reading-grid">' +
          cardsHTML + '</div></article>';
      }).join("");

      section.innerHTML = '<div class="aqeq-name-heading"><span class="aqeq-name-kicker">AQEQ ASTRO · NAME NUMBERS</span><h3>بصمة اسم ' +
        escapeHTML(cleanName) + '</h3><p>قراءة رمزية للتأمل وفهم الذات، بتكمل مسار حياتك ولا تستبدله.</p></div>' +
        '<div class="aqeq-name-groups">' + groupsHTML + '</div>';
    } catch (error) {
      if (!section.isConnected) return;
      const status = section.querySelector(".aqeq-name-status") || document.createElement("p");
      status.className = "aqeq-name-status aqeq-name-error";
      status.textContent = (error && error.message) ? error.message :
        "حصلت مشكلة أثناء تحميل قراءات الاسم. راجع ملفات الموقع وحاول تاني.";
      if (!status.parentNode) section.appendChild(status);
    }
  }

  root.AqeqNameReadings = Object.freeze({ render: render, loadData: loadData });
})(window);
