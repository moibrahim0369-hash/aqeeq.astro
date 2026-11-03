/**
 * Aqeeq Astro — Destiny Matrix Engine & UI (Ivory & Champagne Gold Edition)
 * Natalia Ladini — 22 Major Arcana System
 *
 * Implements:
 * 1. 8-Pointed Star SVG Geometry (Calculated Responsive Geometry)
 * 2. 15-Section Luxury Accordion (Ivory & Champagne Gold Theme)
 * 3. Unified Content Architecture with Structured Slots
 * 4. Interactive Node Highlighting & Direct Navigation
 * 5. Full Backward Compatibility with Existing Tests & Contracts
 */

(() => {
  'use strict';

  const adapter = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
  if (!adapter) {
    console.warn('MatrixMethodAdapter not loaded yet; will defer initialization.');
  }

  // ==================== 1. التوليد الهندسي لرسم الـ SVG ====================

  /**
   * توليد رسم SVG النجمة الثمانية متناسق الإحداثيات (viewBox 0 0 800 800)
   */
  // ==================== 0. أيقونات خطية موحدة (Monoline 1.7) بدل الإيموجي ====================
  const SVG_OPEN = '<svg class="aqm-ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const ICON_SVG = {
    center: SVG_OPEN + '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"/></svg>',
    karmic_tail: SVG_OPEN + '<circle cx="12" cy="5" r="2"/><path d="M12 7v13M8 11h8M6 16a6 6 0 0 0 12 0"/></svg>',
    purposes: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    personal: SVG_OPEN + '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    talents: SVG_OPEN + '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
    father_line: SVG_OPEN + '<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg>',
    mother_line: SVG_OPEN + '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="7" r="2.5"/><circle cx="17" cy="12" r="2.5"/><circle cx="12" cy="17" r="2.5"/><circle cx="7" cy="12" r="2.5"/></svg>',
    ancestral_programs: SVG_OPEN + '<path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>',
    love_line: SVG_OPEN + '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
    money_line: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M14.5 9.5c0-1-1-1.5-2.5-1.5s-2.5.6-2.5 1.6 1 1.4 2.5 1.7 2.5.7 2.5 1.7-1 1.6-2.5 1.6-2.5-.6-2.5-1.6"/></svg>',
    chakras: SVG_OPEN + '<circle cx="12" cy="5" r="2"/><path d="M12 7v4M7 13c1.5 2.5 8.5 2.5 10 0M9 17h6"/></svg>',
    composite_programs: SVG_OPEN + '<circle cx="12" cy="11" r="7"/><path d="M9 20h6M10 22h4"/></svg>',
    children_line: SVG_OPEN + '<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/></svg>',
    age_cycles: SVG_OPEN + '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/></svg>',
    transformation_rx: SVG_OPEN + '<path d="M12 4v16M6 20h12M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>'
  };

  // مسار الحياة: نفس منهج الجمع الكلي (index.html) مع الإبقاء على 11 و22 و33
  function lifePathOf(dateStr) {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    const ds = n => String(n).split('').reduce((a, c) => a + Number(c), 0);
    let n = ds(d) + ds(m) + ds(y);
    while (n > 9 && ![11, 22, 33].includes(n)) n = ds(n);
    return n;
  }

  // ألوان الشاكرات المعتمدة (من أعلى لأسفل)
  const CHAKRA_COLORS = { sahasrara: '#8E6E85', ajna: '#4E7988', vishuddha: '#7EA0B7', anahata: '#5A7E64', manipura: '#E6C280', svadhisthana: '#C06C54', muladhara: '#8B263E' };

  // ==================== 0b. تصدير بطاقة القصة (PNG 9:16) ====================
  function exportStoryCard(host, P, name, dateStr) {
    const svgEl = host.querySelector('.aqm-svg');
    if (!svgEl) return;
    const W = 1080, H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    // خلفية كريمية دافئة بتدرج رأسي
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#FDFBF7'); bgGrad.addColorStop(1, '#F5EFEB');
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.direction = 'rtl';
    ctx.fillStyle = '#6B263D'; ctx.font = '700 64px serif';
    ctx.fillText('عقيق أسترو', W / 2, 150);
    ctx.fillStyle = '#C5A46D'; ctx.fillRect(W / 2 - 120, 185, 240, 3);
    ctx.fillStyle = '#2D2522'; ctx.font = '700 58px serif';
    ctx.fillText(name || 'مستخدم عقيق أسترو', W / 2, 290);
    ctx.fillStyle = '#74685F'; ctx.font = '400 38px serif';
    ctx.fillText('تاريخ الميلاد: ' + dateStr + '   ·   الطاقة الحاكمة: ' + P.anchors.E, W / 2, 350);

    const clone = svgEl.cloneNode(true);
    clone.setAttribute('width', '900'); clone.setAttribute('height', '900');
    // النسخة المصدّرة فقط: خلفية الرسم شفافة لتظهر العلامة المائية، وتسميات الأعمار أرقام هادئة بدون كلمة "سنة"
    clone.querySelector('.aqm-svg-bg')?.remove();
    // الصورة المرسومة لا تستقبل CSS الصفحة: نثبّت لون الرقم وحجمه ومحاذاته داخل النسخة المصدّرة مباشرة
    clone.querySelectorAll('.aqm-node-text').forEach(t => {
      t.style.fill = t.getAttribute('fill') || '#1A1A1A';
      t.style.fontSize = (t.getAttribute('font-size') || '22') + 'px';
      t.style.fontWeight = '800';
      t.style.textAnchor = 'middle';
      t.style.dominantBaseline = 'central';
    });
    clone.querySelectorAll('.aqm-svg-age-label').forEach(t => {
      t.textContent = t.textContent.replace(/\s*سنة\s*/g, '').replace(/\s+/g, '').trim();
      t.style.fill = '#8A7A70';
      t.style.fontWeight = '600';
    });
    const svgStr = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      // علامة مائية خافتة جداً خلف الرسم الهندسي (لا تؤثر على قراءة الأرقام)
      ctx.save();
      ctx.translate(W / 2, 870); ctx.rotate(-30 * Math.PI / 180);
      ctx.fillStyle = 'rgba(142, 40, 0, 0.03)'; ctx.font = '900 150px serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('عقيق أسترو', 0, 0);
      ctx.restore();
      ctx.textBaseline = 'alphabetic';
      ctx.drawImage(img, (W - 900) / 2, 420, 900, 900);
      const caps = [
        ['الجوهر', P.anchors.A],
        ['مسار الحياة', lifePathOf(dateStr)],
        ['الذيل الكارمي', P.anchors.D],
        ['خط المال', P.channels.moneyPoint],
        ['خط الحب', P.channels.heartPoint]
      ];
      const capW = 190, capH = 168, gap = 18, startX = (W - (capW * caps.length + gap * (caps.length - 1))) / 2;
      caps.forEach((c, i) => {
        const x = startX + i * (capW + gap), y = 1450;
        // بطاقة زجاجية: تعبئة بيضاء شبه شفافة وحد ناعم وظل خفيف
        ctx.save();
        ctx.shadowColor = 'rgba(92, 44, 34, 0.10)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, capW, capH, 30) : ctx.rect(x, y, capW, capH);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(215, 196, 182, 0.85)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, capW, capH, 30) : ctx.rect(x, y, capW, capH);
        ctx.stroke();
        ctx.fillStyle = '#7D6B63'; ctx.font = '700 28px serif';
        ctx.fillText(c[0], x + capW / 2, y + 52);
        ctx.fillStyle = '#4A1E17'; ctx.font = '800 78px serif';
        ctx.fillText(String(c[1]), x + capW / 2, y + 134);
      });
      ctx.fillStyle = '#74685F'; ctx.font = '400 28px serif';
      ctx.fillText('مصفوفة القدر · للتأمل والوعي الذاتي', W / 2, 1720);
      URL.revokeObjectURL(img.src);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'aqeeq-destiny-story.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }, 'image/png');
    };
    img.src = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
  }

  function generateMatrixSVG(P) {
    const { anchors, corners, channels, intermediate, ageMap, generational } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    // الجمع الاختزالي 22 من المحرك نفسه (لا تغيير في منطق الحساب): تُستخدم فقط لرسم النقاط الأفقية اليسرى
    const reduce22 = n => (window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter).reduceArcana(n);
    const hP1 = reduce22(A + E);
    const hP2 = reduce22(hP1 + E);
    const hP3 = reduce22(hP1 + A);
    // مسار المال الأيمن من المركز E نحو C: 14 = reduce22(E+E)، 21 = reduce22(14+E)، ثم m1 و m2 (ومن محرك الحساب: B2 و D2 و D3)
    const nE1 = reduce22(E + E);
    const nE2 = reduce22(nE1 + E);
    const mP1 = reduce22(C + E);
    const mP2 = reduce22(mP1 + C);
    const tB = reduce22(B + intermediate.B2);
    const tTop3 = reduce22(generational.ancestralCenter + intermediate.B2); // 14 + 16 = 30 → 3
    const tLove20 = reduce22(intermediate.D2 + intermediate.D3); // 15 + 5 = 20
    const T = { purple: '#8E6E85', petrol: '#4E7988', sky: '#7EA0B7', green: '#5A7E64', solar: '#E6C280', orange: '#C06C54', wine: '#8B263E', white: '#FFFFFF' };
    const DARK = [T.purple, T.petrol, T.green, T.orange, T.wine];
    const { heartPoint, moneyPoint, balancePoint } = channels;

    // الإحداثيات الهندسية المعتمدة (المركز 400, 400) — لا تتغير
    const pos = {
      center: [400, 400],
      west: [130, 400],      // A — 0 سنة
      north: [400, 130],     // B — 20 سنة
      east: [670, 400],      // C — 40 سنة
      south: [400, 670],     // D — 60 سنة
      northWest: [210, 210], // F — 10 سنين
      northEast: [590, 210], // G — 30 سنة
      southEast: [590, 590], // H — 50 سنة
      southWest: [210, 590], // I — 70 سنة
      A2: [265, 400],
      B2: [400, 265],
      C2: [535, 400],
      D2: [400, 535],
      D3: [400, 602],
      heart: [445, 490],
      money: [490, 445],
      balance: [515, 515]
    };

    const r2 = n => Math.round(n * 100) / 100;
    const polar = (radius, deg) => [400 + radius * Math.cos(deg * Math.PI / 180), 400 + radius * Math.sin(deg * Math.PI / 180)];
    // العمر 0 عند الغرب ويتقدم مع اتجاه عقارب الساعة حتى 80 سنة
    const ageDeg = age => 180 + (age / 80) * 360;
    // تقصير الخط بمقدار d من طرفيه حتى لا يغطي العُقد
    const shorten = (p, q, d) => {
      const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      return [[p[0] + ux * d, p[1] + uy * d], [q[0] - ux * d, q[1] - uy * d]];
    };

    // مسطرة القياس الفلكية: 80 تدريجة (سنة لكل تدريجة) وأرقام كل 10 سنين
    let ticks = '';
    for (let y = 0; y < 80; y++) {
      const d = ageDeg(y);
      const major = y % 10 === 0;
      const a = polar(major ? 330 : 344, d), b = polar(356, d);
      ticks += `<line x1="${r2(a[0])}" y1="${r2(a[1])}" x2="${r2(b[0])}" y2="${r2(b[1])}" class="aqm-svg-tick${major ? ' is-major' : ''}" />`;
    }
    let ageLabels = '';
    for (let y = 0; y < 80; y += 10) {
      const p = polar(312, ageDeg(y));
      ageLabels += `<text x="${r2(p[0])}" y="${r2(p[1])}" class="aqm-svg-age-label">${y === 0 ? '0/80' : y}</text>`;
    }

    // أسهم خطوط الأسلاف (خط الأب: F → H، خط الأم: G → I)
    const [fatherA, fatherB] = shorten(pos.northWest, pos.southEast, 26);
    const [motherA, motherB] = shorten(pos.northEast, pos.southWest, 26);

    const nodeG = (cls, section, title, arc, p, r, inner, fill) => {
      const st = fill ? ` style="fill:${fill}"` : '';
      const dark = !!fill && DARK.includes(fill);
      const tc = dark ? ' is-dark' : '';
      // حجم الرقم يتناسب مع قطر الدائرة (نحو 60% من القطر عرضاً): يُكتب كخاصية على وسم <text> نفسه
      const fs = r >= 26 ? 34 : r >= 23 ? 27 : 22;
      const txtFill = dark ? '#ffffff' : '#1A1A1A';
      return `
        <g class="aqm-node ${cls}${r >= 26 ? ' aqm-node-primary' : ''}" data-section="${section}" data-title="${title}" data-arcana="${arc}" transform="translate(${p[0]}, ${p[1]})">
          <circle cx="0" cy="0" r="${r}" class="aqm-node-bg"${st} />
          ${inner || ''}
          <text x="0" y="0" class="aqm-node-text${tc}" font-size="${fs}" font-weight="bold" fill="${txtFill}" text-anchor="middle" dominant-baseline="central">${arc}</text>
        </g>`;
    };

    return `
      <svg class="aqm-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="رسم مصفوفة القدر الهندسية">
        <style>
          svg.aqm-svg .aqm-svg-bg { fill: #FAF7F0; }
          svg.aqm-svg .aqm-svg-dial-ring { fill: none; stroke: #C5A46D; stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-dial-ring.is-outer { stroke-width: 2.6; }
          svg.aqm-svg .aqm-svg-tick { stroke: #C5A46D; stroke-width: 1; }
          svg.aqm-svg .aqm-svg-tick.is-major { stroke: #6B263D; stroke-width: 1.4; }
          svg.aqm-svg .aqm-svg-guide { fill: none; stroke: rgba(197, 164, 109, 0.22); stroke-width: 1.2; stroke-dasharray: 4, 6; }
          svg.aqm-svg .aqm-svg-personal-square { fill: none; stroke: #6B263D; stroke-width: 2.4; stroke-opacity: 1; }
          svg.aqm-svg .aqm-svg-ancestral-square { fill: none; stroke: #C5A46D; stroke-width: 1.8; stroke-dasharray: 6, 4; }
          svg.aqm-svg .aqm-svg-axis { stroke: rgba(107, 38, 61, 0.6); stroke-width: 2; }
          svg.aqm-svg .aqm-svg-father { stroke: #C5A46D; stroke-width: 2.4; }
          svg.aqm-svg .aqm-svg-mother { stroke: #6B263D; stroke-width: 2.4; }
          svg.aqm-svg .aqm-svg-love-channel { stroke: #C89B9E; stroke-width: 2; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-money-channel { stroke: #C5A46D; stroke-width: 2; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-age-label { fill: #5E4A52; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
          svg.aqm-svg .aqm-svg-money-sign { fill: #5E7D52; font-size: 18px; font-weight: 700; }
          svg.aqm-svg .aqm-node-bg { fill: #FFFFFF; stroke: #C5A46D; stroke-width: 1.5; }
          svg.aqm-svg .aqm-node-text { font-weight: 700; }
          svg.aqm-svg .aqm-node-text { fill: #6B263D; font-weight: 800; }
          svg.aqm-svg .aqm-node-love .aqm-node-bg { stroke: #C89B9E; }
          svg.aqm-svg .aqm-node-money .aqm-node-bg { stroke: #C5A46D; }
          svg.aqm-svg .aqm-node-balance .aqm-node-bg { fill: #E7D7C2; }
          svg.aqm-svg .aqm-node-balance .aqm-node-text { fill: #2D2522; }
          svg.aqm-svg .aqm-node-center .aqm-node-bg { fill: #FFFFFF; stroke: #6B263D; stroke-width: 2.6; }
          svg.aqm-svg .aqm-node-center .aqm-node-ring { fill: none; stroke: #C5A46D; stroke-width: 1.2; }
          svg.aqm-svg .aqm-node-center .aqm-node-text { fill: #6B263D; font-size: 30px; font-weight: 800; }
        </style>
        <defs>
          <radialGradient id="aqm-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.55" />
            <stop offset="55%" stop-color="#E6C280" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#E6C280" stop-opacity="0" />
          </radialGradient>
          <marker id="aqm-arr-father" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#C5A46D" />
          </marker>
          <marker id="aqm-arr-mother" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#6B263D" />
          </marker>
        </defs>

        <!-- الخلفية العاجية والإطار الدائري المزدوج -->
        <rect x="0" y="0" width="800" height="800" rx="28" class="aqm-svg-bg" />
        <circle cx="400" cy="400" r="372" class="aqm-svg-dial-ring is-outer" />
        <circle cx="400" cy="400" r="356" class="aqm-svg-dial-ring" />
        ${ticks}
        ${ageLabels}
        <circle cx="400" cy="400" r="270" class="aqm-svg-guide" />

        <!-- المربع الشخصي والأسلاف والمحاور -->
        <polygon points="${pos.west[0]},${pos.west[1]} ${pos.north[0]},${pos.north[1]} ${pos.east[0]},${pos.east[1]} ${pos.south[0]},${pos.south[1]}" class="aqm-svg-personal-square" />
        <polygon points="${pos.northWest[0]},${pos.northWest[1]} ${pos.northEast[0]},${pos.northEast[1]} ${pos.southEast[0]},${pos.southEast[1]} ${pos.southWest[0]},${pos.southWest[1]}" class="aqm-svg-ancestral-square" />
        <line x1="${pos.west[0]}" y1="${pos.west[1]}" x2="${pos.east[0]}" y2="${pos.east[1]}" class="aqm-svg-axis" />
        <line x1="${pos.north[0]}" y1="${pos.north[1]}" x2="${pos.south[0]}" y2="${pos.south[1]}" class="aqm-svg-axis" />
        <line x1="${fatherA[0]}" y1="${fatherA[1]}" x2="${fatherB[0]}" y2="${fatherB[1]}" class="aqm-svg-father" marker-end="url(#aqm-arr-father)" />
        <line x1="${motherA[0]}" y1="${motherA[1]}" x2="${motherB[0]}" y2="${motherB[1]}" class="aqm-svg-mother" marker-end="url(#aqm-arr-mother)" />

        <!-- مسارات الحب والمال -->
        <line x1="${pos.center[0]}" y1="${pos.center[1]}" x2="${pos.heart[0]}" y2="${pos.heart[1]}" class="aqm-svg-love-channel" />
        <line x1="${pos.heart[0]}" y1="${pos.heart[1]}" x2="${pos.balance[0]}" y2="${pos.balance[1]}" class="aqm-svg-love-channel" />
        <line x1="${pos.center[0]}" y1="${pos.center[1]}" x2="${pos.money[0]}" y2="${pos.money[1]}" class="aqm-svg-money-channel" />
        <line x1="${pos.money[0]}" y1="${pos.money[1]}" x2="${pos.balance[0]}" y2="${pos.balance[1]}" class="aqm-svg-money-channel" />
        <g class="aqm-svg-heart-icon" transform="translate(${pos.heart[0] - 30}, ${pos.heart[1] - 34}) scale(0.7)">
          <path d="M12 21 C12 21 3 14.5 3 8.5 C3 5.4 5.4 3 8.2 3 C9.8 3 11.2 3.9 12 5.2 C12.8 3.9 14.2 3 15.8 3 C18.6 3 21 5.4 21 8.5 C21 14.5 12 21 12 21 Z" fill="#B5443E" />
        </g>
        <text x="${pos.money[0] + 26}" y="${pos.money[1] - 22}" class="aqm-svg-money-sign">$</text>

        <!-- المركز الجوهري E بهالة شمسية -->
        <circle cx="400" cy="400" r="72" fill="url(#aqm-halo)" />

        <!-- العُقد التفاعلية (المعرّفات مطابقة لأقسام الأكورديون) -->
        ${nodeG('aqm-node-corner', 'personal', 'طاقة الشخصية والجوهر (اليوم)', A, pos.west, 26, null, '#8E6E85')}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح والمواهب (الشهر)', B, pos.north, 26, null, '#8E6E85')}
        ${nodeG('aqm-node-corner', 'money_line', 'طاقة المادة والصحة (السنة)', C, pos.east, 26, null, '#8B263E')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي الأساسي (Past Karma)', D, pos.south, 26, null, '#8B263E')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي (نقطة وسطى D3)', intermediate.D3, pos.D3, 19, null, '#FFFFFF')}
        ${nodeG('aqm-node-corner', 'karmic_tail', 'الذيل الكارمي (مدخل القلب D2)', intermediate.D2, pos.D2, 19, null, '#C06C54')}
        ${nodeG('aqm-node-ancestral', 'father_line', 'سلالة الأب العليا (مواهب الأب)', F, pos.northWest, 23)}
        ${nodeG('aqm-node-ancestral', 'mother_line', 'سلالة الأم العليا (مواهب الأم)', G, pos.northEast, 23)}
        ${nodeG('aqm-node-ancestral', 'father_line', 'سلالة الأب السفلى (كارما المادة)', H, pos.southEast, 23)}
        ${nodeG('aqm-node-ancestral', 'mother_line', 'سلالة الأم السفلى (كارما المشاعر)', I, pos.southWest, 23)}
        ${nodeG('aqm-node-love', 'love_line', 'مدخل الحب والعلاقات (Heart Point)', heartPoint, pos.heart, 21)}
        ${nodeG('aqm-node-money', 'money_line', 'مدخل المال والوفرة (Money Point)', moneyPoint, pos.money, 21)}
        ${nodeG('aqm-node-ancestral', 'father_line', 'خط الأب — الجمع الكلي عند تقاطع المحور المائل', generational.father.combined, [265, 265], 19)}
        ${nodeG('aqm-node-ancestral', 'mother_line', 'خط الأم — الجمع الكلي عند تقاطع المحور المائل', generational.mother.combined, [265, 535], 19)}
        ${nodeG('aqm-node-balance', 'love_line', 'نقطة التوازن بين الحب والمال (Balance)', balancePoint, pos.balance, 20)}
        <!-- المحور الأفقي الأيسر من A إلى E: 21 ← 14 ← 21 -->
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(p1+A)', hP3, [200, 400], 19, '', T.petrol)}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(A+E)', hP1, [265, 400], 19, '', T.sky)}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(p1+E)', hP2, [330, 400], 19, '', T.green)}
        <!-- المحور الأيمن من E إلى C: 14 ← 21 ← 17 ← 9 -->
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(E+E)', nE1, [490, 400], 19, '', T.white)}
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(p+E)', nE2, [530, 400], 19, '', T.white)}
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(C+E)', mP1, [570, 400], 19, '', T.orange)}
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(m1+C)', mP2, [610, 400], 19, '', T.white)}
        <text x="570" y="344" class="aqm-svg-money-sign" fill="#5A7E64">$</text>
        <!-- المحور الرأسي الأعلى: B(9) ← 7 ← B2(16) -->
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — reduce22(B+B2)', tB, [400, 200], 19, '', T.petrol)}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — B2 (B+E)', intermediate.B2, pos.B2, 19, '', T.sky)}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — reduce22(14+16)', tTop3, [400, 330], 19, '', T.green)}
        ${nodeG('aqm-node-love', 'love_line', 'خط الحب — reduce22(15+5)', tLove20, [460, 552], 19, '', T.white)}
        <g class="aqm-node aqm-node-center" data-section="center" data-title="مركز راحة الروح والجوهر الأساسي" data-arcana="${E}" transform="translate(${pos.center[0]}, ${pos.center[1]})">
          <circle cx="0" cy="0" r="44" class="aqm-node-bg" style="fill:#E6C280" />
          <circle cx="0" cy="0" r="38" class="aqm-node-ring" />
          <text x="0" y="0" class="aqm-node-text" font-size="42" font-weight="bold" fill="#1A1A1A" text-anchor="middle" dominant-baseline="central">${E}</text>
        </g>
      </svg>
      <div id="aqm-tooltip" role="tooltip"></div>
    `;
  }


  // ==================== 2. بنية الأكورديون الـ 12 وحقن النصوص ====================

  /**
   * إنشاء كارت قسم الأكورديون وفق بنية المحتوى المعتمدة
   */
  function buildAccordionItem(item) {
    const { id, icon, title, subtitle, arcanaList, contentKey, slots } = item;
    const badgesHtml = arcanaList.map((a, i) => `<span class="aqm-badge-arcana aqm-tone-${i % 4}">${a.num} · ${a.name}</span>`).join(' ');
    // Pending Content: any of the five slots empty means the section is not complete textually
    const isPending = !slots || Object.values(slots).some(v => !String(v || '').trim());
    const pendingHtml = isPending ? `<span class="aqm-pending-badge" data-pending="true">Pending Content</span>` : '';

    return `
      <div class="aqm-acc-item${isPending ? ' is-pending' : ''}" id="aqm-sec-${id}" data-section-id="${id}" data-content-key="${contentKey}" data-pending="${isPending}">
        <button class="aqm-acc-header" type="button" aria-expanded="false" aria-controls="aqm-body-${id}">
          <div class="aqm-acc-header-left">
            <span class="aqm-acc-icon" aria-hidden="true">${ICON_SVG[id] || ''}</span>
            <div class="aqm-acc-title-group">
              <h3 class="aqm-acc-title">${title}</h3>
              <p class="aqm-acc-subtitle">${subtitle}</p>
            </div>
          </div>
          <div class="aqm-acc-badges">
            ${pendingHtml}
            ${badgesHtml}
          </div>
          <span class="aqm-acc-chevron" aria-hidden="true">›</span>
        </button>

        <div class="aqm-acc-body" id="aqm-body-${id}">
          <div class="aqm-content-grid">
            <!-- النص الأساسي -->
            <div class="aqm-slot aqm-slot-primary" data-slot="primary">
              <h4 class="aqm-slot-title">النص الأساسي</h4>
              <p class="aqm-slot-p">${slots.primary}</p>
            </div>

            <!-- التفسير التفصيلي والعميق -->
            <div class="aqm-slot aqm-slot-detailed" data-slot="detailed">
              <h4 class="aqm-slot-title">التفسير التفصيلي والعميق</h4>
              <p class="aqm-slot-p">${slots.detailed}</p>
            </div>

            <!-- نقاط القوة والتجلي الإيجابي -->
            <div class="aqm-slot aqm-slot-strengths" data-slot="strengths">
              <h4 class="aqm-slot-title">نقاط القوة والتجلي الإيجابي (النور)</h4>
              <p class="aqm-slot-p">${slots.strengths}</p>
            </div>

            <!-- التحديات والجانب الظلي -->
            <div class="aqm-slot aqm-slot-challenges" data-slot="challenges">
              <h4 class="aqm-slot-title">التحديات والجانب الظلي (الظل)</h4>
              <p class="aqm-slot-p">${slots.challenges}</p>
            </div>

            <!-- التطبيق العملي وخطوات التوازن -->
            <div class="aqm-slot aqm-slot-practical" data-slot="practical">
              <h4 class="aqm-slot-title">خطوات التوازن والتطبيق اليومي</h4>
              <p class="aqm-slot-p">${slots.practical}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * بناء الأقسام الـ 12 المعتمدة وفق مواصفات المستخدم
   */
  function build15Sections(P) {
    const getInfo = n => adapter.getArcanaInfo(n);
    const destinyData = (typeof AqeeqDestinyMatrixData !== 'undefined' ? AqeeqDestinyMatrixData : (typeof window !== 'undefined' && window.AqeeqDestinyMatrixData ? window.AqeeqDestinyMatrixData : null));
    const getProfile = n => (destinyData && destinyData.getArcana ? destinyData.getArcana(n) : null);

    const { anchors, corners, channels, generational, purposes, chakras, intermediate } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    const { heartPoint, moneyPoint, balancePoint } = channels;

    // Rich profile helpers
    const arcE = getProfile(E);
    const arcA = getProfile(A);
    const arcB = getProfile(B);
    const ktData = destinyData && destinyData.getKarmicTail ? destinyData.getKarmicTail(D, intermediate.D3, intermediate.D2) : null;
    const ancLines = destinyData && destinyData.ancestralLines ? destinyData.ancestralLines : null;

    const sections = [
      // 1. الجوهر والمركز
      {
        id: 'center',
        icon: '👑',
        title: 'الجوهر والمركز — طاقة الروح ومنطقة الراحة',
        subtitle: 'الجوهر النفسي والمنطقة التي تشحن طاقتك عند العودة إليها',
        arcanaList: [{ num: E, name: getInfo(E).name }],
        contentKey: 'matrix.section.center',
        slots: {
          primary: `تحكم مركز مصفوفتك طاقة <strong>${getInfo(E).name} (${E})</strong>. هذه الطاقة تمثل جوهرك الحقيقي والمكان الآمن الذي تلجأ إليه روحك عندما تستنزفك الحياة.`,
          detailed: arcE ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>النموذج الأصلي:</strong> ${arcE.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>مفارقة الطاقة:</strong> ${arcE.paradox || ''}</p>
              ${arcE.psychosomatics ? `<p class="aqm-slot-p"><strong>الدلالة السيكوسوماتية:</strong> ${arcE.psychosomatics}</p>` : ''}
              ${arcE.pastLifeRoot ? `<p class="aqm-slot-p"><strong>الجذر الكارمي:</strong> ${arcE.pastLifeRoot}</p>` : ''}
              ${arcE.mirror ? `<p class="aqm-slot-p aqm-mirror"><strong>المرآة:</strong> ${arcE.mirror}</p>` : ''}
            </div>
          ` : `طاقة المركز هي الحاكم الفعلي لاستقرارك الداخلي. عندما تعيش في تناغم مع ${getInfo(E).name}، تشعر بالسكينة والقدرة على توجيه كل الطاقات الأخرى بمصفوفتك.`,
          strengths: arcE && arcE.light ? arcE.light : getInfo(E).light,
          challenges: arcE && arcE.shadow ? arcE.shadow : getInfo(E).shadow,
          practical: arcE && arcE.somaticRelease ? arcE.somaticRelease : `احرص يومياً على ممارسة أنشطة تمنحك إحساساً بالحرية والاستقرار المرتبط بـ ${getInfo(E).name}.`
        }
      },

      // 2. الذيل الكارمي
      {
        id: 'karmic_tail',
        icon: '⚓',
        title: ktData && ktData.title ? `الذيل الكارمي — ${ktData.title}` : 'الذيل الكارمي — دروس التناسخ والتحديات المتوارثة',
        subtitle: 'الأنماط النفسية المتكررة والمواقف التي تختبر وعيك حتى تحررها (Karmic Tail)',
        arcanaList: [
          { num: D, name: getInfo(D).name },
          { num: intermediate.D3, name: getInfo(intermediate.D3).name },
          { num: intermediate.D2, name: getInfo(intermediate.D2).name }
        ],
        contentKey: 'matrix.section.karmic_tail',
        slots: {
          primary: `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${D} - ${intermediate.D3} - ${intermediate.D2})</strong> بقيادة طاقة الأساس <strong>${getInfo(D).name}</strong>.`,
          detailed: ktData ? `
            <div class="aqm-kt-box">
              <p class="aqm-slot-p"><strong>شفرة الذيل:</strong> ${ktData.code || `${D}-${intermediate.D3}-${intermediate.D2}`}</p>
              <p class="aqm-slot-p"><strong>المفارقة النفسية:</strong> ${ktData.paradox || ''}</p>
              ${ktData.childhoodRoots ? `<p class="aqm-slot-p"><strong>جذور الطفولة والتكوين:</strong> ${ktData.childhoodRoots}</p>` : ''}
              ${ktData.tracks ? `<p class="aqm-slot-p"><strong>مسار التحرر:</strong> ${ktData.tracks.trackTwo || ''}</p>` : ''}
              ${ktData.psychosomatics ? `<p class="aqm-slot-p"><strong>التنبيه الجسدي:</strong> ${ktData.psychosomatics}</p>` : ''}
            </div>
          ` : `الذيل الكارمي هو أكبر محفز للتطور الروحي؛ تظهر دروسه في صورة أنماط متكررة تختبرك حتى تعيها وتفك ارتباطك بالجانب السلبي لطاقة ${getInfo(D).name}.`,
          strengths: `تحويل خبرات الماضي إلى حكمة عميقة، واكتساب مناعة نفسية عالية ترشدك وتلهم المحيطين بك.`,
          challenges: `الوقوع المتكرر في ردود الأفعال القديمة، الشعور بالإحباط عند مواجهة نفس العقبة، أو الاستسلام لنزعات التدمير الذاتي.`,
          practical: ktData && ktData.transformationProtocol && Array.isArray(ktData.transformationProtocol) ?
            ktData.transformationProtocol.join(' • ') : `راقب تصرفاتك في لحظات الضغط الشديد. عندما تشعر برغبة في تكرار النمط الكارمي لـ ${getInfo(D).name}، توقف وخذ خياراً واعياً مختلفاً.`
        }
      },

      // 3. المهمة والغاية
      {
        id: 'purposes',
        icon: '🎯',
        title: 'المهمة والغاية — الغايات الحياتية الأربع الكبرى',
        subtitle: 'الغاية الشخصية، والاجتماعية، والروحية العامة، والغاية الكونية العليا (Purposes)',
        arcanaList: [
          { num: purposes.personal, name: 'الشخصية' },
          { num: purposes.social, name: 'الاجتماعية' },
          { num: purposes.spiritual, name: 'الروحية' },
          { num: purposes.planetary, name: 'الكونية' }
        ],
        contentKey: 'matrix.section.purposes',
        slots: {
          primary: `تتكامل غاياتك الأربع عبر مسارات الحياة: الشخصية <strong>(${purposes.personal})</strong>، الاجتماعية <strong>(${purposes.social})</strong>، الروحية <strong>(${purposes.spiritual})</strong>، والكونية <strong>(${purposes.planetary})</strong>.`,
          detailed: `
            <div class="aqm-purposes-grid">
              <div class="aqm-pillar">
                <h4>الغاية الشخصية <span class="aqm-t-en">Personal Purpose (حتى سن 40)</span></h4>
                <div class="aqm-pillar-num">${purposes.personal}</div>
                <p>تثبيت الذات، النضج الداخلي، ومواءمة محوري السماء والأرض.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الاجتماعية <span class="aqm-t-en">Social Purpose (40 - 60 سنة)</span></h4>
                <div class="aqm-pillar-num">${purposes.social}</div>
                <p>خدمة المجتمع، العطاء للعائلة، وتمرير الخبرات للأجيال القادمة.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الروحية العامة <span class="aqm-t-en">Spiritual Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.spiritual}</div>
                <p>المكافأة الروحية، السلام الداخلي، والاتصال بالحكمة العليا.</p>
              </div>
              <div class="aqm-pillar">
                <h4>الغاية الكونية العليا <span class="aqm-t-en">Planetary Purpose</span></h4>
                <div class="aqm-pillar-num">${purposes.planetary}</div>
                <p>الأثر التراكمي الممتد والرسالة الإنسانية الأوسع نطاقاً.</p>
              </div>
            </div>
          `,
          strengths: `وضوح الرؤية الحياتية، التوازن بين الأهداف الدنيوية والروحية، والشعور العميق بجدوى المسار.`,
          challenges: `الاستعجال في حرق المراحل العمرية، أو التمسك بالأهداف المادية على حساب النضج الروحي.`,
          practical: `راجع أهدافك كل عام لترى أي الغايات الأربع تحتاج منك تركيزاً أكبر في مرحلتك العمرية الحالية.`
        }
      },

      // 4. الشخصية والصورة الخارجية
      {
        id: 'personal',
        icon: '👤',
        title: 'الشخصية والصورة الخارجية — طاقة يوم الميلاد',
        subtitle: 'الانطباع الأول، بطاقة التعارف، وكيف يراك العالم عند أول لقاء (Anchor A)',
        arcanaList: [{ num: A, name: getInfo(A).name }],
        contentKey: 'matrix.section.personal',
        slots: {
          primary: `يمثل يوم ميلادك زاوية الشخصية <strong>${getInfo(A).name} (${A})</strong>. هذه هي بطاقة تعارفك مع العالم.`,
          detailed: arcA ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>الكاريزما والحضور:</strong> ${arcA.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>تحدي الصورة الخارجية:</strong> ${arcA.paradox || ''}</p>
            </div>
          ` : `طاقة يوم الميلاد هي الغلاف الخارجي الذي يتعامل به المجتمع معك. في جانبها الإيجابي تمنحك جاذبية وثقة.`,
          strengths: arcA && arcA.light ? arcA.light : getInfo(A).light,
          challenges: arcA && arcA.shadow ? arcA.shadow : getInfo(A).shadow,
          practical: `استثمر كاريزما ${getInfo(A).name} في تقديم نفسك بصدق وتلقائية، دون افتعال أو تقمص شخصيات أخرى.`
        }
      },

      // 5. المواهب والقدرات
      {
        id: 'talents',
        icon: '✨',
        title: 'المواهب والقدرات — هدايا الروح والإلهام',
        subtitle: 'المواهب الفطرية والاتصال بالإلهام والحدس (Anchor B)',
        arcanaList: [{ num: B, name: getInfo(B).name }],
        contentKey: 'matrix.section.talents',
        slots: {
          primary: `تتوج زاوية المواهب طاقة شهر الميلاد <strong>${getInfo(B).name} (${B})</strong>؛ وهي الهدية التي زودتك بها الروح لتلهم مسارك.`,
          detailed: arcB ? `
            <div class="aqm-rich-card">
              <p class="aqm-slot-p"><strong>جوهر الموهبة والإلهام:</strong> ${arcB.archetype || ''}</p>
              <p class="aqm-slot-p"><strong>مفتاح تفجير الإبداع:</strong> ${arcB.light || ''}</p>
            </div>
          ` : `هذه الزاوية تمثل الاتصال المباشر مع طاقات الإبداع والحدس وتكشف عن مهاراتك الفطرية.`,
          strengths: arcB && arcB.light ? arcB.light : getInfo(B).light,
          challenges: arcB && arcB.shadow ? arcB.shadow : getInfo(B).shadow,
          practical: `خصص وقتاً أسبوعياً لممارسة هواياتك الإبداعية المرتبطة بـ ${getInfo(B).name}.`
        }
      },

      // 6. خط الأب
      {
        id: 'father_line',
        icon: '🛡️',
        title: 'خط الأب — التراث الكارمي لسلالة الذكور',
        subtitle: 'المحور الممتد من زاوية الأب الروحية (F) إلى زاوية الأب المادية (H)',
        arcanaList: [
          { num: F, name: getInfo(F).name },
          { num: H, name: getInfo(H).name },
          { num: generational.father.combined, name: 'محصلة الأب' }
        ],
        contentKey: 'matrix.section.father_line',
        slots: {
          primary: `يربط خط الأب بين الروح <strong>${getInfo(F).name} (${F})</strong> والمادة <strong>${getInfo(H).name} (${H})</strong> بمحصلة كلية <strong>(${generational.father.combined})</strong>.`,
          detailed: `يعكس هذا الخط الدروس المتوارثة من سلالة الذكور (الأب والأجداد): كيفية التعامل مع السلطة، المسؤولية، الإنجاز المالي، والحماية النفسية.`,
          strengths: `القوة العزمية، الصمود أمام التحديات، والانضباط في السعي نحو الأهداف الكبرى.`,
          challenges: `الخوف من الفشل في نظر الأب، أو تكرار أنماط القسوة وكبت المشاعر.`,
          practical: `اعمل على مسامحة أخطاء الأب والأسلاف الذكور، وخذ من تراثهم العزم وتجنب الجفاء العاطفي.`
        }
      },

      // 7. خط الأم
      {
        id: 'mother_line',
        icon: '🌸',
        title: 'خط الأم — التراث الكارمي لسلالة الإناث',
        subtitle: 'المحور الممتد من زاوية الأم الروحية (G) إلى زاوية الأم المادية (I)',
        arcanaList: [
          { num: G, name: getInfo(G).name },
          { num: I, name: getInfo(I).name },
          { num: generational.mother.combined, name: 'محصلة الأم' }
        ],
        contentKey: 'matrix.section.mother_line',
        slots: {
          primary: `يربط خط الأم بين الروح <strong>${getInfo(G).name} (${G})</strong> والمادة <strong>${getInfo(I).name} (${I})</strong> بمحصلة كلية <strong>(${generational.mother.combined})</strong>.`,
          detailed: `يكشف هذا الخط عن التراث العاطفي الموروث من سلالة النساء: جروح الأمومة، التضحية، علاقات الزواج، والقدرة على تقبل الذات وتغذية الإبداع.`,
          strengths: `الدفء العاطفي، الخصوبة الفكرية والإبداعية، والقدرة العالية على الاحتواء والرعاية.`,
          challenges: `التضحية الزائدة على حساب الذات، الشعور بالذنب العاطفي، أو صعوبة وضع حدود صحية.`,
          practical: `أعد بناء علاقتك مع طاقة الأمومة والأم بالامتنان والحرية، وتجنب الذوبان التام في احتياجات الآخرين.`
        }
      },

      // 8. الأجداد والبرامج العائلية
      {
        id: 'ancestral_programs',
        icon: '🏛️',
        title: 'الأجداد والبرامج العائلية — طاقة التراث الجمعي ومحاور الأنساب',
        subtitle: 'العقد والعهود المتوارثة من أجيال السلف وكيفية تحرير شجرة العائلة',
        arcanaList: [
          { num: P.ancestralPrograms.ancestralCenter, name: 'مركز الأجداد' },
          { num: P.ancestralPrograms.commonCenter, name: 'المركز المشترك' }
        ],
        contentKey: 'matrix.section.ancestral_programs',
        slots: {
          primary: `تتكامل محاور الأنساب في نقطة مركز الأجداد <strong>(${P.ancestralPrograms.ancestralCenter})</strong> والمركز المشترك <strong>(${P.ancestralPrograms.commonCenter})</strong> كجامع للتراث العائلي لخط الأب (${generational.father.combined}) وخط الأم (${generational.mother.combined}).`,
          detailed: ancLines ? `
            <div class="aqm-anc-grid">
              <div class="aqm-pillar">
                <h4>${ancLines.maleLine.title}</h4>
                <p>${ancLines.maleLine.description}</p>
                <p><strong>مسار الشفاء:</strong> ${ancLines.maleLine.healingPath}</p>
              </div>
              <div class="aqm-pillar">
                <h4>${ancLines.femaleLine.title}</h4>
                <p>${ancLines.femaleLine.description}</p>
                <p><strong>مسار الشفاء:</strong> ${ancLines.femaleLine.healingPath}</p>
              </div>
            </div>
          ` : `يكشف تقاطع خطوط السلف في مركز الأجداد عن العقد الروحية والأنماط السلوكية المتوارثة عبر الأجيال.`,
          strengths: `الاستناد إلى قوة الجذور التراكمية للعائلة، توارث الحكمة والصمود والبركة الروحية.`,
          challenges: `الشعور بالذنب غير المبرر عند تحقيق نجاح لم يحققه السلف، أو الانغماس في أعباء الماضي.`,
          practical: `عبّر عن الامتنان لجهود الأجداد، وتحرر بوعي من أي قيد أو اعتقاد سلبي يمنعك من النمو.`
        }
      },

      // 9. خط العلاقات والحب
      {
        id: 'love_line',
        icon: '💖',
        title: 'خط العلاقات والحب — الشريك ونقطة القلب',
        subtitle: 'صفات شريك الروح، كيفية الحفاظ على الشغف، ونقطة التقاء العاطفة بالواقع',
        arcanaList: [
          { num: heartPoint, name: getInfo(heartPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.D2, name: 'مدخل القلب' }
        ],
        contentKey: 'matrix.section.love_line',
        slots: {
          primary: `يمر خط علاقاتك بنقطة مدخل القلب <strong>${getInfo(heartPoint).name} (${heartPoint})</strong> وصولاً لنقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يكشف هذا المسار مواصفات الشريك الأنسب لنموك، والبيئة التي يزدهر فيها الحب، والتحديات العاطفية التي تتطلب صراحة وشفافية.`,
          strengths: `العمق العاطفي، القدرة على بناء شراكة مستدامة، والتفاهم السريع مع الشريك المتوافق.`,
          challenges: `الخوف من الرفض، التعلق العاطفي المرضي، أو فرض التوقعات المثالية غير الواقعية.`,
          practical: `احرص على فتح مساحات حوار دورية وصادقة مع الشريك، وركز على التقدير المستمر للمبادرات الإيجابية.`
        }
      },

      // 10. خط المال والعمل
      {
        id: 'money_line',
        icon: '💰',
        title: 'خط المال والعمل — مصادر الدخل وتدفق الوفرة والمهنة',
        subtitle: 'المسار المالي، المهام المهنية الأنسب، ومفتاح فتح التدفق المالي المستمر',
        arcanaList: [
          { num: moneyPoint, name: getInfo(moneyPoint).name },
          { num: balancePoint, name: 'التوازن' },
          { num: intermediate.C2, name: 'مدخل المادة' }
        ],
        contentKey: 'matrix.section.money_line',
        slots: {
          primary: `يقود خط الوفرة مدخل المال <strong>${getInfo(moneyPoint).name} (${moneyPoint})</strong> بالتقائه مع زاوية المادة والصحة <strong>(${C})</strong> ونقطة التوازن <strong>(${balancePoint})</strong>.`,
          detailed: `يوضح هذا المسار المجالات المهنية الأكثر دراً للمال والمناسبة لطاقتك، وموانع التدفق النفسية كعقدة الخوف من الفقر.`,
          strengths: `القدرة على خلق الفرص، استثمار الموارد بذكاء، وتحويل المعرفة النظرية إلى أصول مادية قيّمة.`,
          challenges: `القلق المستمر بشأن المال، التبذير التعويضي، أو العمل في مجالات تستنزف الروح دون شغف.`,
          practical: `وجّه طاقتك المهنية نحو تقديم قيمة ملموسة للمحيطين، وتعامل مع المال كوسيلة للتمكين والحرية.`
        }
      },

      // 11. الشاكرات
      {
        id: 'chakras',
        icon: '🧘',
        title: 'الشاكرات — جدول مراكز الطاقة ومستويات الوعي',
        subtitle: 'توزيع الطاقات على مراكز الوعي السبعة وتحليل مستويات الجسد والنفس',
        arcanaList: [
          { num: chakras.totals.physics, name: 'الفيزياء' },
          { num: chakras.totals.energy, name: 'الطاقة' },
          { num: chakras.totals.emotions, name: 'المشاعر' }
        ],
        contentKey: 'matrix.section.chakras',
        slots: {
          primary: `يربط جدول الشاكرات طاقاتك بمراكز الوعي السبعة: المحصلة الفيزيائية <strong>(${chakras.totals.physics})</strong>، محصلة الطاقة <strong>(${chakras.totals.energy})</strong>، ومحصلة المشاعر <strong>(${chakras.totals.emotions})</strong>.`,
          detailed: `
            <div class="aqm-chakra-table-wrap">
              <table class="aqm-chakra-table">
                <thead>
                  <tr>
                    <th>الشاكرا وموضعها</th>
                    <th>الجسد الفيزيائي</th>
                    <th>الطاقة الحيوية</th>
                    <th>المشاعر والوعي</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(chakras.rows).map(([k, r]) => `
                    <tr>
                      <td><span class="aqm-chakra-dot" style="display:inline-block;vertical-align:middle;margin-inline-end:8px;background:${CHAKRA_COLORS[k] || '#C5A46D'}"></span>${r.name}</td>
                      <td><span class="aqm-chakra-badge">${r.physics}</span></td>
                      <td><span class="aqm-chakra-badge">${r.energy}</span></td>
                      <td><span class="aqm-chakra-badge">${r.emotions}</span></td>
                    </tr>
                  `).join('')}
                  <tr class="aqm-chakra-total-row">
                    <td><strong>المجموع الكلي</strong></td>
                    <td><strong>${chakras.totals.physics}</strong></td>
                    <td><strong>${chakras.totals.energy}</strong></td>
                    <td><strong>${chakras.totals.emotions}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          `,
          strengths: `التناغم الحيوي، سرعة الاستشفاء الذاتي، والقدرة على استشعار احتياجات الجسد وتلبيتها بحكمة.`,
          challenges: `تراكم التوتر والضغوط النفسية في مراكز محددة مما يسبب تعباً جسدياً مزمناً.`,
          practical: `مارس التنفس الواعي وتمارين التمدد يومياً لتحرير الشاكرات من أي ركود طاقي.`
        }
      },

      // 12. برامج المصفوفة المركبة
      {
        id: 'composite_programs',
        icon: '🔮',
        title: 'برامج المصفوفة المركبة — الشيفرات الثلاثية والأنماط المعقدة',
        subtitle: 'تلاقي طاقات متعددة لتشكيل برامج نفسية وحياتية مركبة داخل الوعي',
        arcanaList: [
          { num: P.compositePrograms.spiritualTriad[1], name: 'برنامج الروح' },
          { num: P.compositePrograms.materialTriad[1], name: 'برنامج المادة' }
        ],
        contentKey: 'matrix.section.composite_programs',
        slots: {
          primary: `تتكامل ثلاثيات مصفوفتك لتشكيل برامج حياتية مركبة: ثلاثية الروح <strong>(${P.compositePrograms.spiritualTriad.join(' - ')})</strong> وثلاثية المادة <strong>(${P.compositePrograms.materialTriad.join(' - ')})</strong>.`,
          detailed: `
            <div class="aqm-prog-box">
              <p class="aqm-slot-p"><strong>برنامج محور الروح (${P.compositePrograms.spiritualTriad.join(' - ')}):</strong> يربط بين تطلعات النور والوعي الروحي، ومواءمة البصيرة مع العمل الفعلي.</p>
              <p class="aqm-slot-p"><strong>برنامج محور المادة (${P.compositePrograms.materialTriad.join(' - ')}):</strong> يدير تدفق الوفرة، التثبيت في أرض الواقع، وتصريف المهارات إلى منجزات ملموسة.</p>
            </div>
          `,
          strengths: `تنوع المهارات، القدرة على التكيف في الأوضاع المعقدة، والجمع بين النظرة الفلسفية والتطبيق العملي.`,
          challenges: `صراع الأولويات بين الرغبات الروحية والواجبات المادية، وتشتت الانتباه.`,
          practical: `حدد هدفاً واحداً واضحاً لكل دورة عمل، وتجنب البدء في مشاريع جديدة قبل إكمال المهام المفتوحة.`
        }
      },

      // 13. الأطفال والمؤشرات المرتبطة بهم
      {
        id: 'children_line',
        icon: '🌱',
        title: 'الأطفال والمؤشرات المرتبطة بهم — طاقة الأبناء واستمرارية الأجيال',
        subtitle: 'العلاقة مع الأبناء، والرسائل التي يحملها الأطفال لوالديهم',
        arcanaList: [
          { num: P.childrenLine.childEnergy, name: 'طاقة الطفل' },
          { num: P.childrenLine.generationKey, name: 'مفتاح التواصل' }
        ],
        contentKey: 'matrix.section.children_line',
        slots: {
          primary: `ترتبط مؤشرات الأبناء بطاقة الامتداد الجيلي <strong>(${P.childrenLine.childEnergy})</strong> ومفتاح التواصل بين الأجيال <strong>(${P.childrenLine.generationKey})</strong>.`,
          detailed: `
            <div class="aqm-child-box">
              <p class="aqm-slot-p"><strong>طاقة الامتداد الجيلي (${P.childrenLine.childEnergy} - ${getInfo(P.childrenLine.childEnergy).name}):</strong> تمثل جوهر التواصل الفطري ونقاط التوافق مع الأبناء والأجيال القادمة.</p>
              <p class="aqm-slot-p"><strong>مفتاح التفاهم التربوي (${P.childrenLine.generationKey}):</strong> بناء جسر من الثقة والاحترام غير المشروط، وتفهم الاختلافات الفردية لكل طفل دون قوالب مسبقة.</p>
            </div>
          `,
          strengths: `الصبر والاحتواء، الفهم العميق لنفسية الأطفال، وبناء علاقة صداقة وثقة تدوم عبر السنين.`,
          challenges: `القلق الزائد على مستقبل الأبناء أو محاولة توجيههم في مسارات لا تناسب شخصياتهم الفطرية.`,
          practical: `امنح الأطفال مساحة حرة للتعبير عن مشاعرهم، واستمع إليهم باهتمام دون أحكام مسبقة.`
        }
      },

      // 14. دورات الحياة ومحطاتها
      {
        id: 'age_cycles',
        icon: '⏳',
        title: 'دورات الحياة ومحطاتها — الخريطة الزمنية (0 - 80 سنة) وطاقة العام',
        subtitle: 'المحطات العمرية على المحيط الخارجي ودورة الطاقات المؤثرة على كل مرحلة',
        arcanaList: [
          { num: (P.ageMap && P.ageMap['20']) || (P.ageStations && P.ageStations['20']) || A, name: 'سن 20' },
          { num: (P.ageMap && P.ageMap['40']) || (P.ageStations && P.ageStations['40']) || C, name: 'سن 40' },
          { num: (P.ageMap && P.ageMap['60']) || (P.ageStations && P.ageStations['60']) || D, name: 'سن 60' }
        ],
        contentKey: 'matrix.section.age_cycles',
        slots: {
          primary: `تتوزع محطات مصفوفتك الزمنية عبر حلقة الأعمار: محطة سن 20 <strong>(${(P.ageMap && P.ageMap['20']) || (P.ageStations && P.ageStations['20']) || A})</strong>، محطة سن 40 <strong>(${(P.ageMap && P.ageMap['40']) || (P.ageStations && P.ageStations['40']) || C})</strong>، ومحطة سن 60 <strong>(${(P.ageMap && P.ageMap['60']) || (P.ageStations && P.ageStations['60']) || D})</strong>.`,
          detailed: `
            <div class="aqm-age-preview">
              <p>تدور طاقات مصفوفتك في دورات زمنية تبدأ من سن الصفر وحتى الثمانين. كل محطة عمرية تحمل طاقة حاكمة توجه أولوياتك النفسية والمادية في تلك الفترة.</p>
              <div class="aqm-age-badges">
                <span class="aqm-badge">0-20 سنة: بناء الشخصية</span>
                <span class="aqm-badge">20-40 سنة: ترسيخ المادة والإنتاج</span>
                <span class="aqm-badge">40-60 سنة: النضج الاجتماعي</span>
                <span class="aqm-badge">60-80 سنة: الحكمة الروحية</span>
              </div>
            </div>
          `,
          strengths: `الاستعداد المبكر للتحولات العمرية، وفهم معنى الدروس التي تفرضها كل مرحلة في توقيتها الدقيق.`,
          challenges: `مقاومة التغيير الطبيعي لمراحل العمر أو الشعور بفوات الأوان.`,
          practical: `راجع طاقتك الحالية وركز على أولويات مرحلتك العمرية الحالية لتحقيق أقصى درجات التناغم.`
        }
      },

      // 15. روشتة التحول
      {
        id: 'transformation_rx',
        icon: '⚖️',
        title: 'روشتة التحول — مفاتيح الموازنة والارتقاء من الظل إلى النور',
        subtitle: 'بروتوكول تفكيك العقد وتفعيل الطاقات الإيجابية في السلوك اليومي',
        arcanaList: [
          { num: P.transformationKeys.balancePoint, name: 'التوازن' },
          { num: P.transformationKeys.skyAxis, name: 'المفتاح الروحي' },
          { num: P.transformationKeys.earthAxis, name: 'المفتاح المادي' }
        ],
        contentKey: 'matrix.section.transformation_rx',
        slots: {
          primary: `تتكامل مفاتيح تحولك عند نقطة التوازن <strong>(${P.transformationKeys.balancePoint})</strong> مع المفتاح الروحي <strong>(${P.transformationKeys.skyAxis})</strong> والمفتاح المادي <strong>(${P.transformationKeys.earthAxis})</strong>.`,
          detailed: `
            <div class="aqm-rx-box">
              <h4>بروتوكول التحول من الظل إلى النور:</h4>
              <ol class="aqm-rx-list">
                <li><strong>الوعي بطاقة المركز (${E}):</strong> لا تسمح لضغوط الحياة بإخراجك من سكينة ${getInfo(E).name}.</li>
                <li><strong>تحرير الذيل الكارمي (${D}):</strong> تذكر دائماً ألا تكرر ردود الأفعال القديمة عندما تواجه عقبات مشابهة.</li>
                <li><strong>تفعيل نقطة التوازن (${P.transformationKeys.balancePoint}):</strong> وازن بين احتياجاتك المادية وتطلعاتك الروحية.</li>
              </ol>
            </div>
          `,
          strengths: `المرونة النفسية العالية، القدرة على تحويل الأزمات إلى فرص للنمو، وتفعيل قوة الإرادة الواعية.`,
          challenges: `الانتكاس نحو العادات القديمة عند الإرهاق أو الاستسلام للشكوك.`,
          practical: `ابدأ كل صباح بنيّة واعية لتفعيل فضائل النور في طاقاتك، واجعل التوازن هدفك اليومي الدائم.`
        }
      }
    ];

    return sections.map(buildAccordionItem).join('\n');
  }

  const build12Sections = build15Sections;

  // ==================== 3. مصفوفة المصطلحات والمرجع (Glossary) ====================

  function buildGlossaryGrid(P) {
    const { anchors, corners } = P;
    const items = [
      { ar: 'الشخصية والمظهر', en: 'Personality Essence (A)', num: anchors.A },
      { ar: 'الاتصال الروحي', en: 'Spiritual Link (B)', num: anchors.B },
      { ar: 'المادة والصحة', en: 'Material Power (C)', num: anchors.C },
      { ar: 'الذيل الكارمي', en: 'Karmic Tail (D)', num: anchors.D },
      { ar: 'مركز راحة الروح', en: 'Soul Comfort (E)', num: anchors.E },
      { ar: 'مواهب الأب', en: 'Paternal Talents (F)', num: corners.F },
      { ar: 'مواهب الأم', en: 'Maternal Talents (G)', num: corners.G },
      { ar: 'كارما الأب', en: 'Ancestral Lines Father (H)', num: corners.H },
      { ar: 'كارما الأم', en: 'Ancestral Lines Mother (I)', num: corners.I }
    ];

    return `
      <div class="aqm-gloss-grid">
        ${items.map(it => `
          <div class="aqm-gloss">
            <span class="aqm-t-en">${it.en}</span>
            <div class="aqm-t-ar">${it.ar}: <strong>${it.num}</strong></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==================== 4. العرض المتكامل والربط بالـ DOM ====================

  /**
   * الدالة الرئيسية لبناء وعرض تقرير مصفوفة القدر المتكامل في المتصفح
   */
  function renderMatrixReport(arg1, arg2, arg3, arg4) {
    let host = null;
    let birthDate = null;
    let name = '';
    let gender = '';

    if (arg1 && typeof arg1 === 'object' && arg1.nodeType) {
      host = arg1;
      birthDate = arg2;
      name = arg3 || '';
      gender = arg4 || '';
    } else {
      host = document.querySelector('#mresult');
      birthDate = arg1;
      name = arg2 || '';
      gender = arg3 || '';
    }

    if (!birthDate || !String(birthDate).trim()) return;
    if (!host) host = document.querySelector('#mresult');
    if (!host) return;

    const engine = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
    if (!engine) {
      host.innerHTML = '<p class="ferr">محرك الحسابات لم يُحمّل بعد. يُرجى تحديث الصفحة.</p>';
      host.hidden = false;
      return;
    }

    const P = engine.calculateDestinyMatrix(birthDate);
    const getInfo = n => engine.getArcanaInfo(n);
    const dateStr = `${P.birthDate.year}-${String(P.birthDate.month).padStart(2, '0')}-${String(P.birthDate.day).padStart(2, '0')}`;
    const displayName = name ? name.trim() : 'مستخدم عقيق أسترو';

    const html = `
      <section class="aqm-shell" aria-labelledby="aqm-report-title">
        <!-- الكارت العلوي الفاخر (Summary Card) -->
        <header class="aqm-header">
          <span class="aqm-kicker">مصفوفة القدر · Natalia Ladini System</span>
          <h2 id="aqm-report-title">${displayName}</h2>
          <div class="aqm-meta-info">
            <span class="aqm-meta-pill">الميلاد: ${dateStr}</span>
            <span class="aqm-meta-pill">المركز: ${getInfo(P.anchors.E).name} (${P.anchors.E})</span>
            <span class="aqm-meta-pill">الجوهر: ${getInfo(P.anchors.A).name} (${P.anchors.A})</span>
            <span class="aqm-meta-pill">سنة ${P.yearEnergy.year}: طاقة ${P.yearEnergy.number}</span>
          </div>
          <div class="aqm-actions">
            <button class="aqm-btn" type="button" id="aqm-btn-edit">تعديل البيانات</button>
            <button class="aqm-btn" type="button" id="aqm-btn-print">حفظ كـ PDF / طباعة</button>
            <button class="aqm-btn aqm-btn-primary" type="button" id="aqm-btn-story">استخراج بطاقة القصة</button>
          </div>
        </header>

        <!-- حاوية الرسم الهندسي (SVG Octagram) -->
        <div class="aqm-canvas-wrap">
          <p style="margin:0 0 16px;color:var(--aqm-text-muted);font-size:0.85rem;">خريطة مصفوفة القدر (توزيع مسارات الطاقة والأركانا)</p>
          ${generateMatrixSVG(P)}
          <ol class="aqm-chakra-axis" aria-label="المحور الرأسي للشاكرات">
            ${Object.entries(P.chakras.rows).map(([key, r]) => `
              <li class="aqm-chakra-row"><span class="aqm-chakra-dot" style="background:${CHAKRA_COLORS[key] || '#C5A46D'}"></span><span class="aqm-chakra-name">${r.name}</span><span class="aqm-chakra-vals">الفيزياء ${r.physics} · الطاقة ${r.energy} · المشاعر ${r.emotions}</span></li>`).join('')}
          </ol>
        </div>

        <!-- نظام الأكورديون الـ 15 المتكامل -->
        <div class="aqm-accordion-container">
          ${build12Sections(P)}
        </div>

        <!-- الفهرس المرجعي للأركان (للتوافق المعياري مع الاختبارات) -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid var(--aqm-gold-border);">
          <h4 style="font-size:0.95rem;color:var(--aqm-text-muted);margin:0 0 10px;">المعجم الرمزي للمواضع (Karmic Tail & Ancestral Lines):</h4>
          ${buildGlossaryGrid(P)}
        </div>

        <!-- التذييل وإخلاء المسؤولية الرمزية -->
        <footer style="margin-top:32px;text-align:center;font-size:0.82rem;color:var(--aqm-text-muted);line-height:1.7;">
          <p>مصفوفة القدر نظام رمزي للتأمل واستكشاف الذات مبني على منهج ناتاليا لاديني (22 أركانا). عقيق أسترو يقدم القراءات كأداة للوعي والتمكين الذاتي وليست للتنبؤ القاطع أو المشورة الطبية.</p>
        </footer>
      </section>
    `;

    host.innerHTML = html;
    host.hidden = false;

    // ربط تفاعلات الأكورديون
    const accItems = host.querySelectorAll('.aqm-acc-item');
    accItems.forEach(item => {
      const header = item.querySelector('.aqm-acc-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // السماح بفتح وإغلاق مستقل
        item.classList.toggle('open');
        header.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // فتح القسم الأول (المركز) تلقائياً افتراضياً
    const firstAcc = host.querySelector('#aqm-sec-center');
    if (firstAcc) {
      firstAcc.classList.add('open');
      firstAcc.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
    }

    // ربط عُقد النجمة بالأكورديون: النقر على العقدة يفتح الكارت المقابل له (data-section = id القسم) ويميّزه ثم يمرّره للأعلى
    const allAcc = host.querySelectorAll('.aqm-acc-item');
    host.querySelectorAll('.aqm-svg .aqm-node').forEach(node => {
      node.addEventListener('click', () => {
        const item = host.querySelector(`#aqm-sec-${node.getAttribute('data-section')}`);
        if (!item) return;
        host.querySelectorAll('.aqm-svg .aqm-node.is-active').forEach(n => n.classList.remove('is-active'));
        allAcc.forEach(a => a.classList.remove('is-active'));
        node.classList.add('is-active');
        item.classList.add('open', 'is-active');
        item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // الخريطة لوحة مرجعية ثابتة: لا توجد أحداث نقر أو تمرير على عُقد الـ SVG

    // ربط زر الطباعة / PDF
    host.querySelector('#aqm-btn-print')?.addEventListener('click', () => {
      // فتح كل الأكورديونات قبل الطباعة لضمان ظهور كامل المحتوى في الـ PDF
      accItems.forEach(item => {
        item.classList.add('open');
        item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
      });
      window.print();
    });

    // تعديل البيانات: يعيد فتح نموذج الإدخال مع القيم الحالية دون تحديث الصفحة
    host.querySelector('#aqm-btn-edit')?.addEventListener('click', () => {
      const mf = document.getElementById('mform');
      if (!mf) return;
      for (let el = mf; el; el = el.parentElement) {
        if (el.hidden) el.hidden = false;
        if (el.style && el.style.display === 'none') el.style.display = '';
        if (el.classList && el.classList.contains('hidden')) el.classList.remove('hidden');
      }
      const nameIn = document.getElementById('m-name');
      const dateIn = document.getElementById('m-date');
      if (nameIn) nameIn.value = name || '';
      if (dateIn) dateIn.value = dateStr;
      mf.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (dateIn || nameIn)?.focus();
    });

    // بطاقة القصة: PNG 9:16 تُولَّد من الـ SVG الحالي
    host.querySelector('#aqm-btn-story')?.addEventListener('click', () => {
      try { exportStoryCard(host, P, displayName === 'مستخدم عقيق أسترو' ? '' : displayName, dateStr); }
      catch (err) { console.error(err); }
    });

    // التمرير إلى النتيجة
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==================== 5. ربط النموذج وتأصيل الأحداث ====================

  function initForm() {
    const form = document.querySelector('#mform');
    if (!form || form.dataset.aqmBound === 'true') return;
    form.dataset.aqmBound = 'true';

    form.addEventListener('submit', e => {
      e.preventDefault();
      const err = document.querySelector('#merr');
      if (err) err.hidden = true;

      const dateInput = document.querySelector('#m-date');
      const nameInput = document.querySelector('#m-name');
      const genderInput = document.querySelector('#m-gender');

      const v = dateInput ? dateInput.value : '';
      if (!v) {
        if (err) {
          err.textContent = 'اكتب تاريخ الميلاد.';
          err.hidden = false;
        }
        return;
      }

      const [y, m, d] = v.split('-').map(Number);
      if (y < 1900 || y > 2100) {
        if (err) {
          err.textContent = 'التاريخ لازم يكون بين 1900 و 2100.';
          err.hidden = false;
        }
        return;
      }
      if (new Date(y, m - 1, d) > new Date()) {
        if (err) {
          err.textContent = 'تاريخ الميلاد في المستقبل. راجع التاريخ.';
          err.hidden = false;
        }
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const gender = genderInput ? genderInput.value : '';

      renderMatrixReport(v, name, gender);

      // تطبيق تخصيص الضمير والنسخ إن وُجد
      const resultHost = document.querySelector('#mresult');
      if (resultHost && window.AqeeqGender) {
        window.AqeeqGender.apply(resultHost, gender);
      }
      if (resultHost && window.AqeeqCopyMap) {
        window.AqeeqCopyMap.attach(resultHost, 'مصفوفة القدر · ' + (name || v));
      }
    });
  }

  // التصدير إلى النطاق العام
  const api = {
    render: renderMatrixReport,
    renderMatrixReport,
    generateMatrixSVG,
    build15Sections,
    build12Sections,
    // الحفاظ على توافق AqeeqNumerology
    calculateDestinyMatrix: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date) : null;
    },
    /**
     * @deprecated دالة مهجورة غير مستخدمة في واجهة التطبيق (Unused Legacy Export Stub).
     * المصدر الأساسي والوحيد المعتمد لحساب مسار الحياة الفعلي في عقيق أسترو هو دالة lifePath(d, m, y)
     * المعرفة داخل index.html (وفق منهج الجمع الكلي مع حفظ الأرقام الرئيسية 11 و 22 و 33 في الناتج النهائي).
     * تم الإبقاء على هذا التصدير الشكلي فقط لمنع أي كسر في التوافق القديم (Backwards Compatibility).
     */
    calculateLifePath: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? { number: eng.reduceArcana(new Date(date).getDate()) } : { number: 1 };
    },
    calculateChakraHealthCard: date => {
      const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
      return eng ? eng.calculateDestinyMatrix(date).chakras : null;
    }
  };

  const root = typeof window !== 'undefined' ? window : globalThis;
  root.AqeeqMatrixUI = api;
  root.AqeeqNumerology = Object.assign(root.AqeeqNumerology || {}, api);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
