import Astro from "./astro-engine.js";
const YRS=[7,20,6,10,7,18,16,19,17], DAY=365.25*864e5;
function ayanamsa(jde){
    const T=(jde-2415020)/36525;
    const mean=(22*3600+27*60+37.65+5025.75*T+1.11*T*T)/3600;
    // المواقع الاستوائية ظاهرية (فيها ترنّح خط الطول)، فيُضاف الترنّح للأيانامشا ليطابق الموضع النجمي مرجع Swiss Ephemeris.
    let dpsi=0;try{const n=Astro._nut((jde-2451545)/36525);if(n&&Number.isFinite(n.dpsi))dpsi=n.dpsi;}catch(_){}
    return mean+dpsi;
  }
function dashas(moonLon, birthMs) {
    var seg = 360 / 27, n = Math.floor(moonLon / seg), frac = 1 - (moonLon % seg) / seg, i = n % 9;
    var list = [], t = birthMs - YRS[i] * (1 - frac) * DAY;
    for (var k = 0; k < 9; k++) { var j = (i + k) % 9, len = YRS[j] * DAY; list.push({ lord: j, s: t, e: t + len }); t += len; }
    return list;
  }
function antars(m) {
    var out = [], t = m.s, total = m.e - m.s;
    for (var k = 0; k < 9; k++) { var j = (m.lord + k) % 9, len = total * YRS[j] / 120; out.push({ lord: j, s: t, e: t + len }); t += len; }
    return out;
  }
export {ayanamsa,dashas,antars};
