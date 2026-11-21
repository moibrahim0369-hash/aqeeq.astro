'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),sb={window:{},module:{exports:{}},Date,Math,Number,Intl,console};vm.createContext(sb);vm.runInContext(fs.readFileSync(path.join(root,'astronomy.min.js'),'utf8'),sb);sb.Astronomy=sb.window.Astronomy;
const src=fs.readFileSync(path.join(root,'assets/js/inline/page-06.js'),'utf8').match(/const Astro = \(\(\) => \{[\s\S]*?\n\}\)\(\);/)[0];vm.runInContext(src+';window.Astro=Astro;',sb);
const aySrc=fs.readFileSync(path.join(root,'assets/js/extended-astro-charts.js'),'utf8').match(/function ayanamsa\(jde\)\{[\s\S]*?\n  \}/)[0],ay=vm.runInContext('('+aySrc+')',sb);sb.window.AqEam={ayanamsa:ay};
vm.runInContext(fs.readFileSync(path.join(root,'assets/js/vedic-varshaphala.js'),'utf8'),sb);
const V=sb.window.AqVarshaphala,A=sb.window.Astro,ref=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/varshaphala-swiss.json'),'utf8')).cases;
const norm=x=>((x%360)+360)%360,delta=(a,b)=>Math.abs(norm(a-b+180)-180),keys=['sun','moon','mars','mercury','jupiter','venus','saturn','node'];
function input(c){const ch=A.chart({utcMs:c.birthMs,lat:c.lat,lon:c.lon,known:true,hs:'whole'}),off=ay(ch.jde);ch.asc=norm(ch.asc-off);ch.mc=norm(ch.mc-off);ch.bodies=ch.bodies.map(b=>({...b,lon:norm(b.lon-off)}));return [ch,{utcMs:c.birthMs,y:c.birthYear}];}
test('seven independent Swiss sidereal returns, longitudes, ascendants and Muntha',()=>{
 for(const c of ref){const [ch,natal]=input(c),r=V.calculate(ch,natal,c.year,{lat:c.lat,lon:c.lon}),seconds=Math.abs(r.returnMs-c.returnMs)/1000;
  console.log(c.id,'return delta seconds',seconds.toFixed(3),'asc arcminutes',(delta(r.chart.asc,c.asc)*60).toFixed(3));assert.ok(seconds<120,c.id+' return within 2 min of Swiss');assert.ok(delta(r.chart.asc,c.asc)<0.5,c.id+' annual asc within 0.5 degree');assert.equal(Math.floor(r.chart.asc/30),Math.floor(c.asc/30));assert.equal(r.muntha.sign,c.muntha);
  assert.ok(r.residual<1e-6);assert.ok(r.nextMs-r.returnMs>365*864e5&&r.nextMs-r.returnMs<366*864e5);
  keys.forEach((k,p)=>{const l=r.chart.bodies.find(b=>b.key===k).lon;assert.ok(delta(l,c.longitudes[p])<0.04,c.id+' '+k+' within 0.04 degrees');});
 }
});
test('return location changes annual ascendant but not return instant or natal Muntha sign',()=>{
 const c=ref[0],[ch,natal]=input(c),a=V.calculate(ch,natal,2027,{lat:30,lon:31}),b=V.calculate(ch,natal,2027,{lat:51.5,lon:-0.12});assert.equal(a.returnMs,b.returnMs);assert.equal(a.muntha.sign,b.muntha.sign);assert.ok(delta(a.chart.asc,b.chart.asc)>10);assert.ok(a.chart.cusps.every((x,i)=>i===0||delta(x,a.chart.cusps[i-1])===30));
});
test('Muntha full cycles, published 25-year Gemini and 36-year Libra examples',()=>{
 assert.equal(V.math.muntha(65,25,0).sign,3);assert.equal(V.math.muntha(190,36,255).sign,6);assert.equal(V.math.muntha(190,36,255).house,11);
 for(let s=0;s<12;s++)for(let a=0;a<=120;a++){const m=V.math.muntha(s*30+15,a,77);assert.equal(m.sign,(s+a)%12);assert.equal(m.house,(m.sign-2+12)%12+1);}
});
test('Tajika sign aspects differ from Parashari special aspects; motion classification is guarded',()=>{
 const asp=(a,b,sa=1,sb=0.1)=>V.math.tajika({lon:a,speed:sa},{lon:b,speed:sb},3,4);
 assert.equal(asp(10,45),null);assert.equal(asp(10,75).friendly,true);assert.equal(asp(10,105).friendly,false);assert.equal(asp(10,135).status,'يتقارب لحظيًا');assert.equal(asp(15,130).status,'يتباعد لحظيًا');assert.equal(asp(10,135,-1,0.1).status,'راجع · لا نصنف التطبيق');assert.equal(asp(10,145).within,false);
});
test('unknown time, invalid location/year and bad root bracket must not return a chart',()=>{
 const c=ref[0],[ch,natal]=input(c);ch.known=false;assert.throws(()=>V.calculate(ch,natal,2027,{lat:30,lon:31}));ch.known=true;
 for(const year of [1999,1998,NaN,2027.5,2300])assert.throws(()=>V.calculate(ch,natal,year,{lat:30,lon:31}));
 for(const loc of [{lat:90,lon:0},{lat:0,lon:181},{lat:NaN,lon:0}])assert.throws(()=>V.calculate(ch,natal,2027,loc));
 assert.throws(()=>V.math.root(norm(V.math.sunAt(c.birthMs)+180),c.birthMs));
});

test('five-dignity strength reproduces published Hyderabad Venus/Moon/Saturn worked chart',()=>{
 const c=ref.find(v=>v.id==='hyderabad-source'),p=V.math.pancha(c.longitudes.slice(0,7));
 assert.equal(p[5].total.toFixed(1),'13.5');assert.equal(p[1].total.toFixed(1),'12.3');assert.equal(p[6].total.toFixed(1),'9.3');
 const annual={asc:c.asc,bodies:keys.map((key,i)=>({key,lon:c.longitudes[i]}))};
 const o=V.math.officeHolders(c.natalAsc,annual,{sign:6,house:11,lord:5},true);assert.equal(o.selected,null,'the older simplified example has disqualifications under the added duruhpha screen');assert.deepEqual(Array.from(o.candidates,c=>c.key),[5,4,5,6,1]);
 assert.ok(p.every(v=>v.total>=0&&v.total<=20));
});
test('Hadda boundaries and independent hand-worked Punya calculations',()=>{
 assert.equal(V.math.hadda(5.9999),4);assert.equal(V.math.hadda(6),5);assert.equal(V.math.hadda(12),3);assert.equal(V.math.hadda(20),2);assert.equal(V.math.hadda(25),6);
 assert.equal(V.math.hadda(60+14),4);assert.equal(V.math.hadda(300+1),3); // Gemini 12..17 Jupiter, Aquarius starts Mercury.
 const v=V.math.punya(277.5,172+10/60,18+4/60,true);assert.ok(Math.abs(v-(270+2+44/60))<1e-8);
 assert.ok(Math.abs(V.math.punya(118+23/60,153+34/60,255+41/60,true)-(320+52/60))<1e-8);
 assert.equal(V.math.punya(5,45,10,true),null,'same-sign boundary is unresolved, not guessed');
});
test('zero-Aries solar root handles the zodiac wrap',()=>{
 const r=V.math.root(0,Date.UTC(2027,3,14));assert.ok(r.residual<1e-6);assert.ok(delta(V.math.sunAt(r.ms),0)<1e-6);
});

test('year-lord tie resolution uses strength, aspect, claims, then the declared offices',()=>{
 const rank=V.math.rankOffices,c=(key,strength=10,aspect=15)=>({key,strength,aspect});
 assert.equal(rank([c(2,12),c(4,10,60)],5,3,0).key,2);
 assert.equal(rank([c(2,10,15),c(4,10,60)],5,3,0).key,4);
 assert.equal(rank([c(2),c(4),c(4)],5,3,0).key,4);
 assert.equal(rank([c(2),c(4)],4,3,0).key,4);
 assert.equal(rank([c(2),c(4)],5,3,4).key,4);
 assert.equal(rank([c(2),c(4)],5,4,0).key,4);
 assert.equal(rank([c(2),c(4)],5,3,0).key,null);
});
test('Tajika ongoing and perfected configurations are distinct, with direct faster motion',()=>{
 const j=V.math.joining,a={lon:32,speed:13},b={lon:212+20/3600,speed:0.1};
 assert.ok(j(a,b,1,6).perfected);b.lon=214;assert.equal(j(a,b,1,6).perfected,false);
 a.speed=-13;assert.equal(j(a,b,1,6),null);a.speed=13;b.speed=-0.1;assert.ok(j(a,b,1,6),'retrograde slower body can receive an application');
 b.lon=210;assert.equal(j(a,b,1,6),null,'separation is not application');
});
test('Moon replacement: unique perfected recipient, no joining fallback, multiple recipients and pending application',()=>{
 const audit=Array.from({length:7},()=>({blocked:false,uncertain:[]}));
 function annual(lons){return {asc:0,bodies:keys.map((key,i)=>({key,lon:lons[i],speed:i===1?13:0.1}))};}
 let an=annual([11,35,77,151,215.001,281,119]);assert.equal(V.math.moonReplacement(an,audit).key,4);
 an=annual([29,99,29,29,29,29,29]);assert.equal(V.math.moonReplacement(an,audit).key,1,'Cancer Moon retains itself with no application');
 an=annual([11,35,95.001,151,215.001,281,119]);assert.equal(V.math.moonReplacement(an,audit).key,null,'two perfected recipients are not arbitrarily ranked');
 an=annual([11,35,77,151,217,281,119]);assert.equal(V.math.moonReplacement(an,audit).key,null,'future application is not perfected');
});
test('duruhpha audit identifies house, retrogression, detriment and does not invent combustion boundaries',()=>{
 const c=ref[0],[ch,natal]=input(c),r=V.calculate(ch,natal,2027,{lat:c.lat,lon:c.lon}),annual=r.chart;
 const mars=annual.bodies.find(b=>b.key==='mars');mars.lon=185;mars.speed=-0.1;annual.asc=30;
 const audit=V.math.screenDuru(annual);assert.ok(audit[2].blocked);assert.ok(audit[2].reasons.includes('راجع'));assert.ok(audit[2].reasons.includes('في البيت 6'));assert.ok(audit[2].reasons.includes('في البرج المقابل لبيته'));
 const mercury=annual.bodies.find(b=>b.key==='mercury'),sun=annual.bodies.find(b=>b.key==='sun');mercury.lon=sun.lon+16;assert.ok(V.math.screenDuru(annual)[3].uncertain.some(t=>t.includes('الشمس')));
});
test('full office selection returns an audited ruler and applies the named no-aspect fallback',()=>{
 function annual(pos,asc){return {asc,bodies:[...keys,'node'].map((key,i)=>({key,lon:pos[i],speed:i===1?13:0.1}))};}
 const clear=annual([253,50,102,235,135,306,220,90],135),normal=V.math.officeHolders(135,clear,{lord:0},true);
 assert.equal(normal.selected,0);assert.equal(normal.candidates[0].audit.blocked,false);assert.equal(normal.candidates[0].audit.uncertain.length,0);
 const noasp=annual([165,230,130,280,350,300,140,20],135),fallback=V.math.officeHolders(135,noasp,{lord:0},true);
 assert.ok(fallback.candidates.every(v=>v.aspect===0));assert.equal(fallback.selected,0);assert.ok(fallback.reason.includes('موكتافالي'));
});
