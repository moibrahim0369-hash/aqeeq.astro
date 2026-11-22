'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/vedic-narratives.js'),'utf8'),box);const N=box.window.AqVedicNarratives;
function library(){
 const d={schemaVersion:1,charts:{},planets:{}};
 for(const key of N.chartKeys){d.charts[key]={title:'CHART_'+key,intro:'INTRO_'+key,houseReadings:{}};for(let h=1;h<=12;h++)d.charts[key].houseReadings[h]={lead:'LEAD_'+key+'_'+h,paragraphs:['BODY_'+key+'_'+h]};}
 for(const key of ['sun','moon','mars','mercury','jupiter','venus','saturn','node','ketu']){d.planets[key]={role:'ROLE_'+key,signs:{}};for(let s=0;s<12;s++)d.planets[key].signs[s]='PLANET_'+key+'_SIGN_'+s;}
 return d;
}
const data=library();
function map(o={}){return {n:9,basis:'asc',lagna:0,items:[{key:'sun',name:'الشمس',sign:0,house:0,lon:1},{key:'moon',name:'القمر',sign:1,house:1,lon:31},{key:'venus',name:'الزهرة',sign:6,house:6,lon:181},{key:'mars',name:'المريخ',sign:9,house:9,lon:271}],...o};}
test('library contract requires all22 charts and108 planet-sign entries',()=>{
 assert.equal(N.chartKeys.length,22);assert.equal(N.validate(data),data);
 const broken=library();delete broken.charts['60'];assert.throws(()=>N.validate(broken));
 const missing=library();delete missing.planets.ketu.signs['11'];assert.throws(()=>N.validate(missing));
});
test('D2 only requires reachable occupied-house slots1,2,12',()=>{
 const d=library();for(let h=3;h<=11;h++)delete d.charts['2'].houseReadings[h];assert.equal(N.validate(d),d);
 delete d.charts['2'].houseReadings['12'];assert.throws(()=>N.validate(d));
});
test('render selects selected-chart house and actual planet-sign prose',()=>{
 const html=N.render(map(),data);assert.ok(html.includes('BODY_9_1'));assert.ok(!html.includes('BODY_10_1'));assert.ok(html.includes('PLANET_sun_SIGN_0'));assert.ok(html.includes('PLANET_venus_SIGN_6'));assert.ok(!html.includes('PLANET_venus_SIGN_7'));
 const other=N.render(map({n:10}),data);assert.ok(other.includes('BODY_10_1'));assert.ok(!other.includes('BODY_9_1'));
});
test('same chart input has stable content, without clock or random variation',()=>{
 assert.equal(N.render(map(),data),N.render(map(),data));assert.ok(!fs.readFileSync(path.join(__dirname,'../assets/js/vedic-narratives.js'),'utf8').includes('Math.random'));
});
test('multiple occupants share one house reading but retain separate planetary context',()=>{
 const m=map();m.items[1].sign=0;m.items[1].house=0;const h=N.render(m,data);assert.equal((h.match(/BODY_9_1</g)||[]).length,1);assert.ok(h.includes('PLANET_sun_SIGN_0'));assert.ok(h.includes('PLANET_moon_SIGN_0'));assert.equal(N.facts(m).groups.length,3);
});
test('unknown-time numbered charts never turn Moon fallback into measured houses',()=>{
 const h=N.render(map({basis:'moon'}),data);assert.ok(!h.includes('BODY_9_'));assert.ok(!h.includes('PLANET_sun_SIGN_'));assert.ok(h.includes('لن نضع قراءة شخصية'));
 const d1=N.render(map({n:1,basis:'moon'}),data);assert.ok(!d1.includes('BODY_1_'));assert.ok(d1.includes('PLANET_sun_SIGN_0'));
});
test('Moon and Sun reference charts remain distinct and disclose missing-time uncertainty',()=>{
 for(const k of ['moon','sun']){const html=N.render(map({n:k,basis:k}),data,{birthTimeKnown:false});assert.ok(html.includes('BODY_'+k+'_1'));assert.ok(html.includes('الأبراج هي أبراج الميلاد'));assert.ok(html.includes('وقت الميلاد غير معروف'));}
});
test('fine divisions require explicit precision acknowledgment before house interpretation',()=>{
 for(const n of [27,30,40,45,60]){const m=map({n});assert.ok(!N.render(m,data).includes('BODY_'+n+'_'));const h=N.render(m,data,{precisionAccepted:true});assert.ok(h.includes('BODY_'+n+'_'));}
});
test('ruler and drishti facts use the selected map, not fixed topical planets',()=>{
 const f=N.facts(map());assert.equal(f.groups[0].ruler.key,'mars');assert.equal(f.groups[0].ruler.house,9);assert.ok(f.aspects.some(a=>a.from==='sun'&&a.to==='venus'));assert.ok(!f.aspects.some(a=>a.from==='sun'&&a.to==='moon'));
});
test('nodal dignity is not silently claimed as a universally agreed rule',()=>{
 assert.equal(N.dignity({key:'node',sign:1}),null);assert.equal(N.dignity({key:'ketu',sign:7}),null);assert.equal(N.dignity({key:'venus',sign:11}),'exalted');assert.equal(N.dignity({key:'venus',sign:5}),'debilitated');
});
test('combustion uses physical natal separation only and preserves current thresholds',()=>{
 let m=map({n:1});let x={key:'mercury',lon:2};assert.equal(N.combustion(m,x),true);assert.equal(N.combustion(m,{key:'mercury',lon:181}),false);assert.equal(N.combustion(map({n:9}),x),false);assert.equal(N.separation(359,1),2);
});
test('content and names are escaped rather than treated as authored HTML',()=>{
 const d=library();d.charts['9'].houseReadings['1'].paragraphs=['<img src=x onerror=alert(1)>'];const h=N.render(map(),d);assert.ok(h.includes('&lt;img'));assert.ok(!h.includes('<img'));
});
