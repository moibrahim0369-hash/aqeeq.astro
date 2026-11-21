import Astronomy from "./astronomy-engine.js";
const Astro = (() => {
  const RAD = Math.PI / 180, DEG = 180 / Math.PI;
  const norm = x => ((x % 360) + 360) % 360;
  const sin = x => Math.sin(x * RAD), cos = x => Math.cos(x * RAD), tan = x => Math.tan(x * RAD);
  const d180 = x => { x = norm(x); return x > 180 ? x - 360 : x; };

  const jdFromMs = ms => ms / 86400000 + 2440587.5;
  const msFromJd = jd => (jd - 2440587.5) * 86400000;
  const yearOf = jd => 2000 + (jd - 2451545) / 365.25;
  const deltaT = y => (y >= 2000 ? 63.8 + 0.32 * (y - 2000) : 63.8 + 0.45 * (y - 2000)); // ثواني، تقريبي ويكفي

  function nutation(T) {
    const Om = 125.04452 - 1934.136261 * T;
    const L = 280.4665 + 36000.7698 * T, Lp = 218.3165 + 481267.8813 * T;
    return {
      dpsi: (-17.20 * sin(Om) - 1.32 * sin(2 * L) - 0.23 * sin(2 * Lp) + 0.21 * sin(2 * Om)) / 3600,
      deps: (9.20 * cos(Om) + 0.57 * cos(2 * L) + 0.10 * cos(2 * Lp) - 0.09 * cos(2 * Om)) / 3600
    };
  }
  const meanObliq = T => 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;

  function keplerE(Mdeg, e) {
    const M = norm(Mdeg);
    let E = M + e * DEG * sin(M) * (1 + e * cos(M));
    for (let k = 0; k < 30; k++) {
      const dE = (E - e * DEG * sin(E) - M) / (1 - e * cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    return E;
  }

  /* ---------- الشمس ---------- */
  function sunTrue(T) {
    const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    const v = M + C;
    return { lon: norm(L0 + C), R: 1.000001018 * (1 - e * e) / (1 + e * cos(v)) };
  }

  /* ---------- القمر ---------- */
  const MOON_TERMS = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116],
    [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758],
    [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720], [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
    [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
    [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036], [2, 0, 2, 0, 3994],
    [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
    [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048],
    [2, 0, 1, -2, -1773], [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110], [3, 0, -1, 0, -892],
    [2, 1, 1, 0, -810], [4, -1, -2, 0, 759], [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
    [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537], [4, -1, 0, 0, 520], [1, 0, -2, 0, -487],
    [2, 1, 0, -2, -399], [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340], [4, 0, -3, 0, 330],
    [2, -1, 2, 0, 327], [0, 2, 1, 0, -323], [1, 1, -1, 0, 299], [2, 0, 3, 0, 294]
  ];
  function moonLonMean(T) { // خط الطول الهندسي (من غير nutation)
    const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000);
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
    const M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000);
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000);
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000);
    const A1 = norm(119.75 + 131.849 * T), A2 = norm(53.09 + 479264.290 * T);
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    let sl = 0;
    for (const [d, m, mp, f, c] of MOON_TERMS) {
      let v = c * sin(d * D + m * M + mp * Mp + f * F);
      const am = Math.abs(m);
      if (am === 1) v *= E; else if (am === 2) v *= E * E;
      sl += v;
    }
    sl += 3958 * sin(A1) + 1962 * sin(Lp - F) + 318 * sin(A2);
    return norm(Lp + sl / 1e6);
  }

  /* ---------- العقدة وليليث (متوسطة) ---------- */
  const meanNode = T => norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000);
  const meanApogee = T => norm(83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - T * T * T / 80053 + T * T * T * T / 18999000 + 180);

  /* ---------- الكواكب: عناصر مدارية (d = أيام من 1999-12-31 0h) ---------- */
  const ELS = {
    mercury: { N: [48.3313, 3.24587e-5], i: [7.0047, 5.00e-8], w: [29.1241, 1.01444e-5], a: [0.387098, 0], e: [0.205635, 5.59e-10], M: [168.6562, 4.0923344368] },
    venus:   { N: [76.6799, 2.46590e-5], i: [3.3946, 2.75e-8], w: [54.8910, 1.38374e-5], a: [0.723330, 0], e: [0.006773, -1.302e-9], M: [48.0052, 1.6021302244] },
    mars:    { N: [49.5574, 2.11081e-5], i: [1.8497, -1.78e-8], w: [286.5016, 2.92961e-5], a: [1.523688, 0], e: [0.093405, 2.516e-9], M: [18.6021, 0.5240207766] },
    jupiter: { N: [100.4542, 2.76854e-5], i: [1.3030, -1.557e-7], w: [273.8777, 1.64505e-5], a: [5.20256, 0], e: [0.048498, 4.469e-9], M: [19.8950, 0.0830853001] },
    saturn:  { N: [113.6634, 2.38980e-5], i: [2.4886, -1.081e-7], w: [339.3939, 2.97661e-5], a: [9.55475, 0], e: [0.055546, -9.499e-9], M: [316.9670, 0.0334442282] },
    uranus:  { N: [74.0005, 1.3978e-5], i: [0.7733, 1.9e-8], w: [96.6612, 3.0565e-5], a: [19.18171, -1.55e-8], e: [0.047318, 7.45e-9], M: [142.5905, 0.011725806] }
  };
  const el = (k, d) => { const o = ELS[k], f = v => v[0] + v[1] * d; return { N: f(o.N), i: f(o.i), w: f(o.w), a: f(o.a), e: f(o.e), M: f(o.M) }; };

  function helioSchlyter(key, d) {
    const p = el(key, d);
    const E = keplerE(p.M, p.e);
    const xv = p.a * (cos(E) - p.e), yv = p.a * Math.sqrt(1 - p.e * p.e) * sin(E);
    const v = Math.atan2(yv, xv) * DEG, r = Math.hypot(xv, yv), vw = v + p.w;
    const xh = r * (cos(p.N) * cos(vw) - sin(p.N) * sin(vw) * cos(p.i));
    const yh = r * (sin(p.N) * cos(vw) + cos(p.N) * sin(vw) * cos(p.i));
    const zh = r * sin(vw) * sin(p.i);
    let lon = norm(Math.atan2(yh, xh) * DEG), lat = Math.atan2(zh, Math.hypot(xh, yh)) * DEG;
    if (key === 'jupiter' || key === 'saturn' || key === 'uranus') {
      const Mj = el('jupiter', d).M, Ms = el('saturn', d).M, Mu = el('uranus', d).M;
      if (key === 'jupiter') {
        lon += -0.332 * sin(2 * Mj - 5 * Ms - 67.6) - 0.056 * sin(2 * Mj - 2 * Ms + 21) + 0.042 * sin(3 * Mj - 5 * Ms + 21)
          - 0.036 * sin(Mj - 2 * Ms) + 0.022 * cos(Mj - Ms) + 0.023 * sin(2 * Mj - 3 * Ms + 52) - 0.016 * sin(Mj - 5 * Ms - 69);
      } else if (key === 'saturn') {
        lon += 0.812 * sin(2 * Mj - 5 * Ms - 67.6) - 0.229 * cos(2 * Mj - 4 * Ms - 2) + 0.119 * sin(Mj - 2 * Ms - 3)
          + 0.046 * sin(2 * Mj - 6 * Ms - 69) + 0.014 * sin(Mj - 3 * Ms + 32);
        lat += -0.020 * cos(2 * Mj - 4 * Ms - 2) + 0.018 * sin(2 * Mj - 6 * Ms - 49);
      } else {
        lon += 0.040 * sin(Ms - 2 * Mu + 6) + 0.035 * sin(Ms - 3 * Mu + 33) - 0.015 * sin(Mj - Mu + 20);
      }
    }
    const rr = Math.hypot(xh, yh, zh);
    return { x: rr * cos(lon) * cos(lat), y: rr * sin(lon) * cos(lat), z: rr * sin(lat) };
  }

  /* ---------- JPL (Standish) للمقارنة ولبلوتو ونبتون ---------- */
  const STD = {
    mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
    venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
    earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0],
    mars: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
    jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
    saturn: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794],
    uranus: [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.95427630, 0.40805281, 74.01692503, 0.04240589],
    neptune: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
    pluto: [39.48211675, -0.00031596, 0.24882730, 0.00005170, 17.14001206, 0.00004818, 238.92903833, 145.20780515, 224.06891629, -0.04062942, 110.30393684, -0.01183482]
  };
  function stdHelio(key, T) {
    const p = STD[key];
    const a = p[0] + p[1] * T, e = p[2] + p[3] * T, I = p[4] + p[5] * T, L = p[6] + p[7] * T, w = p[8] + p[9] * T, Om = p[10] + p[11] * T;
    const arg = w - Om, E = keplerE(L - w, e);
    const xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    const cw = cos(arg), sw = sin(arg), cO = cos(Om), sO = sin(Om), cI = cos(I), sI = sin(I);
    return {
      x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
      y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
      z: (sw * sI) * xp + (cw * sI) * yp
    };
  }
  const precession = T => (5028.796195 * T + 1.1054348 * T * T) / 3600; // درجات من J2000
  function stdGeoLon(key, T) {
    const p = stdHelio(key, T), e = stdHelio('earth', T);
    return norm(Math.atan2(p.y - e.y, p.x - e.x) * DEG + precession(T));
  }

  /* ---------- خط الطول الظاهري لأي جرم ---------- */
  const PLANET_KEYS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  /* محرك الحساب: مكتبة astronomy-engine (MIT) للشمس والقمر والكواكب السبعة — دقة دون الثانية القوسية.
     العقدة وليليث لسه بمعادلات متوسطة داخلية (مش من المكتبة). لو المكتبة ما اتحمّلتش، بيرجع تلقائيًا
     للصيغ الداخلية القديمة (أقل دقة بعشرات الثواني القوسية، لكنها سليمة) عشان الموقع يفضل شغال. */
  const AE_BODY = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' };
  function aeLonOf(key, jde) {
    if (typeof Astronomy === 'undefined' || !AE_BODY[key]) return null;
    try {
      const y = yearOf(jde), jdUt = jde - deltaT(y) / 86400, ms = msFromJd(jdUt);
      const v = Astronomy.GeoVector(Astronomy.Body[AE_BODY[key]], new Date(ms), true);
      return norm(Astronomy.Ecliptic(v).elon);
    } catch (e) { return null; }
  }
  /* العقدة الحقيقية: تقاطع مدار القمر اللحظي مع الكسوف. بتتحسب من متجه موضع وسرعة القمر
     (astronomy-engine) بعد تدويره لإطار الكسوف الحقيقي للتاريخ؛ العقدة الصاعدة = z × (r × v). */
  function aeTrueNode(jde) {
    if (typeof Astronomy === 'undefined') return null;
    try {
      const y = yearOf(jde), jdUt = jde - deltaT(y) / 86400, t = new Astronomy.AstroTime(new Date(msFromJd(jdUt)));
      const st = Astronomy.RotateState(Astronomy.Rotation_EQJ_ECT(t), Astronomy.GeoMoonState(t));
      const hx = st.y * st.vz - st.z * st.vy, hy = st.z * st.vx - st.x * st.vz;
      const lon = norm(Math.atan2(hx, -hy) * DEG);
      return Number.isFinite(lon) ? lon : null;
    } catch (e) { return null; }
  }
  function legacyLonOf(key, jde) {
    const T = (jde - 2451545) / 36525;
    const dpsi = nutation(T).dpsi;
    if (key === 'sun') return norm(sunTrue(T).lon + dpsi - 0.00569);
    if (key === 'moon') return norm(moonLonMean(T) + dpsi);
    if (key === 'node') return norm(meanNode(T) + dpsi);
    if (key === 'truenode') {   // احتياطي (لو المكتبة ما اتحمّلتش): العقدة المتوسطة + تصحيحات Meeus الدورية
      const rad = Math.PI / 180, D = norm(297.85036 + 445267.11148 * T), M = norm(357.52772 + 35999.05034 * T),
        Mp = norm(134.96298 + 477198.867398 * T), F = norm(93.27191 + 483202.017538 * T);
      const corr = -1.4979 * Math.sin((2 * D - 2 * F) * rad) - 0.15 * Math.sin(M * rad) - 0.1226 * Math.sin(2 * D * rad) + 0.1176 * Math.sin(2 * F * rad) - 0.0801 * Math.sin((2 * Mp - 2 * F) * rad);
      return norm(meanNode(T) + corr + dpsi);
    }
    if (key === 'lilith') {   // ليليث المتوسطة: الأوج بيتسقط من مدار القمر المائل (5.145°) على مسار الشمس، زي Swiss Ephemeris
      const om = meanNode(T), u = (meanApogee(T) - om) * Math.PI / 180;
      return norm(om + Math.atan2(Math.cos(5.1453 * Math.PI / 180) * Math.sin(u), Math.cos(u)) * 180 / Math.PI + dpsi);
    }
    if (key === 'pluto' || key === 'neptune') return norm(stdGeoLon(key, T) + dpsi);
    const d = jde - 2451543.5, s = sunTrue(T);
    const h = helioSchlyter(key, d);
    const xg = h.x + s.R * cos(s.lon), yg = h.y + s.R * sin(s.lon);
    return norm(Math.atan2(yg, xg) * DEG + dpsi);
  }
  function lonOf(key, jde) {
    if (key === 'node' || key === 'lilith') return legacyLonOf(key, jde);
    if (key === 'truenode') { const tn = aeTrueNode(jde); return tn !== null ? tn : legacyLonOf(key, jde); }
    const ae = aeLonOf(key, jde);
    return ae !== null ? ae : legacyLonOf(key, jde);
  }

  /* ---------- الطالع والبيوت ---------- */
  function ascMc(ramc, eps, lat) {
    const mc = norm(Math.atan2(sin(ramc), cos(ramc) * cos(eps)) * DEG);
    let asc = norm(Math.atan2(cos(ramc), -(sin(ramc) * cos(eps) + tan(lat) * sin(eps))) * DEG);
    if (norm(asc - mc) > 180) asc = norm(asc + 180);
    return { asc, mc };
  }
  function placidusCusps(ramc, eps, lat, asc, mc) {
    const cuspBy = raFn => {
      let ra = raFn(90);
      for (let i = 0; i < 50; i++) {
        const lam = norm(Math.atan2(sin(ra), cos(ra) * cos(eps)) * DEG);
        const dec = Math.asin(sin(eps) * sin(lam)) * DEG;
        const x = -tan(lat) * tan(dec);
        if (Math.abs(x) >= 1) return null;
        const nra = raFn(Math.acos(x) * DEG);
        if (Math.abs(d180(nra - ra)) < 1e-8) { ra = nra; break; }
        ra = nra;
      }
      return norm(Math.atan2(sin(ra), cos(ra) * cos(eps)) * DEG);
    };
    const c11 = cuspBy(D => ramc + D / 3), c12 = cuspBy(D => ramc + 2 * D / 3);
    const c2 = cuspBy(D => ramc + 180 - 2 * (180 - D) / 3), c3 = cuspBy(D => ramc + 180 - (180 - D) / 3);
    if ([c11, c12, c2, c3].some(v => v === null)) return null;
    const c = new Array(12);
    c[0] = asc; c[1] = c2; c[2] = c3; c[3] = norm(mc + 180);
    c[4] = norm(c11 + 180); c[5] = norm(c12 + 180); c[6] = norm(asc + 180);
    c[7] = norm(c2 + 180); c[8] = norm(c3 + 180); c[9] = mc; c[10] = c11; c[11] = c12;
    return c;
  }
  const wholeSignCusps = asc => { const s = Math.floor(asc / 30) * 30; return Array.from({ length: 12 }, (_, i) => norm(s + 30 * i)); };
  // Equal House: each cusp is exactly 30° from the Ascendant.
  const equalCusps = asc => Array.from({ length: 12 }, (_, i) => norm(asc + 30 * i));
  // Porphyry: trisect each of the four ecliptic arcs between ASC, IC, DSC and MC.
  function porphyryCusps(asc, mc) {
    const anchors = [norm(asc), norm(mc + 180), norm(asc + 180), norm(mc)];
    const c = new Array(12);
    for (let q = 0; q < 4; q++) {
      const start = anchors[q], end = anchors[(q + 1) % 4];
      const arc = norm(end - start);
      c[q * 3] = start;
      c[q * 3 + 1] = norm(start + arc / 3);
      c[q * 3 + 2] = norm(start + 2 * arc / 3);
    }
    return c;
  }
  function houseOf(lon, cusps) {
    for (let i = 0; i < 12; i++) {
      const a = cusps[i], b = cusps[(i + 1) % 12];
      if (norm(lon - a) < norm(b - a)) return i + 1;
    }
    return 1;
  }

  /* ---------- الخريطة كاملة ---------- */
  const BODY_KEYS = [...PLANET_KEYS, 'node', 'lilith', 'truenode'];
  const RETRO_KEYS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'truenode'];

  /* Vertex: تقاطع الدائرة العمودية الغربية مع الكسوف، بغض النظر عن الارتفاع */
  function vertexWest(ramc, eps, lat) {
    const phi = lat * RAD, th = ramc * RAD, e = eps * RAD;
    const unit = lam => { const l = lam * RAD; const a = Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l)); const d = Math.asin(Math.sin(e) * Math.sin(l)); return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)]; };
    const dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
    const N = [-Math.sin(phi) * Math.cos(th), -Math.sin(phi) * Math.sin(th), Math.cos(phi)];
    const E = [-Math.sin(th), Math.cos(th), 0];
    const f = l => dot(unit(l), N);
    const roots = []; let prev = f(0);
    for (let l = 0.02; l <= 360.0001; l += 0.02) {
      const c = f(l);
      if (Math.sign(c) !== Math.sign(prev)) {
        let lo = l - 0.02, hi = l;
        for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Math.sign(f(m)) === Math.sign(f(lo))) lo = m; else hi = m; }
        roots.push((lo + hi) / 2);
      }
      prev = c;
    }
    const west = roots.filter(r => dot(unit(r), E) < 0);
    return west.length === 1 ? norm(west[0]) : null;
  }
  function chart({ utcMs, lat, lon, hs = 'placidus', known = true }) {
    const jd = jdFromMs(utcMs);
    const jde = jd + deltaT(yearOf(jd)) / 86400;
    const T0 = (jd - 2451545) / 36525, T = (jde - 2451545) / 36525;
    const bodies = BODY_KEYS.map(key => {
      const l = lonOf(key, jde);
      const sp = d180(lonOf(key, jde + 0.5) - lonOf(key, jde - 0.5));
      return { key, lon: l, speed: sp, retro: RETRO_KEYS.includes(key) && sp < 0, sign: Math.floor(l / 30) };
    });
    const out = { jde, bodies, known, hs, lat, lon };
    if (known) {
      const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T0 * T0 - T0 * T0 * T0 / 38710000);
      const nu = nutation(T), eps = meanObliq(T) + nu.deps;
      const ramc = norm(gmst + nu.dpsi * cos(eps) + lon);
      const { asc, mc } = ascMc(ramc, eps, lat);
      let cusps = null, used = hs;
      if (hs === 'placidus') cusps = placidusCusps(ramc, eps, lat, asc, mc);
      else if (hs === 'whole') cusps = wholeSignCusps(asc);
      else if (hs === 'equal') cusps = equalCusps(asc);
      else if (hs === 'porphyry') cusps = porphyryCusps(asc, mc);
      if (!cusps) { cusps = wholeSignCusps(asc); used = 'whole-fallback'; }
      Object.assign(out, { ramc, eps, asc, mc, cusps, hs: used, vertex: vertexWest(ramc, eps, lat) });
      /* سهم السعادة: بالنهار طالع + قمر − شمس، وبالليل طالع + شمس − قمر (الشمس فوق الأفق = نهار) */
      const sunB = bodies.find(b => b.key === 'sun'), moonB = bodies.find(b => b.key === 'moon');
      const isDay = norm(sunB.lon - asc) > 180;
      const fortuneLon = isDay ? norm(asc + moonB.lon - sunB.lon) : norm(asc + sunB.lon - moonB.lon);
      bodies.push({ key: 'fortune', lon: fortuneLon, speed: 0, retro: false, sign: Math.floor(fortuneLon / 30), day: isDay });
      bodies.forEach(b => { b.house = houseOf(b.lon, cusps); });
    }
    return out;
  }

  /* ---------- أوقات محلية ← UTC باستخدام قاعدة بيانات المتصفح للتوقيت ---------- */
  function tzOffsetMin(tz, utcMs) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const p = {};
    f.formatToParts(new Date(utcMs)).forEach(x => { p[x.type] = x.value; });
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return (asUtc - Math.floor(utcMs / 1000) * 1000) / 60000;
  }
  function localToUtcMs(y, m, d, hh, mm, tz) {
    const guess = Date.UTC(y, m - 1, d, hh, mm);
    const o1 = tzOffsetMin(tz, guess);
    let utc = guess - o1 * 60000;
    const o2 = tzOffsetMin(tz, utc);
    if (o2 !== o1) utc = guess - o2 * 60000;
    return utc;
  }

  return { chart, vertexWest, lonOf, houseOf, norm, d180, jdFromMs, msFromJd, deltaT, yearOf, localToUtcMs, tzOffsetMin,
    PLANET_KEYS, BODY_KEYS, _moonLonMean: moonLonMean, _stdGeoLon: stdGeoLon, _helio: helioSchlyter, _sunTrue: sunTrue, _ascMc: ascMc, _plac: placidusCusps, _whole: wholeSignCusps, _equal: equalCusps, _porphyry: porphyryCusps, _nut: nutation, _obl: meanObliq };
})();
export default Astro;
