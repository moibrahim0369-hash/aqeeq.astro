'use strict';
const assert=require('node:assert/strict'),M=require('../assets/js/year2027-focused.js');
const S=Date.UTC(2026,11,31,22),E=Date.UTC(2027,11,31,22),H=(S+E)/2;
const specs={dasha:9,covenant:9,nodes:12,caution:12,opportunity:12,sadeSati:4};
const copy=Object.fromEntries(Object.entries(specs).map(([section,n])=>[section,Object.fromEntries((section==='sadeSati'?['outside','rising','peak','setting']:Array.from({length:n},(_,i)=>String(i+(['nodes','caution','opportunity'].includes(section)?1:0)))).map(key=>[key,{title:section+key,free:'test',paid:'test',question:'test?'}]))]));
assert.equal(M.validate(copy).length,58);
for(let moon=0;moon<12;moon++)for(let house=1;house<=12;house++){
 const visit=(s,e,sign,h)=>({s,e,sign,house:h});
 const report={periods:[{s:S,e:H,lord:0,maha:8},{s:H,e:E,lord:1,maha:8}],groups:[{planet:'saturn',periods:[visit(S,H,(moon+11)%12,house),visit(H,E,moon,house)]},{planet:'rahu',periods:[visit(S,E,0,house)]},{planet:'jupiter',periods:[visit(S,E,0,house)]}]};
 const result=M.assemble(report,{known:true,bodies:[{key:'moon',lon:moon*30+3}]},copy);
 assert.deepEqual(result.map(x=>x.id),['dasha','sadeSati','nodes','caution','opportunity','covenant']);
 for(const section of result){const visits=section.entries.flatMap(e=>e.visits).sort((a,b)=>a.s-b.s);assert.equal(visits[0].s,S);assert.equal(visits.at(-1).e,E);for(let i=1;i<visits.length;i++)assert.equal(visits[i].s,visits[i-1].e);}
 assert.deepEqual(result[1].entries.map(e=>e.key),['rising','peak']);assert.equal(result[2].entries[0].metadata.ketuHouse,(house+5)%12+1);
}
assert.throws(()=>M.assemble({groups:[],periods:[]},{known:false},copy));
console.log('PASS144 natal-Moon/house combinations, selected six, exact intervals, opposite nodes, phase and unknown-time guards. No private library fixture.');
