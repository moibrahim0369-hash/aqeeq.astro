/**
 * Workbench Library Engine (workbench-library.js)
 * Manages the 78-card encyclopedia, search, filtering, and detailed inspection modal
 * for the Academic Tarot Workbench (workbench.html).
 */

(function () {
  'use strict';

  let tarotData = [];
  let currentCard = null;
  let activeTab = 'overview';

  // DOM Elements
  const searchInput = document.getElementById('tarotSearchInput');
  const cardsGrid = document.getElementById('tarotCardsGrid');
  const filterChips = document.querySelectorAll('.chip');
  const totalCountDisplay = document.getElementById('totalCountDisplay');

  // Modal Elements
  const modalOverlay = document.getElementById('tarotModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMetaPills = document.getElementById('modalMetaPills');
  const modalBody = document.getElementById('modalBody');
  const modalTabs = document.querySelectorAll('.modal-tab');

  function getElementClass(el) {
    if (!el) return '';
    if (el.includes('نار')) return 'fire';
    if (el.includes('ماء')) return 'water';
    if (el.includes('هواء')) return 'air';
    if (el.includes('تراب')) return 'earth';
    return '';
  }

  async function loadTarotData() {
    try {
      const response = await fetch('assets/data/tarot/tarot-library.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      tarotData = Array.isArray(data) ? data : (data.cards || []);

      if (totalCountDisplay) {
        totalCountDisplay.textContent = `الموسوعة المكتملة: ${tarotData.length} بطاقة مفعلة بالكامل (الأركانا الكبرى 22 + الأركانا الصغرى 56)`;
      }

      renderCardsGrid(tarotData);
      setupEventListeners();
    } catch (error) {
      console.error('Error loading tarot database:', error);
      if (cardsGrid) {
        cardsGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--tarot-text-muted);">
            <p>تعذر تحميل بيانات التاروت حالياً. يرجى إعادة تحديث الصفحة.</p>
          </div>
        `;
      }
    }
  }

  function renderCardsGrid(cards) {
    if (!cardsGrid) return;
    cardsGrid.innerHTML = '';

    if (!cards || cards.length === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--tarot-text-muted);">
          <p>لم يتم العثور على بطاقات مطابقة لخيارات البحث المحددة.</p>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    cards.forEach((card) => {
      const item = document.createElement('div');
      item.className = 'tarot-grid-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `عرض تفاصيل بطاقة ${card.name_ar}`);

      const glyph = card.astrological_link || (card.category === 'major' ? '✦' : '✧');
      const elClass = getElementClass(card.element);
      const arcanaLabel = card.category === 'major' ? `الأركانا الكبرى · ${card.number}` : `${card.suit_ar} · ${card.number}`;

      item.innerHTML = `
        <div class="grid-item-header">
          <span class="grid-item-arcana">${arcanaLabel}</span>
          <span class="grid-item-glyph">${glyph}</span>
        </div>
        <div class="grid-item-title">${card.name_ar}</div>
        <div class="grid-item-title-en" dir="ltr">${card.name_en}</div>
        <div class="grid-item-footer">
          <span class="grid-item-tag ${elClass}">عنصر ${card.element}</span>
        </div>
      `;

      item.addEventListener('click', () => openCardModal(card));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCardModal(card);
        }
      });

      fragment.appendChild(item);
    });

    cardsGrid.appendChild(fragment);
  }

  function filterCards() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeChip = document.querySelector('.chip.active');
    const category = activeChip ? activeChip.getAttribute('data-filter') : 'all';

    let filtered = tarotData.filter((card) => {
      let matchesCat = true;
      if (category === 'major') {
        matchesCat = card.category === 'major';
      } else if (['wands', 'cups', 'swords', 'pentacles'].includes(category)) {
        matchesCat = card.suit === category;
      }

      if (!matchesCat) return false;

      if (!query) return true;

      const nameAr = (card.name_ar || '').toLowerCase();
      const nameEn = (card.name_en || '').toLowerCase();
      const element = (card.element || '').toLowerCase();
      const astro = (card.astrological_link || '').toLowerCase();
      const keywords = Array.isArray(card.keywords) ? card.keywords.join(' ').toLowerCase() : '';

      return nameAr.includes(query) ||
             nameEn.includes(query) ||
             element.includes(query) ||
             astro.includes(query) ||
             keywords.includes(query);
    });

    renderCardsGrid(filtered);
  }

  function openCardModal(card) {
    if (!card || !modalOverlay) return;
    currentCard = card;

    if (modalTitle) modalTitle.textContent = `${card.name_ar} (${card.name_en})`;

    if (modalMetaPills) {
      const arcanaLabel = card.category === 'major' ? `الأركانا الكبرى · ${card.number}` : `${card.suit_ar} · ${card.rank || card.number}`;
      modalMetaPills.innerHTML = `
        <span class="modal-pill gold">${arcanaLabel}</span>
        <span class="modal-pill">عنصر ${card.element}</span>
        ${card.astrological_link ? `<span class="modal-pill">${card.astrological_link}</span>` : ''}
      `;
    }

    switchModalTab(activeTab);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Open modal globally for workbench studio inspection button
  window.openTarotCardModal = openCardModal;
  window.openTarotCardModalById = function (cardId) {
    if (!tarotData || tarotData.length === 0) return;
    const card = tarotData.find(c => c.id === cardId);
    if (card) openCardModal(card);
  };

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchModalTab(tabKey) {
    activeTab = tabKey;
    modalTabs.forEach((tab) => {
      if (tab.getAttribute('data-tab') === tabKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    renderModalTabContent(tabKey);
  }

  function renderModalTabContent(tabKey) {
    if (!modalBody || !currentCard) return;

    let contentHtml = '';

    switch (tabKey) {
      case 'overview':
        contentHtml = `
          <div class="modal-tab-pane active">
            <div class="modal-section-title">
              <span>✦</span>
              <span>الجوهر والمفهوم المركزي (Core Concept)</span>
            </div>
            <p>${escapeHtml(currentCard.core_concept || 'لا يوجد وصف متاح')}</p>

            <div class="modal-section-title">
              <span>✦</span>
              <span>المعنى العام (Core Meaning)</span>
            </div>
            <p>${escapeHtml((currentCard.core_meaning && currentCard.core_meaning.overview) || 'لا يوجد نص')}</p>

            <div class="meaning-cards-grid">
              <div class="meaning-box upright">
                <div class="meaning-box-title">
                  <span>⬆️</span>
                  <span>في وضع الاعتدال (Upright)</span>
                </div>
                <div>${escapeHtml((currentCard.core_meaning && currentCard.core_meaning.upright) || 'مكتمل')}</div>
              </div>
              <div class="meaning-box reversed">
                <div class="meaning-box-title">
                  <span>🔄</span>
                  <span>في الوضع المقلوب (Reversed)</span>
                </div>
                <div>${escapeHtml((currentCard.core_meaning && currentCard.core_meaning.reversed) || 'مكتمل')}</div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'psychology':
        contentHtml = `
          <div class="modal-tab-pane active">
            <div class="modal-section-title">
              <span>🧠</span>
              <span>التشريح النفسي والنموذج الأصلي (Archetype)</span>
            </div>
            <p><strong>النموذج الأصلي:</strong> ${escapeHtml(currentCard.archetype || 'غير محدد')}</p>
            <p>${escapeHtml((currentCard.deep_psychology && currentCard.deep_psychology.text) || 'لا توجد بيانات')}</p>

            <div class="modal-section-title">
              <span>👥</span>
              <span>عمل الظل (Shadow Work)</span>
            </div>
            <p>${escapeHtml((currentCard.deep_psychology && currentCard.deep_psychology.shadow) || 'لا توجد بيانات')}</p>
          </div>
        `;
        break;

      case 'domains':
        contentHtml = `
          <div class="modal-tab-pane active">
            <div class="modal-section-title">
              <span>❤️</span>
              <span>العلاقات وديناميكيات التعلق</span>
            </div>
            <p>${escapeHtml((currentCard.practical_domains && currentCard.practical_domains.love_relationships) || 'لا توجد بيانات')}</p>

            <div class="modal-section-title">
              <span>💼</span>
              <span>العمل والمشاريع والمال</span>
            </div>
            <p>${escapeHtml((currentCard.practical_domains && currentCard.practical_domains.career_projects) || 'لا توجد بيانات')}</p>
            <p>${escapeHtml((currentCard.practical_domains && currentCard.practical_domains.money_abundance) || '')}</p>

            <div class="modal-section-title">
              <span>🌿</span>
              <span>الجسد والصحة السيكوسوماتية</span>
            </div>
            <p>${escapeHtml((currentCard.practical_domains && currentCard.practical_domains.health_psychosomatics) || 'لا توجد بيانات')}</p>
          </div>
        `;
        break;

      case 'symbols':
        contentHtml = `
          <div class="modal-tab-pane active">
            <div class="modal-section-title">
              <span>👁️</span>
              <span>الرمزية البصرية والأركيتايب</span>
            </div>
            <p>${escapeHtml(currentCard.visual_symbolism || 'لا توجد بيانات رمزية مسجلة')}</p>

            <div class="modal-section-title">
              <span>🌌</span>
              <span>الربط الفلكي والدرجات</span>
            </div>
            <p><strong>الارتباط الفلكي:</strong> ${escapeHtml(currentCard.astrological_link || 'غير محدد')}</p>
            <p>${escapeHtml(currentCard.astrological_correspondences || '')}</p>
          </div>
        `;
        break;

      case 'action':
        contentHtml = `
          <div class="modal-tab-pane active">
            <div class="modal-section-title">
              <span>⚡</span>
              <span>إجراء التمكين السلوكي (Empowerment Action)</span>
            </div>
            <p>${escapeHtml(currentCard.empowerment_action || 'لا يوجد إجراء محدد')}</p>

            <div class="modal-section-title">
              <span>❓</span>
              <span>سؤال الاستبصار والتأمل (Inquiry Question)</span>
            </div>
            <p>${escapeHtml(currentCard.inquiry_question || currentCard.inquiry_meditation || 'لا يوجد سؤال مسجل')}</p>
          </div>
        `;
        break;

      default:
        contentHtml = `<p>المحتوى قيد المراجعة والتدقيق.</p>`;
    }

    modalBody.innerHTML = contentHtml;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function setupEventListeners() {
    if (searchInput) searchInput.addEventListener('input', filterCards);

    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        filterCards();
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    modalTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabKey = tab.getAttribute('data-tab');
        switchModalTab(tabKey);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', loadTarotData);
})();
