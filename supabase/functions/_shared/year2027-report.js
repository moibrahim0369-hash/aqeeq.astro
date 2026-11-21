import Astro from './astro-engine.js';
import {ayanamsa,dashas,antars} from './vedic-engine.js';
import './year2027-core.js';
const C=globalThis.AqYear2027Core;
const norm=C.norm,delta=C.delta;
export function validateInput(input){
 if(!input||typeof input!=='object'||!/^\d{4}-\d{2}-\d{2}$/.test(input.date||'')||!Number.isFinite(input.utcMs)||input.utcMs<Date.UTC(1900,0,1)||input.utcMs>Date.now()||!Number.isFinite(input.lat)||Math.abs(input.lat)>90||!Number.isFinite(input.lon)||Math.abs(input.lon)>180||typeof input.city!=='string'||input.city.length>500)throw new Error('invalid_input');
 if(typeof input.unknown!=='boolean')throw new Error('invalid_input');
 return input;
}
export function natalFor(input){validateInput(input);return {utcMs:input.utcMs,ch:Astro.chart({utcMs:input.utcMs,lat:input.lat,lon:input.lon,known:!input.unknown,hs:'whole'})};}
function sidereal(n){var ch={...n.ch},ay=ayanamsa(ch.jde);ch.bodies=ch.bodies.map(b=>({...b,lon:norm(b.lon-ay)}));if(ch.known)ch.asc=norm(ch.asc-ay);return ch;}
export function previewFor(input,lib,now=Date.now()){
 const natal=natalFor(input),ch=sidereal(natal),moon=ch.bodies.find(b=>b.key==='moon'),periods=[];
 dashas(moon.lon,input.utcMs).forEach(m=>antars(m).forEach(a=>{if(a.e>C.Y0&&a.s<C.END)periods.push({maha:m.lord,lord:a.lord,s:Math.max(a.s,C.Y0),e:Math.min(a.e,C.END)});}));
 if(!periods.length)throw Error('unsupported_birth_date');const R={known:ch.known,periods},p=C.periodsAt(R,now),t=lib.dasha[p.lord];
 const paragraphs=[];let words=0;for(const para of t.paragraphs){if(words>=180)break;paragraphs.push(para);words+=para.split(/\s+/).length;}
 if(ch.known){const at=C.Y0,jde=Astro.jdFromMs(at),sky=Astro.chart({utcMs:at,lat:input.lat,lon:input.lon,known:false,hs:'whole'}),planet=['ketu','venus','sun','moon','mars','rahu','jupiter','saturn','mercury'][p.lord],key=planet==='rahu'||planet==='ketu'?'node':planet,b=sky.bodies.find(x=>x.key===key);if(b){const lon=norm(b.lon-ayanamsa(sky.jde)+(planet==='ketu'?180:0)),house=(Math.floor(lon/30)-Math.floor(ch.asc/30)+12)%12+1,extra=lib.templates[planet][house-1];for(const para of extra.paragraphs){if(words>=180)break;paragraphs.push(para);words+=para.split(/\s+/).length;}}}
 return {model:R,free:{...t,paragraphs,sections:[],introParagraphs:[]},period:p,revision:lib.revision};
}
export function reportFor(input,lib,ephem){
 const natal=natalFor(input);if(input.unknown)throw Error('birth_time_required');
 const E={siderealChart:sidereal,ayanamsa,engineChart(t){
  const offset=(t-ephem.start)/ephem.step,i=Math.max(0,Math.min(ephem.rows.length-2,Math.floor(offset))),f=offset-i,a=ephem.rows[i],b=ephem.rows[i+1];const jd=Astro.jdFromMs(t);
  return {jde:jd+Astro.deltaT(Astro.yearOf(jd))/86400,bodies:ephem.keys.filter(k=>k!=='ketu').map(k=>{const j=ephem.keys.indexOf(k);return {key:k==='rahu'?'node':k,lon:norm(a[j]+delta(b[j],a[j])*f)};})};
 }};
 const R=C.compute(natal,E,{dashas,antars}),events=C.timeline(R),keys=['saturn','jupiter','rahu','mars','mercury'];
 const closing=lib.closing[R.lagna].map((text,i)=>({planet:keys[i],s:C.START,e:C.SPLIT,house:R.segs[keys[i]][0].house,houses:[...new Set(R.segs[keys[i]].filter(s=>s.s<C.SPLIT&&s.e>C.START).map(s=>s.house))],text}));
 const groups=C.KEYS.map(k=>({planet:k,periods:events.filter(s=>s.planet===k).map(s=>{
  const text=lib.templates[k][s.house-1],lord=lib.lordship[k]?.[R.lagna]||'',topics=k==='jupiter'?C.lordHouses(k,R.lagna).map(h=>lib.topics[h]):[];
  return {...s,text,lord,topics,contacts:R.hits.filter(h=>h.planet===k&&h.t>=s.s&&h.t<s.e)};
 })}));
 return {model:{known:R.known,periods:R.periods},closing,groups,periods:R.periods.map(p=>({...p,text:lib.dasha[p.lord]})),revision:lib.revision,calculation:{system:'Lahiri',node:'mean',transitResolution:'hourly engine samples, interpolated and angular-verified'},created:Date.now()};
}
