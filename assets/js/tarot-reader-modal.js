/**
 * tarot-reader-modal.js - Aqeeq Astro
 * Full-screen Academic Encyclopedia Reader for Tarot References
 * Covers: Spreads, Combinations, Court Cards, Astrology & Decans, Numbers & Elements, Psychology & Shadow Work
 */

(function () {
  'use strict';

  // In-memory cache
  let guidesData = window.AqeeqTarotReferences || null;
  let activeGuideKey = null;

  // Initialize or fetch if needed
  async function getGuide(key) {
    if (guidesData && guidesData[key]) {
      return guidesData[key];
    }
    try {
      const res = await fetch('assets/data/tarot/tarot-encyclopedia-guides.json');
      if (res.ok) {
        guidesData = await res.json();
        window.AqeeqTarotReferences = guidesData;
        return guidesData[key];
      }
    } catch (e) {
      console.warn('Could not fetch tarot-encyclopedia-guides.json, falling back to window cache:', e);
    }
    return window.AqeeqTarotReferences ? window.AqeeqTarotReferences[key] : null;
  }

  // Format Markdown to Clean Semantic HTML with GFM Tables
  function renderEncyclopediaMarkdown(md) {
    if (!md) return '';
    const lines = md.split('\n');
    let html = '';
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    let inList = false;
    let inQuote = false;
    let currentSectionIndex = 0;

    function flushTable() {
      if (!inTable) return;
      html += '<div class="ref-table-responsive"><table class="ref-table"><thead><tr>';
      tableHeaders.forEach(h => {
        html += `<th>${formatInline(h)}</th>`;
      });
      html += '</tr></thead><tbody>';
      tableRows.forEach((row, idx) => {
        html += `<tr class="${idx % 2 === 1 ? 'even-row' : ''}">`;
        row.forEach(c => {
          html += `<td>${formatInline(c)}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    function flushList() {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    }

    function flushQuote() {
      if (inQuote) {
        html += '</blockquote>';
        inQuote = false;
      }
    }

    function formatInline(text) {
      return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="ref-code">$1</code>')
        .trim();
    }

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Markdown Table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList();
        flushQuote();
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          tableRows = [];
        } else if (cells.every(c => /^:?-+:?$/.test(c))) {
          // Separator line - skip
        } else {
          tableRows.push(cells);
        }
        continue;
      } else {
        flushTable();
      }

      if (!trimmed) {
        flushList();
        flushQuote();
        continue;
      }

      // Horizontal Rule
      if (/^---+$/.test(trimmed)) {
        flushList();
        flushQuote();
        html += '<hr class="ref-divider" />';
        continue;
      }

      // Headings
      if (trimmed.startsWith('#### ')) {
        flushList();
        flushQuote();
        html += `<h4 class="ref-h4">${formatInline(trimmed.substring(5))}</h4>`;
        continue;
      }
      if (trimmed.startsWith('### ')) {
        flushList();
        flushQuote();
        html += `<h3 class="ref-h3">${formatInline(trimmed.substring(4))}</h3>`;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        flushQuote();
        currentSectionIndex++;
        const secId = `guide-section-${currentSectionIndex}`;
        html += `<div class="ref-section-anchor" id="${secId}"></div>`;
        html += `<h2 class="ref-h2">${formatInline(trimmed.substring(3))}</h2>`;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        flushQuote();
        html += `<h1 class="ref-h1">${formatInline(trimmed.substring(2))}</h1>`;
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushList();
        if (!inQuote) {
          inQuote = true;
          html += '<blockquote class="ref-quote">';
        }
        html += `<p>${formatInline(trimmed.substring(2))}</p>`;
        continue;
      } else {
        flushQuote();
      }

      // Unordered List item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
          html += '<ul class="ref-list">';
        }
        html += `<li>${formatInline(trimmed.substring(2))}</li>`;
        continue;
      }

      // Ordered list item
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (olMatch) {
        flushList();
        html += `<div class="ref-num-item"><span class="ref-num-badge">${olMatch[1]}</span><div class="ref-num-content">${formatInline(olMatch[2])}</div></div>`;
        continue;
      }

      flushList();
      html += `<p class="ref-p">${formatInline(trimmed)}</p>`;
    }

    flushTable();
    flushList();
    flushQuote();
    return html;
  }

  // Toast Notification
  function showToast(message) {
    const existing = document.querySelector('.tarot-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'tarot-toast';
    toast.innerHTML = `<span>✦</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Open the Reference Reader Modal
  window.openReferenceModal = async function (key) {
    activeGuideKey = key;
    const guide = await getGuide(key);
    if (!guide) {
      alert('لم يتم العثور على محتوى الدليل المطلوب.');
      return;
    }

    const modal = document.getElementById('tarotReferenceReaderModal');
    if (!modal) {
      console.error('Reference Reader Modal element #tarotReferenceReaderModal not found.');
      return;
    }

    // Set Header
    const titleEl = document.getElementById('refReaderTitle');
    const authEl = document.getElementById('refReaderAuthorities');
    const tocBarEl = document.getElementById('refReaderTocBar');
    const bodyEl = document.getElementById('refReaderBody');

    if (titleEl) {
      titleEl.innerHTML = `${guide.title_ar || guide.title} <span class="ref-title-en">${guide.title_en ? `(${guide.title_en})` : ''}</span>`;
    }

    if (authEl && Array.isArray(guide.authorities)) {
      authEl.innerHTML = guide.authorities.map(a => `<span class="ref-auth-pill">📜 ${a}</span>`).join('');
    }

    // Build Table of Contents Bar
    if (tocBarEl && Array.isArray(guide.sections)) {
      let tocHtml = `<span class="ref-toc-label">فهرس المحتويات:</span>`;
      guide.sections.forEach((sec, idx) => {
        const targetId = `guide-section-${idx + 1}`;
        tocHtml += `<button class="ref-toc-pill" onclick="window.scrollToRefSection('${targetId}')">${sec.title}</button>`;
      });
      tocBarEl.innerHTML = tocHtml;
      tocBarEl.style.display = 'flex';
    } else if (tocBarEl) {
      tocBarEl.style.display = 'none';
    }

    // Render Body
    if (bodyEl) {
      let summaryHtml = '';
      if (guide.summary) {
        summaryHtml = `
          <div class="ref-summary-box">
            <div class="ref-summary-icon">✦</div>
            <div class="ref-summary-text">
              <strong>خلاصة الدليل المرجعي:</strong> ${guide.summary}
            </div>
          </div>
        `;
      }

      const formattedContent = renderEncyclopediaMarkdown(guide.full_markdown || guide.markdown);
      bodyEl.innerHTML = summaryHtml + formattedContent;
      bodyEl.scrollTop = 0;
    }

    // Bind Copy Button
    const copyBtn = document.getElementById('refCopyGuideBtn');
    if (copyBtn) {
      copyBtn.onclick = function () {
        const textToCopy = guide.full_markdown || guide.markdown || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span style="color: #22c55e;">تم النسخ!</span>
          `;
          showToast('تم نسخ محتوى الدليل المرجعي بالكامل إلى الحافظة!');
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 3000);
        }).catch(err => {
          console.error('Failed to copy guide:', err);
          showToast('تعذر النسخ تلقائياً، يرجى النسخ اليدوي.');
        });
      };
    }

    // Display Modal
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 10);
  };

  window.openTarotReferenceReader = window.openReferenceModal;

  // Scroll to section inside reader body
  window.scrollToRefSection = function (targetId) {
    const targetEl = document.getElementById(targetId);
    const bodyEl = document.getElementById('refReaderBody');
    if (targetEl && bodyEl) {
      const topOffset = targetEl.offsetTop - bodyEl.offsetTop - 15;
      bodyEl.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  // Close Reference Reader Modal
  window.closeReferenceModal = function () {
    const modal = document.getElementById('tarotReferenceReaderModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 280);
  };

  // Setup DOM Event Listeners when document is ready
  document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('refReaderCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', window.closeReferenceModal);
    }

    const modal = document.getElementById('tarotReferenceReaderModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeReferenceModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('tarotReferenceReaderModal');
        if (modal && modal.classList.contains('open')) {
          window.closeReferenceModal();
        }
      }
    });
  });

})();
