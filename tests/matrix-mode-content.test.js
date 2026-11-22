'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../assets/data/matrix/gemini');
const keys={compat:[['E','personal'],['A','social'],['money','balance'],['C','I'],['D3','C2'],['D','D2'],['heart','B2'],['H','G'],['F','spiritual'],['personal','earth'],['B','A2']],child:[['A','E'],['A2','balance'],['F','G','father','mother'],['B','B2'],['C','C2'],['personal','social','spiritual'],['D','D2','D3'],['__year','__age']]};
test('All 924 mode slots use exact number/section/key and complete split content',()=>{
 let total=0;const ids=new Set();
 for(const mode of ['compat','child'])for(let n=1;n<=22;n++){
  const name=mode+'-'+String(n).padStart(2,'0')+'.json';const d=JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
  assert.equal(d.mode,mode,name);assert.equal(d.arcana,n,name);assert.equal(d.sections.length,keys[mode].length,name);
  d.sections.forEach((s,i)=>{assert.equal(s.id,(mode==='compat'?'pair-':'child-')+i,name);assert.deepEqual(s.slots.map(x=>x.key),keys[mode][i],name+'/'+s.id);
   s.slots.forEach(v=>{const id=mode+'/'+n+'/'+s.id+'/'+v.key;assert.ok(!ids.has(id),id);ids.add(id);total++;
    for(const k of ['label','free','paid','reflection_question'])assert.ok(typeof v[k]==='string'&&v[k].trim(),id+'/'+k);
    assert.equal(v.text,v.free+'\n\n'+v.paid,id+'/text');
   });
  });
 }
 assert.equal(total,924);assert.equal(ids.size,924);
});
