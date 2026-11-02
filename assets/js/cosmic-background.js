/* ============================================================================
   عقيق أسترو — البيئة الكونية العاجية الحية (Living Ivory Celestial Environment)
   خلفية فلكية دافئة ومريحة بصرياً على لون العاج الدافئ (#F5F0E6):
     1) دوائر ومدارات فلكية ذهبية رفيعة (#C5A46D) تدور ببطء شديد
     2) تقسيمات الأبراج الـ 12 ودرجات القوس الفلكي ومخططات هندسية خافتة
     3) رموز كوكبية وبروجية رقيقة تسبح بهدوء على المسارات المدارية
     4) كوكبات نجمية ناعمة وذرات ضوئية ذهبية دافئة
     5) لوحة كوكبة البرج التفاعلية في قسم الأبراج (#signs) بالهوية العاجية
   ============================================================================ */
(function () {
  'use strict';

  var SIGN_META = [
    { id: 'aries',       ar: 'الحمل',   en: 'Aries',       glyph: '♈', el: 'fire',  stars: [[0.18,0.62,1.6],[0.38,0.44,2.4],[0.62,0.38,2.9],[0.78,0.48,1.9],[0.84,0.60,1.4]], lines: [[0,1],[1,2],[2,3],[3,4]] },
    { id: 'taurus',      ar: 'الثور',   en: 'Taurus',      glyph: '♉', el: 'earth', stars: [[0.18,0.28,1.9],[0.36,0.44,1.8],[0.50,0.52,3.1],[0.42,0.64,1.9],[0.24,0.78,1.8],[0.66,0.46,2.0],[0.82,0.34,2.2],[0.78,0.66,1.7]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[5,7]] },
    { id: 'gemini',      ar: 'الجوزاء', en: 'Gemini',      glyph: '♊', el: 'air',   stars: [[0.34,0.22,2.8],[0.64,0.20,3.0],[0.36,0.42,1.9],[0.62,0.40,2.0],[0.32,0.64,1.8],[0.60,0.62,1.9],[0.26,0.82,1.7],[0.44,0.80,1.6],[0.58,0.82,1.7],[0.74,0.78,1.6]], lines: [[0,2],[2,4],[4,6],[4,7],[1,3],[3,5],[5,8],[5,9],[2,3]] },
    { id: 'cancer',      ar: 'السرطان', en: 'Cancer',      glyph: '♋', el: 'water', stars: [[0.50,0.24,1.9],[0.48,0.48,2.4],[0.30,0.72,2.0],[0.68,0.70,2.1],[0.50,0.56,1.6]], lines: [[0,1],[1,2],[1,3],[1,4]] },
    { id: 'leo',         ar: 'الأسد',   en: 'Leo',         glyph: '♌', el: 'fire',  stars: [[0.24,0.72,3.1],[0.30,0.52,2.1],[0.22,0.36,1.9],[0.32,0.24,2.2],[0.44,0.30,1.8],[0.48,0.48,2.2],[0.68,0.54,2.1],[0.82,0.66,2.6],[0.72,0.72,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,1],[5,6],[6,7],[7,8],[8,0]] },
    { id: 'virgo',       ar: 'العذراء', en: 'Virgo',       glyph: '♍', el: 'earth', stars: [[0.20,0.40,1.8],[0.36,0.34,2.0],[0.50,0.46,2.2],[0.66,0.32,2.0],[0.62,0.64,3.1],[0.42,0.70,1.9],[0.26,0.78,1.7],[0.78,0.52,1.8],[0.84,0.72,1.7]], lines: [[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[2,7],[4,8]] },
    { id: 'libra',       ar: 'الميزان', en: 'Libra',       glyph: '♎', el: 'air',   stars: [[0.50,0.24,2.6],[0.28,0.48,2.5],[0.72,0.46,2.2],[0.36,0.76,1.9],[0.66,0.74,1.8]], lines: [[0,1],[0,2],[1,2],[1,3],[2,4]] },
    { id: 'scorpio',     ar: 'العقرب',  en: 'Scorpio',     glyph: '♏', el: 'water', stars: [[0.22,0.26,2.0],[0.20,0.38,2.1],[0.24,0.50,1.9],[0.36,0.42,3.2],[0.48,0.52,2.1],[0.56,0.66,2.0],[0.64,0.78,2.0],[0.76,0.80,1.9],[0.84,0.70,2.4],[0.80,0.60,2.0]], lines: [[0,3],[1,3],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]] },
    { id: 'sagittarius', ar: 'القوس',   en: 'Sagittarius', glyph: '♐', el: 'fire',  stars: [[0.26,0.64,2.2],[0.36,0.46,2.1],[0.50,0.32,2.3],[0.54,0.52,2.2],[0.42,0.68,2.4],[0.66,0.42,2.0],[0.76,0.56,2.1],[0.68,0.70,2.2]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3],[2,5],[5,6],[6,7],[7,3]] },
    { id: 'capricorn',   ar: 'الجدي',   en: 'Capricorn',   glyph: '♑', el: 'earth', stars: [[0.20,0.34,2.3],[0.34,0.46,1.9],[0.52,0.56,1.8],[0.72,0.48,2.1],[0.82,0.34,2.4],[0.68,0.68,2.0],[0.46,0.74,2.1],[0.28,0.62,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]] },
    { id: 'aquarius',    ar: 'الدلو',   en: 'Aquarius',    glyph: '♒', el: 'air',   stars: [[0.24,0.30,2.2],[0.40,0.26,2.5],[0.56,0.34,2.4],[0.48,0.46,1.9],[0.34,0.58,2.0],[0.66,0.52,2.0],[0.58,0.68,1.9],[0.74,0.74,2.1],[0.44,0.78,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[4,8]] },
    { id: 'pisces',      ar: 'الحوت',   en: 'Pisces',      glyph: '♓', el: 'water', stars: [[0.22,0.30,2.1],[0.30,0.44,1.8],[0.40,0.60,1.8],[0.50,0.76,2.4],[0.62,0.64,1.9],[0.72,0.50,1.9],[0.80,0.36,2.1],[0.74,0.26,1.9],[0.84,0.28,1.8]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,6]] }
  ];

  var PLANET_GLYPHS = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆'];
  var ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  var canvas = document.getElementById('cosmos-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'cosmos-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }
  var ctx = canvas.getContext('2d', { alpha: true });

  var tint = document.getElementById('sky-tint');
  if (!tint) {
    tint = document.createElement('div');
    tint.id = 'sky-tint';
    tint.setAttribute('aria-hidden', 'true');
    document.body.prepend(tint);
  }

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var orbitalBodies = [];
  var constellations = [];
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seedScene() {
    var isMobile = W < 768;
    var particleCount = isMobile ? 32 : 58;
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.7 + Math.random() * 1.6,
        alpha: 0.14 + Math.random() * 0.28,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.55,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: (Math.random() - 0.5) * 0.06,
        isBurgundy: Math.random() < 0.18
      });
    }

    orbitalBodies = [];
    var orbitCount = isMobile ? 5 : 8;
    for (var j = 0; j < orbitCount; j++) {
      orbitalBodies.push({
        radiusRatio: 0.18 + j * 0.055,
        angle: (j * Math.PI * 2) / orbitCount + 0.4,
        speed: (j % 2 === 0 ? 1 : -1) * (0.000045 + j * 0.000008),
        glyph: PLANET_GLYPHS[j % PLANET_GLYPHS.length],
        size: isMobile ? 11 : 13
      });
    }

    // 3 faint background constellations placed in corners
    constellations = [
      { cx: 0.14, cy: 0.22, scale: isMobile ? 90 : 140, pts: [[0,0],[0.4,-0.25],[0.85,-0.1],[1.1,0.3],[0.6,0.45]], links: [[0,1],[1,2],[2,3],[2,4]] },
      { cx: 0.84, cy: 0.26, scale: isMobile ? 95 : 150, pts: [[0,0],[-0.45,0.2],[-0.8,-0.15],[-0.3,-0.5],[0.25,-0.35]], links: [[0,1],[1,2],[1,3],[3,4],[4,0]] },
      { cx: 0.18, cy: 0.78, scale: isMobile ? 85 : 130, pts: [[0,0],[0.5,0.15],[0.9,-0.2],[1.25,0.1]], links: [[0,1],[1,2],[2,3]] }
    ];
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedScene();
  }

  function drawCelestialWheelBackground(t) {
    var cx = W * 0.5;
    var cy = H * 0.46;
    var baseR = Math.min(W, H) * (W < 768 ? 0.44 : 0.41);

    ctx.save();
    ctx.translate(cx, cy);

    // 1. Gentle warm radial halo
    var halo = ctx.createRadialGradient(0, 0, baseR * 0.08, 0, 0, baseR * 1.25);
    halo.addColorStop(0, 'rgba(197, 164, 109, 0.08)');
    halo.addColorStop(0.55, 'rgba(197, 164, 109, 0.035)');
    halo.addColorStop(1, 'rgba(245, 240, 230, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer astrological wheel ring & 12 zodiac divisions (slow clockwise rotation)
    var rotOuter = reducedMotion ? 0 : t * 0.000018;
    ctx.save();
    ctx.rotate(rotOuter);

    ctx.strokeStyle = 'rgba(197, 164, 109, 0.20)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(197, 164, 109, 0.15)';
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.86, 0, Math.PI * 2);
    ctx.stroke();

    // 72 fine degree ticks around the outer ring
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.18)';
    ctx.lineWidth = 0.65;
    for (var deg = 0; deg < 360; deg += 5) {
      var rad = (deg * Math.PI) / 180;
      var isMajor = deg % 30 === 0;
      var rInner = isMajor ? baseR * 0.86 : baseR * 0.965;
      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * rInner, Math.sin(rad) * rInner);
      ctx.lineTo(Math.cos(rad) * baseR, Math.sin(rad) * baseR);
      ctx.stroke();
    }

    // Faint zodiac glyphs in the 12 sectors
    ctx.fillStyle = 'rgba(107, 38, 61, 0.13)';
    ctx.font = (W < 768 ? '11px' : '13px') + ' "Amiri", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var z = 0; z < 12; z++) {
      var midAngle = ((z * 30 + 15) * Math.PI) / 180;
      var gx = Math.cos(midAngle) * (baseR * 0.91);
      var gy = Math.sin(midAngle) * (baseR * 0.91);
      ctx.fillText(ZODIAC_GLYPHS[z], gx, gy);
    }
    ctx.restore();

    // 3. Counter-rotating geometric astronomical diagram (octagram / cardinal axes)
    var rotInner = reducedMotion ? 0 : -t * 0.000014;
    ctx.save();
    ctx.rotate(rotInner);
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.12)';
    ctx.lineWidth = 0.7;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Subtle sacred square & diamond inside the wheel
    var sqR = baseR * 0.68;
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.09)';
    ctx.lineWidth = 0.65;
    for (var s = 0; s < 2; s++) {
      ctx.save();
      ctx.rotate((s * Math.PI) / 4);
      ctx.beginPath();
      ctx.moveTo(sqR, 0);
      ctx.lineTo(0, sqR);
      ctx.lineTo(-sqR, 0);
      ctx.lineTo(0, -sqR);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // 4. Delicate planetary symbols drifting along orbital paths
    for (var b = 0; b < orbitalBodies.length; b++) {
      var body = orbitalBodies[b];
      var orbitR = Math.min(W, H) * body.radiusRatio;
      var ang = body.angle + (reducedMotion ? 0 : t * body.speed);
      var bx = Math.cos(ang) * orbitR;
      var by = Math.sin(ang) * orbitR;

      // Subtle dashed orbital track
      if (b % 2 === 0) {
        ctx.strokeStyle = 'rgba(197, 164, 109, 0.08)';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, orbitR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Small golden orbital node & planetary symbol
      ctx.fillStyle = 'rgba(197, 164, 109, 0.22)';
      ctx.beginPath();
      ctx.arc(bx, by, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(107, 38, 61, 0.26)';
      ctx.font = body.size + 'px "IBM Plex Sans Arabic", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(body.glyph, bx, by);
    }

    ctx.restore();
  }

  function drawConstellationsAndParticles(t) {
    // Faint corner constellations
    ctx.save();
    for (var c = 0; c < constellations.length; c++) {
      var con = constellations[c];
      var ox = con.cx * W;
      var oy = con.cy * H;

      ctx.strokeStyle = 'rgba(197, 164, 109, 0.16)';
      ctx.lineWidth = 0.75;
      for (var l = 0; l < con.links.length; l++) {
        var p1 = con.pts[con.links[l][0]];
        var p2 = con.pts[con.links[l][1]];
        ctx.beginPath();
        ctx.moveTo(ox + p1[0] * con.scale, oy + p1[1] * con.scale);
        ctx.lineTo(ox + p2[0] * con.scale, oy + p2[1] * con.scale);
        ctx.stroke();
      }

      for (var p = 0; p < con.pts.length; p++) {
        var pt = con.pts[p];
        var px = ox + pt[0] * con.scale;
        var py = oy + pt[1] * con.scale;
        ctx.fillStyle = 'rgba(197, 164, 109, 0.34)';
        ctx.beginPath();
        ctx.arc(px, py, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Soft golden & burgundy celestial dust particles
    for (var i = 0; i < particles.length; i++) {
      var st = particles[i];
      if (!reducedMotion) {
        st.x += st.driftX;
        st.y += st.driftY;
        if (st.x < 0) st.x = W;
        if (st.x > W) st.x = 0;
        if (st.y < 0) st.y = H;
        if (st.y > H) st.y = 0;
      }
      var pulse = reducedMotion ? 1 : 0.65 + 0.35 * Math.sin(t * 0.0012 * st.speed + st.phase);
      var a = st.alpha * pulse;
      ctx.fillStyle = st.isBurgundy
        ? 'rgba(107, 38, 61, ' + (a * 0.7).toFixed(3) + ')'
        : 'rgba(197, 164, 109, ' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    var t = now || 0;
    ctx.clearRect(0, 0, W, H);
    drawCelestialWheelBackground(t);
    drawConstellationsAndParticles(t);
    if (!reducedMotion) {
      requestAnimationFrame(frame);
    }
  }

  resize();
  window.addEventListener('resize', function () {
    resize();
    if (reducedMotion) frame(0);
  }, { passive: true });

  if (reducedMotion) {
    frame(0);
  } else {
    requestAnimationFrame(frame);
  }

  /* ============================================================================
     لوحة كوكبة البرج التفاعلية في قسم الأبراج (#signs) بالهوية العاجية والذهبية
     ============================================================================ */
  function buildConstellationSVG(meta) {
    var Wv = 260, Hv = 175;
    var lines = meta.lines.map(function (pair) {
      var a = meta.stars[pair[0]], b = meta.stars[pair[1]];
      return '<line class="const-line" x1="' + (a[0] * Wv).toFixed(1) + '" y1="' + (a[1] * Hv).toFixed(1) +
             '" x2="' + (b[0] * Wv).toFixed(1) + '" y2="' + (b[1] * Hv).toFixed(1) + '"/>';
    }).join('');
    var stars = meta.stars.map(function (s, idx) {
      var cx = (s[0] * Wv).toFixed(1), cy = (s[1] * Hv).toFixed(1), r = s[2];
      var delay = (idx * 0.22).toFixed(2);
      return '<g>' +
        '<circle class="const-halo" cx="' + cx + '" cy="' + cy + '" r="' + (r * 3.2).toFixed(1) + '"/>' +
        '<circle class="const-star" style="animation-delay:' + delay + 's" cx="' + cx + '" cy="' + cy + '" r="' + r.toFixed(1) + '"/>' +
      '</g>';
    }).join('');
    return '<svg viewBox="0 0 ' + Wv + ' ' + Hv + '" role="img" aria-label="كوكبة برج ' + meta.ar + '">' +
      '<defs>' +
        '<radialGradient id="cbg-' + meta.id + '" cx="50%" cy="50%" r="55%">' +
          '<stop offset="0%" stop-color="#C5A46D" stop-opacity="0.22"/>' +
          '<stop offset="100%" stop-color="#F5F0E6" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<circle cx="' + (Wv / 2) + '" cy="' + (Hv / 2) + '" r="78" fill="url(#cbg-' + meta.id + ')"/>' +
      '<circle cx="' + (Wv / 2) + '" cy="' + (Hv / 2) + '" r="74" fill="none" stroke="rgba(197,164,109,0.42)" stroke-dasharray="2 5"/>' +
      lines + stars +
    '</svg>';
  }

  function injectSignConstellation() {
    var panel = document.getElementById('panel');
    if (!panel || !panel.children.length) return;
    var titleEl = panel.querySelector('h3');
    if (!titleEl) return;
    var txt = titleEl.textContent || '';
    var meta = null;
    for (var i = 0; i < SIGN_META.length; i++) {
      if (txt.indexOf(SIGN_META[i].ar) !== -1) { meta = SIGN_META[i]; break; }
    }
    if (!meta) return;

    var existing = panel.querySelector('.sign-constellation-stage');
    if (existing && existing.getAttribute('data-sign') === meta.id) return;
    if (existing) existing.remove();

    var stage = document.createElement('div');
    stage.className = 'sign-constellation-stage';
    stage.setAttribute('data-sign', meta.id);
    stage.innerHTML = buildConstellationSVG(meta) +
      '<div class="sign-constellation-caption">' + meta.glyph + ' الكوكبة الفلكية لبرج ' + meta.ar + ' · ' + meta.en + ' Constellation</div>';

    var head = panel.querySelector('.arch-head');
    if (head && head.nextSibling) {
      panel.insertBefore(stage, head.nextSibling);
    } else {
      panel.prepend(stage);
    }
  }

  function watchSignsPanel() {
    var panel = document.getElementById('panel');
    if (!panel) return;
    injectSignConstellation();
    var obs = new MutationObserver(function () { injectSignConstellation(); });
    obs.observe(panel, { childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchSignsPanel);
  } else {
    watchSignsPanel();
  }
})();
