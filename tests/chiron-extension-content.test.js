'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),X=require('../assets/js/chiron-extensions.js');
const d=require('../data/chiron-extensions.json'),ix=Object.fromEntries(d.entries.map(e=>[e.id,e]));
assert.equal(d.entries.length,706);assert.equal(Object.keys(ix).length,706);// Mirror records may share the same role-based prose; record count is not authorship count.
assert(new Set(d.entries.map(e=>e.text)).size<706);
const counts=Object.fromEntries(['natal','transit','synastry'].map(c=>[c,d.entries.filter(e=>e.context===c).length]));assert.deepEqual(counts,{natal:112,transit:261,synastry:333});
function chart(known,key,lon){const c={known,bodies:[],asc:1,mc:271,cusps:Array.from({length:12},(_,i)=>i*30)};
 if(key==='asc')c.asc=lon;else if(key==='dsc')c.asc=lon-180;else if(key==='mc')c.mc=lon;else if(key==='ic')c.mc=lon-180;else c.bodies.push({key:key==='north_node'||key==='south_node'?'truenode':key,lon:key==='south_node'?lon-180:lon,house:1});return c;}
let routes=0,hidden=0;
for(const e of d.entries){assert.equal(e.status,d.releaseReady?'approved':'draft');assert(e.title&&e.summary&&e.text.length>600);assert.equal(e.id,['chiron',e.context,e.first,e.aspect,e.second].join('.'));assert.equal(e.text.includes('{{'),false);const a=X.MAJOR.concat(X.MINOR).find(a=>a.key===e.aspect);assert(a);
 for(const known of[true,false])for(const sign of[1,-1]){
  let found;
  if(e.context==='natal'){const c=chart(known,e.first,0);c.bodies.push({key:'chiron',lon:sign*a.angle});found=X.natal(c,{includeMinor:true,includePoints:true});}
  else {const first=chart(e.context==='transit'?false:known,e.first,0),second=chart(known,e.second,sign*a.angle);found=e.context==='transit'?X.transits(second,first,{includeMinor:true,includePoints:true}):X.synastry(first,second,{includeMinor:true,includePoints:true});}
  const missingTime=!known&&[e.first,e.second].some(k=>['asc','dsc','mc','ic','fortune'].includes(k));const r=found.find(r=>r.id===e.id||(r.linkedContacts||[]).some(c=>c.id===e.id));if(missingTime){assert(!r,'unknown-time route '+e.id);hidden++;}else{assert(r,'missing route '+e.id+' '+known+' '+sign);assert.equal(X.reading(Object.assign({},r,{id:e.id}),ix,true).text,e.text);routes++;}
 }
}
assert.equal(X.POINTS.includes('vertex'),false);assert.equal(X.MINOR.length,4);
console.log('PASS 706 stored contextual records, not a prose-quality signoff; '+routes+' full-text routes; '+hidden+' known-time exclusions; ten planets, four minors and existing points only.');
