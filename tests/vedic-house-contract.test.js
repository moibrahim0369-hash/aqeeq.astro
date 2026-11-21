'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const H=require('./helpers/production-page'),{Astro:A,sandbox:sb,page}=H.loadAstro();
const source=H.read('assets/js/extended-astro-charts.js');
assert.ok(page.code.includes(source.trim()),'exact sidereal source is loaded by built page');
vm.runInContext('var norm=x=>((x%360)+360)%360;',sb);
for(const name of ['ayanamsa','siderealChart']){
 const match=source.match(new RegExp('function '+name+'\\([^]*?\\n  \\}'));
 assert.ok(match,name+' extracted');vm.runInContext(match[0],sb);
}
function convert(ch){sb.natal={ch};return vm.runInContext('siderealChart(natal)',sb);}
const fixtures=[['2000-01-01T10:00:00Z',30,31],['1999-09-25T09:00:00Z',30.0444,31.2357],['1985-02-28T23:55:00Z',51.5,-.12],['2012-02-29T05:05:00Z',40.7,-74],['1962-07-04T03:20:00Z',-33.9,151.2]];
for(const hs of ['placidus','equal','porphyry','whole'])test('sidereal '+hs+' houses are consistent and input stays untouched',()=>{
 for(const [utc,lat,lon]of fixtures){
  const original=A.chart({utcMs:Date.parse(utc),lat,lon,known:true,hs}),before=JSON.stringify(original),ch=convert(original);
  assert.equal(JSON.stringify(original),before,'no natal mutation');
  assert.notEqual(ch.bodies,original.bodies);assert.notEqual(ch.cusps,original.cusps);
  assert.ok(ch.bodies.every(b=>b.house===A.houseOf(b.lon,ch.cusps)));
  if(hs==='whole'){
   assert.ok(ch.cusps.every(x=>Math.abs(x/30-Math.round(x/30))<1e-9));
   const ascSign=Math.floor(ch.asc/30);
   assert.ok(ch.bodies.every(b=>b.house===(Math.floor(b.lon/30)-ascSign+12)%12+1));
  }else assert.deepEqual(Array.from(ch.bodies,b=>b.house),Array.from(original.bodies,b=>b.house));
 }
});
test('polar whole-sign fallback is rebuilt in the sidereal zodiac',()=>{
 const ch=A.chart({utcMs:Date.parse('2000-01-01T10:00:00Z'),lat:80,lon:31,known:true,hs:'placidus'});
 assert.equal(ch.hs,'whole-fallback');const s=convert(ch);assert.equal(s.hs,'whole-fallback');
 assert.ok(s.cusps.every(x=>Math.abs(x/30-Math.round(x/30))<1e-9));
 assert.ok(s.bodies.every(b=>b.house===(b.sign-Math.floor(s.asc/30)+12)%12+1));
});
test('unknown birth time never invents houses or angles',()=>{
 for(const hs of ['placidus','whole']){
  const ch=A.chart({utcMs:Date.parse(fixtures[0][0]),lat:30,lon:31,known:false,hs}),before=JSON.stringify(ch),s=convert(ch);
  assert.equal(JSON.stringify(ch),before);assert.equal(s.known,false);assert.ok(!s.cusps);assert.ok(!Number.isFinite(s.asc));
  assert.ok(s.bodies.every(b=>b.house==null));
 }
});
test('reproduced Cairo whole-sign case agrees with D1 houses',()=>{
 const ch=convert(A.chart({utcMs:Date.parse(fixtures[0][0]),lat:30,lon:31,known:true,hs:'whole'}));
 assert.equal(ch.cusps[0],330);assert.equal(ch.bodies.find(b=>b.key==='mars').house,12);assert.equal(ch.bodies.find(b=>b.key==='jupiter').house,2);
});
