'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),sb={window:{},module:{exports:{}},Date,Math,Number,Intl,console};vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root,'astronomy.min.js'),'utf8'),sb);sb.Astronomy=sb.window.Astronomy;
const src=fs.readFileSync(path.join(root,'assets/js/inline/page-06.js'),'utf8').match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/)[0];vm.runInContext(src+';window.Astro=Astro;',sb);
for(const f of ['vedic-extras.js','vedic-shadbala.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets/js',f),'utf8'),sb);
const aySrc=fs.readFileSync(path.join(root,'assets/js/extended-astro-charts.js'),'utf8').match(/function ayanamsa\(jde\)\{[\s\S]*?\n  \}/)[0];const ay=vm.runInContext('('+aySrc+')',sb);sb.window.AqEam={ayanamsa:ay};
const S=sb.window.AqShadbala,M=S.math,A=sb.window.Astro,keys=['sun','moon','mars','mercury','jupiter','venus','saturn'];
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function chart(ms){let ch=A.chart({utcMs:ms,lat:30.0444,lon:31.2357,known:true,hs:'whole'}),off=ay(ch.jde);ch.asc=M.norm(ch.asc-off);ch.mc=M.norm(ch.mc-off);ch.bodies=ch.bodies.map(b=>({...b,lon:M.norm(b.lon-off)}));return ch;}
test('mean-orbit and Chesta results match separate PyMeeus/Swiss/vector-angle fixtures',()=>{
 const ref=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/shadbala-mean-orbits.json'),'utf8'));
 for(const r of ref.rows){for(const k of Object.keys(r.means))near(M.mean(k,r.jde),r.means[k],1e-7);for(const k of Object.keys(r.chesta))near(M.chesta(keys.indexOf(k),r.jde,r.tropical[keys.indexOf(k)]),r.chesta[k],1e-7);}
});
test('hand-worked BPHS exaltation, tabular Ayana and special aspect anchors',()=>{
 const ex=[10,33,298,165,95,357,200];for(let p=0;p<7;p++){near(M.uchcha(p,ex[p]),60);near(M.uchcha(p,M.norm(ex[p]+180)),0);near(M.uchcha(p,M.norm(ex[p]+90)),30);near(M.ayana(p,0),30);}
 near(M.uchcha(0,72),118/3);near(M.ayana(0,90),60);near(M.ayana(0,270),0);near(M.ayana(1,270),60);near(M.ayana(3,90),60);near(M.ayana(3,270),60);
 for(let p=0;p<7;p++)near(M.aspect(180,p),60);near(M.aspect(90,2),60);near(M.aspect(210,2),60);near(M.aspect(120,4),60);near(M.aspect(240,4),60);near(M.aspect(60,6),60);near(M.aspect(270,6),60);
 for(let p=0;p<7;p++)for(let a=0;a<360;a+=0.13){const x=M.aspect(a,p);assert.ok(x>=0&&x<=60&&Number.isFinite(x));}
});
test('Sun/Moon substitutions, exact six-component sum, ratios and zero-sum temporal complements',()=>{
 for(const ms of [Date.UTC(1999,8,25,9),Date.UTC(2000,0,1,10),Date.UTC(2012,1,29,5)]){
  const ch=chart(ms),r=S.calculate(ch,{utcMs:ms});
  for(const row of r.rows){for(const k of ['sthana','dig','kala','chesta','naisargika','drik'])assert.ok(Number.isFinite(row[k]));if(r.complete){near(row.total,row.sthana+row.dig+row.kala+row.chesta+row.naisargika+row.drik);near(row.rupas,row.total/60);near(row.ratio,row.rupas/row.required);}}
  near(r.rows[0].chesta,r.rows[0].kalaParts[7]);near(r.rows[1].chesta,r.rows[1].kalaParts[1]);near(r.rows[0].kalaParts[0]+r.rows[1].kalaParts[0],60);near(r.rows[3].kalaParts[0],60);
 }
});
test('calendar lords reproduce independently published Saravali worked years/months',()=>{
 for(const [y,p]of [[1999,0],[2000,3],[2001,6],[2002,2],[2003,5],[2004,1],[2005,4]]){const ms=Date.UTC(y,5,15,10);assert.equal(M.temporal(ms,chart(ms)).lords[0],p);}
 const ms=Date.UTC(2006,10,15,10);assert.equal(M.temporal(ms,chart(ms)).lords[1],4);
});
test('planetary hours and thirds switch at measured sunrise and sunset, not midnight',()=>{
 const noon=Date.UTC(2000,0,1,10),ch=chart(noon),t=M.temporal(noon,ch);
 const rise=M.temporal(t.rise+1000,ch);assert.equal(rise.hora,1);assert.equal(rise.lords[2],rise.lords[3]);assert.equal(rise.third,0);assert.equal(rise.day,true);
 const set=M.temporal(t.set+1000,ch);assert.equal(set.hora,13);assert.equal(set.third,0);assert.equal(set.day,false);
 const pre=M.temporal(t.rise-1000,ch);assert.equal(pre.hora,24);assert.notEqual(pre.lords[2],rise.lords[2]);
});
test('war, unknown time and polar sunrise absence fail closed rather than fabricate total',()=>{
 const ms=Date.UTC(2000,0,1,10),ch=chart(ms);ch.bodies.find(b=>b.key==='mars').lon=359.8;ch.bodies.find(b=>b.key==='venus').lon=0.2;const r=S.calculate(ch,{utcMs:ms});assert.ok(!r.complete);assert.ok(r.wars.length);assert.ok(r.rows.every(v=>v.total===null&&v.ratio===null));
 ch.known=false;assert.throws(()=>S.calculate(ch,{utcMs:ms}));ch.known=true;ch.lat=89;assert.throws(()=>M.temporal(Date.UTC(2000,5,21,12),ch));
});
