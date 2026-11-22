'use strict';
const assert=require('node:assert/strict'),M=require('../assets/js/year2027-reading-model.js');
for(let lord=0;lord<9;lord++)for(let house=1;house<=12;house++){
 const text=k=>({title:k,paragraphs:[k+' scene'],action:k+' action',question:k+' question'}),visit=(planet,house,s=0,e=100)=>({planet,house,s,e,text:text(planet+house),contacts:[]});
 const dasha={maha:7,lord,s:0,e:100,text:text('dasha'+lord)},opposite=(house+5)%12+1;
 const phases=['outside','rising','peak','setting'].map((key,i)=>({key,ref:'sadeSati-'+key,text:{title:key,free:'scene',paid:'meaning',question:'question'},visits:[{s:i*25,e:(i+1)*25}],metadata:{}}));
 const covenant={ref:'covenant-'+lord+'-7',text:{title:'covenant',free:'scene',paid:'التزم ثم تجنّب',question:'question'},visits:[{s:0,e:100}],metadata:{maha:7,lord}};
 const report={periods:[dasha],groups:['saturn','jupiter','rahu','ketu','mars'].map(k=>({planet:k,periods:[visit(k,k==='ketu'?opposite:house)]})),focused:[{id:'sadeSati',entries:phases},{id:'covenant',entries:[covenant]}]},z=M.assemble(report);
 assert.deepEqual(z.map(s=>s.id),['dasha','sadeSati','nodes','caution','opportunity','covenant']);assert.strictEqual(z[0].entries[0].text,dasha.text);assert.equal(z[0].entries[0].maha,7);assert.equal(z[0].entries[0].lord,lord);assert.deepEqual(z[2].entries.map(e=>e.house),[house,opposite]);assert.deepEqual(z[3].entries.map(e=>e.planet),['saturn']);assert.deepEqual(z[4].entries.map(e=>e.planet),['jupiter']);assert.strictEqual(z[5].entries[0].text,covenant.text);assert.ok(z[1].entries.every(e=>e.note&&e.text.title===e.phase));assert.ok(z[1].entries[2].note.includes('نفسه'));assert.ok(z[1].entries[3].note.includes('التراجع'));
 const repeated=report.groups[0].periods[0];report.groups[0].periods.push({...repeated,s:200,e:250});const merged=M.assemble(report)[3].entries;assert.equal(merged.length,1);assert.deepEqual(merged[0].visits,[{s:0,e:100},{s:200,e:250}]);
}
assert.throws(()=>M.assemble({groups:[],periods:[]}));console.log('PASS108 synthetic lord/house source-binding cases, all four explicit Moon-relative contexts, selected originals, opposite nodes, actual major/sub period labels, return visits and distinct covenants. Not a semantic review.');
