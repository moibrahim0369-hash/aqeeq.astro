/**
 * AQEEQ ASTRO — Master Platform Orchestrator (aqeeq-platform.js)
 * Unifies:
 *  1. Global Navigation, Active Section State & Section Topbars
 *  2. Live Cosmic Observatory Ribbon (Real Sun/Moon/Numerology calculation for today)
 *  3. Personal Observatory Dashboard & Unified Saved Library (Search, Filter, Restore, Delete)
 *  4. 1-Click Profile Birth Data Auto-Fill across Natal Chart (#cform), Matrix (#mform), and Life Path (#lpform)
 *  5. Save-Reading Action Bars & 20-Dimension Natal Chart Chapter Filter
 *  6. Arabic (RTL) / English (LTR) Direction & Shell Switcher
 */

(function () {
  'use strict';

  const STORAGE_KEY_READINGS = 'aqeeq_saved_readings_v1';
  const STORAGE_KEY_PROFILE_CACHE = 'aqeeq_profile_cache_v1';
  const STORAGE_KEY_LANG = 'aqeeq_lang_dir_v1';

  const SIGNS_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
  const SIGNS_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  const ARCANA_NAMES_AR = {
    1: '١ · الساحر (المبادرة والقدرة)',
    2: '٢ · الكاهنة العليا (الحدس والسر)',
    3: '٣ · الإمبراطورة (الوفرة والخلق)',
    4: '٤ · الإمبراطور (البناء والسلطة)',
    5: '٥ · الكاهن الأكبر (الحكمة والنظام)',
    6: '٦ · العشاق (الاختيار والانسجام)',
    7: '٧ · العربة (القيادة والإنجاز)',
    8: '٨ · العدالة (التوازن والسببية)',
    9: '٩ · الناسك (البصيرة والعمق)',
    10: '١٠ · عجلة الحظ (الدورات والفرص)',
    11: '١١ · القوة (السيادة الداخلية)',
    12: '١٢ · المعلّق (الرؤية المغايرة)',
    13: '١٣ · التحول (التجديد الجذري)',
    14: '١٤ · الاعتدال (التناغم والشفاء)',
    15: '١٥ · الظل والجاذبية (الوعي بالرغبات)',
    16: '١٦ · البرج (اليقظة والتحرر)',
    17: '١٧ · النجمة (الإلهام والرسالة)',
    18: '١٨ · القمر (الخيال واللاوعي)',
    19: '١٩ · الشمس (الإشراق والنجاح)',
    20: '٢٠ · اليقظة الكبرى (نداء الروح)',
    21: '٢١ · العالم (الاكتمال والشمول)',
    22: '٢٢ · الروح الحرة (البدايات المفتوحة)'
  };

  let currentFilter = 'all';
  let currentSearch = '';
  let currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'ar';

  // =========================================================================
  // 1. TOAST NOTIFICATION HELPER
  // =========================================================================
  function showToast(message) {
    let toast = document.getElementById('aq-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'aq-global-toast';
      toast.className = 'aq-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.__timer);
    toast.__timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // 2. SYMBOLIC & ASTROLOGICAL QUICK CALCULATORS
  // =========================================================================
  function calcLifePathNumber(dateStr) {
    if (!dateStr) return null;
    const parts = String(dateStr).split('-').map(Number);
    const digSum = (n) => {
      let s = 0;
      for (const c of String(Math.abs(n))) s += +c;
      return s;
    };
    let sum = 0;
    if (parts.length === 3 && parts.every(Number.isFinite)) {
      sum = digSum(parts[2]) + digSum(parts[1]) + digSum(parts[0]);
    } else {
      const digits = String(dateStr).replace(/\D/g, '').split('').map(Number);
      if (!digits.length) return null;
      sum = digits.reduce((a, b) => a + b, 0);
    }
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = digSum(sum);
    }
    return sum;
  }

  function calcMatrixArcana(dateStr) {
    if (!dateStr) return null;
    const digits = String(dateStr).replace(/\D/g, '').split('').map(Number);
    if (!digits.length) return null;
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 22) {
      sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
    }
    return sum || 22;
  }

  function calcSunSignFromDate(dateStr) {
    if (!dateStr) return null;
    const parts = String(dateStr).split('-').map(Number);
    if (parts.length < 3) return null;
    const m = parts[1];
    const d = parts[2];
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 0;
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 1;
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 2;
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 3;
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 4;
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 5;
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 6;
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 7;
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 8;
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 9;
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 10;
    return 11;
  }

  // =========================================================================
  // 3. DAILY COSMIC OBSERVATORY RIBBON (LIVE ASTRONOMY + NUMEROLOGY)
  // =========================================================================
  function updateObservatoryRibbon() {
    const sunEl = document.getElementById('aq-obs-sun');
    const moonEl = document.getElementById('aq-obs-moon');
    const dayNumEl = document.getElementById('aq-obs-daynum');
    const focusEl = document.getElementById('aq-obs-focus');
    const skyPlanetsStrip = document.getElementById('aq-home-sky-planets');
    if (!sunEl && !moonEl) return;

    const now = new Date();
    const isoToday = now.toISOString().slice(0, 10);
    const dayLp = calcLifePathNumber(isoToday) || 1;

    const dayThemesAr = {
      1: 'يوم المبادرة وبداية القرارات المستقلة',
      2: 'يوم الدبلوماسية، الإصغاء، وتعميق الروابط',
      3: 'يوم التعبير الإبداعي، الحوار، والانفتاح',
      4: 'يوم التنظيم، إرساء القواعد، والعمل المتقن',
      5: 'يوم المرونة، التغيير الواعي، وكسر الجمود',
      6: 'يوم التوازن الأسري، الرعاية، والجمال',
      7: 'يوم التأمل العميق، البحث، والهدوء الذهني',
      8: 'يوم الحسم المهني، التخطيط المالي، والإنجاز',
      9: 'يوم الإغلاق الحكيم، التسامح، وتصفية العوائق',
      11: 'يوم البصيرة الفائقة والإلهام الروحي (١١)',
      22: 'يوم البناء الكبير وتحويل الرؤى إلى واقع (٢٢)',
      33: 'يوم الحكمة القلبية والعطاء المتزن (٣٣)'
    };

    try {
      if (window.Astro && typeof window.Astro.chart === 'function') {
        const skyChart = window.Astro.chart({
          utcMs: now.getTime(),
          lat: 30.0444,
          lon: 31.2357,
          known: false
        });
        const degInSign = lon => Math.floor(((Number(lon) % 30) + 30) % 30);
        const sunBody = skyChart.bodies.find(b => b.key === 'sun');
        const moonBody = skyChart.bodies.find(b => b.key === 'moon');
        if (sunBody && sunEl) {
          sunEl.textContent = `${SIGNS_GLYPH[sunBody.sign]} ${SIGNS_AR[sunBody.sign]} (${degInSign(sunBody.lon)}°)`;
        }
        if (moonBody && moonEl) {
          moonEl.textContent = `${SIGNS_GLYPH[moonBody.sign]} القمر في ${SIGNS_AR[moonBody.sign]} (${degInSign(moonBody.lon)}°)`;
        }
        if (skyPlanetsStrip && Array.isArray(skyChart.bodies)) {
          const planetNamesAr = {
            mercury: '☿ عطارد',
            venus: '♀ الزهرة',
            mars: '♂ المريخ',
            jupiter: '♃ المشتري',
            saturn: '♄ زحل'
          };
          const pills = ['mercury', 'venus', 'mars', 'jupiter', 'saturn']
            .map(key => {
              const body = skyChart.bodies.find(b => b.key === key);
              if (!body) return '';
              const retroTag = body.retro ? ' (تراجع ℞)' : '';
              return `<span class="aq-sky-planet-pill"><b>${planetNamesAr[key]}:</b> ${SIGNS_GLYPH[body.sign]} ${SIGNS_AR[body.sign]} ${degInSign(body.lon)}°${retroTag}</span>`;
            })
            .filter(Boolean)
            .join('');
          if (pills) {
            skyPlanetsStrip.innerHTML = pills;
          }
        }
      } else {
        const sIdx = calcSunSignFromDate(isoToday) ?? 0;
        if (sunEl) sunEl.textContent = `${SIGNS_GLYPH[sIdx]} برج ${SIGNS_AR[sIdx]}`;
        if (moonEl) moonEl.textContent = 'اضغط لاستكشاف السماء الآن';
      }
    } catch (_) {
      const sIdx = calcSunSignFromDate(isoToday) ?? 0;
      if (sunEl) sunEl.textContent = `${SIGNS_GLYPH[sIdx]} برج ${SIGNS_AR[sIdx]}`;
    }

    if (dayNumEl) {
      dayNumEl.textContent = `الرقم الكوني ${dayLp} · ${isoToday}`;
    }
    if (focusEl) {
      focusEl.textContent = dayThemesAr[dayLp] || dayThemesAr[1];
    }
  }

  // =========================================================================
  // 4. SAVED READINGS & PERSONAL LIBRARY ENGINE
  // =========================================================================
  function getSavedReadings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_READINGS);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function setSavedReadings(list) {
    try {
      localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(list.slice(0, 80)));
    } catch (_) {}
    updateSavedCounterBadges();
    renderPersonalLibrary();
    renderHomePersonalInsights();
  }

  function saveReading(item) {
    if (!item || !item.title) return null;
    const list = getSavedReadings();
    const entry = {
      id: 'aq_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: item.type || 'natal',
      typeLabel: item.typeLabel || 'قراءة محفوظة',
      title: item.title,
      subtitle: item.subtitle || '',
      route: item.route || '#chart',
      inputs: item.inputs || null,
      payload: item.payload || null,
      createdAt: new Date().toISOString()
    };
    list.unshift(entry);
    setSavedReadings(list);
    showToast('تم حفظ القراءة في مكتبتك الشخصية');
    return entry;
  }

  function deleteReading(id) {
    const list = getSavedReadings().filter(r => r.id !== id);
    setSavedReadings(list);
    showToast('تم حذف القراءة من المكتبة');
  }

  function updateSavedCounterBadges() {
    const count = getSavedReadings().length;
    document.querySelectorAll('.aq-saved-count').forEach(el => {
      el.textContent = String(count);
    });
  }

  function formatDateShort(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (_) {
      return String(isoStr).slice(0, 10);
    }
  }

  function restoreSavedReading(item) {
    if (!item) return;
    if (item.inputs) {
      if (item.type === 'natal') {
        location.hash = '#chart';
        setTimeout(() => {
          const nameEl = document.getElementById('f-name');
          const dateEl = document.getElementById('f-date');
          const timeEl = document.getElementById('f-time');
          const noTimeEl = document.getElementById('f-unknown');
          if (nameEl && item.inputs.name) nameEl.value = item.inputs.name;
          if (dateEl && item.inputs.date) {
            dateEl.value = item.inputs.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (noTimeEl && typeof item.inputs.noTime === 'boolean') {
            noTimeEl.checked = item.inputs.noTime;
            noTimeEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (timeEl && item.inputs.time) {
            timeEl.value = item.inputs.time;
            timeEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const form = document.getElementById('cform');
          if (form) form.requestSubmit();
        }, 120);
        return;
      }

      if (item.type === 'matrix') {
        location.hash = '#matrix';
        setTimeout(() => {
          const nameEl = document.getElementById('m-name');
          const dateEl = document.getElementById('m-date');
          if (nameEl && item.inputs.name) nameEl.value = item.inputs.name;
          if (dateEl && item.inputs.date) {
            dateEl.value = item.inputs.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const form = document.getElementById('mform');
          if (form) form.requestSubmit();
        }, 120);
        return;
      }

      if (item.type === 'lifepath') {
        location.hash = '#lifepath';
        setTimeout(() => {
          const nameEl = document.getElementById('lp-name');
          const dateEl = document.getElementById('lp-date');
          if (nameEl && item.inputs.name) nameEl.value = item.inputs.name;
          if (dateEl && item.inputs.date) {
            dateEl.value = item.inputs.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const form = document.getElementById('lpform');
          if (form) {
            form.hidden = false;
            form.style.display = 'block';
            form.requestSubmit();
          }
        }, 120);
        return;
      }

      if (item.type === 'compat' && item.route === '#life-path-synastry') {
        location.hash = '#life-path-synastry';
        setTimeout(() => {
          const n1 = document.getElementById('syn-name-a');
          const d1 = document.getElementById('syn-date-a');
          const n2 = document.getElementById('syn-name-b');
          const d2 = document.getElementById('syn-date-b');
          if (n1 && item.inputs.name1) n1.value = item.inputs.name1;
          if (d1 && item.inputs.date1) {
            d1.value = item.inputs.date1;
            d1.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (n2 && item.inputs.name2) n2.value = item.inputs.name2;
          if (d2 && item.inputs.date2) {
            d2.value = item.inputs.date2;
            d2.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const form = document.getElementById('synastry-form');
          if (form) form.requestSubmit();
        }, 120);
        return;
      }
    }

    if (item.route) {
      if (item.route.startsWith('#')) {
        location.hash = item.route;
      } else {
        location.href = item.route;
      }
    }
  }

  // =========================================================================
  // 5. RENDER PERSONAL OBSERVATORY DASHBOARD & LIBRARY IN #account + HOME
  // =========================================================================
  function getProfileBirthData() {
    const profDate =
      document.getElementById('profile-birth-date')?.value ||
      document.getElementById('prof-bdate')?.value;
    const profPref =
      document.getElementById('profile-preferred-name')?.value?.trim() || '';
    const profName =
      document.getElementById('profile-first-name')?.value?.trim() ||
      document.getElementById('prof-first-name')?.value?.trim() || '';
    const profLast =
      document.getElementById('profile-last-name')?.value?.trim() ||
      document.getElementById('prof-last-name')?.value?.trim() || '';
    const profTime =
      document.getElementById('profile-birth-time')?.value ||
      document.getElementById('prof-btime')?.value;
    const profTimeUnk =
      document.getElementById('profile-time-unknown')?.checked ??
      document.getElementById('prof-btime-unknown')?.checked;
    const profCity =
      document.getElementById('profile-birth-city')?.value?.trim() || '';
    const profCountry =
      document.getElementById('profile-birth-country')?.value?.trim() || '';

    if (profDate) {
      const fullName = profPref || [profName, profLast].filter(Boolean).join(' ').trim();
      const data = {
        name: fullName,
        firstName: profName,
        lastName: profLast,
        preferredName: profPref,
        date: profDate,
        time: profTime || '12:00',
        noTime: Boolean(profTimeUnk),
        city: profCity,
        country: profCountry
      };
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE_CACHE, JSON.stringify(data));
      } catch (_) {}
      return data;
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY_PROFILE_CACHE);
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return null;
  }

  function updateCosmicIdentitySummary() {
    const sunNode = document.getElementById('aq-id-sun');
    const lpNode = document.getElementById('aq-id-lp');
    const matrixNode = document.getElementById('aq-id-matrix');
    const savedCountNode = document.getElementById('aq-id-saved-count');

    const homeSunNode = document.getElementById('aq-home-cid-sun');
    const homeLpNode = document.getElementById('aq-home-cid-lp');
    const homeMatrixNode = document.getElementById('aq-home-cid-matrix');
    const homeStatusNode = document.getElementById('aq-home-cid-status');

    const profile = getProfileBirthData();
    const bdate =
      profile?.date ||
      document.getElementById('f-date')?.value ||
      document.getElementById('m-date')?.value ||
      document.getElementById('lp-date')?.value ||
      document.getElementById('q-date')?.value;

    if (bdate) {
      const sIdx = calcSunSignFromDate(bdate);
      const lp = calcLifePathNumber(bdate);
      const arcana = calcMatrixArcana(bdate);

      const sunText = sIdx !== null ? `${SIGNS_GLYPH[sIdx]} برج ${SIGNS_AR[sIdx]}` : 'أدخل تاريخ الميلاد';
      const lpText = lp ? `مسار الحياة ${lp}` : '—';
      const arcanaText = arcana ? (ARCANA_NAMES_AR[arcana] || `أركانا ${arcana}`) : '—';

      if (sunNode) sunNode.textContent = sunText;
      if (lpNode) lpNode.textContent = lpText;
      if (matrixNode) matrixNode.textContent = arcanaText;

      if (homeSunNode) homeSunNode.textContent = sunText;
      if (homeLpNode) homeLpNode.textContent = lpText;
      if (homeMatrixNode) homeMatrixNode.textContent = arcanaText;
      if (homeStatusNode) {
        const displayName = profile?.name ? `لـ ${profile.name} · ` : '';
        homeStatusNode.textContent = `البصمة الفلكية والرقمية المحسوبة ${displayName}لتاريخ الميلاد (${bdate}).`;
      }
    } else {
      if (sunNode) sunNode.textContent = 'أكمل تاريخ ميلادك';
      if (lpNode) lpNode.textContent = 'يحسب تلقائيًا';
      if (matrixNode) matrixNode.textContent = 'يحسب تلقائيًا';
    }

    if (savedCountNode) {
      savedCountNode.textContent = `${getSavedReadings().length} قراءة محفوظة`;
    }
  }

  function renderHomePersonalInsights() {
    const homeBox = document.getElementById('aq-home-personal-insights');
    if (!homeBox) return;

    const all = getSavedReadings();
    if (all.length === 0) {
      homeBox.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
          <div>
            <strong style="display:block;font-family:var(--font-display);font-size:1.25rem;color:var(--ink-brown);margin-bottom:6px;">أرشيفك الفلكي الشخصي جاهز للحفظ</strong>
            <p style="margin:0;color:var(--muted-text);font-size:0.92rem;line-height:1.75;max-width:60ch;">عند حساب خريطة ميلادك، مصفوفة القدر، مسار الحياة، أو التوافق، اضغط على زر «حفظ في مكتبتي» لتظهر قراءاتك المحفوظة هنا للرجوع إليها في أي وقت.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="#chart" class="aq-section-pill">احسب خريطة الميلاد</a>
            <a href="#matrix" class="aq-section-pill">مصفوفة القدر</a>
            <a href="#lifepath" class="aq-section-pill">مسار الحياة</a>
          </div>
        </div>
      `;
      return;
    }

    const recent = all.slice(0, 3);
    homeBox.innerHTML = `
      <div class="aq-lib-grid">
        ${recent.map(item => `
          <article class="aq-lib-card">
            <div>
              <div class="aq-lib-card-top">
                <span class="aq-lib-type-tag">${String(item.typeLabel || 'قراءة').replace(/[<>]/g, '')}</span>
                <span class="aq-lib-date">${formatDateShort(item.createdAt)}</span>
              </div>
              <h4 class="aq-lib-card-title">${String(item.title || '').replace(/[<>]/g, '')}</h4>
              <p class="aq-lib-card-sub">${String(item.subtitle || '').replace(/[<>]/g, '')}</p>
            </div>
            <div class="aq-lib-card-actions">
              <button type="button" class="aq-lib-open-btn" data-home-open-id="${item.id}">فتح واستعادة القراءة</button>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    homeBox.querySelectorAll('[data-home-open-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-home-open-id');
        const target = all.find(r => r.id === id);
        if (target) restoreSavedReading(target);
      });
    });
  }

  function renderPersonalLibrary() {
    const grid = document.getElementById('aq-lib-grid');
    updateCosmicIdentitySummary();
    renderHomePersonalInsights();
    if (!grid) return;

    const all = getSavedReadings();
    const filtered = all.filter(item => {
      const matchType = currentFilter === 'all' || item.type === currentFilter;
      const q = currentSearch.trim().toLowerCase();
      const matchSearch = !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.typeLabel && item.typeLabel.toLowerCase().includes(q));
      return matchType && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 20px; border-radius: 16px; border: 1px dashed rgba(198, 165, 107, 0.45); background: #FAF7F0;">
          <strong style="display: block; color: var(--ink-brown); font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">
            ${all.length === 0 ? 'مكتبتك الشخصية جاهزة لحفظ قراءاتك' : 'لا توجد قراءات مطابقة لبحثك الحالي'}
          </strong>
          <p style="margin: 0 auto 16px; max-width: 460px; font-size: 0.88rem; color: var(--muted-text); line-height: 1.75;">
            ${all.length === 0
              ? 'احسب خريطة ميلادك، مصفوفة القدر، مسار الحياة، التوافق، أو اسحب قراءة تاروت واضغط «حفظ في مكتبتي» للرجوع إليها في أي وقت.'
              : 'جرّب تغيير كلمة البحث أو اختيار تصنيف آخر لعرض قراءاتك المحفوظة.'}
          </p>
          <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
            <a href="#chart" class="aq-section-pill">حساب خريطة الميلاد</a>
            <a href="#matrix" class="aq-section-pill">مصفوفة القدر</a>
            <a href="#lifepath" class="aq-section-pill">مسار الحياة</a>
            <a href="#tarot-chamber" class="aq-section-pill">محراب التاروت</a>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'aq-lib-card';
      card.innerHTML = `
        <div>
          <div class="aq-lib-card-top">
            <span class="aq-lib-type-tag">${item.typeLabel || 'قراءة'}</span>
            <span class="aq-lib-date">${formatDateShort(item.createdAt)}</span>
          </div>
          <h4 class="aq-lib-card-title">${String(item.title || '').replace(/[<>]/g, '')}</h4>
          <p class="aq-lib-card-sub">${String(item.subtitle || '').replace(/[<>]/g, '')}</p>
        </div>
        <div class="aq-lib-card-actions">
          <button type="button" class="aq-lib-open-btn" data-open-id="${item.id}">فتح واستعادة القراءة</button>
          <button type="button" class="aq-lib-del-btn" data-del-id="${item.id}" title="حذف القراءة" aria-label="حذف القراءة">حذف</button>
        </div>
      `;

      const openBtn = card.querySelector('[data-open-id]');
      if (openBtn) {
        openBtn.addEventListener('click', () => restoreSavedReading(item));
      }

      const delBtn = card.querySelector('[data-del-id]');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (delBtn.dataset.confirming === 'true') {
            deleteReading(item.id);
          } else {
            delBtn.dataset.confirming = 'true';
            delBtn.textContent = 'تأكيد الحذف؟';
            setTimeout(() => {
              if (delBtn.isConnected) {
                delBtn.dataset.confirming = 'false';
                delBtn.textContent = 'حذف';
              }
            }, 3000);
          }
        });
      }

      grid.appendChild(card);
    });
  }

  function initAccountDashboardAndLibrary() {
    const acctShell = document.querySelector('#account .acct-card-shell');
    if (!acctShell || document.getElementById('aq-personal-observatory-hub')) return;

    const hub = document.createElement('div');
    hub.id = 'aq-personal-observatory-hub';
    hub.className = 'aq-dashboard-grid';
    hub.innerHTML = `
      <!-- Cosmic Identity Summary Strip -->
      <div class="aq-identity-summary" aria-label="ملخص البصمة الفلكية والرقمية">
        <div class="aq-id-metric">
          <span class="aq-id-metric-label">البرج الشمسي</span>
          <strong class="aq-id-metric-val" id="aq-id-sun">أكمل تاريخ ميلادك</strong>
        </div>
        <div class="aq-id-metric">
          <span class="aq-id-metric-label">رقم مسار الحياة</span>
          <strong class="aq-id-metric-val" id="aq-id-lp">يحسب تلقائيًا</strong>
        </div>
        <div class="aq-id-metric">
          <span class="aq-id-metric-label">أركانا مصفوفة القدر</span>
          <strong class="aq-id-metric-val" id="aq-id-matrix">يحسب تلقائيًا</strong>
        </div>
        <div class="aq-id-metric">
          <span class="aq-id-metric-label">الأرشيف الشخصي</span>
          <strong class="aq-id-metric-val" id="aq-id-saved-count">0 قراءة محفوظة</strong>
        </div>
      </div>

      <!-- Quick Launch Observatory Shortcuts -->
      <div class="aq-dash-shortcuts" aria-label="الوصول السريع للأدوات">
        <a href="#chart" class="aq-dash-shortcut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>
          <span>خريطة الميلاد</span>
        </a>
        <a href="#lifepath" class="aq-dash-shortcut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19l16-14M4 5h6v6M14 13h6v6"/></svg>
          <span>مسار الحياة</span>
        </a>
        <a href="#matrix" class="aq-dash-shortcut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 22 12 12 22 2 12"/><rect x="6" y="6" width="12" height="12"/></svg>
          <span>مصفوفة القدر</span>
        </a>
        <a href="#compat" class="aq-dash-shortcut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>
          <span>التوافق والعلاقات</span>
        </a>
        <a href="#tarot-chamber" class="aq-dash-shortcut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 8l2 4-2 4-2-4z"/></svg>
          <span>محراب التاروت</span>
        </a>
      </div>

      <!-- Personal Library Panel -->
      <div class="aq-library-panel">
        <div class="aq-library-header">
          <h3 class="aq-library-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="color: var(--aq-accent-gold);"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>مكتبة قراءاتي وتقاريري المحفوظة</span>
          </h3>
          <span style="font-size: 0.78rem; color: var(--aq-text-muted);">تحفظ تلقائيًا وتستعاد بضغطة واحدة</span>
        </div>

        <div class="aq-library-controls">
          <input
            type="search"
            id="aq-lib-search"
            class="aq-lib-search"
            placeholder="ابحث في قراءاتك المحفوظة (الاسم، التاريخ، نوع القراءة)..."
            aria-label="ابحث في قراءاتك المحفوظة"
          />
          <div class="aq-lib-filters" role="tablist" aria-label="تصفية القراءات المحفوظة">
            <button type="button" class="aq-lib-filter-btn active" data-lib-filter="all">الكل</button>
            <button type="button" class="aq-lib-filter-btn" data-lib-filter="natal">خريطة الميلاد</button>
            <button type="button" class="aq-lib-filter-btn" data-lib-filter="matrix">مصفوفة القدر</button>
            <button type="button" class="aq-lib-filter-btn" data-lib-filter="lifepath">مسار الحياة</button>
            <button type="button" class="aq-lib-filter-btn" data-lib-filter="compat">التوافق</button>
            <button type="button" class="aq-lib-filter-btn" data-lib-filter="tarot">التاروت</button>
          </div>
        </div>

        <div class="aq-lib-grid" id="aq-lib-grid"></div>
      </div>
    `;

    acctShell.appendChild(hub);

    const searchInput = document.getElementById('aq-lib-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        renderPersonalLibrary();
      });
    }

    hub.querySelectorAll('[data-lib-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-lib-filter') || 'all';
        hub.querySelectorAll('[data-lib-filter]').forEach(b => b.classList.toggle('active', b === btn));
        renderPersonalLibrary();
      });
    });

    renderPersonalLibrary();
    updateSavedCounterBadges();

    document.addEventListener('change', (e) => {
      if (e.target && e.target.id && e.target.id.startsWith('prof-')) {
        updateCosmicIdentitySummary();
      }
    });
  }

  // =========================================================================
  // 6. AUTO-FILL FROM PROFILE & SAVE-TO-LIBRARY ON CALCULATOR RESULTS
  // =========================================================================
  function injectFormAutoFillBars() {
    const formsConfig = [
      {
        formId: 'cform',
        onFill: (prof) => {
          const nameEl = document.getElementById('f-name');
          const dateEl = document.getElementById('f-date');
          const timeEl = document.getElementById('f-time');
          const noTimeEl = document.getElementById('f-unknown');
          if (nameEl && prof.name) nameEl.value = prof.name;
          if (dateEl && prof.date) {
            dateEl.value = prof.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (noTimeEl && typeof prof.noTime === 'boolean') {
            noTimeEl.checked = prof.noTime;
            noTimeEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (timeEl && prof.time) {
            timeEl.value = prof.time;
            timeEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          showToast('تم ملء بيانات الميلاد من ملفك الشخصي');
        }
      },
      {
        formId: 'mform',
        onFill: (prof) => {
          const nameEl = document.getElementById('m-name');
          const dateEl = document.getElementById('m-date');
          if (nameEl && prof.name) nameEl.value = prof.name;
          if (dateEl && prof.date) {
            dateEl.value = prof.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          showToast('تم ملء بيانات الميلاد من ملفك الشخصي');
        }
      },
      {
        formId: 'lpform',
        onFill: (prof) => {
          const nameEl = document.getElementById('lp-name');
          const dateEl = document.getElementById('lp-date');
          if (nameEl && prof.name) nameEl.value = prof.name;
          if (dateEl && prof.date) {
            dateEl.value = prof.date;
            dateEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          showToast('تم ملء بيانات الميلاد من ملفك الشخصي');
        }
      }
    ];

    formsConfig.forEach(cfg => {
      const form = document.getElementById(cfg.formId);
      if (!form || form.querySelector('.aq-autofill-bar')) return;

      const bar = document.createElement('div');
      bar.className = 'aq-autofill-bar';
      bar.innerHTML = `
        <span>استخدام بيانات الميلاد المحفوظة في ملفك الشخصي</span>
        <button type="button" class="aq-autofill-btn">تعبئة تلقائية من حسابي</button>
      `;

      const btn = bar.querySelector('button');
      btn.addEventListener('click', () => {
        const prof = getProfileBirthData();
        if (prof && prof.date) {
          cfg.onFill(prof);
        } else {
          showToast('احفظ تاريخ ميلادك أولاً في قسم «حسابي» أو أدخله هنا وسيتم تذكّره تلقائيًا');
        }
      });

      form.insertBefore(bar, form.firstChild);
    });
  }

  function attachFormCachingAndSaveBars() {
    // 1. Natal Chart
    const chartForm = document.getElementById('cform');
    if (chartForm) {
      chartForm.addEventListener('submit', () => {
        const name = document.getElementById('f-name')?.value?.trim() || '';
        const date = document.getElementById('f-date')?.value || '';
        const time = document.getElementById('f-time')?.value || '12:00';
        const noTime = Boolean(document.getElementById('f-unknown')?.checked);
        if (date) {
          try {
            localStorage.setItem(STORAGE_KEY_PROFILE_CACHE, JSON.stringify({ name, date, time, noTime }));
          } catch (_) {}
          updateCosmicIdentitySummary();
        }
      });
    }

    // Inject Save Bar + 20-Dimension Chapter Filter when Natal Chart is rendered
    const onNatalRendered = (e) => {
      const resultEl = document.getElementById('result');
      if (!resultEl) return;

      // Ensure Recharts resizes when #tb-charts tab is clicked
      const tabCharts = document.getElementById('tb-charts') || document.getElementById('tab-charts');
      if (tabCharts && !tabCharts.__aqResizeBound) {
        tabCharts.__aqResizeBound = true;
        tabCharts.addEventListener('click', () => {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            if (window.renderPlanetDistribution && window.__lastNatalChart) {
              const rootEl = document.getElementById('planet-distribution-container') || document.getElementById('aq-planet-distribution-root');
              if (rootEl) window.renderPlanetDistribution(rootEl, window.__lastNatalChart);
            }
          }, 60);
        });
      }

      if (resultEl.querySelector('.aq-reading-action-bar')) return;

      const raw = e?.detail || window.AqeeqChartContext?.getNatal?.() || window.__lastNatalChart;
      const chart = raw?.ch && Array.isArray(raw.ch.bodies) ? raw.ch : raw;
      const name = document.getElementById('f-name')?.value?.trim() || 'خريطتي الفلكية';
      const date = document.getElementById('f-date')?.value || '';
      const time = document.getElementById('f-time')?.value || '';
      const noTime = Boolean(document.getElementById('f-unknown')?.checked);
      const sunBody = chart?.bodies?.find(b => (b.key || b.id || '').toLowerCase() === 'sun');
      const moonBody = chart?.bodies?.find(b => (b.key || b.id || '').toLowerCase() === 'moon');
      const subtitle = [
        date,
        sunBody ? `الشمس في ${SIGNS_AR[sunBody.sign]}` : '',
        moonBody ? `القمر في ${SIGNS_AR[moonBody.sign]}` : ''
      ].filter(Boolean).join(' · ');

      const bar = document.createElement('div');
      bar.className = 'aq-reading-action-bar animate-lux-card delay-100 transition-all duration-500 ease-out hover:border-[#BDA16A]/35';
      bar.innerHTML = `
        <div class="aq-reading-meta">
          <span class="aq-reading-badge">التقرير الفلكي الكامل</span>
          <strong style="color: var(--ink-brown); font-size: 0.9rem;">${name.replace(/[<>]/g, '')}</strong>
          <span style="color: var(--muted-text); font-size: 0.8rem;">${subtitle}</span>
        </div>
        <div class="aq-reading-actions">
          <button type="button" class="aq-save-reading-btn transition-all duration-300 hover:-translate-y-0.5" id="aq-save-natal-btn">
            <span>حفظ الخريطة في مكتبتي</span>
          </button>
        </div>
      `;

      const saveBtn = bar.querySelector('#aq-save-natal-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          saveReading({
            type: 'natal',
            typeLabel: 'خريطة الميلاد الفلكية',
            title: name,
            subtitle: subtitle || date,
            route: '#chart',
            inputs: { name, date, time, noTime }
          });
          saveBtn.classList.add('is-saved');
          saveBtn.innerHTML = '<span>محفوظة في مكتبتك</span>';
        });
      }

      const summaryCard = resultEl.querySelector('.chart-summary-card');
      if (summaryCard && summaryCard.nextSibling) {
        resultEl.insertBefore(bar, summaryCard.nextSibling);
      } else {
        resultEl.insertBefore(bar, resultEl.firstChild);
      }

      // Inject Chapter Filter inside #tp1 / #tp-natal
      const tpNatal = document.getElementById('tp1') || document.getElementById('tp-natal');
      if (tpNatal && !tpNatal.querySelector('.aq-chapter-nav')) {
        const nav = document.createElement('div');
        nav.className = 'aq-chapter-nav animate-lux-card delay-150';
        nav.setAttribute('role', 'region');
        nav.setAttribute('aria-label', 'تصفية فصول الخريطة الفلكية');
        nav.innerHTML = `
          <button type="button" class="aq-chapter-chip active transition-all duration-300" data-ch-filter="all">جميع الكواكب والنقاط</button>
          <button type="button" class="aq-chapter-chip transition-all duration-300" data-ch-filter="big3">الثالوث الأساسي (الطالع · الشمس · القمر)</button>
          <button type="button" class="aq-chapter-chip transition-all duration-300" data-ch-filter="personal">الكواكب الشخصية (عطارد · الزهرة · المريخ)</button>
          <button type="button" class="aq-chapter-chip transition-all duration-300" data-ch-filter="social">الكواكب الاجتماعية والكونية</button>
          <button type="button" class="aq-chapter-chip transition-all duration-300" data-ch-filter="karmic">العقد القمرية والكارما</button>
        `;

        nav.querySelectorAll('[data-ch-filter]').forEach(chip => {
          chip.addEventListener('click', () => {
            const cat = chip.getAttribute('data-ch-filter') || 'all';
            nav.querySelectorAll('[data-ch-filter]').forEach(c => c.classList.toggle('active', c === chip));
            const articles = Array.from(tpNatal.querySelectorAll('article.rd'));
            let visibleIndex = 0;
            articles.forEach((art, idx) => {
              const num = idx + 1;
              if (cat === 'all') {
                art.hidden = false;
              } else if (cat === 'big3') {
                art.hidden = !(num >= 1 && num <= 3);
              } else if (cat === 'personal') {
                art.hidden = !(num >= 4 && num <= 6);
              } else if (cat === 'social') {
                art.hidden = !(num >= 7 && num <= 11);
              } else if (cat === 'karmic') {
                art.hidden = !(num >= 12);
              }
              if (!art.hidden) {
                art.classList.remove('animate-lux-card');
                void art.offsetWidth;
                art.style.animationDelay = `${Math.min(visibleIndex * 55, 280)}ms`;
                art.classList.add('animate-lux-card');
                visibleIndex++;
              }
            });
          });
        });

        const firstReading = tpNatal.querySelector('article.rd');
        if (firstReading) {
          tpNatal.insertBefore(nav, firstReading);
        }
      }
    };

    window.addEventListener('aqeeq:chart-rendered', onNatalRendered);

    // 2. Observe Matrix of Destiny (#mresult), Life Path (#lpresult), and Synastry (#cp-out, #syn-result)
    const observeTargets = [
      {
        id: 'mresult',
        type: 'matrix',
        typeLabel: 'مصفوفة القدر (٢٢ أركانا)',
        route: '#matrix',
        getMeta: () => {
          const name = document.getElementById('m-name')?.value?.trim() || 'مصفوفة القدر';
          const date = document.getElementById('m-date')?.value || '';
          const arc = calcMatrixArcana(date);
          return {
            title: name,
            subtitle: [date, arc ? (ARCANA_NAMES_AR[arc] || `أركانا ${arc}`) : ''].filter(Boolean).join(' · '),
            inputs: { name, date }
          };
        }
      },
      {
        id: 'lpresult',
        type: 'lifepath',
        typeLabel: 'مسار الحياة والأرقام',
        route: '#lifepath',
        getMeta: () => {
          const name = document.getElementById('lp-name')?.value?.trim() || 'قراءة مسار الحياة';
          const date = document.getElementById('lp-date')?.value || '';
          const lp = calcLifePathNumber(date);
          return {
            title: name,
            subtitle: [date, lp ? `مسار الحياة رقم ${lp}` : ''].filter(Boolean).join(' · '),
            inputs: { name, date }
          };
        }
      },
      {
        id: 'cp-out',
        type: 'compat',
        typeLabel: 'توافق الخرائط الفلكية (Synastry)',
        route: '#compat',
        getMeta: () => {
          const n1 = document.getElementById('cp1_name')?.value?.trim() || 'الشخص الأول';
          const n2 = document.getElementById('cp2_name')?.value?.trim() || 'الشخص الثاني';
          return {
            title: `${n1} + ${n2}`,
            subtitle: 'مقارنة الاتصالات الكوكبية والخريطة المركّبة',
            inputs: null
          };
        }
      },
      {
        id: 'syn-result',
        type: 'compat',
        typeLabel: 'شفرة العلاقات ومسار الحياة',
        route: '#life-path-synastry',
        getMeta: () => {
          const n1 = document.getElementById('syn-name-a')?.value?.trim() || 'الطرف الأول';
          const d1 = document.getElementById('syn-date-a')?.value || '';
          const n2 = document.getElementById('syn-name-b')?.value?.trim() || 'الطرف الثاني';
          const d2 = document.getElementById('syn-date-b')?.value || '';
          return {
            title: `${n1} + ${n2}`,
            subtitle: [d1, d2].filter(Boolean).join(' × '),
            inputs: { name1: n1, date1: d1, name2: n2, date2: d2 }
          };
        }
      }
    ];

    observeTargets.forEach(cfg => {
      const container = document.getElementById(cfg.id);
      if (!container) return;

      const observer = new MutationObserver(() => {
        if (container.hidden || !container.innerHTML.trim()) return;
        if (container.querySelector('.aq-reading-action-bar')) return;

        const meta = cfg.getMeta();
        if (meta.inputs?.date) {
          try {
            localStorage.setItem(STORAGE_KEY_PROFILE_CACHE, JSON.stringify({
              name: meta.inputs.name || '',
              date: meta.inputs.date,
              time: '12:00',
              noTime: true
            }));
          } catch (_) {}
          updateCosmicIdentitySummary();
        }

        const bar = document.createElement('div');
        bar.className = 'aq-reading-action-bar';
        bar.innerHTML = `
          <div class="aq-reading-meta">
            <span class="aq-reading-badge">${cfg.typeLabel}</span>
            <strong style="color: var(--ink-brown); font-size: 0.9rem;">${String(meta.title).replace(/[<>]/g, '')}</strong>
            <span style="color: var(--muted-text); font-size: 0.8rem;">${String(meta.subtitle).replace(/[<>]/g, '')}</span>
          </div>
          <div class="aq-reading-actions">
            <button type="button" class="aq-save-reading-btn">
              <span>حفظ التقرير في مكتبتي</span>
            </button>
          </div>
        `;

        const btn = bar.querySelector('.aq-save-reading-btn');
        btn.addEventListener('click', () => {
          const freshMeta = cfg.getMeta();
          saveReading({
            type: cfg.type,
            typeLabel: cfg.typeLabel,
            title: freshMeta.title,
            subtitle: freshMeta.subtitle,
            route: cfg.route,
            inputs: freshMeta.inputs
          });
          btn.classList.add('is-saved');
          btn.innerHTML = '<span>تم الحفظ في مكتبتك</span>';
        });

        container.insertBefore(bar, container.firstChild);
      });

      observer.observe(container, { childList: true, attributes: true, attributeFilter: ['hidden'] });
    });
  }

  // =========================================================================
  // 7. HOME PILLAR CATEGORY FILTER & ACTIVE ROUTE HIGHLIGHTING
  // =========================================================================
  function initHomePillarFilter() {
    const filterButtons = document.querySelectorAll('[data-pillar-filter]');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-pillar-filter') || 'all';
        filterButtons.forEach(b => b.classList.toggle('active', b === btn));

        document.querySelectorAll('.home .grp').forEach(grp => {
          if (grp.classList.contains('hidden-feature')) return;
          const grpId = grp.id;
          const isMatch =
            cat === 'all' ||
            (cat === 'discover' && grpId === 'cat-discover') ||
            (cat === 'relations' && grpId === 'cat-relations') ||
            (cat === 'tarot' && grpId === 'cat-tarot') ||
            (cat === 'account' && grpId === 'cat-account') ||
            (cat === 'forecast' && (grpId === 'cat-account' || grpId === 'cat-forecast'));
          grp.hidden = !isMatch;
          grp.classList.toggle('aq-grp-hidden', !isMatch);
        });
      });
    });
  }

  function syncActiveNavLinks() {
    const hash = location.hash || '#home';
    document.querySelectorAll('.tnav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('aq-nav-active', href === hash);
    });
    document.querySelectorAll('.bnav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('on', href === hash);
    });
  }

  // =========================================================================
  // 8. LANGUAGE & DIRECTION SWITCHER (AR RTL / EN LTR)
  // =========================================================================
  function applyLanguageDirection(lang) {
    currentLang = lang === 'en' ? 'en' : 'ar';
    localStorage.setItem(STORAGE_KEY_LANG, currentLang);

    const html = document.documentElement;
    html.setAttribute('lang', currentLang);
    html.setAttribute('dir', currentLang === 'en' ? 'ltr' : 'rtl');

    const langBtn = document.getElementById('aq-lang-toggle');
    if (langBtn) {
      langBtn.textContent = currentLang === 'en' ? 'عربي · RTL' : 'EN · LTR';
      langBtn.setAttribute('title', currentLang === 'en' ? 'التبديل إلى العربية' : 'Switch interface direction to English LTR');
    }

    document.querySelectorAll('[data-i18n-ar][data-i18n-en]').forEach(el => {
      el.textContent = currentLang === 'en'
        ? el.getAttribute('data-i18n-en')
        : el.getAttribute('data-i18n-ar');
    });
  }

  function initLanguageSwitcher() {
    const langBtn = document.getElementById('aq-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        applyLanguageDirection(currentLang === 'ar' ? 'en' : 'ar');
      });
    }
    if (currentLang === 'en') {
      applyLanguageDirection('en');
    }
  }

  // =========================================================================
  // INITIALIZE PLATFORM
  // =========================================================================
  function init() {
    updateObservatoryRibbon();
    initAccountDashboardAndLibrary();
    updateCosmicIdentitySummary();
    renderHomePersonalInsights();
    injectFormAutoFillBars();
    attachFormCachingAndSaveBars();
    initHomePillarFilter();
    initLanguageSwitcher();
    syncActiveNavLinks();
    updateSavedCounterBadges();

    const qDate = document.getElementById('q-date');
    if (qDate) {
      qDate.addEventListener('change', () => {
        updateCosmicIdentitySummary();
      });
    }
    const qForm = document.getElementById('qform');
    if (qForm) {
      qForm.addEventListener('submit', () => {
        const dateVal = document.getElementById('q-date')?.value;
        if (dateVal) {
          try {
            const existing = getProfileBirthData() || {};
            localStorage.setItem(STORAGE_KEY_PROFILE_CACHE, JSON.stringify({
              ...existing,
              date: dateVal
            }));
          } catch (_) {}
        }
        setTimeout(updateCosmicIdentitySummary, 50);
      });
    }

    window.addEventListener('hashchange', () => {
      syncActiveNavLinks();
      if (location.hash === '#account' || location.hash === '#home' || !location.hash) {
        renderPersonalLibrary();
      }
    });
  }

  window.AqeeqPlatform = {
    saveReading,
    deleteReading,
    getSavedReadings,
    restoreSavedReading,
    showToast,
    applyLanguageDirection,
    syncProfileToPlatform: () => {
      updateCosmicIdentitySummary();
      renderHomePersonalInsights();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
