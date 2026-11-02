/* ============================================================================
   عقيق أسترو — العجلة الفلكية الاحترافية متعددة الطبقات (Ivory Celestial Wheel)
   ترتقي بـ svg.wheel في قسم الهيرو إلى عجلة فلكية كلاسيكية بهوية العاج والذهبي والبرغندي:
     • الطبقة الخارجية (.spin-a): حلقة الدرجات الـ 360 (كل 5° و10° و30°) تدور ببطء
     • طبقة الأبراج الـ 12: قطاعات عاجية متناوبة ورموز الأبراج باللون البرغندي والذهبي
     • الطبقة المدارية (.pw-orbit-layer): مسارات الكواكب الفلكية الحية
     • الطبقة الهندسية (.spin-b): خطوط البيوت والهندسة المقدسة تدور بالاتجاه المعاكس
     • القلب الشمسي المركزي (.pw-sun-focal): شمس فلكية ذهبية/برغندية متوهجة في المركز
     • مواقع الكواكب الحية الآن في السماء محسوبة فعلياً عبر window.Astro
   ============================================================================ */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var CX = 200, CY = 200;

  var SIGNS_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var SIGNS_AR = ['الحمل','الثور','الجوزاء','السرطان','الأسد','العذراء','الميزان','العقرب','القوس','الجدي','الدلو','الحوت'];
  var EL_TINT = [
    'rgba(107, 38, 61, 0.06)',  // نار — برغندي دافئ خفيف
    'rgba(197, 164, 109, 0.11)', // تراب — ذهبي شامبانيا خفيف
    'rgba(82, 115, 138, 0.07)',  // هواء — أزرق سماوي هادئ
    'rgba(200, 155, 158, 0.09)'  // ماء — وردي مغبر ناعم
  ];

  var PLANETS_LIVE = [
    { key: 'sun',     g: '☉', ar: 'الشمس',   col: '#6B263D', bg: '#FAF3E6', r: 108 },
    { key: 'moon',    g: '☽', ar: 'القمر',   col: '#52738A', bg: '#F4F8FA', r: 108 },
    { key: 'mercury', g: '☿', ar: 'عطارد',   col: '#7A5C38', bg: '#FAF6EE', r: 94  },
    { key: 'venus',   g: '♀', ar: 'الزهرة',  col: '#8C3B54', bg: '#FCF5F6', r: 94  },
    { key: 'mars',    g: '♂', ar: 'المريخ',  col: '#9B333E', bg: '#FDF4F4', r: 94  },
    { key: 'jupiter', g: '♃', ar: 'المشتري', col: '#6B263D', bg: '#FAF3E6', r: 80  },
    { key: 'saturn',  g: '♄', ar: 'زحل',     col: '#5C4B3B', bg: '#F7F3EB', r: 80  }
  ];

  function el(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  function polar(r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  }

  function sectorPath(rOuter, rInner, deg0, deg1) {
    var p1 = polar(rOuter, deg0);
    var p2 = polar(rOuter, deg1);
    var p3 = polar(rInner, deg1);
    var p4 = polar(rInner, deg0);
    var large = (deg1 - deg0) > 180 ? 1 : 0;
    return 'M ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) +
           ' A ' + rOuter + ' ' + rOuter + ' 0 ' + large + ' 1 ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2) +
           ' L ' + p3[0].toFixed(2) + ' ' + p3[1].toFixed(2) +
           ' A ' + rInner + ' ' + rInner + ' 0 ' + large + ' 0 ' + p4[0].toFixed(2) + ' ' + p4[1].toFixed(2) +
           ' Z';
  }

  function enhanceHeroWheel() {
    var svg = document.querySelector('#home svg.wheel');
    if (!svg || svg.getAttribute('data-pro-wheel') === '1') return;
    svg.setAttribute('data-pro-wheel', '1');

    // 1. تعريفات التدرجات العاجية والذهبية والبرغندية
    var defs = svg.querySelector('defs') || svg.insertBefore(el('defs'), svg.firstChild);
    var bgGrad = el('radialGradient', { id: 'pw-bg', cx: '50%', cy: '50%', r: '55%' });
    bgGrad.appendChild(el('stop', { offset: '0%',   'stop-color': '#FFFFFF', 'stop-opacity': '0.98' }));
    bgGrad.appendChild(el('stop', { offset: '62%',  'stop-color': '#FAF6EE', 'stop-opacity': '0.95' }));
    bgGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#EFE8DA', 'stop-opacity': '0.92' }));
    defs.appendChild(bgGrad);

    var sunGrad = el('radialGradient', { id: 'pw-sun-grad', cx: '50%', cy: '50%', r: '50%' });
    sunGrad.appendChild(el('stop', { offset: '0%',   'stop-color': '#FFFDF9', 'stop-opacity': '1' }));
    sunGrad.appendChild(el('stop', { offset: '55%',  'stop-color': '#F5E6C8', 'stop-opacity': '0.95' }));
    sunGrad.appendChild(el('stop', { offset: '100%', 'stop-color': '#C5A46D', 'stop-opacity': '0.25' }));
    defs.appendChild(sunGrad);

    // 2. القرص الخلفي العاجي الدافئ
    var disc = el('circle', {
      cx: CX, cy: CY, r: 192,
      fill: 'url(#pw-bg)',
      stroke: '#C5A46D',
      'stroke-width': '1.2',
      'class': 'pw-disc'
    });
    svg.insertBefore(disc, svg.firstChild.nextSibling);

    // 3. قطاعات الأبراج الـ 12 (بين نصف القطر 132 و166)
    var sectorsG = el('g', { 'class': 'pw-sectors', 'aria-hidden': 'true' });
    for (var s = 0; s < 12; s++) {
      var d0 = s * 30 - 15;
      var d1 = d0 + 30;
      var path = el('path', {
        d: sectorPath(166, 132, d0, d1),
        fill: EL_TINT[s % 4],
        stroke: 'rgba(197, 164, 109, 0.45)',
        'stroke-width': '0.8',
        'class': 'pw-sign-sector'
      });
      var title = el('title');
      title.textContent = SIGNS_AR[s] + ' ' + SIGNS_GLYPHS[s];
      path.appendChild(title);
      sectorsG.appendChild(path);
    }
    svg.insertBefore(sectorsG, disc.nextSibling);

    // 4. الطبقة الأولى المتحركة (.spin-a): حلقة الدرجات الـ 360 الدقيقة
    var spinA = svg.querySelector('.spin-a');
    var ticksG = el('g', {
      'class': 'pw-ticks',
      stroke: '#C5A46D',
      'stroke-linecap': 'round',
      'aria-hidden': 'true'
    });
    for (var deg = 0; deg < 360; deg += 5) {
      var isSign = (deg % 30 === 0);
      var isTen  = (deg % 10 === 0);
      var rOut = 188;
      var rIn  = isSign ? 168 : (isTen ? 178 : 183);
      var pA = polar(rOut, deg - 15);
      var pB = polar(rIn,  deg - 15);
      ticksG.appendChild(el('line', {
        x1: pA[0].toFixed(2), y1: pA[1].toFixed(2),
        x2: pB[0].toFixed(2), y2: pB[1].toFixed(2),
        'stroke-width': isSign ? '1.3' : (isTen ? '0.85' : '0.55'),
        opacity: isSign ? '0.85' : (isTen ? '0.55' : '0.35')
      }));
    }
    if (spinA) {
      spinA.appendChild(ticksG);
    } else {
      svg.insertBefore(ticksG, sectorsG.nextSibling);
    }

    // 5. الطبقة المدارية للكواكب (.pw-orbit-layer)
    var orbitLayer = el('g', { 'class': 'pw-orbit-layer', 'aria-hidden': 'true' });
    [108, 94, 80].forEach(function (radius, idx) {
      orbitLayer.appendChild(el('circle', {
        cx: CX, cy: CY, r: radius,
        fill: 'none',
        stroke: '#C5A46D',
        'stroke-width': idx === 0 ? '0.85' : '0.65',
        'stroke-dasharray': idx % 2 === 0 ? '2 5' : '4 4',
        opacity: '0.55'
      }));
    });
    // نقاط مدارية ذهبية صغيرة على المدارات
    [45, 135, 225, 315].forEach(function (angle, idx) {
      var pt = polar(108 - (idx % 2) * 14, angle);
      orbitLayer.appendChild(el('circle', {
        cx: pt[0].toFixed(2), cy: pt[1].toFixed(2), r: '2.2',
        fill: '#C5A46D', opacity: '0.7'
      }));
    });
    svg.appendChild(orbitLayer);

    // 6. القلب الشمسي الفلكي في المركز (.pw-sun-focal)
    var sunFocal = el('g', { 'class': 'pw-sun-focal', 'aria-hidden': 'true' });
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 28,
      fill: 'url(#pw-sun-grad)',
      stroke: 'rgba(197, 164, 109, 0.55)',
      'stroke-width': '0.9'
    }));
    // 12 شعاعاً شمسياً كلاسيكياً دقيقاً في المركز
    for (var ray = 0; ray < 12; ray++) {
      var rAng = ray * 30;
      var rStart = polar(11, rAng);
      var rEnd = polar(ray % 2 === 0 ? 24 : 18, rAng);
      sunFocal.appendChild(el('line', {
        x1: rStart[0].toFixed(2), y1: rStart[1].toFixed(2),
        x2: rEnd[0].toFixed(2),   y2: rEnd[1].toFixed(2),
        stroke: ray % 2 === 0 ? '#6B263D' : '#C5A46D',
        'stroke-width': ray % 2 === 0 ? '1.15' : '0.85',
        opacity: '0.75'
      }));
    }
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 9.5,
      fill: '#FAF6EE',
      stroke: '#6B263D',
      'stroke-width': '1.3'
    }));
    sunFocal.appendChild(el('circle', {
      cx: CX, cy: CY, r: 2.8,
      fill: '#6B263D'
    }));
    svg.appendChild(sunFocal);

    // 7. طبقة الكواكب الحية الآن في السماء (باستخدام محرك Astro الحقيقي)
    var liveG = el('g', { 'class': 'pw-live', 'aria-label': 'مواقع الكواكب الآن في السماء' });
    svg.appendChild(liveG);

    function plotLivePlanets() {
      var A = window.Astro;
      if (!A || typeof A.lonOf !== 'function' || typeof A.jdeNow !== 'function') {
        return false;
      }
      while (liveG.firstChild) liveG.removeChild(liveG.firstChild);
      var jde = A.jdeNow();

      PLANETS_LIVE.forEach(function (P) {
        var lon = A.lonOf(P.key, jde);
        if (typeof lon !== 'number' || isNaN(lon)) return;
        var deg = (lon - 15 + 360) % 360;
        var pos = polar(P.r, deg);
        var edge = polar(132, deg);
        var signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
        var degInSign = Math.floor(((lon % 360) + 360) % 30);

        var g = el('g', { 'class': 'pw-planet', 'data-planet': P.key });
        var tip = el('title');
        tip.textContent = P.ar + ' الآن في برج ' + SIGNS_AR[signIdx] + ' (' + degInSign + '°)';
        g.appendChild(tip);

        // خط رقيق يصل الكوكب بقطاع البرج المقابل له
        g.appendChild(el('line', {
          x1: pos[0].toFixed(2), y1: pos[1].toFixed(2),
          x2: edge[0].toFixed(2), y2: edge[1].toFixed(2),
          stroke: P.col, 'stroke-width': '0.85', 'stroke-dasharray': '1.5 2.5', opacity: '0.55'
        }));
        // هالة عاجية/ذهبية ناعمة
        g.appendChild(el('circle', {
          cx: pos[0].toFixed(2), cy: pos[1].toFixed(2), r: '10',
          fill: P.bg, stroke: '#C5A46D', 'stroke-width': '1.1', opacity: '0.96', 'class': 'pw-p-halo'
        }));
        // رمز الكوكب بتباين واضح
        var t = el('text', {
          x: pos[0].toFixed(2), y: (pos[1] + 0.5).toFixed(2),
          'text-anchor': 'middle', 'dominant-baseline': 'central',
          fill: P.col, 'font-size': '11.5', 'font-weight': '700'
        });
        t.textContent = P.g;
        g.appendChild(t);

        liveG.appendChild(g);
      });
      return true;
    }

    if (!plotLivePlanets()) {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (plotLivePlanets() || tries > 20) clearInterval(iv);
      }, 250);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceHeroWheel);
  } else {
    enhanceHeroWheel();
  }
})();
