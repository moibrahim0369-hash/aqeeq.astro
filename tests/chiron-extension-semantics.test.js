'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),cp=require('child_process'),path=require('path');
const root=path.resolve(__dirname,'..'),X=require('../assets/js/chiron-extensions.js'),D=require('../data/chiron-extensions.json').entries,ix=Object.fromEntries(D.map(e=>[e.id,e]));
const opt={includeMinor:true,includePoints:true};
function c(known,bodies=[],asc=0,mc=90){return {known,bodies,asc,mc};}
const chr=lon=>({key:'chiron',lon});
// Return is the conjunction only. Other self-aspects must explicitly distinguish themselves.
for(const a of X.MAJOR.concat(X.MINOR)){
 const e=ix['chiron.transit.chiron.'+a.key+'.chiron'];assert(e);
 if(a.key==='conjunction')assert(e.text.includes('نسمي هذا الاتصال عودة كيرون'));
 else {assert(!e.text.includes('دي عودة كيرون'));assert(!e.text.includes('هو اتصال العودة'));assert(e.text.replace(/ال/g,'').includes(a.label.replace(/ال/g,''))); }
}
// A physical synastry contact is invariant to chart input order. Owner labels live in the row.
let mirrors=0;
for(const e of D.filter(e=>e.context==='synastry'&&e.first==='chiron'&&e.second!=='chiron')){
 const other=ix['chiron.synastry.'+e.second+'.'+e.aspect+'.chiron'];assert(other);assert.equal(other.text,e.text,e.id+' physical-contact prose changed with input order');mirrors++;
}
assert.equal(mirrors,162);
const a=c(true,[chr(0)]),b=c(true,[{key:'venus',lon:150}]);
const ab=X.synastry(a,b,opt).find(r=>r.id==='chiron.synastry.chiron.quincunx.venus'),ba=X.synastry(b,a,opt).find(r=>r.id==='chiron.synastry.venus.quincunx.chiron');assert(ab&&ba);assert.equal(X.reading(ab,ix,true).text,X.reading(ba,ix,true).text);assert(ab.first==='chiron'&&ba.second==='chiron');
// Point ownership is local to its chart, not the other participant's time knowledge.
assert(X.synastry(c(false,[chr(0)]),c(true,[],180,90),opt).some(r=>(r.linkedContacts||[]).some(x=>x.point==='dsc')));
assert(!X.synastry(c(true,[chr(0)]),c(false,[],180,90),opt).some(r=>r.linkedAxis==='horizon'||r.linkedAxis==='meridian'));
assert(X.synastry(c(true,[],180,90),c(false,[chr(0)]),opt).some(r=>r.linkedAxis==='horizon'));
assert(!X.synastry(c(false,[],180,90),c(true,[chr(0)]),opt).some(r=>r.linkedAxis==='horizon'||r.linkedAxis==='meridian'));
// Complementary endpoints are one geometric contact, with the near endpoint as primary.
for(const [chart,axis,primary,alias]of[
 [c(true,[chr(0)],180,90),'horizon','chiron.natal.dsc.conjunction.chiron','chiron.natal.asc.opposition.chiron'],
 [c(true,[chr(0)],90,180),'meridian','chiron.natal.ic.conjunction.chiron','chiron.natal.mc.opposition.chiron'],
 [c(false,[chr(90),{key:'truenode',lon:0}]),'nodes','chiron.natal.north_node.square.chiron','chiron.natal.south_node.square.chiron']
]){
 const rows=X.natal(chart,opt).filter(r=>r.linkedAxis===axis);assert.equal(rows.length,1,axis+' double counted');assert.equal(rows[0].id,primary);assert(rows[0].linkedContacts.some(r=>r.id===alias));
}
const hs=X.natal(c(true,[chr(90)],0,20),opt).filter(r=>r.linkedAxis==='horizon');assert.equal(hs.length,1);assert.equal(hs[0].linkedContacts.length,2);
// Different moving/natal mechanisms and angle-dependent choices are authored in the representative matrix.
for(const body of['mars','moon'])assert.notEqual(ix['chiron.transit.chiron.square.'+body].text,ix['chiron.transit.'+body+'.square.chiron'].text);
const sun=X.MINOR.map(a=>ix['chiron.natal.sun.'+a.key+'.chiron'].text);assert.equal(new Set(sun).size,4);assert(sun.every(t=>t.length>750));
for(const e of D.filter(e=>e.context!=='synastry'))assert(!e.text.includes('سبب نغيّر درجة التوافق'));
// The entire legacy five-planet compatibility/composite implementation is byte-identical.
const old=cp.execFileSync('git',['show','f334bf0:assets/js/inline/page-06.js'],{cwd:root,encoding:'utf8',maxBuffer:8e6}),now=fs.readFileSync(root+'/assets/js/inline/page-06.js','utf8');
function scoring(s){return s.slice(s.indexOf('    const CP_KEYS ='),s.indexOf('    window.AqeqSynastry ='));}
assert(scoring(old).length>1000);assert.equal(scoring(now),scoring(old),'legacy score/composite source changed');
console.log('PASS Chiron semantic guard: return-only conjunction; 162 role-invariant mirrors; owner-specific timed-point gates; complementary axis dedup; representative mechanisms; legacy score/composite byte snapshot.');

for(const angle of[30,45,60,90])for(const context of['natal','transit','synastry','synastrySwapped']){const timed=c(true,[],0,17),moving=c(false,[chr(angle)]);let rows;if(context==='natal')rows=X.natal(c(true,[chr(angle)],0,17),opt);else if(context==='transit')rows=X.transits(timed,moving,opt);else rows=context==='synastry'?X.synastry(moving,timed,opt):X.synastry(timed,moving,opt);const hs=rows.filter(r=>r.linkedAxis==='horizon');assert.equal(hs.length,1,context+' '+angle);assert.equal(hs[0].linkedContacts.length,2);assert.deepEqual(hs[0].linkedContacts.map(r=>r.angle).sort((a,b)=>a-b),[angle,180-angle]);}
for(const source of require('../docs/chiron-representative-prose.json').concat(require('../docs/chiron-axis-family-revision.json')))for(const id of source.ids){assert.equal(ix[id].nucleusId,source.ids[0]);assert.equal(ix[id].text,source.text);}
console.log('PASS 16 numeric complementary-axis mappings across natal/transit/synastry/swapped charts; every representative alias routes to its actual full nucleus.');

for(const angle of[88,92]){const rows=X.natal(c(true,[chr(angle)],0,17),opt).filter(r=>r.linkedAxis==='horizon');assert.equal(rows.length,1);assert.equal(rows[0].first,'asc');assert.deepEqual(rows[0].linkedContacts.map(r=>r.orb),[2,2]);assert.deepEqual(rows[0].linkedContacts.map(r=>r.angle).sort((a,b)=>a-b),[88,92]);}
