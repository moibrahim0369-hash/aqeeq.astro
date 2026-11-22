'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),Astronomy=require('../astronomy.min.js');
const source=fs.readFileSync(path.join(root,'assets/js/inline/page-06.js'),'utf8'),context={Astronomy,window:{},module:{exports:{}},console};
vm.runInNewContext(source.slice(0,source.indexOf('/* ============================== منطق الموقع')),context);const A=context.module.exports;
const samples=require('./fixtures/chiron-horizons-independent.json').samples;
function chartAt(jd,known=false){return A.chart({utcMs:(jd-2440587.5)*86400000,lat:30.0444,lon:31.2357,known});}
let worst=0;
for(const p of samples){const b=chartAt(p.jd).bodies.find(x=>x.key==='chiron');assert(b,'missing supported sample '+p.date);const error=Math.abs(A.d180(b.lon-p.longitude))*3600;worst=Math.max(worst,error);assert(error<1,'independent JPL longitude mismatch '+p.date+': '+error);assert.equal(b.house,undefined,'unknown time inferred a house');}
const start=2422324.5,end=2466520.5;
for(const jd of [start,start+0.0001,start+0.5,end-3.5,end-0.5,end])for(const known of [true,false]){const b=chartAt(jd,known).bodies.find(x=>x.key==='chiron');assert(b,'missing endpoint interval '+jd);assert(Number.isFinite(b.speed),'non-finite endpoint speed');if(known)assert(b.house>=1&&b.house<=12);else assert.equal(b.house,undefined);}
for(const jd of [start-1/86400,end+1/86400,2410000,2480000])assert(!chartAt(jd).bodies.some(x=>x.key==='chiron'),'extrapolated unsupported date '+jd);
assert(chartAt(end).bodies.find(x=>x.key==='chiron').retro,'end-of-range reference motion must be retrograde');
const station=require('./fixtures/chiron-station-horizons-independent.json').rows;
for(let i=1;i<station.length-1;i++){const p=station[i],b=chartAt(p.jd).bodies.find(x=>x.key==='chiron'),reference=A.d180(station[i+1].lon-station[i-1].lon);assert.equal(b.retro,reference<0,'wrong motion at '+p.jd);assert(Math.abs(b.speed-reference)<0.00001,'station speed mismatch '+p.jd);}
const baseline=require('./fixtures/chiron-nonchiron-baseline.json');for(const r of baseline.rows){const c=JSON.parse(JSON.stringify(A.chart(r.input)));assert.deepEqual(c.bodies.filter(b=>b.key!=='chiron'),r.bodies);for(const k of ['cusps','asc','mc'])assert.deepEqual(c[k],r[k],'changed '+k);}
const L=require('../assets/js/interpretation-library.js'),data=JSON.parse(fs.readFileSync(path.join(root,'data/interpretations/chiron.json'))),reference=JSON.parse(fs.readFileSync(path.join(root,'data/interpretations/reference.json'))),ix=L.indexOf([data,reference]),seen=new Set();
assert.equal(data.length,37);
for(let sign=0;sign<12;sign++)for(let house=1;house<=12;house++)for(const known of [true,false])for(const retro of [true,false]){
 const m=L.build({ch:{known,bodies:[{key:'chiron',lon:sign*30+5,house,retro}],cusps:Array.from({length:12},(_,i)=>i*30),asc:0,mc:270}}),S=L.sections(m,ix);
 const ids=known?[L.idCore('chiron',house),L.idTint('chiron',sign),L.idSignOnly('chiron',sign)]:[L.idSignOnly('chiron',sign)];
 if(retro)ids.push('natal.modifier.chiron.retrograde');
 for(const id of ids){assert(ix[id],'missing source '+id);assert(S.points.includes('data-il-id="'+id+'"'),'wrong route '+id);assert(S.points.includes(L.renderText(ix[id].text)),'incomplete body '+id);seen.add(id);}
 if(!known){assert.equal(m.items.chiron.house,null);assert(!S.points.includes('data-il-id="natal.core.chiron.'));assert.deepEqual(S.houseTpl,{});assert.equal(S.angles,'');}
}
assert.deepEqual([...seen].sort(),data.map(e=>e.id).sort());
console.log('PASS Chiron: 13 independent JPL samples (max '+worst.toFixed(4)+' arcsec), full endpoints/no extrapolation, 11 station motion checks, 8 Astronomy Engine baseline charts unchanged, all 37 full-text routes and unknown-time house suppression');
