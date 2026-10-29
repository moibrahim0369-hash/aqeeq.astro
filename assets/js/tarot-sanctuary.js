/**
 * محراب التاروت التفاعلي وموسوعة الـ 78 كارت - عقيق أسترو
 * Tarot Sanctuary Interactive Engine & Card Browser
 */

(function () {
  'use strict';

  let tarotData = [];
  let currentCard = null;
  let isFlipped = false;
  let activeFilter = 'all';

  // DOM Elements
  const cardContainer = document.getElementById('tarotCard');
  const cardArcana = document.getElementById('cardArcana');
  const cardName = document.getElementById('cardName');
  const cardNameEn = document.getElementById('cardNameEn');
  const cardMeaning = document.getElementById('cardMeaning');
  const cardElement = document.getElementById('cardElement');
  const cardAstro = document.getElementById('cardAstro');
  const cardsGrid = document.getElementById('tarotCardsGrid');
  const searchInput = document.getElementById('tarotSearchInput');
  const filterChips = document.querySelectorAll('.filter-chip');
  const modalOverlay = document.getElementById('tarotModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMetaPills = document.getElementById('modalMetaPills');
  const modalBody = document.getElementById('modalBody');
  const modalTabs = document.querySelectorAll('.modal-tab-btn');
  const inspectCurrentBtn = document.getElementById('inspectCurrentBtn');
  const totalCountEl = document.getElementById('totalCountDisplay');

  // Element class mapping
  function getElementClass(el) {
    if (!el) return '';
    if (el.includes('نار')) return 'fire';
    if (el.includes('ماء')) return 'water';
    if (el.includes('هواء')) return 'air';
    if (el.includes('تراب')) return 'earth';
    return '';
  }

  // Load JSON Data
  async function loadTarotData() {
    try {
      const basePath = window.location.pathname.includes('/library/') ? '../' : './';
      // Try unified library first
      let res = await fetch(basePath + 'assets/data/tarot/tarot-library.json');
      if (!res.ok) {
        res = await fetch(basePath + 'assets/data/tarot/major-arcana.json');
      }
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      tarotData = json.cards || [];
      console.log(`[Tarot Sanctuary] Loaded ${tarotData.length} cards successfully.`);
      
      if (totalCountEl) {
        totalCountEl.textContent = `${tarotData.length} بطاقة مفعلة`;
      }

      initSanctuary();
    } catch (err) {
      console.error('[Tarot Sanctuary] Error loading data:', err);
      if (cardMeaning) cardMeaning.textContent = 'تعذر تحميل قاعدة بيانات التاروت مؤقتًا. يرجى إعادة المحاولة.';
    }
  }

  // Initialize UI
  function initSanctuary() {
    window.AqeeqTarotDeck = tarotData;
    window.openTarotCardModal = openCardModal;
    window.getTarotElementClass = getElementClass;
    document.dispatchEvent(new CustomEvent('aqeeq:tarot-loaded', { detail: { cards: tarotData } }));

    renderCardsGrid(tarotData);
    setupEventListeners();
    
    // Pick an initial random card without auto-flipping
    const randomIndex = Math.floor(Math.random() * tarotData.length);
    setDrawnCard(tarotData[randomIndex], false);
  }

  // Set the drawn card content
  function setDrawnCard(card, flip = true) {
    currentCard = card;
    if (!card) return;

    if (cardArcana) cardArcana.textContent = card.arcana_title || (card.category === 'major' ? `الأركانا الكبرى - ${card.number}` : `${card.suit_ar} - ${card.number}`);
    if (cardName) cardName.textContent = card.name_ar;
    if (cardNameEn) cardNameEn.textContent = card.name_en;
    if (cardAstro) cardAstro.textContent = card.astrological_link || '';
    
    // Summary
    const summary = card.core_concept || 
                    (card.core_meaning && card.core_meaning.overview ? card.core_meaning.overview.substring(0, 160) + '...' : '');
    if (cardMeaning) cardMeaning.textContent = summary;

    if (cardElement) {
      cardElement.textContent = `عنصر ${card.element}`;
      cardElement.className = 'card-tag ' + getElementClass(card.element);
    }

    if (flip) {
      cardContainer.classList.add('flipped');
      isFlipped = true;
    }
  }

  // Flip Card Action
  window.flipCard = function () {
    if (!cardContainer) return;
    isFlipped = !isFlipped;
    if (isFlipped) {
      cardContainer.classList.add('flipped');
    } else {
      cardContainer.classList.remove('flipped');
    }
  };

  // Draw New Card Action
  window.drawNewCard = function () {
    if (!tarotData || tarotData.length === 0) return;

    if (isFlipped) {
      cardContainer.classList.remove('flipped');
      isFlipped = false;
      setTimeout(() => {
        pickAndReveal();
      }, 450);
    } else {
      pickAndReveal();
    }
  };

  function pickAndReveal() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * tarotData.length);
    } while (tarotData.length > 1 && currentCard && tarotData[nextIndex].id === currentCard.id);

    const nextCard = tarotData[nextIndex];
    setDrawnCard(nextCard, false);

    cardContainer.style.transform = 'scale(0.96)';
    setTimeout(() => {
      cardContainer.style.transform = '';
      cardContainer.classList.add('flipped');
      isFlipped = true;
    }, 200);
  }

  // Render Grid
  function renderCardsGrid(cards) {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';

    if (cards.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--tarot-text-muted);">
          لم يتم العثور على بطاقات مطابقة لبحثك.
        </div>
      `;
      return;
    }

    cards.forEach(card => {
      const item = document.createElement('div');
      item.className = 'tarot-grid-item';
      item.setAttribute('data-id', card.id);
      item.setAttribute('tabindex', '0');

      const elClass = getElementClass(card.element);
      const summary = card.core_concept 
        ? card.core_concept.substring(0, 130) + '...'
        : (card.keywords && card.keywords.general ? card.keywords.general.slice(0, 5).join(' • ') : '');

      const badgeCategory = card.category === 'major' ? `أركانا كبرى #${card.number}` : `${card.suit_ar || 'العصي'} #${card.number}`;

      item.innerHTML = `
        <div>
          <div class="item-top">
            <span class="item-number">${badgeCategory}</span>
            <span class="item-astro">${card.astrological_link || ''}</span>
          </div>
          <h3 class="item-name">${card.name_ar}</h3>
          <div class="item-name-en">${card.name_en}</div>
          <p class="item-summary">${summary}</p>
        </div>
        <div class="item-footer">
          <span class="item-element ${elClass}">عنصر ${card.element}</span>
          <span class="item-view-pill">التشريح الكامل ←</span>
        </div>
      `;

      item.addEventListener('click', () => openCardModal(card));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCardModal(card);
        }
      });

      cardsGrid.appendChild(item);
    });
  }

  // Filter and Search logic
  function filterCards() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

    const filtered = tarotData.filter(card => {
      const matchFilter = (activeFilter === 'all') ||
                          (activeFilter === 'major' && card.category === 'major') ||
                          (activeFilter === 'wands' && card.suit === 'wands') ||
                          (activeFilter === 'cups' && card.suit === 'cups') ||
                          (activeFilter === 'swords' && card.suit === 'swords') ||
                          (activeFilter === 'pentacles' && card.suit === 'pentacles') ||
                          (activeFilter === 'fire' && card.element.includes('نار')) ||
                          (activeFilter === 'water' && card.element.includes('ماء')) ||
                          (activeFilter === 'air' && card.element.includes('هواء')) ||
                          (activeFilter === 'earth' && card.element.includes('تراب'));

      if (!matchFilter) return false;

      if (!query) return true;

      const inAr = (card.name_ar || '').toLowerCase().includes(query);
      const inEn = (card.name_en || '').toLowerCase().includes(query);
      const inNum = String(card.number) === query;
      const inAstro = (card.astrological_link || '').toLowerCase().includes(query);
      const inKw = (card.keywords && card.keywords.general ? card.keywords.general.join(' ') : '').toLowerCase().includes(query);
      const inConcept = (card.core_concept || '').toLowerCase().includes(query);

      return inAr || inEn || inNum || inAstro || inKw || inConcept;
    });

    renderCardsGrid(filtered);
  }

  // Open Modal
  let activeModalCard = null;
  let activeTab = 'overview';

  function openCardModal(card) {
    if (!modalOverlay || !card) return;
    activeModalCard = card;

    const tabsNav = document.querySelector('.modal-tabs');
    if (tabsNav) tabsNav.style.display = '';

    modalTitle.textContent = `${card.name_ar} (${card.name_en})`;
    
    const elClass = getElementClass(card.element);
    const catTitle = card.category === 'major' ? `الأركانا الكبرى - الرقم ${card.number}` : `${card.suit_ar} - الكارت ${card.number}`;
    modalMetaPills.innerHTML = `
      <span class="card-tag">${catTitle}</span>
      <span class="card-tag ${elClass}">عنصر ${card.element}</span>
      <span class="card-tag">${card.astrological_link || ''}</span>
    `;

    switchModalTab('overview');

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.openReferenceModal = function (key) {
    if (!modalOverlay) return;
    const refData = window.AqeeqTarotReferences && window.AqeeqTarotReferences[key];
    if (!refData) return;

    modalTitle.textContent = refData.title;
    modalMetaPills.innerHTML = `
      <span class="card-tag">الموسوعة المرجعية الكبرى</span>
      <span class="card-tag">عقيق أسترو (Aqeeq Astro)</span>
    `;

    const tabsNav = document.querySelector('.modal-tabs');
    if (tabsNav) tabsNav.style.display = 'none';

    modalBody.innerHTML = `
      <div class="card-fulltext">
        <h3 style="color: var(--tarot-gold); margin-bottom: 20px; font-family: var(--display, 'Amiri', serif);">${refData.title}</h3>
        ${formatMarkdown(refData.markdown)}
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    const tabsNav = document.querySelector('.modal-tabs');
    if (tabsNav) tabsNav.style.display = '';
  }

  function switchModalTab(tabKey) {
    activeTab = tabKey;
    modalTabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    renderModalTabContent(tabKey);
  }

  function renderModalTabContent(tabKey) {
    if (!activeModalCard || !modalBody) return;
    const card = activeModalCard;

    let html = '';

    switch (tabKey) {
      case 'overview':
        html = `
          <h3>المعنى الأساسي وجوهر الكارت</h3>
          <p>${card.core_meaning && card.core_meaning.overview ? card.core_meaning.overview.replace(/\n/g, '<br>') : card.core_concept || ''}</p>
          
          <h3>الكلمات المفتاحية</h3>
          <ul>
            ${(card.keywords && card.keywords.general ? card.keywords.general : []).map(k => `<li>${k}</li>`).join('')}
          </ul>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 24px;">
            <div style="background: rgba(212, 175, 55, 0.06); padding: 18px; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.2);">
              <h4 style="color: var(--tarot-gold); margin-bottom: 10px;">المعنى المستقيم (Upright)</h4>
              <p style="font-size: 0.95rem; line-height: 1.8;">${card.core_meaning && card.core_meaning.upright ? card.core_meaning.upright.replace(/\n/g, '<br>') : 'متضمن في التحليل الشامل.'}</p>
            </div>
            <div style="background: rgba(255, 107, 74, 0.06); padding: 18px; border-radius: 12px; border: 1px solid rgba(255, 107, 74, 0.2);">
              <h4 style="color: #ff9179; margin-bottom: 10px;">المعنى المقلوب (Reversed)</h4>
              <p style="font-size: 0.95rem; line-height: 1.8;">${card.core_meaning && card.core_meaning.reversed ? card.core_meaning.reversed.replace(/\n/g, '<br>') : 'متضمن في التحليل الشامل.'}</p>
            </div>
          </div>
        `;
        break;

      case 'psychology':
        html = `
          <h3>التشريح النفسي، ديناميكيات التعلق، والظل الأصلي</h3>
          <p>${card.deep_psychology && card.deep_psychology.text ? card.deep_psychology.text.replace(/\n/g, '<br>') : 'التحليل النفسي الأصلي موثق في التقرير الكامل.'}</p>
        `;
        break;

      case 'practical':
        html = `
          <h3>أبعاد الحياة الواقعية</h3>
          
          <div style="margin-bottom: 24px;">
            <h4 style="color: #ff99aa; margin-bottom: 8px;">❤️ الحب والعلاقات والشراكات</h4>
            <p>${card.practical_domains && card.practical_domains.love_relationships ? card.practical_domains.love_relationships.replace(/\n/g, '<br>') : 'راجع المخطوطة الأصلية.'}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h4 style="color: var(--tarot-gold); margin-bottom: 8px;">💼 العمل والمهنة والدراسة والمشاريع</h4>
            <p>${card.practical_domains && card.practical_domains.career_projects ? card.practical_domains.career_projects.replace(/\n/g, '<br>') : 'راجع المخطوطة الأصلية.'}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h4 style="color: #7ad1ff; margin-bottom: 8px;">💰 المال والوفرة والقرارات المادية</h4>
            <p>${card.practical_domains && card.practical_domains.money_abundance ? card.practical_domains.money_abundance.replace(/\n/g, '<br>') : 'راجع المخطوطة الأصلية.'}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h4 style="color: #a9dca9; margin-bottom: 8px;">🌿 الجسد، الجهاز العصبي، والتأثير السيكوسوماتي</h4>
            <p>${card.practical_domains && card.practical_domains.health_psychosomatics ? card.practical_domains.health_psychosomatics.replace(/\n/g, '<br>') : 'راجع المخطوطة الأصلية.'}</p>
          </div>
        `;
        break;

      case 'symbols':
        html = `
          <h3>الرموز البصرية وعلم التناظر في مدرسة Rider-Waite</h3>
          <p>${card.symbols_breakdown ? card.symbols_breakdown.replace(/\n/g, '<br>') : 'رموز الكارت موضحة في المخطوطة.'}</p>
          
          <h3>المراسلات الفلكية والعددية</h3>
          <p>${card.astrological_correspondences ? card.astrological_correspondences.replace(/\n/g, '<br>') : `الارتباط الفلكي: ${card.astrological_link} | عنصر: ${card.element}`}</p>
        `;
        break;

      case 'inquiry':
        html = `
          <h3>أسئلة التأمل والاستبصار الذاتي</h3>
          <p>${card.inquiry_meditation ? card.inquiry_meditation.replace(/\n/g, '<br>') : 'أسئلة تفكيك الوعي موجودة في المخطوطة.'}</p>

          ${card.card_combinations ? `
            <h3>تفسير الكارت مع الكروت الأخرى (Combinations)</h3>
            <p>${card.card_combinations.replace(/\n/g, '<br>')}</p>
          ` : ''}

          ${card.positional_spreads ? `
            <h3>دلالة الكارت حسب موقعه في السحب (Positional Spreads)</h3>
            <p>${card.positional_spreads.replace(/\n/g, '<br>')}</p>
          ` : ''}
        `;
        break;

      case 'aqeeq':
        html = `
          <h3>منهجية القراءة بأسلوب عقيق أسترو</h3>
          <p>${card.aqeeq_methodology ? card.aqeeq_methodology.replace(/\n/g, '<br>') : 'القراءة متعددة الطبقات بحسب أسلوب عقيق أسترو.'}</p>

          ${card.quotes ? `
            <h3>حكم ومقولات ملهمة للكارت</h3>
            <p>${card.quotes.replace(/\n/g, '<br>')}</p>
          ` : ''}

          ${card.study_takeaway ? `
            <h3>الخلاصة المرجعية ودليل الحفظ السريع</h3>
            <p>${card.study_takeaway.replace(/\n/g, '<br>')}</p>
          ` : ''}
        `;
        break;

      case 'fulltext':
        html = `
          <div style="font-family: monospace; white-space: pre-wrap; font-size: 0.9rem; line-height: 1.7; background: #0c0817; padding: 20px; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.2);">
${escapeHtml(card.full_markdown || '')}
          </div>
        `;
        break;
    }

    modalBody.innerHTML = html;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Setup Event Listeners
  function setupEventListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', filterCards);
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter') || 'all';
        filterCards();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        switchModalTab(tabKey);
      });
    });

    if (inspectCurrentBtn) {
      inspectCurrentBtn.addEventListener('click', () => {
        if (currentCard) {
          openCardModal(currentCard);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTarotData);
  } else {
    loadTarotData();
  }
})();
