/**
 * Consultation Tarot Engine (consultation-tarot.js)
 * Live, immersive consultative tarot experience for querents in tarot.html & index.html#tarot-chamber.
 * Features:
 *  - 2nd-person direct addressing ("أنت تمر الآن بـ...", "العائق الذي يواجهك في الكواليس هو...")
 *  - Zero academic filler, card mechanics, or dry textbook jargon
 *  - Interactive 3D card flips across all classical & advanced spreads (1, 3, 5, 7, 9, custom cards)
 *  - Dynamic lenses: Motives (النوايا والظل), Momentum (المسار والقرارات), Psyche (الاتزان النفسي)
 *  - Save Reading integration with Aqeeq Personal Library
 */

(function () {
  'use strict';

  let tarotDeck = [];
  let isShuffling = false;

  const SPREAD_DEFINITIONS = {
    'single': {
      title: 'بصيرة الموقف والرسالة العاجلة (بطاقة واحدة)',
      count: 1,
      roles: [
        { ar: 'واقعك ورسالة اللحظة الحالية', en: 'Present Reality & Immediate Truth', roleType: 'reality' }
      ]
    },
    'three-direct': {
      title: 'ثالوث الاستبصار المباشر (3 بطاقات: واقعك · العائق · خطوتك)',
      count: 3,
      roles: [
        { ar: '1. واقعك الداخلي وما تعيشه الآن', en: 'Where You Stand Today', roleType: 'reality' },
        { ar: '2. العائق الخفي الذي يواجهك في الكواليس', en: 'The Hidden Block & Shadow Resistance', roleType: 'obstacle' },
        { ar: '3. خطوتك السلوكية القادمة ومسار الحل', en: 'Your Decisive Action & Optimal Path', roleType: 'action' }
      ]
    },
    'three-time': {
      title: 'مثلث الزمن (3 بطاقات: الماضي · الحاضر · المستقبل)',
      count: 3,
      roles: [
        { ar: '1. الجذور والماضي المؤثر في الموقف', en: 'Past Roots & Foundation', roleType: 'reality' },
        { ar: '2. طاقة اللحظة الحاضرة ومحور التفاعل', en: 'Present Dynamics & Focus', roleType: 'obstacle' },
        { ar: '3. الاتجاه المستقبلي المحتمل ومسار التطور', en: 'Emerging Future Trajectory', roleType: 'action' }
      ]
    },
    'three-guide': {
      title: 'ثالوث التوجيه (3 بطاقات: الموقف · التحدي · الإرشاد)',
      count: 3,
      roles: [
        { ar: '1. جوهر الموقف الحالي كما هو', en: 'Core Situation', roleType: 'reality' },
        { ar: '2. العقبة الرئيسية أو الدرس المطروح', en: 'Central Challenge', roleType: 'obstacle' },
        { ar: '3. التوجيه العملي والحكمة الفاعلة', en: 'Higher Guidance & Action', roleType: 'action' }
      ]
    },
    'relationship': {
      title: 'كشف النوايا والعلاقات والشراكات (3 بطاقات)',
      count: 3,
      roles: [
        { ar: '1. حقيقة مشاعرك ونواياك الدفينة', en: 'Your True Feelings & Motives', roleType: 'reality' },
        { ar: '2. طاقة الطرف الآخر وما يحجبه عنك', en: 'The Other’s Real Energy & Mask', roleType: 'obstacle' },
        { ar: '3. حقيقة العلاقة ومآل التواصل', en: 'The Core Truth & Emerging Dynamic', roleType: 'action' }
      ]
    },
    'decision': {
      title: 'ميزان القرار والخيارات الحاسمة (3 بطاقات)',
      count: 3,
      roles: [
        { ar: '1. مسار الخيار الأول وطاقته', en: 'Path A: Energy & Repercussions', roleType: 'reality' },
        { ar: '2. مسار الخيار الثاني وتحدياته', en: 'Path B: Friction & Potential', roleType: 'obstacle' },
        { ar: '3. توجيه الحكمة ومحور الحسم', en: 'Decisive Wisdom & Core Truth', roleType: 'action' }
      ]
    },
    'five-cross': {
      title: 'صليب التحول العميق (5 بطاقات: الجوهر والتحدي والمآل)',
      count: 5,
      roles: [
        { ar: '1. محور الموقف وقلب الحقيقة الراهنة', en: 'Core Heart of the Matter', roleType: 'reality' },
        { ar: '2. القوة المتقاطعة أو التحدي المباشر', en: 'Crossing Force & Challenge', roleType: 'obstacle' },
        { ar: '3. الدافع اللاواعي والجذور الخفية', en: 'Subconscious Root & Shadow', roleType: 'obstacle' },
        { ar: '4. الدرس الواعي والفرصة المتاحة', en: 'Conscious Lesson & Support', roleType: 'reality' },
        { ar: '5. مسار التحول والخطوة الحاسمة', en: 'Transformative Outcome', roleType: 'action' }
      ]
    },
    'seven-horseshoe': {
      title: 'حدوة الحصان الاستبصارية (7 بطاقات: التحليل الشامل للمسار)',
      count: 7,
      roles: [
        { ar: '1. تأثيرات الماضي القريب', en: 'Past Influences', roleType: 'reality' },
        { ar: '2. الظروف الحاضرة المحيطة بك', en: 'Present Circumstances', roleType: 'reality' },
        { ar: '3. التطورات غير المتوقعة في الكواليس', en: 'Hidden / Unseen Factors', roleType: 'obstacle' },
        { ar: '4. العقبة الجوهرية التي تتطلب الحسم', en: 'Central Obstacle to Overcome', roleType: 'obstacle' },
        { ar: '5. المحيطون بك والضغوط الخارجية', en: 'External Environment & Others', roleType: 'reality' },
        { ar: '6. الفعل الأمثل الذي يجب اتخاذه الآن', en: 'Recommended Action', roleType: 'action' },
        { ar: '7. المآل المتوقع عند تطبيق الإرشاد', en: 'Likely Resolution & Outcome', roleType: 'action' }
      ]
    },
    'nine-matrix': {
      title: 'المصفوفة الاستراتيجية 3×3 (9 بطاقات: الجذور والواقع والمآل)',
      count: 9,
      roles: [
        { ar: '1. الماضي الفكري والذهني', en: 'Mental Past', roleType: 'reality' },
        { ar: '2. الماضي العاطفي والشعوري', en: 'Emotional Past', roleType: 'reality' },
        { ar: '3. الماضي السلوكي والواقعي', en: 'Material Past', roleType: 'reality' },
        { ar: '4. الحاضر الفكري ورؤيتك الحالية', en: 'Current Mindset', roleType: 'obstacle' },
        { ar: '5. القلب المركزي للموقف الآن', en: 'Central Axis of Present', roleType: 'reality' },
        { ar: '6. التحدي الواقعي المباشر', en: 'Immediate Practical Block', roleType: 'obstacle' },
        { ar: '7. الوعي الجديد المطلوب تبنّيه', en: 'Evolving Perspective', roleType: 'action' },
        { ar: '8. التحول العاطفي والنفسي القادم', en: 'Emotional Integration', roleType: 'action' },
        { ar: '9. التجسيد العملي والنتيجة الكبرى', en: 'Concrete Manifestation', roleType: 'action' }
      ]
    }
  };

  // State
  let activeSpreadKey = 'three-direct';
  let activeLens = 'motives';
  let drawnCards = []; // Array of { slotRole, card, isReversed, isFlipped }

  // Classical Roman Numerals & Suit Symbols (No Cartoon Emojis)
  function getCardGlyph(card) {
    if (!card) return 'I';
    if (card.category === 'major') {
      const numerals = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
      return numerals[card.number] || String(card.number || 'I');
    }
    if (card.suit === 'wands') return '🜂';
    if (card.suit === 'cups') return '🜄';
    if (card.suit === 'swords') return '🜁';
    if (card.suit === 'pentacles') return '🜃';
    return 'I';
  }

  function getElementClass(el) {
    if (!el) return '';
    if (el.includes('نار')) return 'fire';
    if (el.includes('ماء')) return 'water';
    if (el.includes('هواء')) return 'air';
    if (el.includes('تراب')) return 'earth';
    return '';
  }

  // Fetch Tarot Deck
  async function initDeck() {
    const cardsArena = document.getElementById('consultCardsArena');
    if (!cardsArena) return;

    try {
      const response = await fetch('assets/data/tarot/tarot-library.json');
      if (!response.ok) throw new Error('Failed to load tarot database');
      const data = await response.json();
      tarotDeck = Array.isArray(data) ? data : (data.cards || []);

      setupControls();
      performDraw(false);
    } catch (err) {
      console.error('Consultation engine error:', err);
      if (cardsArena) {
        cardsArena.innerHTML = `
          <div style="text-align: center; color: var(--tarot-text-muted); padding: 30px;">
            تعذر تحميل أوراق التاروت حالياً. يرجى إعادة تحديث الصفحة.
          </div>
        `;
      }
    }
  }

  function setupControls() {
    const spreadSelect = document.getElementById('consultSpreadSelect');
    const lensSelect = document.getElementById('consultLensSelect');
    const drawActionBtn = document.getElementById('consultDrawBtn');

    if (spreadSelect) {
      spreadSelect.addEventListener('change', () => {
        activeSpreadKey = spreadSelect.value;
        updateStatusDisplay();
        performDraw(true);
      });
    }

    if (lensSelect) {
      lensSelect.addEventListener('change', () => {
        activeLens = lensSelect.value;
        updateStatusDisplay();
        renderConsultationReport();
      });
    }

    if (drawActionBtn) {
      drawActionBtn.addEventListener('click', () => {
        performDraw(true);
      });
    }
  }

  function updateStatusDisplay() {
    const activeSpreadTitleDisplay = document.getElementById('activeSpreadTitleDisplay');
    const activeLensTitleDisplay = document.getElementById('activeLensTitleDisplay');
    const spreadDef = SPREAD_DEFINITIONS[activeSpreadKey] || SPREAD_DEFINITIONS['three-direct'];
    if (activeSpreadTitleDisplay) {
      activeSpreadTitleDisplay.textContent = spreadDef.title;
    }

    const lensLabels = {
      motives: 'تفكيك النوايا وما وراء السلوك',
      momentum: 'المسار الحركي والقرارات',
      psyche: 'التشريح النفسي والتوازن الذاتي'
    };
    if (activeLensTitleDisplay) {
      activeLensTitleDisplay.textContent = lensLabels[activeLens] || 'تفكيك النوايا والظل';
    }
  }

  // Shuffle and Draw Spread
  function performDraw(animate = true) {
    if (!tarotDeck || tarotDeck.length === 0 || isShuffling) return;
    const drawActionBtn = document.getElementById('consultDrawBtn');

    const spreadDef = SPREAD_DEFINITIONS[activeSpreadKey] || SPREAD_DEFINITIONS['three-direct'];
    const count = spreadDef.count;

    // Pick random unique cards
    const pool = [...tarotDeck];
    const picked = [];

    for (let i = 0; i < count; i++) {
      if (pool.length === 0) break;
      const randIdx = Math.floor(Math.random() * pool.length);
      const card = pool.splice(randIdx, 1)[0];
      const isReversed = Math.random() < 0.3;

      picked.push({
        slotRole: spreadDef.roles[i] || { ar: `الموضع ${i + 1}`, en: `Position ${i + 1}`, roleType: 'reality' },
        card: card,
        isReversed: isReversed,
        isFlipped: false
      });
    }

    drawnCards = picked;
    isShuffling = true;

    if (animate && drawActionBtn) {
      drawActionBtn.disabled = true;
      drawActionBtn.classList.add('shuffling');
      drawActionBtn.innerHTML = `<span>جارٍ خلط الأوراق واستحضار القراءة...</span>`;
    }

    renderCardsArena();

    setTimeout(() => {
      drawnCards.forEach(c => { c.isFlipped = true; });
      updateCardsFlipVisuals();
      renderConsultationReport();

      isShuffling = false;
      if (drawActionBtn) {
        drawActionBtn.disabled = false;
        drawActionBtn.classList.remove('shuffling');
        drawActionBtn.innerHTML = `<span>إعادة خلط وسحب قراءة جديدة</span>`;
      }
    }, animate ? 650 : 50);
  }

  // Render 3D Card Slots in the Arena
  function renderCardsArena() {
    const cardsArena = document.getElementById('consultCardsArena');
    if (!cardsArena) return;
    cardsArena.innerHTML = '';

    const isSingle = drawnCards.length === 1;
    cardsArena.className = `consult-cards-arena ${isSingle ? 'single-card-mode' : 'multi-card-mode'}`;

    drawnCards.forEach((item, idx) => {
      const { slotRole, card, isReversed, isFlipped } = item;
      const glyph = getCardGlyph(card);
      const arcanaLabel = card.category === 'major'
        ? `الأركانا الكبرى · ${card.number}`
        : `${card.suit_ar} · ${card.rank || card.number}`;

      const cardWrap = document.createElement('div');
      cardWrap.className = 'consult-card-wrapper';
      cardWrap.id = `consultCardWrap_${idx}`;

      cardWrap.innerHTML = `
        <div class="consult-role-pill">
          <span class="role-ar">${slotRole.ar}</span>
          <span class="role-en" dir="ltr">${slotRole.en}</span>
        </div>

        <div class="card-container ${isFlipped ? 'flipped' : ''}" id="consultCardBox_${idx}" role="button" tabindex="0" title="انقر لقلب البطاقة">
          <div class="card-inner">
            <!-- Card Back (Facedown) -->
            <div class="card-face card-back">
              <div class="cosmic-seal">
                <span class="seal-glyph" dir="ltr">AQ</span>
              </div>
              <div class="cosmic-back-title">عقيق أسترو</div>
              <div class="cosmic-back-sub" dir="ltr">AQEEQ TAROT</div>
            </div>

            <!-- Card Front (Revealed) -->
            <div class="card-face card-front ${isReversed ? 'is-card-reversed' : ''}">
              <div class="card-header-bar">
                <span class="card-arcana-num">${arcanaLabel}</span>
                <span class="card-glyph">${card.astrological_link || glyph}</span>
              </div>

              <div class="card-art-box">
                <div class="card-symbol ${isReversed ? 'reversed-glyph' : ''}">${glyph}</div>
                <div class="card-orbit"></div>
              </div>

              <div class="card-info-box">
                <h3 class="card-title">${card.name_ar}</h3>
                <div class="card-title-en" dir="ltr">${card.name_en}</div>
              </div>

              <div class="card-footer-tags">
                <span class="card-tag ${getElementClass(card.element)}">عنصر ${card.element}</span>
                ${isReversed 
                  ? '<span class="card-tag card-tag-reversed">مقلوب</span>' 
                  : '<span class="card-tag card-tag-upright">معتدل</span>'}
              </div>
            </div>
          </div>
        </div>
      `;

      const box = cardWrap.querySelector('.card-container');
      if (box) {
        box.addEventListener('click', () => {
          item.isFlipped = !item.isFlipped;
          box.classList.toggle('flipped', item.isFlipped);
        });
      }

      cardsArena.appendChild(cardWrap);
    });
  }

  function updateCardsFlipVisuals() {
    drawnCards.forEach((item, idx) => {
      const box = document.getElementById(`consultCardBox_${idx}`);
      if (box && item.isFlipped) {
        box.classList.add('flipped');
      }
    });
  }

  function generateDirectQuerentVoice(card, isReversed, lens, roleDef) {
    if (!card) return '';

    let directOpening = '';
    const roleType = roleDef.roleType || 'reality';

    if (roleType === 'reality') {
      directOpening = isReversed
        ? 'أنت تعيش الآن حالة من الضبابية أو التردد الباطني؛ تشعر بأن هناك أمراً لم يعد ينسجم مع رغبتك العميقة ولكنك تؤجل مواجهته. '
        : 'أنت تقف في هذه اللحظة في صلب موقف يتطلب منك الصدق الكامل مع ذاتك دون تبرير أو ادعاء؛ طاقتك الحاضرة تدفعك للارتقاء بوعيك. ';
    } else if (roleType === 'obstacle') {
      directOpening = isReversed
        ? 'العائق الحقيقي الذي يواجهك في الكواليس ليس الظروف الخارجية، بل آلية دفاعية ومقاومة داخلية غير واعية؛ تتشبث بردة فعل قديمة لم تعد تخدمك. '
        : 'ما يعطلك في الخفاء الآن هو نمط سلوكي متكرر؛ تمنح طاقتك لمن لا يقدرها أو تتمسك بتوقع غير واقعي يعزلك عن رؤية الحقيقة كما هي. ';
    } else if (roleType === 'action') {
      directOpening = isReversed
        ? 'مسار الحل يطالبك أولاً بالتوقف التام عن الاندفاع؛ لا تتخذ قرارات رد فعل متسرعة، بل راجع دوافعك الحقيقية واستعد اتزانك الداخلي قبل أي تحرك. '
        : 'المآل الواعد يعتمد كلياً على شجاعتك في الانتقال من التفكير المفرط والقلق إلى الفعل المتزن الواعي؛ الحقيقة واضحة أمامك ولا ينقصك سوى المبادرة. ';
    } else {
      directOpening = isReversed
        ? 'طاقتك الحالية تشهد نوعاً من الاحتكاك الداخلي؛ ما تريده في الظاهر يتعارض مع خوفك الدفين في الأعماق. '
        : 'طاقتك الحالية تدعوك للوضوح والتصالح مع ما أنت مقبل عليه؛ تحرر من التردد واستقبل مرحلتك الجديدة بثقة. ';
    }

    let rawText = '';
    if (lens === 'motives') {
      if (isReversed) {
        rawText = (card.deep_psychology && card.deep_psychology.shadow) || (card.core_meaning && card.core_meaning.reversed) || '';
      } else {
        rawText = (card.deep_psychology && card.deep_psychology.shadow) || (card.practical_domains && card.practical_domains.love_relationships) || '';
      }
    } else if (lens === 'momentum') {
      if (isReversed) {
        rawText = (card.core_meaning && card.core_meaning.reversed) || (card.practical_domains && card.practical_domains.career_projects) || '';
      } else {
        rawText = (card.practical_domains && card.practical_domains.career_projects) || (card.core_meaning && card.core_meaning.upright) || '';
      }
    } else {
      if (isReversed) {
        rawText = (card.core_meaning && card.core_meaning.reversed) || (card.deep_psychology && card.deep_psychology.text) || '';
      } else {
        rawText = (card.deep_psychology && card.deep_psychology.text) || (card.core_meaning && card.core_meaning.overview) || '';
      }
    }

    if (!rawText || rawText.length < 20) {
      rawText = card.core_concept || (card.core_meaning ? card.core_meaning.overview : '');
    }

    let sanitized = rawText
      .replace(/^#+\s.*$/gm, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/^\s*[-*•]\s*/gm, '')
      .replace(/الجانب الإيجابي|الجانب السلبي|الوجه المقلوب|في وضع الاعتدال|الأعمق/g, '')
      .replace(/هذا الكارت يرمز إلى|يدل هذا الكارت على|يشير هذا الكارت إلى|الكارت ممكن يظهر|الكارت المقلوب مش معناه/g, '')
      .replace(/في صورة Rider-Waite-Smith|بحسب مدرسة|في التاروت التقليدي/g, '')
      .trim();

    const lines = sanitized.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 15 && !l.startsWith('###') && !l.includes('نسخ إجابات'));
    const coreDiagnosis = lines.slice(0, 2).join(' ') || sanitized;

    return `${directOpening} ${coreDiagnosis}`;
  }

  function extractInquiryQuestion(card) {
    if (!card) return 'ما هو الشيء الحقيقي الذي تتجاهله الآن رغم وضوحه التام أمام بصيرتك؟';

    const source = card.inquiry_question || card.inquiry_meditation || '';
    if (source) {
      const questions = source.split('\n')
        .map(l => l.trim().replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, ''))
        .filter(l => (l.includes('؟') || l.includes('?')) && l.length > 15 && !l.includes('إجابات التأمل'));

      if (questions.length > 0) {
        return questions[0];
      }
    }

    return 'لو تحليت اليوم بالصدق المطلق مع نفسك، ما هو القرار الذي تعرف في أعماقك أنك مضطر لاتخاذه؟';
  }

  function extractNextBehavioralAction(card, isReversed) {
    if (!card) return 'اتخذ خطوة صغيرة واضحة اليوم تترجم وعيك الداخلي إلى فعل واقعي دون تردد.';

    if (card.empowerment_action && card.empowerment_action.length > 15) {
      return card.empowerment_action.replace(/^#+\s*/, '').trim();
    }

    if (isReversed) {
      return 'توقف عن المقاومة وإلقاء اللوم على الظروف؛ اعترف بما تشعر به حقاً، وأعد رسم حدودك الشخصية بحزم وهدوء.';
    }

    return 'اتخذ خطوة أولى ملموسة اليوم تترجم إدراكك إلى واقع عملي، وثق في قدرتك على الحسم وإدارة المسار.';
  }

  // Render the Structured Direct Consultation Report
  function renderConsultationReport() {
    const resultsContainer = document.getElementById('consultResultsContainer');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    if (!drawnCards || drawnCards.length === 0) return;

    const reportWrap = document.createElement('div');
    reportWrap.className = 'consult-report-wrap';

    const spreadDef = SPREAD_DEFINITIONS[activeSpreadKey] || SPREAD_DEFINITIONS['three-direct'];
    const cardsSummary = drawnCards.map(c => `${c.card.name_ar} (${c.isReversed ? 'مقلوب' : 'معتدل'})`).join(' · ');

    reportWrap.innerHTML = `
      <div class="consult-report-header">
        <div class="consult-badge">
          <span>تقرير الاستشارة المباشرة · ${spreadDef.title}</span>
        </div>
        <h2 class="consult-report-title">تشريح الواقع والرسائل السلوكية الحاضرة</h2>
        <p class="consult-report-sub">
          خطاب استبصاري مباشر يفكك حالتك الراهنة دون مقدمات نظرية أو مصطلحات جافة.
        </p>
        <div style="margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" class="aq-save-reading-btn" id="saveTarotReadingBtn">
            <span>حفظ قراءة التاروت في مكتبتي</span>
          </button>
        </div>
      </div>

      <div class="consult-results-cards-list">
        <!-- Rendered per card below -->
      </div>
    `;

    const saveBtn = reportWrap.querySelector('#saveTarotReadingBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (window.AqeeqPlatform && typeof window.AqeeqPlatform.saveReading === 'function') {
          window.AqeeqPlatform.saveReading({
            type: 'tarot',
            typeLabel: 'قراءة تاروت استبصارية',
            title: spreadDef.title,
            subtitle: cardsSummary,
            route: '#tarot-chamber',
            payload: {
              spreadKey: activeSpreadKey,
              lens: activeLens,
              cards: drawnCards.map(c => ({
                role: c.slotRole.ar,
                name_ar: c.card.name_ar,
                name_en: c.card.name_en,
                reversed: c.isReversed
              }))
            }
          });
          saveBtn.classList.add('is-saved');
          saveBtn.innerHTML = '<span>تم الحفظ في مكتبتك الشخصية</span>';
        } else {
          try {
            const raw = localStorage.getItem('aqeeq_saved_readings_v1');
            const list = raw ? JSON.parse(raw) : [];
            list.unshift({
              id: 'tr_' + Date.now(),
              type: 'tarot',
              typeLabel: 'قراءة تاروت استبصارية',
              title: spreadDef.title,
              subtitle: cardsSummary,
              route: 'tarot.html',
              createdAt: new Date().toISOString()
            });
            localStorage.setItem('aqeeq_saved_readings_v1', JSON.stringify(list.slice(0, 60)));
            saveBtn.classList.add('is-saved');
            saveBtn.innerHTML = '<span>تم الحفظ في مكتبتك الشخصية</span>';
          } catch (_) {}
        }
      });
    }

    const listContainer = reportWrap.querySelector('.consult-results-cards-list');

    drawnCards.forEach((item, idx) => {
      const { slotRole, card, isReversed } = item;
      const directVoiceText = generateDirectQuerentVoice(card, isReversed, activeLens, slotRole);
      const inquiryText = extractInquiryQuestion(card);
      const actionText = extractNextBehavioralAction(card, isReversed);

      const cardResultCard = document.createElement('div');
      cardResultCard.className = 'consult-result-card';

      cardResultCard.innerHTML = `
        <div class="consult-slot-header">
          <div class="consult-slot-title-group">
            <span class="consult-slot-num">0${idx + 1}</span>
            <div class="consult-slot-titles">
              <span class="consult-slot-ar">${slotRole.ar}</span>
              <span class="consult-slot-en" dir="ltr">${slotRole.en}</span>
            </div>
          </div>
          <div class="consult-card-identity">
            <div class="consult-card-names">
              <span class="name-ar">${card.name_ar}</span>
              <span class="name-en" dir="ltr">${card.name_en}</span>
            </div>
            <span class="card-tag ${isReversed ? 'card-tag-reversed' : 'card-tag-upright'}">
              ${isReversed ? 'مقلوب' : 'معتدل'}
            </span>
          </div>
        </div>

        <div class="consult-voice-box">
          <div class="consult-voice-header">
            <span class="voice-title">٠١ / صوت القراءة المباشر: واقعك وما وراء السلوك</span>
          </div>
          <p class="consult-voice-text">${directVoiceText}</p>
        </div>

        <div class="consult-inquiry-box">
          <div class="consult-inquiry-header">
            <span class="inquiry-title">٠٢ / سؤال الاستبصار والتأمل</span>
          </div>
          <div class="consult-inquiry-text">«${inquiryText}»</div>
        </div>

        <div class="consult-action-box">
          <div class="consult-action-header">
            <span class="action-title">٠٣ / الخطوة السلوكية القادمة</span>
          </div>
          <div class="consult-action-text">${actionText}</div>
        </div>
      `;

      listContainer.appendChild(cardResultCard);
    });

    const transitionCta = document.createElement('div');
    transitionCta.className = 'consult-transition-cta';
    transitionCta.innerHTML = `
      <div class="cta-inner">
        <div class="cta-text">
          <h4>هل ترغب في دراسة التسكين الأكاديمي والكرامات العنصرية لهذه القراءة؟</h4>
          <p>انتقل إلى محراب التعليم واستوديو التسكين لاحتساب ميزان العناصر الأربعة وهيمنة الأركانا ومراجعة المخطوطات الكبرى.</p>
        </div>
        <a href="workbench.html" class="workbench-btn-primary">
          <span>الانتقال لمحراب التعليم والتسكين</span>
        </a>
      </div>
    `;
    reportWrap.appendChild(transitionCta);

    resultsContainer.appendChild(reportWrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeck);
  } else {
    initDeck();
  }
})();
