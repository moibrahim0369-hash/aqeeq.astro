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
    clone.querySelector('.aqm-svg-watermark')?.remove(); // بطاقة التصدير لها علامتها المائية الخاصة
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

  /* نقاط المحاور الأربعة (ثلاث نقاط لكل محور بين الطرف X والمركز E) بالمعادلة القياسية الموحّدة:
     mid = reduce(X+E) · outer = reduce(X+mid) · inner = reduce(mid+E). دالة نقية قابلة للاختبار. */
  function axisPoints(P, reduce) {
    const { A, B, C, D, E } = P.anchors;
    const axis = X => { const mid = reduce(X + E); return { mid, outer: reduce(X + mid), inner: reduce(mid + E) }; };
    return { left: axis(A), top: axis(B), right: axis(C), bottom: axis(D) };
  }

  /* نقاط الخطوط المائلة (الأجداد): لكل ركن F,G,H,I نقطتان بين الركن والمركز.
     inner (جهة المركز) = reduce(الركن + مركز الأجداد) · outer (جهة الركن) = reduce(الركن + inner).
     تحقّق على تاريخين مرجعيين (1999-09-25 و1998-01-07). */
  function diagonalPoints(P, reduce) {
    const anc = P.generational.ancestralCenter;
    const pt = X => { const inner = reduce(X + anc); return { inner, outer: reduce(X + inner) }; };
    return { F: pt(P.corners.F), G: pt(P.corners.G), H: pt(P.corners.H), I: pt(P.corners.I) };
  }

  function generateMatrixSVG(P) {
    const { anchors, corners, channels, intermediate, ageMap, generational } = P;
    const { A, B, C, D, E } = anchors;
    const { F, G, H, I } = corners;
    // الجمع الاختزالي 22 من المحرك نفسه (لا تغيير في منطق الحساب): تُستخدم فقط لرسم النقاط الأفقية اليسرى
    const reduce22 = n => (window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter).reduceArcana(n);
    // نقاط المحاور بالمعادلة القياسية الموحّدة: X2 = X+E، الخارجية = X+X2، الداخلية = X2+E
    const ax = axisPoints(P, reduce22);
    const dg = diagonalPoints(P, reduce22);
    const hP3 = ax.left.outer, hP1 = ax.left.mid, hP2 = ax.left.inner;
    const tB = ax.top.outer, tTop3 = ax.top.inner;
    const mP1 = ax.right.mid, mP2 = ax.right.outer;   // الداخلية اليمنى = نقطة المال (تُرسم في موضعها الخاص)
    const T = { purple: '#8E6E85', petrol: '#4E7988', sky: '#7EA0B7', green: '#5A7E64', solar: '#E6C280', lgreen: '#B7D3AE', orange: '#C06C54', wine: '#8B263E', white: '#FFFFFF' };
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
      heart: [426.5, 494],
      money: [494, 426.5],
      balance: [453, 453]
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
    for (let y = 0; y < 80; y += 5) {
      const p = polar(312, ageDeg(y));
      const pe = polar(312, ageDeg(y) + 5.2), py = polar(312, ageDeg(y) - 5.2);
      const en = ageMap && ageMap[y];
      ageLabels += `<text x="${r2(py[0])}" y="${r2(py[1])}" class="aqm-svg-age-label">${y === 0 ? '0/80' : y}</text>`;
      if (en) ageLabels += `<text x="${r2(pe[0])}" y="${r2(pe[1])}" class="aqm-svg-age-energy" data-age="${y}">${en}</text>`;
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
          svg.aqm-svg .aqm-svg-dial-ring.is-outer { stroke-width: 1.8; }
          svg.aqm-svg .aqm-svg-tick { stroke: rgba(197, 164, 109, 0.75); stroke-width: 0.8; }
          svg.aqm-svg .aqm-svg-tick.is-major { stroke: #A8865A; stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-guide { fill: none; stroke: rgba(197, 164, 109, 0.22); stroke-width: 1.2; stroke-dasharray: 4, 6; }
          svg.aqm-svg .aqm-svg-personal-square { fill: none; stroke: #B79B66; stroke-width: 1.5; stroke-opacity: 0.95; stroke-linejoin: round; }
          svg.aqm-svg .aqm-svg-ancestral-square { fill: none; stroke: rgba(197, 164, 109, 0.8); stroke-width: 1.2; stroke-dasharray: 6, 5; }
          svg.aqm-svg .aqm-svg-axis { stroke: rgba(138, 118, 96, 0.55); stroke-width: 1.2; }
          svg.aqm-svg .aqm-svg-father { stroke: #8E6E85; stroke-width: 1.6; stroke-opacity: 0.9; }
          svg.aqm-svg .aqm-svg-mother { stroke: #B5443E; stroke-width: 1.6; stroke-opacity: 0.9; }
          svg.aqm-svg .aqm-svg-love-channel { stroke: #C89B9E; stroke-width: 1.5; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-money-channel { stroke: #C5A46D; stroke-width: 1.5; stroke-dasharray: 2, 6; stroke-linecap: round; fill: none; }
          svg.aqm-svg .aqm-svg-age-label { fill: #5E4A52; font-size: 13px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
          svg.aqm-svg .aqm-svg-age-energy { fill: #8B263E; font-size: 15px; font-weight: 800; text-anchor: middle; dominant-baseline: central; }
          svg.aqm-svg .aqm-svg-watermark { fill: #B89758; opacity: 0.17; font-size: 22px; font-weight: 700; text-anchor: end; letter-spacing: .5px; pointer-events: none; }
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
          <marker id="aqm-arr-father" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#8E6E85" />
          </marker>
          <marker id="aqm-arr-mother" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="#B5443E" />
          </marker>
        </defs>

        <!-- الخلفية العاجية والإطار الدائري المزدوج -->
        <rect x="0" y="0" width="800" height="800" rx="28" class="aqm-svg-bg" fill="#FAF7F0" />
        <circle cx="400" cy="400" r="372" class="aqm-svg-dial-ring is-outer" fill="none" stroke="#C5A46D" />
        <circle cx="400" cy="400" r="356" class="aqm-svg-dial-ring" fill="none" stroke="#C5A46D" />
        <text x="778" y="786" class="aqm-svg-watermark" fill="#B89758" fill-opacity="0.17" text-anchor="end" font-size="22" font-weight="700" direction="ltr">عقيق أسترو · Aqeq Astro</text>
        ${ticks}
        ${ageLabels}
        <circle cx="400" cy="400" r="270" class="aqm-svg-guide" fill="none" stroke="#C5A46D" stroke-opacity="0.25" />

        <!-- المربع الشخصي والأسلاف والمحاور -->
        <polygon points="${pos.west[0]},${pos.west[1]} ${pos.north[0]},${pos.north[1]} ${pos.east[0]},${pos.east[1]} ${pos.south[0]},${pos.south[1]}" class="aqm-svg-personal-square" fill="none" stroke="#B79B66" />
        <polygon points="${pos.northWest[0]},${pos.northWest[1]} ${pos.northEast[0]},${pos.northEast[1]} ${pos.southEast[0]},${pos.southEast[1]} ${pos.southWest[0]},${pos.southWest[1]}" class="aqm-svg-ancestral-square" fill="none" stroke="#C5A46D" />
        <line x1="${pos.west[0]}" y1="${pos.west[1]}" x2="${pos.east[0]}" y2="${pos.east[1]}" class="aqm-svg-axis" />
        <line x1="${pos.north[0]}" y1="${pos.north[1]}" x2="${pos.south[0]}" y2="${pos.south[1]}" class="aqm-svg-axis" />
        <line x1="${fatherA[0]}" y1="${fatherA[1]}" x2="${fatherB[0]}" y2="${fatherB[1]}" class="aqm-svg-father" marker-end="url(#aqm-arr-father)" />
        <line x1="${motherA[0]}" y1="${motherA[1]}" x2="${motherB[0]}" y2="${motherB[1]}" class="aqm-svg-mother" marker-end="url(#aqm-arr-mother)" />
        <text x="303" y="261" transform="rotate(45 303 261)" text-anchor="middle" font-size="10" font-weight="700" fill="#8E6E85" stroke="#FFFFFF" stroke-width="3" paint-order="stroke" class="aqm-svg-gen-label">male generation line</text>
        <text x="539" y="261" transform="rotate(-45 539 261)" text-anchor="middle" font-size="10" font-weight="700" fill="#B5443E" stroke="#FFFFFF" stroke-width="3" paint-order="stroke" class="aqm-svg-gen-label">female generation line</text>

        <!-- مسارات الحب والمال -->
        <polyline points="${pos.C2[0]},${pos.C2[1]} ${pos.money[0]},${pos.money[1]} ${pos.balance[0]},${pos.balance[1]}" class="aqm-svg-money-channel" fill="none" />
        <polyline points="${pos.balance[0]},${pos.balance[1]} ${pos.heart[0]},${pos.heart[1]} ${pos.D2[0]},${pos.D2[1]}" class="aqm-svg-love-channel" fill="none" />
        <g class="aqm-svg-heart-icon" transform="translate(${pos.heart[0] - 46}, ${pos.heart[1] - 8}) scale(0.7)">
          <path d="M12 21 C12 21 3 14.5 3 8.5 C3 5.4 5.4 3 8.2 3 C9.8 3 11.2 3.9 12 5.2 C12.8 3.9 14.2 3 15.8 3 C18.6 3 21 5.4 21 8.5 C21 14.5 12 21 12 21 Z" fill="#B5443E" />
        </g>
        <text x="${pos.money[0] + 22}" y="${pos.money[1] + 22}" class="aqm-svg-money-sign">$</text>

        <!-- المركز الجوهري E بهالة شمسية -->

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
        ${nodeG('aqm-node-love', 'love_line', 'مدخل الحب والعلاقات (Heart Point)', heartPoint, pos.heart, 18)}
        ${nodeG('aqm-node-money', 'money_line', 'مدخل المال والوفرة (Money Point)', moneyPoint, pos.money, 18)}
        ${[['F', 'father_line', -1, -1], ['G', 'mother_line', 1, -1], ['H', 'father_line', 1, 1], ['I', 'mother_line', -1, 1]].map(([k, sec, sx, sy]) => {
          const at = d => [r2(400 + sx * d / Math.SQRT2), r2(400 + sy * d / Math.SQRT2)];
          return nodeG('aqm-node-ancestral', sec, 'خط الأجداد المائل — النقطة الخارجية: reduce22(' + k + '+الداخلية)', dg[k].outer, at(212), 17)
               + nodeG('aqm-node-ancestral', sec, 'خط الأجداد المائل — النقطة الداخلية: reduce22(' + k + '+مركز الأجداد)', dg[k].inner, at(122), 17);
        }).join('')}
        ${nodeG('aqm-node-balance', 'love_line', 'نقطة التوازن بين الحب والمال (Balance)', balancePoint, pos.balance, 18)}
        <!-- المحور الأفقي الأيسر من A إلى E: النقاط الثلاث (الخارجية والوسطى والداخلية الخضراء) -->
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(p1+A)', hP3, [200, 400], 19, '', T.petrol)}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية — reduce22(A+E)', hP1, [265, 400], 19, '', T.sky)}
        ${nodeG('aqm-node-chakra', 'chakras', 'نقطة أفقية داخلية — reduce22(الوسطى+E)', hP2, [326, 400], 19, '', T.lgreen)}
        <!-- المحور الأيمن من E إلى C: C2 = reduce(C+E) ثم reduce(C+C2) (والنقطة الداخلية هي نقطة المال) -->
        ${nodeG('aqm-node-money', 'money_line', 'مال — C2 = reduce22(C+E)', mP1, [535, 400], 19, '', T.orange)}
        ${nodeG('aqm-node-money', 'money_line', 'مال — reduce22(C+C2)', mP2, [600, 400], 19, '', T.white)}
        <!-- المحور الرأسي الأعلى: B(9) ← 7 ← B2(16) -->
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — reduce22(B+B2)', tB, [400, 200], 19, '', T.petrol)}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح — B2 (B+E)', intermediate.B2, pos.B2, 19, '', T.sky)}
        ${nodeG('aqm-node-corner', 'talents', 'طاقة الروح الداخلية — reduce22(B2+E)', tTop3, [400, 326], 19, '', T.lgreen)}
        <g class="aqm-node aqm-node-center" data-section="center" data-title="مركز راحة الروح والجوهر الأساسي" data-arcana="${E}" transform="translate(${pos.center[0]}, ${pos.center[1]})">
          <circle cx="0" cy="0" r="44" class="aqm-node-bg" style="fill:#E6C280" />
          <circle cx="0" cy="0" r="38" class="aqm-node-ring" />
          <text x="0" y="0" class="aqm-node-text" font-size="42" font-weight="bold" fill="#1A1A1A" text-anchor="middle" dominant-baseline="central">${E}</text>
        </g>
      </svg>
      <div id="aqm-tooltip" role="tooltip"></div>
    `;
  }

  // ==================== 2. بنية الأكورديون الـ 15 وحقن النصوص ====================

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ===== الذيل الكارمي من karmic-tails.json (Schema v2) =====
     بيتحمّل لما أكورديون الذيل يتفتح بس. لو الملف مش متاح أو الشفرة مش مسجلة،
     النص الحالي (من destiny-matrix-data.js) بيفضل زي ما هو. */
  function karmicTailV2Html(res, gender) {
    const t = res.tail;
    const v = (gender && t.genderVariants && t.genderVariants[gender]) || {};
    const e = escapeHtml;
    const note = res.match === 'redirect'
      ? `<p class="aqm-slot-p aqm-kt-note">لا توجد قراءة مستقلة للثلاثية ${e(res.requested)}، فاعتُمدت أقرب قراءة معتمدة لها: ${e(t.code)}.</p>`
      : res.match === 'reverse'
      ? `<p class="aqm-slot-p aqm-kt-note">لا توجد قراءة مستقلة للترتيب ${e(res.requested)}، فاعتُمدت قراءة الترتيب المعكوس ${e(t.code)}.</p>`
      : '';
    return `
      <div class="aqm-kt-box" data-kt-source="v2" data-kt-code="${e(t.code)}">
        <p class="aqm-slot-p"><strong>${e(t.title.ar)}</strong> — ${e(t.title.subtitle)} <span class="aqm-kt-code">(شفرة ${e(t.code)})</span></p>
        ${note}
        <p class="aqm-slot-p"><strong>العمق النفسي:</strong> ${e(t.psychologicalDepth)}</p>
        <p class="aqm-slot-p"><strong>التناقض:</strong> ${e(v.paradox || t.paradox)}</p>
        <p class="aqm-slot-p"><strong>جذور الطفولة:</strong> ${e(v.childhoodRoots || t.childhoodRoots)}</p>
        <p class="aqm-slot-p"><strong>التنبيه الجسدي الرمزي:</strong> ${e(t.symbolicBodyNote)}</p>
      </div>`;
  }

  function hydrateKarmicTail(item, triad, gender) {
    if (!item || item.dataset.ktState === 'loading' || item.dataset.ktState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.karmicTail !== 'function') return Promise.resolve();
    if (!triad.every(n => Number.isInteger(Number(n)) && Number(n) >= 1 && Number(n) <= 22)) return Promise.resolve();
    item.dataset.ktState = 'loading';
    // ثلاثية بلا نص مستقل: نجرّب الذيل المعتمد المربوط بها (خريطة الربط) بمطابقة مجموعة الأرقام، وإلا يبقى النص القديم
    const redirect = (item.dataset.ktRedirect || '').split('-').map(Number);
    const viaRedirect = res => {
      if (res || redirect.length !== 3 || redirect.some(n => !(n >= 1 && n <= 22))) return res;
      const sorted = a => a.slice().sort((x, y) => x - y).join('-');
      return loader.karmicTails().then(d => {
        const hit = d.tails.find(tl => sorted(tl.code.split('-').map(Number)) === sorted(redirect));
        return hit ? { tail: hit, match: 'redirect', requested: triad.join('-') } : null;
      });
    };
    return loader.karmicTail(triad[0], triad[1], triad[2]).then(viaRedirect).then(res => {
      item.dataset.ktState = 'done';
      if (!res || !res.tail) return;
      const g = gender === 'male' || gender === 'female' ? gender : '';
      const detailed = item.querySelector('[data-slot="detailed"] .aqm-slot-p');
      const practical = item.querySelector('[data-slot="practical"] .aqm-slot-p');
      const title = item.querySelector('.aqm-acc-title');
      if (detailed) detailed.innerHTML = karmicTailV2Html(res, g);
      if (practical && Array.isArray(res.tail.protocol)) {
        practical.innerHTML = `<ol class="aqm-kt-protocol">${res.tail.protocol.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`;
      }
      if (title) title.textContent = `الذيل الكارمي — ${res.tail.title.ar}`;
      item.dataset.ktCode = res.tail.code;
      // مزامنة الكبسولات والنص التمهيدي مع شفرة الذيل المحمّل فعلاً (كانت تعرض أرقام ذيل مربوط قديم)
      if (res.match !== 'redirect') {
        const eng = window.AqeeqMatrixMethodAdapter || window.MatrixMethodAdapter;
        const digits = res.tail.digits || res.tail.code.split('-').map(Number);
        const badgeBox = item.querySelector('.aqm-acc-badges');
        if (badgeBox && eng && typeof eng.getArcanaInfo === 'function') {
          badgeBox.querySelectorAll('.aqm-badge-arcana').forEach(el => el.remove());
          digits.forEach((n, i) => {
            const span = document.createElement('span');
            span.className = `aqm-badge-arcana aqm-tone-${i % 4}`;
            span.textContent = `${n} · ${eng.getArcanaInfo(n).name}`;
            badgeBox.appendChild(span);
          });
        }
        const primary = item.querySelector('[data-slot="primary"] .aqm-slot-p');
        if (primary) primary.innerHTML = `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${digits.join(' - ')})</strong>.`;
      }
    }).catch(() => { delete item.dataset.ktState; });
  }

  /* ===== أقسام المصفوفة من sections/*.json (Schema v2) =====
     كل قسم بيتحمّل لما أكورديونه يتفتح. لو الملف مش متاح أو الأركانا مالهاش نص (missingIds)،
     النص القديم بيفضل زي ما هو. genderDynamic بيظهر بس لما المستخدم يختار ذكر/أنثى
     والمدخل فيه الحقل ده. المصدر: ['t' نص | 'l' قائمة | 'j' قائمة بفواصل, التسمية, المفتاح]. */
  const SECTION_SPECS = {
    center: { file: 'center', ids: P => [P.anchors.E],
      detailed: [['t', 'الهوية', 'identity'], ['t', 'السلوك التلقائي', 'behavior']],
      challenges: ['shadow'], practical: ['balanceKey'] },
    talents: { file: 'talents', ids: P => [P.anchors.B],
      detailed: [['t', 'قناة الاتصال', 'channel']],
      strengths: ['gift'], challenges: ['trap'], practical: ['practice'] },
    love_line: { file: 'love_line', ids: P => [P.channels.heartPoint],
      detailed: [['t', 'الانجذاب', 'attraction']],
      challenges: ['shadowPatterns'], practical: ['harmonyKey'] },
    money_line: { file: 'money_line', ids: P => [P.channels.moneyPoint],
      detailed: [['t', 'بوابة التدفق', 'inflow'], ['j', 'المجالات الأنسب', 'sectors']],
      challenges: ['blocks'], practical: ['goldenRule'] },
    father_line: { file: 'father_line', ids: P => [P.corners.F, P.corners.H],
      detailed: [['t', 'المحور', 'theme'], ['l', 'أسئلة للتأمل', 'questions']],
      strengths: ['potential'], challenges: ['challenge'], practical: ['practice'] },
    mother_line: { file: 'mother_line', ids: P => [P.corners.G, P.corners.I],
      detailed: [['t', 'المحور', 'theme'], ['l', 'أسئلة للتأمل', 'questions']],
      strengths: ['potential'], challenges: ['challenge'], practical: ['practice'] },
    ancestral_programs: { file: 'ancestral_programs', ids: P => [P.ancestralPrograms.ancestralCenter],
      detailed: [['t', 'الجذر والموروث', 'roots'], ['l', 'أنماط السقوط التلقائي', 'fallPatterns']],
      practical: ['path'] },
    purposes: { file: 'purposes', ids: P => [P.purposes.social],
      detailed: [['t', 'الرسالة', 'mission']], practical: ['maturityTest'] },
    children_line: { file: 'children_line', ids: P => [P.childrenLine.childEnergy],
      detailed: [['t', 'الأسرة والتربية', 'family']] },
    transformation_rx: { file: 'transformation_rx', ids: P => [P.transformationKeys.balancePoint],
      detailed: [['l', 'خطوات التحول', 'protocol'], ['l', 'أسئلة للتأمل', 'reflectiveQuestions']],
      practical: ['__summary'] }
  };

  function sectionVal(kind, label, val) {
    if (val == null || val === '' || (Array.isArray(val) && !val.length)) return '';
    const lab = label ? `<strong>${escapeHtml(label)}:</strong> ` : '';
    if (Array.isArray(val) && kind === 'j') return `<p class="aqm-slot-p">${lab}${escapeHtml(val.join('، '))}</p>`;
    if (Array.isArray(val)) {
      return `<div class="aqm-slot-sub">${lab ? `<p class="aqm-slot-p">${lab}</p>` : ''}<ul class="aqm-slot-list">${val.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`;
    }
    return `<p class="aqm-slot-p">${lab}${escapeHtml(val)}</p>`;
  }

  function sectionEntryVal(entry, key) {
    return key === '__summary' ? entry.summary : (entry.deep ? entry.deep[key] : undefined);
  }

  function buildSectionFill(spec, entries, gender) {
    const multi = entries.length > 1;
    const head = e => (multi ? `<p class="aqm-slot-p aqm-entry-head"><strong>الأركانا ${e.id} · ${escapeHtml(e.arcana && e.arcana.ar)}</strong></p>` : '');
    const slot = def => {
      if (!def) return null;
      const parts = entries.map(en => {
        const v = sectionEntryVal(en, def[0]);
        const html = sectionVal(Array.isArray(v) ? 'l' : 't', '', v);
        return html ? head(en) + html : '';
      }).filter(Boolean);
      return parts.length ? parts.join('') : null;
    };
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const detailed = entries.map(en => {
      const rows = spec.detailed.map(([kind, label, key]) => sectionVal(kind, label, sectionEntryVal(en, key))).join('');
      const gd = g && en.genderDynamic && en.genderDynamic[g]
        ? `<p class="aqm-slot-p aqm-gender-dynamic"><strong>بصيغتك:</strong> ${escapeHtml(en.genderDynamic[g])}</p>` : '';
      const draft = en.meta && en.meta.status === 'draft' ? '<p class="aqm-slot-p aqm-draft-note">نص تأملي قيد المراجعة.</p>' : '';
      return `<div class="aqm-sec-entry">${head(en)}${en.summary ? `<p class="aqm-slot-p aqm-sec-lead">${escapeHtml(en.summary)}</p>` : ''}${rows}${gd}${draft}</div>`;
    }).join('');
    return { detailed, strengths: slot(spec.strengths), challenges: slot(spec.challenges), practical: slot(spec.practical) };
  }

  function setSlots(item, fill) {
    ['detailed', 'strengths', 'challenges', 'practical'].forEach(name => {
      if (!fill[name]) return;
      const el = item.querySelector(`[data-slot="${name}"] .aqm-slot-p`);
      if (el) el.innerHTML = fill[name];
    });
  }

  function hydrateSection(item, spec, P, gender) {
    if (!item || item.dataset.secState === 'loading' || item.dataset.secState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.section !== 'function') return Promise.resolve();
    item.dataset.secState = 'loading';
    return loader.section(spec.file).then(data => {
      item.dataset.secState = 'done';
      const ids = [...new Set(spec.ids(P).map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 22))];
      const entries = ids.map(id => data.entries.find(e => e.id === id)).filter(Boolean);
      if (!entries.length) {
        const el = item.querySelector('[data-slot="detailed"] .aqm-slot-p');
        if (el) el.insertAdjacentHTML('beforeend', '<p class="aqm-slot-p aqm-pending-note">نص هذا الموضع قيد الإعداد.</p>');
        return;
      }
      setSlots(item, buildSectionFill(spec, entries, gender));
      item.dataset.secSource = 'json';
    }).catch(err => {
      delete item.dataset.secState;
      if (typeof console !== 'undefined') console.warn('matrix section load failed:', spec.file, err && err.message);
    });
  }

  /* البرامج المركبة: بحث بالكود، التطابق التام أولاً ثم المعكوس، ومفيش حاجة لو الثلاثية مش مسجلة. */
  function hydrateComposite(item, P) {
    if (!item || item.dataset.secState === 'loading' || item.dataset.secState === 'done') return Promise.resolve();
    const loader = window.AqeeqMatrix;
    if (!loader || typeof loader.section !== 'function') return Promise.resolve();
    item.dataset.secState = 'loading';
    return loader.section('composite_programs').then(data => {
      item.dataset.secState = 'done';
      const triads = [P.compositePrograms.spiritualTriad, P.compositePrograms.materialTriad].filter(t => Array.isArray(t) && t.length === 3);
      const found = [];
      triads.forEach(t => {
        const code = t.map(Number).join('-');
        const rev = t.map(Number).reverse().join('-');
        const hit = data.entries.find(e => e.code === code) || data.entries.find(e => e.code === rev);
        if (hit && !found.includes(hit)) found.push(hit);
      });
      if (!found.length) return;
      const html = found.map(e => `<div class="aqm-sec-entry"><p class="aqm-slot-p aqm-entry-head"><strong>${escapeHtml(e.title)} (شفرة ${escapeHtml(e.code)})</strong></p><p class="aqm-slot-p">${escapeHtml(e.summary)}</p>${sectionVal('t', 'مفتاح التوازن', e.deep && e.deep.remedy)}</div>`).join('');
      setSlots(item, { detailed: html });
      item.dataset.secSource = 'json';
    }).catch(err => {
      delete item.dataset.secState;
      if (typeof console !== 'undefined') console.warn('matrix composite load failed:', err && err.message);
    });
  }

  /* ===== التفسير الموسع: بيتبني من sections/*.json المراجَعة (مش من Master V1 الخام) =====
     كل قسم بيعرض كل حقول deep + genderDynamic (لو المستخدم اختار ذكر/أنثى). */
  const XR_SECTIONS = [
    { name: 'center', title: 'الجوهر والمركز', fields: [['t', 'الهوية', 'identity'], ['t', 'السلوك التلقائي', 'behavior'], ['l', 'فخ الظل', 'shadow'], ['t', 'مفتاح التوازن', 'balanceKey']] },
    { name: 'talents', title: 'المواهب والقدرات', fields: [['t', 'قناة الاتصال', 'channel'], ['t', 'الموهبة', 'gift'], ['t', 'الفخ', 'trap'], ['t', 'خطوة عملية', 'practice']] },
    { name: 'love_line', title: 'خط العلاقات والحب', fields: [['t', 'الانجذاب', 'attraction'], ['l', 'أنماط الظل', 'shadowPatterns'], ['t', 'مفتاح التناغم', 'harmonyKey']] },
    { name: 'money_line', title: 'خط المال والعمل', fields: [['t', 'بوابة التدفق', 'inflow'], ['j', 'المجالات الأنسب', 'sectors'], ['l', 'عوائق التدفق', 'blocks'], ['t', 'القاعدة الذهبية', 'goldenRule']] },
    { name: 'father_line', title: 'خط الأب', fields: [['t', 'المحور', 'theme'], ['t', 'الإمكانية', 'potential'], ['t', 'التحدي', 'challenge'], ['l', 'أسئلة للتأمل', 'questions'], ['t', 'خطوة عملية', 'practice']] },
    { name: 'mother_line', title: 'خط الأم', fields: [['t', 'المحور', 'theme'], ['t', 'الإمكانية', 'potential'], ['t', 'التحدي', 'challenge'], ['l', 'أسئلة للتأمل', 'questions'], ['t', 'خطوة عملية', 'practice']] },
    { name: 'ancestral_programs', title: 'برامج الأسلاف', fields: [['t', 'الجذر والموروث', 'roots'], ['l', 'أنماط السقوط التلقائي', 'fallPatterns'], ['t', 'مسار التحرر', 'path']] },
    { name: 'purposes', title: 'الغاية والرسالة', fields: [['t', 'الرسالة', 'mission'], ['t', 'امتحان النضج', 'maturityTest']] },
    { name: 'children_line', title: 'خط الأبناء', fields: [['t', 'الأسرة والتربية', 'family']] },
    { name: 'transformation_rx', title: 'روشتة التحول', fields: [['l', 'خطوات التحول', 'protocol'], ['l', 'أسئلة للتأمل', 'reflectiveQuestions']] }
  ];

  function xrSectionHtml(def, entry, gender) {
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const rows = def.fields.map(([kind, label, key]) => sectionVal(kind, label, entry.deep && entry.deep[key])).join('');
    const gd = g && entry.genderDynamic && entry.genderDynamic[g]
      ? `<p class="aqm-slot-p aqm-gender-dynamic"><strong>بصيغتك:</strong> ${escapeHtml(entry.genderDynamic[g])}</p>` : '';
    const draft = entry.meta && entry.meta.status === 'draft' ? '<p class="aqm-slot-p aqm-draft-note">نص تأملي قيد المراجعة.</p>' : '';
    const lead = entry.summary ? `<p class="aqm-slot-p aqm-sec-lead">${escapeHtml(entry.summary)}</p>` : '';
    return `<section class="aqm-xr-sec"><h5>${escapeHtml(def.title)}</h5>${lead}${rows}${gd}${draft}</section>`;
  }

  function expandedArcanaHtml(id, gender) {
    const loader = window.AqeeqMatrix;
    return Promise.all(XR_SECTIONS.map(def =>
      loader.sectionEntry(def.name, id).then(e => (e ? { def, e } : null)).catch(() => null)
    )).then(list => {
      const found = list.filter(Boolean);
      if (!found.length) return '<p class="aqm-slot-p aqm-pending-note">لا يوجد نص موسع لهذه الأركانا بعد.</p>';
      const a = found[0].e.arcana || {};
      return `<article class="aqm-xr" dir="rtl"><header class="aqm-xr-head"><span class="aqm-xr-kicker">التفسير الموسع</span><h4>الأركانا ${id} · ${escapeHtml(a.ar || '')}${a.en ? ` <small>${escapeHtml(a.en)}</small>` : ''}</h4></header>${found.map(({ def, e }) => xrSectionHtml(def, e, gender)).join('')}</article>`;
    });
  }

  function tailsLibraryHtml(data, gender) {
    const g = gender === 'male' || gender === 'female' ? gender : '';
    const items = data.tails.map(t => {
      const v = (g && t.genderVariants && t.genderVariants[g]) || {};
      return `<details class="aqm-xr-tail"><summary><strong>${escapeHtml(t.code)}</strong> · ${escapeHtml(t.title.ar)} — ${escapeHtml(t.title.subtitle)}</summary>
        ${sectionVal('t', 'العمق النفسي', t.psychologicalDepth)}${sectionVal('t', 'التناقض', v.paradox || t.paradox)}${sectionVal('t', 'جذور الطفولة', v.childhoodRoots || t.childhoodRoots)}${sectionVal('t', 'التنبيه الجسدي الرمزي', t.symbolicBodyNote)}${sectionVal('l', 'بروتوكول التحرر', t.protocol)}
      </details>`;
    }).join('');
    return `<article class="aqm-xr" dir="rtl"><header class="aqm-xr-head"><span class="aqm-xr-kicker">مكتبة الذيول الكارمية</span><h4>${data.tails.length} ذيلاً كارمياً</h4></header>${items}</article>`;
  }

  /* زر «التفسير الموسع» وزر مكتبة الذيول: كليك واحد يفتح المحتوى جوه البطاقة، وكليك تاني يقفله. */
  function bindExpandedReadings(host) {
    if (!host || host.dataset.aqmXrBound === 'true') return;
    host.dataset.aqmXrBound = 'true';
    host.addEventListener('click', ev => {
      const btn = ev.target.closest && ev.target.closest('.aqm-master-open');
      if (!btn || !host.contains(btn)) return;
      const lib = btn.closest('.aqm-master-library');
      const out = lib && lib.querySelector('.aqm-master-output');
      const loader = window.AqeeqMatrix;
      if (!out || !loader) return;
      if (btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
        out.innerHTML = '';
        return;
      }
      lib.querySelectorAll('.aqm-master-open').forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
      out.innerHTML = '<p class="aqm-slot-p aqm-xr-loading">جارٍ التحميل…</p>';
      const gender = host.dataset.aqmGender || '';
      const task = btn.dataset.aqmMasterTail
        ? loader.karmicTails().then(d => tailsLibraryHtml(d, gender))
        : expandedArcanaHtml(Number(btn.dataset.aqmMasterArcana), gender);
      task.then(html => {
        if (btn.getAttribute('aria-expanded') === 'true') out.innerHTML = html;
      }).catch(() => {
        out.innerHTML = '<p class="aqm-slot-p aqm-pending-note">تعذّر تحميل النص الآن. حاول مرة أخرى.</p>';
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function buildMasterLibrary(item) {
    const uniqueArcana = [...new Map((item.arcanaList || [])
      .filter(a => Number.isInteger(Number(a.num)) && Number(a.num) >= 1 && Number(a.num) <= 22)
      .map(a => [Number(a.num), a])).values()];
    if (!uniqueArcana.length) return '';
    const buttons = uniqueArcana.map(a => `
      <button type="button" class="aqm-master-open" data-aqm-master-arcana="${a.num}" aria-expanded="false">
        <span aria-hidden="true">✦</span> التفسير الموسع: ${a.num} · ${escapeHtml(a.name)}
      </button>`).join('');
    const tailButton = item.id === 'karmic_tail'
      ? '<button type="button" class="aqm-master-open aqm-master-tail-open" data-aqm-master-tail="true" aria-expanded="false">⚓ مكتبة الذيول الكارمية والتركيبات الكاملة</button>'
      : '';
    return `
      <section class="aqm-master-library" aria-label="التفسير الموسع للأركانا">
        <div class="aqm-master-library-intro">
          <h4>المكتبة الموسعة للطاقات الظاهرة في هذا الموضع</h4>
          <p>اضغط على أي طاقة لقراءة تفسيرها الموسع المراجَع (الجوهر والمواهب والعلاقات والمال والأسلاف وغيرها). التحميل يتم عند الطلب ولا يغير حساب المصفوفة.</p>
        </div>
        <div class="aqm-master-actions">${buttons}${tailButton}</div>
        <div class="aqm-master-output" aria-live="polite"></div>
      </section>`;
  }

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
      <div class="aqm-acc-item${isPending ? ' is-pending' : ''}" id="aqm-sec-${id}" data-section-id="${id}" data-content-key="${contentKey}" data-pending="${isPending}"${item.ktRedirect ? ` data-kt-redirect="${item.ktRedirect}"` : ''}>
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
            <section class="aqm-slot aqm-slot-primary" data-slot="primary">
              <h4 class="aqm-slot-title">✦ النص الأساسي</h4>
              <div class="aqm-slot-p">${slots.primary}</div>
            </section>

            <!-- التفسير التفصيلي والعميق -->
            <section class="aqm-slot aqm-slot-detailed" data-slot="detailed">
              <h4 class="aqm-slot-title">📖 التفسير التفصيلي والعميق</h4>
              <div class="aqm-slot-p">${slots.detailed}</div>
            </section>

            <!-- نقاط القوة والتجلي الإيجابي -->
            <section class="aqm-slot aqm-slot-strengths" data-slot="strengths">
              <h4 class="aqm-slot-title">✨ نقاط القوة والتجلي الإيجابي (النور)</h4>
              <div class="aqm-slot-p">${slots.strengths}</div>
            </section>

            <!-- التحديات والجانب الظلي -->
            <section class="aqm-slot aqm-slot-challenges" data-slot="challenges">
              <h4 class="aqm-slot-title">⚠️ التحديات والجانب الظلي (الظل)</h4>
              <div class="aqm-slot-p">${slots.challenges}</div>
            </section>

            <!-- التطبيق العملي وخطوات التوازن -->
            <section class="aqm-slot aqm-slot-practical" data-slot="practical">
              <h4 class="aqm-slot-title">🌱 خطوات التوازن والتطبيق اليومي</h4>
              <div class="aqm-slot-p">${slots.practical}</div>
            </section>
          </div>
          ${buildMasterLibrary(item)}
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
    const ktData = destinyData && destinyData.getKarmicTail ? destinyData.getKarmicTail(intermediate.D2, intermediate.D3, D) : null;
    // أرقام الذيل المعتمدة للعرض: عند ربط ثلاثية بذيل معتمد (mappedFrom) نعرض أرقام شفرته هو في كل مكان بالأكورديون
    const tailMapped = !!(ktData && ktData.mappedFrom && ktData.code);
    const tailNums = tailMapped ? ktData.code.split('-').map(Number) : [intermediate.D2, intermediate.D3, D];
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
        arcanaList: tailNums.map(n => ({ num: n, name: getInfo(n).name })),
        contentKey: 'matrix.section.karmic_tail',
        ktRedirect: tailMapped ? ktData.code : '',
        slots: {
          primary: `يتشكل ثالوث ذيلك الكارمي من الطاقات <strong>(${tailNums.join(' - ')})</strong>${tailMapped ? '.' : ` بقيادة طاقة الأساس <strong>${getInfo(D).name}</strong>.`}`,
          detailed: ktData ? `
            <div class="aqm-kt-box">
              <p class="aqm-slot-p"><strong>شفرة الذيل:</strong> ${ktData.code || tailNums.join('-')}</p>
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

    // لو الاستدعاء جه من index.html (بدون جنس)، ناخد الاختيار من حقل صيغة التقرير.
    if (!gender) {
      const gi = document.querySelector('#m-gender');
      gender = gi ? gi.value : '';
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
    host.dataset.aqmGender = gender || '';
    bindExpandedReadings(host);

    // تحميل المحتوى عند فتح الأكورديون (الذيل الكارمي من karmic-tails.json)
    // ترتيب الأرشيف هو عكس ترتيب المحرك (D, D3, D2)، فنعكس الثلاثية قبل البحث.
    const tailTriad = [P.intermediate && P.intermediate.D2, P.intermediate && P.intermediate.D3, P.anchors.D];
    const onAccOpen = item => {
      const sid = item.dataset.sectionId;
      if (sid === 'karmic_tail') return hydrateKarmicTail(item, tailTriad, gender);
      if (sid === 'composite_programs') return hydrateComposite(item, P);
      if (SECTION_SPECS[sid]) return hydrateSection(item, SECTION_SPECS[sid], P, gender);
      return Promise.resolve();
    };

    // ربط تفاعلات الأكورديون
    const accItems = host.querySelectorAll('.aqm-acc-item');
    accItems.forEach(item => {
      const header = item.querySelector('.aqm-acc-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // السماح بفتح وإغلاق مستقل
        item.classList.toggle('open');
        header.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) onAccOpen(item);
      });
    });

    // فتح القسم الأول (المركز) تلقائياً افتراضياً
    const firstAcc = host.querySelector('#aqm-sec-center');
    if (firstAcc) {
      firstAcc.classList.add('open');
      firstAcc.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
    }
    // نحمّل نصوص كل الأقسام فوراً بعد الرسم عشان النص العميق يكون جاهز أول ما الأكورديون يتفتح.
    accItems.forEach(item => { onAccOpen(item); });

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
      const loads = [];
      accItems.forEach(item => {
        item.classList.add('open');
        item.querySelector('.aqm-acc-header')?.setAttribute('aria-expanded', 'true');
        loads.push(onAccOpen(item));
      });
      // نستنى تحميل نصوص الأقسام قبل الطباعة عشان الـ PDF يطلع كامل.
      Promise.all(loads).then(() => window.print(), () => window.print());
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
  api.axisPoints = axisPoints;
  api.diagonalPoints = diagonalPoints;
  root.AqeeqMatrixUI = api;
  root.AqeeqNumerology = Object.assign(root.AqeeqNumerology || {}, api);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
