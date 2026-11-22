'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),crypto=require('crypto'),path=require('path');
const X=require('../assets/js/chiron-extensions.js'),L=require('../assets/js/interpretation-library.js');
const bodies=X.PLANETS.concat(['chiron']);
const chart=(known,rows)=>({known,bodies:rows.map(([key,lon])=>({key,lon,house:1})),asc:2,mc:271,cusps:Array.from({length:12},(_,i)=>i*30)});
let tested=0;
for(const asp of X.MAJOR.concat(X.MINOR))for(const k of X.PLANETS)for(const sign of[-1,1])for(const known of[true,false]){
 const ch=chart(known,[[k,0],['chiron',sign*asp.angle]]),m=X.natal(ch,{includeMinor:true,includePoints:true});
 const r=m.find(r=>r.first===k&&r.type===asp.key);
 assert.equal(!!r,!!asp.key.match(/^(semisextile|semisquare|sesquiquadrate|quincunx)$/));
 if(r)assert.equal(r.orb,0);
 const first=chart(known,[['chiron',0]]),second=chart(known,[[k,sign*asp.angle]]);
 const s=X.synastry(first,second,{includeMinor:true}).find(r=>r.first==='chiron'&&r.second===k&&r.type===asp.key);assert(s);
 const rev=X.synastry(second,first,{includeMinor:true}).find(r=>r.first===k&&r.second==='chiron'&&r.type===asp.key);assert(rev);
 const t=X.transits(second,first,{includeMinor:true}).find(r=>r.first==='chiron'&&r.second===k&&r.type===asp.key);assert(t);
 const tr=X.transits(first,second,{includeMinor:true}).find(r=>r.first===k&&r.second==='chiron'&&r.type===asp.key);assert(tr);
 tested++;
}
for(const asp of X.MINOR)for(const direction of[-1,1]){
 const a={key:'sun',lon:0},mk=offset=>({key:'chiron',lon:direction*(asp.angle+offset)});
 assert(X.match(a,mk(2),'natal',{includeMinor:true}));assert(!X.match(a,mk(2.0001),'natal',{includeMinor:true}));
 assert(!X.match(a,mk(0),'natal',{}));
}
const known=chart(true,[['sun',8],['chiron',0],['truenode',0],['node',90],['lilith',60],['fortune',120]]),unknown={...known,known:false};
const kp=X.positions(known,true),up=X.positions(unknown,true);assert.equal(kp.north_node.lon,0);assert.equal(kp.south_node.lon,180);assert.equal(kp.north_node.source,'truenode');
for(const k of['asc','dsc','mc','ic','fortune']){assert(kp[k]);assert(!up[k]);}
for(const k of['north_node','south_node','lilith'])assert(up[k]);
assert(!X.positions(chart(false,[['node',3]]),true).north_node,'mean node must not be relabelled true');
for(const value of[null,undefined,NaN,Infinity,'30'])assert(!X.positions(chart(false,[['chiron',value]])).chiron);
assert.deepEqual(X.natal(chart(false,[['sun',0]]),{includeMinor:true,includePoints:true}),[]);
assert.deepEqual(X.transits(chart(false,[]),chart(false,[])),[]);
assert.equal(X.synastry(chart(false,[['chiron',0]]),chart(false,[['chiron',0]])).length,1);
assert(X.synastry(chart(false,[['chiron',0]]),chart(false,[['moon',0]]))[0].timeUncertain);
assert.equal(X.transits(chart(false,[['chiron',0]]),chart(false,[['moon',0]]))[0].timeUncertain,false,'current Moon time is specified even with transit houses disabled');
assert(X.transits(chart(false,[['moon',0]]),chart(false,[['chiron',0]]))[0].timeUncertain,'natal Moon time can be unknown');
assert(X.natal(known,{includePoints:true}).find(r=>r.first==='north_node').linkedAxis==='nodes');
assert(!X.synastry(chart(true,[['chiron',0]]),chart(true,[['moon',0]]))[0].timeUncertain);
const index={x:{context:'transit',status:'draft',text:'review'}};assert.equal(X.reading({id:'x',context:'transit'},index),null);assert(X.reading({id:'x',context:'transit'},index,true));assert.equal(X.reading({id:'x',context:'synastry'},index,true),null);
// Entire approved natal corpus is untouched, not just selected strings.
const root=path.resolve(__dirname,'..'),canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x,hash=x=>crypto.createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex'),snapshot={};
for(const f of fs.readdirSync(root+'/data/interpretations').filter(f=>f.endsWith('.json')&&!f.startsWith('_')))for(const e of JSON.parse(fs.readFileSync(root+'/data/interpretations/'+f)))snapshot[e.id]=hash(e);
assert.equal(Object.keys(snapshot).length,1270);
const baseline=require('./fixtures/chiron-expansion-preserved-1270.json');assert.equal(Object.keys(baseline).length,1270);for(const[id,h]of Object.entries(baseline))assert.equal(snapshot[id],h,id);
const original=L.build(known),again=L.build(known);X.natal(known,{includeMinor:true,includePoints:true});assert.deepEqual(L.build(known),original);assert.deepEqual(original,again);
console.log('PASS Chiron isolated extension candidate: '+tested+' aspect/body/direction/time combinations; exact minor limits; both transit and synastry directions; known-time points; true-node labels; no forced match; draft gating; 1270 existing entries untouched.');
