/**
 * محراب ومختبر القراءات التعليمي (Tarot Reader Workbench / Studio)
 * منصة عقيق أسترو (Aqeeq Astro)
 */

(() => {
  'use strict';

  // Spread Templates with preset position roles
  const SPREAD_TEMPLATES = {
    'three-time': {
      title: 'مثلث الزمن (3 بطاقات)',
      count: 3,
      roles: [
        '1. الماضي والنشأة (Past & Roots)',
        '2. الحاضر والواقع الراهن (Present Reality)',
        '3. المستقبل المحتمل والاتجاه (Emerging Future)'
      ]
    },
    'three-guide': {
      title: 'ثالوث التوجيه والاستبصار (3 بطاقات)',
      count: 3,
      roles: [
        '1. الموقف والجوهر (The Core Situation)',
        '2. العقبة والتحدي الخفي (The Obstacle / Block)',
        '3. الإرشاد والحل المقترح (Guidance & Action)'
      ]
    },
    'five-cross': {
      title: 'صليب التحول السريع (5 بطاقات)',
      count: 5,
      roles: [
        '1. الجوهر والمحور المركزي (Core Theme)',
        '2. التحدي والعائق المعاكس (Crossing Challenge)',
        '3. الماضي والأساس غير المرئي (Underlying Root)',
        '4. المستقبل القريب والفرص (Next Phase)',
        '5. النتيجة والرسالة الحكيمة (Outcome & Wisdom)'
      ]
    },
    'seven-horseshoe': {
      title: 'حدوة الحصان الاستبصارية (7 بطاقات)',
      count: 7,
      roles: [
        '1. الماضي والمؤثرات السابقة (Past Influences)',
        '2. الواقع الحاضر (Present State)',
        '3. التأثيرات والدوافع الخفية (Hidden Motives)',
        '4. العائق أو الامتحان الروحي (The Hurdle / Test)',
        '5. بيئة المحيطين وطاقتهم (Surroundings & People)',
        '6. مسار العمل الأفضل (Optimal Course of Action)',
        '7. المآل والنتيجة النهائية (Culmination / Outcome)'
      ]
    },
    'nine-matrix': {
      title: 'المصفوفة الاستراتيجية 3×3 (9 بطاقات)',
      count: 9,
      roles: [
        '1. الجذور: الوعي الباطن والرغبة الدفينة (Unconscious Root)',
        '2. الجذور: الأنماط المتوارثة والكارما (Karmic Pattern)',
        '3. الجذور: الموارد والقوة الأساسية (Core Resource)',
        '4. الواقع: التحدي والتوتر الراهن (Current Tension)',
        '5. الواقع: القلب والمركز الآن (Heart of the Matter)',
        '6. الواقع: القوى الخارجية المؤثرة (External Dynamics)',
        '7. المآل: الاتجاه العاطفي والنفسي (Emotional Trajectory)',
        '8. المآل: التجسيد المادي والعملي (Practical Manifestation)',
        '9. المآل: الخلاصة والتحول الأسمى (Final Evolution)'
      ]
    },
    'custom': {
      title: 'فرشة حرة مخصصة',
      count: 4,
      roles: []
    }
  };

  // Major Arcana Elemental Assignments (Hermetic Golden Dawn)
  const MAJOR_ELEMENTS = {
    0: 'هواء', 1: 'هواء', 2: 'ماء', 3: 'تراب', 4: 'نار',
    5: 'تراب', 6: 'هواء', 7: 'ماء', 8: 'نار', 9: 'تراب',
    10: 'نار', 11: 'هواء', 12: 'ماء', 13: 'ماء', 14: 'نار',
    15: 'تراب', 16: 'نار', 17: 'هواء', 18: 'ماء', 19: 'نار',
    20: 'نار', 21: 'تراب'
  };

  function getCardElementCategory(card) {
    if (!card) return 'نار';
    if (card.category === 'major') {
      return MAJOR_ELEMENTS[card.number] || 'نار';
    }
    if (card.suit === 'wands') return 'نار';
    if (card.suit === 'cups') return 'ماء';
    if (card.suit === 'swords') return 'هواء';
    if (card.suit === 'pentacles') return 'تراب';
    if (card.element && card.element.includes('نار')) return 'نار';
    if (card.element && card.element.includes('ماء')) return 'ماء';
    if (card.element && card.element.includes('هواء')) return 'هواء';
    if (card.element && card.element.includes('تراب')) return 'تراب';
    return 'نار';
  }

  function getCardGlyph(card) {
    if (!card) return '✦';
    if (card.category === 'major') {
      const glyphs = ['🃏','🧙‍♂️','🔮','👑','🏛️','📜','💞','🛡️','🦁','🕯️','🎡','⚖️','🧗','🌊','🕊️','⛓️','⚡','⭐','🌙','☀️','🎺','🌍'];
      return glyphs[card.number] || '✦';
    }
    if (card.suit === 'wands') return '🪵';
    if (card.suit === 'cups') return '💧';
    if (card.suit === 'swords') return '⚔️';
    if (card.suit === 'pentacles') return '🪙';
    return '✦';
  }

  function getElementClass(el) {
    if (!el) return '';
    if (el.includes('نار')) return 'fire';
    if (el.includes('ماء')) return 'water';
    if (el.includes('هواء')) return 'air';
    if (el.includes('تراب')) return 'earth';
    return '';
  }

  // State
  let tarotDeck = [];
  // Parse slot role into Arabic title and LTR English subtitle
  function parseSlotRole(role, defaultIdx = 0) {
    if (!role || typeof role !== 'string') {
      return { ar: `الموضع ${defaultIdx + 1}`, en: '' };
    }
    const trimmed = role.trim();
    const parenMatch = trimmed.match(/^(.*?)\s*\((.*?)\)$/);
    if (parenMatch) {
      const candidateEn = parenMatch[2].trim();
      if (/[a-zA-Z]/.test(candidateEn)) {
        return {
          ar: parenMatch[1].trim(),
          en: candidateEn
        };
      }
    }
    return {
      ar: trimmed,
      en: ''
    };
  }

  let spreadState = {
    readingType: 'motives',
    templateKey: 'three-time',
    slots: []
  };

  // DOM Elements
  const readingTypeSelect = document.getElementById('workbenchReadingType');
  const spreadTypeSelect = document.getElementById('workbenchSpreadType');
  const customCountGroup = document.getElementById('customCountGroup');
  const customCountInput = document.getElementById('workbenchCustomCount');
  const buildSpreadBtn = document.getElementById('buildSpreadBtn');
  const resetWorkbenchBtn = document.getElementById('resetWorkbenchBtn');
  const slotsGrid = document.getElementById('workbenchSlotsGrid');
  const currentSpreadNameDisplay = document.getElementById('currentSpreadNameDisplay');
  const currentReadingTypeDisplay = document.getElementById('currentReadingTypeDisplay');
  const generateSynthesisBtn = document.getElementById('generateSynthesisBtn');
  const synthesisPanel = document.getElementById('workbenchSynthesisPanel');
  const synthesisCardsCountTag = document.getElementById('synthesisCardsCountTag');
  const fireMeterFill = document.getElementById('fireMeterFill');
  const firePctText = document.getElementById('firePctText');
  const waterMeterFill = document.getElementById('waterMeterFill');
  const waterPctText = document.getElementById('waterPctText');
  const airMeterFill = document.getElementById('airMeterFill');
  const airPctText = document.getElementById('airPctText');
  const earthMeterFill = document.getElementById('earthMeterFill');
  const earthPctText = document.getElementById('earthPctText');
  const elementalInterpretationText = document.getElementById('elementalInterpretationText');
  const majorGaugeSeg = document.getElementById('majorGaugeSeg');
  const minorGaugeSeg = document.getElementById('minorGaugeSeg');
  const majorCountLabel = document.getElementById('majorCountLabel');
  const minorCountLabel = document.getElementById('minorCountLabel');
  const arcanaRatioInterpretation = document.getElementById('arcanaRatioInterpretation');
  const synthesisNarrativeBody = document.getElementById('synthesisNarrativeBody');
  const synthesisTimelineSteps = document.getElementById('synthesisTimelineSteps');
  const synthesisInquiryQuestion = document.getElementById('synthesisInquiryQuestion');
  const copySynthesisReportBtn = document.getElementById('copySynthesisReportBtn');
  const printSynthesisReportBtn = document.getElementById('printSynthesisReportBtn');
  const collapseSynthesisBtn = document.getElementById('collapseSynthesisBtn');

  function initWorkbench(deck) {
    if (Array.isArray(deck) && deck.length > 0) {
      tarotDeck = deck;
    } else if (window.AqeeqTarotDeck && window.AqeeqTarotDeck.length > 0) {
      tarotDeck = window.AqeeqTarotDeck;
    }

    setupEventListeners();
    buildSpreadWorkbench('three-time', 'psychology', 3);
  }

  function setupEventListeners() {
    if (spreadTypeSelect) {
      spreadTypeSelect.addEventListener('change', () => {
        if (customCountGroup) {
          customCountGroup.style.display = spreadTypeSelect.value === 'custom' ? 'flex' : 'none';
        }
      });
    }

    if (buildSpreadBtn) {
      buildSpreadBtn.addEventListener('click', () => {
        const templateKey = spreadTypeSelect ? spreadTypeSelect.value : 'three-time';
        const readingType = readingTypeSelect ? readingTypeSelect.value : 'motives';
        let count = 3;
        if (templateKey === 'custom' && customCountInput) {
          count = parseInt(customCountInput.value, 10) || 4;
          if (count < 1) count = 1;
          if (count > 10) count = 10;
        }
        buildSpreadWorkbench(templateKey, readingType, count);
        showToast('تم تجهيز مساحة الفرشة بنجاح ✨');
      });
    }

    if (resetWorkbenchBtn) {
      resetWorkbenchBtn.addEventListener('click', () => {
        if (confirm('هل ترغب في إعادة ضبط مساحة الفرشة ومسح كافة البطاقات المسكنة؟')) {
          const templateKey = spreadTypeSelect ? spreadTypeSelect.value : 'three-time';
          const readingType = readingTypeSelect ? readingTypeSelect.value : 'psychology';
          let count = 3;
          if (templateKey === 'custom' && customCountInput) {
            count = parseInt(customCountInput.value, 10) || 4;
          }
          buildSpreadWorkbench(templateKey, readingType, count);
          if (synthesisPanel) synthesisPanel.classList.remove('active');
          showToast('تمت إعادة ضبط مساحة الفرشة ↺');
        }
      });
    }

    if (readingTypeSelect) {
      readingTypeSelect.addEventListener('change', () => {
        spreadState.readingType = readingTypeSelect.value;
        updateReadingTypeDisplay();
        renderSlotCards();
      });
    }

    if (generateSynthesisBtn) {
      generateSynthesisBtn.addEventListener('click', generateSynthesisAnalysis);
    }

    if (copySynthesisReportBtn) {
      copySynthesisReportBtn.addEventListener('click', copySynthesisReport);
    }

    if (printSynthesisReportBtn) {
      printSynthesisReportBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (collapseSynthesisBtn) {
      collapseSynthesisBtn.addEventListener('click', () => {
        if (synthesisPanel) {
          synthesisPanel.classList.remove('active');
          const anchor = document.getElementById('tarotWorkbench');
          if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function updateReadingTypeDisplay() {
    if (!currentReadingTypeDisplay) return;
    const labels = {
      love: 'قراءة عاطفية وشراكات وعلاقات ❤️',
      career: 'قراءة مهنية ومشاريع ومسار مالي 💼',
      psychology: 'قراءة عامة وتشريح نفسي وتحليل الظل 🧠'
    };
    currentReadingTypeDisplay.textContent = labels[spreadState.readingType] || 'قراءة عامة';
  }

  function buildSpreadWorkbench(templateKey, readingType, customCount) {
    spreadState.templateKey = templateKey;
    spreadState.readingType = readingType;
    const template = SPREAD_TEMPLATES[templateKey] || SPREAD_TEMPLATES['three-time'];

    let count = template.count;
    let roles = [...(template.roles || [])];

    if (templateKey === 'custom') {
      count = customCount || 4;
      roles = [];
      for (let i = 1; i <= count; i++) {
        roles.push(`الموضع ${i}: (حدد غرض الموضع)`);
      }
    }

    spreadState.slots = [];
    for (let i = 0; i < count; i++) {
      spreadState.slots.push({
        index: i,
        role: roles[i] || `الموضع ${i + 1}`,
        cardId: '',
        isReversed: false
      });
    }

    if (currentSpreadNameDisplay) {
      currentSpreadNameDisplay.textContent = templateKey === 'custom' ? `فرشة حرة مخصصة (${count} بطاقات)` : template.title;
    }
    updateReadingTypeDisplay();

    if (synthesisPanel) synthesisPanel.classList.remove('active');

    renderSlotCards();
  }

  function renderCardSelectOptions(selectedId) {
    if (!tarotDeck || tarotDeck.length === 0) {
      return '<option value="">جاري تحميل البطاقات...</option>';
    }

    const majors = tarotDeck.filter(c => c.category === 'major');
    const wands = tarotDeck.filter(c => c.suit === 'wands');
    const cups = tarotDeck.filter(c => c.suit === 'cups');
    const swords = tarotDeck.filter(c => c.suit === 'swords');
    const pentacles = tarotDeck.filter(c => c.suit === 'pentacles');

    const opt = (c) => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.name_ar} (${c.name_en})</option>`;

    return `
      <option value="">-- اختر أو ابحث عن البطاقة في هذا الموضع --</option>
      <optgroup label="الأركانا الكبرى (22 بطاقة)">
        ${majors.map(opt).join('')}
      </optgroup>
      <optgroup label="عائلة العصي - النار 🔥 (14 بطاقة)">
        ${wands.map(opt).join('')}
      </optgroup>
      <optgroup label="عائلة الكؤوس - الماء 💧 (14 بطاقة)">
        ${cups.map(opt).join('')}
      </optgroup>
      <optgroup label="عائلة السيوف - الهواء 💨 (14 بطاقة)">
        ${swords.map(opt).join('')}
      </optgroup>
      <optgroup label="عائلة العملات - التراب 🌿 (14 بطاقة)">
        ${pentacles.map(opt).join('')}
      </optgroup>
    `;
  }

  function cleanCardText(text) {
    if (!text) return '';
    return text
      .replace(/\\([#*_`\-[\]()!|.:+>])/g, '$1')
      .replace(/^#+\s.*$/gm, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  function extractSlotInsight(card, readingType, isReversed, role) {
    if (!card) return null;
    let insightLabel = '';
    let rawText = '';

    const type = readingType || 'motives';

    if (type === 'motives' || type === 'love') {
      insightLabel = isReversed
        ? '👁️ تنبيه الظل وتفكيك النوايا المعطلة'
        : '👁️ الدوافع الخفية والصدق مع الذات';

      if (isReversed) {
        rawText = (card.core_meaning && card.core_meaning.reversed) ? card.core_meaning.reversed : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.deep_psychology && card.deep_psychology.shadow) ? card.deep_psychology.shadow : '';
        }
        if (!rawText || rawText.length < 30) {
          rawText = (card.practical_domains && card.practical_domains.love_relationships) ? card.practical_domains.love_relationships : '';
        }
      } else {
        rawText = (card.deep_psychology && card.deep_psychology.shadow) ? card.deep_psychology.shadow : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.practical_domains && card.practical_domains.love_relationships) ? card.practical_domains.love_relationships : '';
        }
        if (!rawText || rawText.length < 30) {
          rawText = (card.deep_psychology && card.deep_psychology.text) ? card.deep_psychology.text : '';
        }
      }
    } else if (type === 'momentum' || type === 'career') {
      insightLabel = isReversed
        ? '🧭 كوابح المسار وعوائق الحركة والقرارات'
        : '🧭 اتجاه الحركة والقرارات الحاسمة';

      if (isReversed) {
        rawText = (card.core_meaning && card.core_meaning.reversed) ? card.core_meaning.reversed : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.practical_domains && card.practical_domains.career_projects) ? (card.practical_domains.career_projects + '\n\n' + (card.practical_domains.money_abundance || '')) : '';
        }
      } else {
        rawText = (card.practical_domains && card.practical_domains.career_projects) ? (card.practical_domains.career_projects + '\n\n' + (card.practical_domains.money_abundance || '')) : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.empowerment_action) ? card.empowerment_action : '';
        }
        if (!rawText || rawText.length < 30) {
          rawText = (card.core_meaning && card.core_meaning.upright) ? card.core_meaning.upright : '';
        }
      }
    } else { // psyche or psychology
      insightLabel = isReversed
        ? '🧠 التصدع النفسي واختبار الاتزان الداخلي'
        : '🧠 التشريح النفسي ومحور الاتزان';

      if (isReversed) {
        rawText = (card.core_meaning && card.core_meaning.reversed) ? card.core_meaning.reversed : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.practical_domains && card.practical_domains.health_psychosomatics) ? card.practical_domains.health_psychosomatics : '';
        }
      } else {
        rawText = (card.deep_psychology && card.deep_psychology.text) ? card.deep_psychology.text : '';
        if (!rawText || rawText.length < 30) {
          rawText = (card.core_meaning && card.core_meaning.overview) ? card.core_meaning.overview : '';
        }
      }
    }

    if (!rawText || rawText.length < 20) {
      rawText = card.core_concept || (card.core_meaning ? card.core_meaning.overview : '');
    }

    const cleaned = cleanCardText(rawText);
    const paras = cleaned.split('\n\n').map(p => p.trim()).filter(p => p.length > 10);
    const excerpt = paras.slice(0, 2).join('\n\n') || cleaned;

    return {
      title: insightLabel,
      text: excerpt
    };
  }

  function renderSlotCards() {
    if (!slotsGrid) return;
    slotsGrid.innerHTML = '';

    spreadState.slots.forEach((slot, idx) => {
      const card = slot.cardId ? tarotDeck.find(c => c.id === slot.cardId) : null;
      const isReversed = !!slot.isReversed;
      const hasCard = !!card;

      const slotEl = document.createElement('div');
      slotEl.className = `workbench-slot-card ${hasCard ? 'has-card' : ''} ${isReversed ? 'is-slot-reversed' : ''}`;
      slotEl.id = `workbenchSlot_${idx}`;

      const roleParts = parseSlotRole(slot.role, idx);

      // 1. Header
      let headerHtml = `
        <div class="slot-header">
          <span class="slot-num-badge">#${idx + 1}</span>
          <div class="slot-role-wrap">
            <input type="text" class="slot-role-input" value="${roleParts.ar}" data-orig-en="${roleParts.en}" data-slot="${idx}" placeholder="عنوان وغرض الموضع..." title="انقر لتعديل عنوان الموضع">
            ${roleParts.en ? `<div class="slot-role-en-sub" dir="ltr">${roleParts.en}</div>` : ''}
          </div>
          ${hasCard ? `<button type="button" class="slot-clear-btn" data-slot="${idx}" title="تفريغ هذا الموضع">✕</button>` : ''}
        </div>
      `;

      // 2. Card Selector
      let selectHtml = `
        <div class="slot-select-wrap">
          <select class="slot-card-select" data-slot="${idx}">
            ${renderCardSelectOptions(slot.cardId)}
          </select>
        </div>
      `;

      // 3. Orientation Selector
      let orientHtml = `
        <div class="slot-orient-group">
          <button type="button" class="slot-orient-btn ${!isReversed ? 'active-upright' : ''}" data-slot="${idx}" data-orient="upright">
            <span>⬆️</span>
            <span>معتدل (Upright)</span>
          </button>
          <button type="button" class="slot-orient-btn ${isReversed ? 'active-reversed' : ''}" data-slot="${idx}" data-orient="reversed">
            <span>🔄</span>
            <span>مقلوب (Reversed)</span>
          </button>
        </div>
      `;

      // 4. Preview Box
      let previewHtml = '';
      if (hasCard) {
        const elClass = getElementClass(card.element);
        const glyph = getCardGlyph(card);
        const arcanaLabel = card.category === 'major' ? `الأركانا الكبرى · ${card.number}` : `${card.suit_ar} · ${card.rank}`;
        previewHtml = `
          <div class="slot-preview-box ${isReversed ? 'is-reversed' : ''}">
            <div class="slot-preview-glyph">${glyph}</div>
            <div class="slot-preview-name-ar">${card.name_ar}</div>
            <div class="slot-preview-name-en" dir="ltr">${card.name_en}</div>
            <div class="slot-preview-tags">
              <span class="card-tag ${elClass}">عنصر ${card.element}</span>
              <span class="card-tag">${arcanaLabel}</span>
              ${isReversed ? '<span class="card-tag" style="background: rgba(255, 107, 74, 0.2); border-color: #ff6b4a; color: #ff9e88;">مقلوب 🔄</span>' : '<span class="card-tag" style="background: rgba(212, 175, 55, 0.15); border-color: var(--tarot-gold); color: var(--tarot-gold-light);">معتدل ⬆️</span>'}
            </div>
          </div>
        `;
      } else {
        previewHtml = `
          <div class="slot-preview-box empty">
            <span style="font-size: 1.8rem; opacity: 0.5; margin-bottom: 6px;">🎴</span>
            <span>اختر بطاقة التاروت المسحوبة لتسكينها في هذا الموضع</span>
          </div>
        `;
      }

      // 5. Insight Box
      let insightHtml = '';
      if (hasCard) {
        const insight = extractSlotInsight(card, spreadState.readingType, isReversed, slot.role);
        if (insight) {
          insightHtml = `
            <div class="slot-insight-box">
              <div>
                <div class="slot-insight-title">
                  <span>✦</span>
                  <span>${insight.title}</span>
                </div>
                <div class="slot-insight-text">${insight.text}</div>
              </div>
            </div>
          `;
        }
      }

      // 6. Inspect Action Button
      let actionHtml = '';
      if (hasCard) {
        actionHtml = `
          <button type="button" class="slot-inspect-btn" data-slot="${idx}">
            <span>📖</span>
            <span>التشريح والدراسة الكاملة للكارت</span>
          </button>
        `;
      }

      slotEl.innerHTML = headerHtml + selectHtml + orientHtml + previewHtml + insightHtml + actionHtml;
      slotsGrid.appendChild(slotEl);
    });

    attachSlotEvents();
  }

  function attachSlotEvents() {
    // Role Inputs
    document.querySelectorAll('.slot-role-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-slot'), 10);
        const origEn = e.target.getAttribute('data-orig-en');
        if (spreadState.slots[idx]) {
          const val = e.target.value.trim() || `الموضع ${idx + 1}`;
          spreadState.slots[idx].role = origEn ? `${val} (${origEn})` : val;
        }
      });
    });

    // Clear Slot Buttons
    document.querySelectorAll('.slot-clear-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-slot'), 10);
        if (spreadState.slots[idx]) {
          spreadState.slots[idx].cardId = '';
          spreadState.slots[idx].isReversed = false;
          renderSlotCards();
        }
      });
    });

    // Card Select Dropdowns
    document.querySelectorAll('.slot-card-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-slot'), 10);
        const cardId = e.target.value;
        if (spreadState.slots[idx]) {
          spreadState.slots[idx].cardId = cardId;
          renderSlotCards();
        }
      });
    });

    // Orientation Buttons
    document.querySelectorAll('.slot-orient-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-slot'), 10);
        const orient = e.currentTarget.getAttribute('data-orient');
        if (spreadState.slots[idx]) {
          spreadState.slots[idx].isReversed = (orient === 'reversed');
          renderSlotCards();
        }
      });
    });

    // Inspect Card Buttons
    document.querySelectorAll('.slot-inspect-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-slot'), 10);
        const slot = spreadState.slots[idx];
        if (slot && slot.cardId) {
          const card = tarotDeck.find(c => c.id === slot.cardId);
          if (card && typeof window.openTarotCardModal === 'function') {
            window.openTarotCardModal(card);
          }
        }
      });
    });
  }

  function generateSynthesisAnalysis() {
    const filledSlots = spreadState.slots.filter(s => s.cardId);
    if (filledSlots.length === 0) {
      showToast('⚠️ يرجى تسكين بطاقة واحدة على الأقل في الفرشة لتوليد لوحة الربط الكلي.');
      return;
    }

    const cardsInSpread = [];
    let counts = { 'نار': 0, 'ماء': 0, 'هواء': 0, 'تراب': 0 };
    let majorCount = 0;
    let minorCount = 0;
    let reversedCount = 0;

    filledSlots.forEach(slot => {
      const card = tarotDeck.find(c => c.id === slot.cardId);
      if (card) {
        cardsInSpread.push({ slot, card, isReversed: slot.isReversed });
        const el = getCardElementCategory(card);
        counts[el] = (counts[el] || 0) + 1;
        if (card.category === 'major') majorCount++;
        else minorCount++;
        if (slot.isReversed) reversedCount++;
      }
    });

    const total = cardsInSpread.length;
    const firePct = Math.round((counts['نار'] / total) * 100);
    const waterPct = Math.round((counts['ماء'] / total) * 100);
    const airPct = Math.round((counts['هواء'] / total) * 100);
    const earthPct = Math.round((counts['تراب'] / total) * 100);

    const majorPct = Math.round((majorCount / total) * 100);
    const minorPct = Math.round((minorCount / total) * 100);

    // 1. Update Progress Bars
    if (fireMeterFill) fireMeterFill.style.width = firePct + '%';
    if (firePctText) firePctText.textContent = firePct + '%';
    if (waterMeterFill) waterMeterFill.style.width = waterPct + '%';
    if (waterPctText) waterPctText.textContent = waterPct + '%';
    if (airMeterFill) airMeterFill.style.width = airPct + '%';
    if (airPctText) airPctText.textContent = airPct + '%';
    if (earthMeterFill) earthMeterFill.style.width = earthPct + '%';
    if (earthPctText) earthPctText.textContent = earthPct + '%';

    // 2. Elemental Interpretation Synthesis
    let dominantElements = Object.entries(counts).filter(([el, cnt]) => cnt === Math.max(...Object.values(counts)) && cnt > 0).map(e => e[0]);
    let missingElements = Object.entries(counts).filter(([el, cnt]) => cnt === 0).map(e => e[0]);

    let elementText = '';
    if (dominantElements.length === 1) {
      const dom = dominantElements[0];
      const domDetails = {
        'نار': '🔥 <strong>هيمنة عنصر النار (الإرادة والشغف والتحرك السريع):</strong> تشير إلى أن الموقف تقوده دوافع قوية، حماس، ورغبة ملحة في كسر الركود واغتنام الفرص. <br><em>التنبيه النفسي:</em> احذر من التسرع، ردود الأفعال الصدامية، أو الاحتراق الذاتي ونفاد الصبر.',
        'ماء': '💧 <strong>هيمنة عنصر الماء (المشاعر والحدس والروابط العاطفية):</strong> الموقف تسيطر عليه الحساسية المفرطة، الذاكرة العاطفية، والارتباطات الإنسانية العميقة. <br><em>التنبيه النفسي:</em> حافظ على حدود واضحة تحميك من الاستنزاف ولا تغرق في دوامات الشك والتعلق.',
        'هواء': '💨 <strong>هيمنة عنصر الهواء (العقل والتحليل والقرارات الصعبة):</strong> الموقف محكوم بالبحث عن الحقيقة والمنطق والتشكيك في الافتراضات وفض النزاعات الفكرية. <br><em>التنبيه النفسي:</em> تجنب الإفراط في التحليل (Overthinking) الذي يشل قدرتك على التنفيذ الفعلي.',
        'تراب': '🌿 <strong>هيمنة عنصر التراب (الواقعية والمال والأمان المادي):</strong> الموقف يركز بالكامل على النتائج الملموسة، الموارد، الاستقرار طويل المدى، وصحة الجسد. <br><em>التنبيه النفسي:</em> لا تجعل الخوف من فقد الأمان المادي يتحول إلى جمود وبخل ومقاومة للتغيير الضروري.'
      };
      elementText = domDetails[dom] || '';
    } else {
      elementText = `⚖️ <strong>توزيع متوازن بين عناصر (${dominantElements.join(' و ')}):</strong> يعكس نضجاً وتناغماً وقدرة على المزاوجة بين الرؤية والفعل، وبين الشعور الداخلي والتطبيق الواقعي.`;
    }

    if (missingElements.length > 0) {
      const missNames = missingElements.join(' و ');
      elementText += `<br><br>⚠️ <strong>العنصر الغائب (${missNames}):</strong> القراءة تكشف عن افتقار بيئة الموقف لطاقة ${missNames}؛ لذا يتطلب النجاح استحضار هذه الطاقة بوعي متعمد لتحقيق الاتزان والتكامل المنشود.`;
    }
    if (elementalInterpretationText) elementalInterpretationText.innerHTML = elementText;

    // 3. Major vs Minor Gauge
    if (majorGaugeSeg) {
      majorGaugeSeg.style.width = majorPct + '%';
      majorGaugeSeg.textContent = `كبرى: ${majorPct}%`;
    }
    if (minorGaugeSeg) {
      minorGaugeSeg.style.width = minorPct + '%';
      minorGaugeSeg.textContent = `صغرى: ${minorPct}%`;
    }
    if (majorCountLabel) majorCountLabel.textContent = `الأركانا الكبرى: ${majorCount} (${majorPct}%)`;
    if (minorCountLabel) minorCountLabel.textContent = `الأركانا الصغرى: ${minorCount} (${minorPct}%)`;

    let ratioText = '';
    if (majorPct >= 50) {
      ratioText = '⚡ <strong>هيمنة الأركانا الكبرى (منعطف قدري ودروس روحية كبرى):</strong> تدل على أن الموقف الحالي محكوم بقوانين قدرية وتطور روحي وتأسيسي عميق يتجاوز التفاصيل اليومية، إنه منعطف لإعادة تعريف الذات واختبار النضج الإنساني الأعمق (Major Life Archetypes).';
    } else {
      ratioText = '🛠️ <strong>هيمنة الأركانا الصغرى (مجال السلوك والقرارات المباشرة):</strong> توضح أن المسألة تدور حول تفاصيل واقعية، خيارات عملية، وتصرفات يومية يمكنك التحكم فيها وتعديل مسارها بسهولة عبر قرارات واعية وإجراءات سلوكية مباشرة.';
    }
    if (arcanaRatioInterpretation) arcanaRatioInterpretation.innerHTML = ratioText;

    // 4. Synthesized Narrative & Timeline
    const lensDescriptions = {
      motives: 'تفكيك النوايا وما وراء السلوك والظلال الخفية',
      momentum: 'المسار الحركي والقرارات الاستراتيجية والواقع العملي',
      psyche: 'التشريح النفسي الشامل والتوازن الذاتي',
      love: 'تفكيك النوايا وما وراء السلوك والظلال الخفية',
      career: 'المسار الحركي والقرارات الاستراتيجية والواقع العملي',
      psychology: 'التشريح النفسي الشامل والتوازن الذاتي'
    };
    const activeLens = lensDescriptions[spreadState.readingType] || 'التشريح النفسي والرمزي';
    let narrativeText = `تُظهر هذه القراءة المنظورة عبر عدسة (${activeLens}) صورة متكاملة تتضافر فيها طاقات ${total} بطاقات.\n\n`;
    if (reversedCount > 0) {
      narrativeText += `يظهر في الفرشة ${reversedCount} كارت في الوضع المقلوب، مما يشير إلى وجود طاقات معطلة، أو آليات دفاعية وظلال نفسية داخلية تحتاج إلى التبصر وعدم الاستعجال.\n\n`;
    }

    if (synthesisTimelineSteps) {
      synthesisTimelineSteps.innerHTML = '';
      cardsInSpread.forEach(({ slot, card, isReversed }) => {
        const insight = extractSlotInsight(card, spreadState.readingType, isReversed, slot.role);
        const roleParts = parseSlotRole(slot.role, slot.index);
        const stepEl = document.createElement('div');
        stepEl.className = 'synthesis-timeline-step';
        stepEl.innerHTML = `
          <div class="step-position-header">
            <div class="step-pos-title-group">
              <div class="step-pos-ar">
                <span class="step-bullet">🔹</span>
                <span class="step-pos-ar-text">${roleParts.ar}</span>
              </div>
              ${roleParts.en ? `<div class="step-pos-en" dir="ltr">${roleParts.en}</div>` : ''}
            </div>
            <div class="step-card-badge-row">
              <div class="step-card-name-group">
                <span class="step-card-name-ar">${card.name_ar}</span>
                <span class="step-card-name-en" dir="ltr">${card.name_en}</span>
              </div>
              <span class="card-tag ${isReversed ? 'card-tag-reversed' : 'card-tag-upright'}">${isReversed ? 'مقلوب 🔄' : 'معتدل ⬆️'}</span>
            </div>
          </div>
          <div class="step-card-text">${insight ? insight.text : card.core_concept}</div>
        `;
        synthesisTimelineSteps.appendChild(stepEl);
      });
    }

    narrativeText += `الخلاصة التركيبية: المسار يدعوك للعبور من منطلق الوعي الداخلي إلى الفعل المتزن، مع إعطاء الأولوية للرسائل التي تؤكدها البطاقات المركزية.`;
    if (synthesisNarrativeBody) synthesisNarrativeBody.textContent = narrativeText;

    // 5. Derive Inquiry Question
    const inquiryCards = cardsInSpread.filter(c => c.card.inquiry_meditation && c.card.inquiry_meditation.length > 10);
    let chosenInquiry = '';
    if (inquiryCards.length > 0) {
      const sample = inquiryCards[Math.floor(Math.random() * inquiryCards.length)].card;
      const lines = sample.inquiry_meditation.split('\n').map(l => l.trim().replace(/^[-*•]\s*/, '')).filter(l => l.includes('؟') || l.includes('?'));
      if (lines.length > 0) {
        chosenInquiry = lines[0];
      }
    }
    if (!chosenInquiry) {
      chosenInquiry = 'ما هو القرار الصادق الذي إذا اتخذته اليوم استعدت توازني وانسجامي مع حقيقة مساري؟';
    }
    if (synthesisInquiryQuestion) {
      synthesisInquiryQuestion.textContent = `«${chosenInquiry}»`;
    }

    // 6. Update Header Count
    if (synthesisCardsCountTag) {
      synthesisCardsCountTag.textContent = `${total} / ${spreadState.slots.length} بطاقات مسكنة`;
    }

    // Reveal and scroll
    if (synthesisPanel) {
      synthesisPanel.classList.add('active');
      synthesisPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast('تم توليد لوحة الربط الكلي وهيمنة العناصر بنجاح ✨');
  }

  function copySynthesisReport() {
    const filledSlots = spreadState.slots.filter(s => s.cardId);
    if (filledSlots.length === 0) {
      showToast('⚠️ لا توجد بطاقات مسكنة لنسخ تقريرها.');
      return;
    }

    let report = `🔮 **تقرير قراءة التاروت - منصة عقيق أسترو (Aqeeq Astro)**\n`;
    report += `📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}\n`;
    report += `📐 الفرشة: ${currentSpreadNameDisplay ? currentSpreadNameDisplay.textContent : ''}\n`;
    report += `🎯 السياق: ${currentReadingTypeDisplay ? currentReadingTypeDisplay.textContent : ''}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `### تفصيل البطاقات المسكنة في الفرشة:\n`;

    filledSlots.forEach((slot) => {
      const card = tarotDeck.find(c => c.id === slot.cardId);
      if (card) {
        const orient = slot.isReversed ? 'مقلوب (Reversed) 🔄' : 'معتدل (Upright) ⬆️';
        const insight = extractSlotInsight(card, spreadState.readingType, slot.isReversed, slot.role);
        report += `\n**${slot.role}**\n`;
        report += `• البطاقة: ${card.name_ar} (${card.name_en}) - [${orient}]\n`;
        report += `• العنصر: ${card.element} | الفلك: ${card.astrological_link || 'عام'}\n`;
        if (insight && insight.text) {
          report += `• الدلالة: ${insight.text.split('\n')[0]}\n`;
        }
      }
    });

    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (elementalInterpretationText) {
      report += `### ميزان هيمنة العناصر:\n${elementalInterpretationText.innerText}\n\n`;
    }
    if (arcanaRatioInterpretation) {
      report += `### الأركانا الكبرى مقابل الصغرى:\n${arcanaRatioInterpretation.innerText}\n\n`;
    }
    if (synthesisInquiryQuestion) {
      report += `### سؤال التأمل والاستبصار:\n${synthesisInquiryQuestion.textContent}\n\n`;
    }
    report += `© عقيق أسترو - محراب وموسوعة التاروت التفاعلية.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(report).then(() => {
        showToast('تم نسخ التقرير الكامل إلى الحافظة بنجاح 📋');
      }).catch(() => {
        showToast('تعذر النسخ التلقائي، يمكنك تحديد النص ونسخه يدوياً.');
      });
    } else {
      showToast('تم إعداد التقرير بنجاح.');
    }
  }

  function showToast(msg) {
    const existing = document.querySelector('.tarot-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'tarot-toast';
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // Listen to tarot loaded event from tarot-sanctuary.js or init if already loaded
  document.addEventListener('aqeeq:tarot-loaded', (e) => {
    initWorkbench(e.detail && e.detail.cards);
  });

  if (window.AqeeqTarotDeck && window.AqeeqTarotDeck.length > 0) {
    initWorkbench(window.AqeeqTarotDeck);
  } else {
    // If loaded standalone, try fetching tarot-library.json directly
    const basePath = window.location.pathname.includes('/library/') ? '../' : './';
    fetch(basePath + 'assets/data/tarot/tarot-library.json')
      .then(r => r.json())
      .then(data => {
        if (data && data.cards) {
          initWorkbench(data.cards);
        }
      })
      .catch(() => {});
  }

})();
