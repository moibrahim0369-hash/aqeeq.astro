'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),sb={window:{},Number,Math};vm.createContext(sb);vm.runInContext(fs.readFileSync(path.join(root,'assets/js/vedic-ashtakavarga.js'),'utf8'),sb);
const A=sb.window.AqAshtakavarga,ref=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/ashtakavarga-parashara.json'),'utf8')).contributors;
const keys=['sun','moon','mars','mercury','jupiter','venus','saturn'];
function chart(signs){return {known:true,asc:signs[7]*30+5,bodies:keys.map((key,i)=>({key,lon:signs[i]*30+10}))};}
function calc(signs){return A.calculate(chart(signs));}
function plain(x){return JSON.parse(JSON.stringify(x));}
test('all 56 contributor rows match independent contributor-oriented reference for 200 charts',()=>{
 let state=12987;const rand=()=>{state=(state*1664525+1013904223)>>>0;return state%12;};
 for(let n=0;n<200;n++){
  const signs=Array.from({length:8},rand),r=calc(signs),sum=Array(12).fill(0);
  for(let p=0;p<7;p++){
   const want=Array(12).fill(0);
   for(let s=0;s<12;s++)for(let k=0;k<8;k++){
    const h=(s-signs[k]+12)%12+1,v=ref[p][k].includes(h)?1:0;
    assert.equal(r.bav[p].contributors[k][s],v,`table ${p}, source ${k}, sign ${s}`);want[s]+=v;
   }
   assert.deepEqual(plain(r.bav[p].values),want);assert.equal(r.bav[p].total,[48,49,39,54,56,52,39][p]);want.forEach((v,s)=>sum[s]+=v);
  }
  assert.deepEqual(plain(r.sav),sum);assert.equal(r.total,337);assert.ok(r.bav.every(b=>b.values.every(v=>v>=0&&v<=8)));
 }
});
test('rotating all eight sources rotates every row without changing totals',()=>{
 const s=[0,2,4,6,8,10,11,1],a=calc(s);
 for(let k=0;k<12;k++){
  const b=calc(s.map(v=>(v+k)%12));
  for(let i=0;i<12;i++)assert.equal(b.sav[(i+k)%12],a.sav[i]);
 }
});
test('six recension cells are specifically Parashara, not caught by checksum alone',()=>{
 const r=calc(Array(8).fill(0));
 assert.equal(r.bav[1].contributors[1][8],1);assert.equal(r.bav[1].contributors[2][8],0);
 assert.equal(r.bav[1].contributors[4][1],1);assert.equal(r.bav[1].contributors[4][11],0);
 assert.equal(r.bav[5].contributors[2][3],1);assert.equal(r.bav[5].contributors[2][4],0);
});
test('missing time or nonfinite positions must not invent Lagna contributions',()=>{
 const ch=chart(Array(8).fill(0));ch.known=false;assert.throws(()=>A.calculate(ch));ch.known=true;ch.asc=NaN;assert.throws(()=>A.calculate(ch));ch.asc=0;ch.bodies[0].lon=NaN;assert.throws(()=>A.calculate(ch));
});
