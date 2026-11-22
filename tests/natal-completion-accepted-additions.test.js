'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict'),A=require('../assets/js/interpretation-library.js');
const allProof=require('./fixtures/natal-completion-accepted-additions-hashes.json'),selected=allProof.rows.filter(e=>['packet4','packet2-saturn-v3','packet2-neptune-v4','packet5-v2'].includes(e.packet)),proof={count:selected.length,rows:selected},dir=path.join(__dirname,'../data/interpretations');
const all=fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f)))),ix=A.indexOf([all]);
assert.equal(proof.rows.length,proof.count);assert.equal(new Set(proof.rows.map(e=>e.id)).size,proof.count);
for(const p of proof.rows){const e=ix[p.id];assert(e,p.id+' not approved/reachable');for(const k of ['title','summary','text'])assert.equal(crypto.createHash('sha256').update(e[k]).digest('hex'),p[k+'_sha256'],p.id+' changed '+k);assert(['authored_completion','authored_complement'].includes(typeof e.editorial_origin==='string'?e.editorial_origin:e.editorial_origin.kind));if(typeof e.editorial_origin==='object')assert.equal(e.editorial_origin.source_adaptation,false);}
const seen=new Set();
for(let sign=0;sign<12;sign++)for(const known of [true,false])for(const retro of [true,false]){
 const model=A.build({ch:{known,bodies:A.PLANETS.map(key=>({key,lon:sign*30+3,house:1,retro})),cusps:Array.from({length:12},()=>sign*30+3),asc:sign*30+3,mc:sign*30+3}}),s=A.sections(model,ix);
 for(const b of ['saturn','neptune']){const html=s.planetTpl[b],id='natal.sign_only.'+b+'.'+A.SIGN_EN[sign],mod='natal.modifier.'+b+'.retrograde';assert(html.includes(A.renderText(ix[id].text)));seen.add(id);const genericExpected=retro&&!(known&&ix['natal.modifier.'+b+'.house'+model.items[b].house+'.retrograde']);assert.equal(html.includes('data-il-id="'+mod+'"'),genericExpected,'house-specific Saturn retrograde must retain priority');if(genericExpected){assert(html.includes(A.renderText(ix[mod].text)));seen.add(mod);}}
 if(!known){assert.deepEqual(s.houseTpl,{});assert.equal(s.angles,'');continue;}
 for(let h=1;h<=12;h++){const id='natal.house_cusp.house'+h+'.'+A.SIGN_EN[sign],html=s.houseTpl[h];assert(html.includes(A.renderText(ix[id].text)));assert.equal(html.split('data-il-id="'+id+'"').length-1,1);for(let other=1;other<=12;other++)if(other!==h)assert(!html.includes('data-il-id="natal.house_cusp.house'+other+'.'));seen.add(id);}
}
assert.deepEqual([...seen].sort(),proof.rows.map(e=>e.id).sort());
for(const house of [7,8]){const s=A.sections(A.build({ch:{known:true,bodies:[{key:'saturn',lon:5,house,retro:true}],cusps:Array.from({length:12},(_,i)=>i*30),asc:0,mc:270}}),ix);assert(s.planetTpl.saturn.includes('data-il-id="natal.modifier.saturn.house'+house+'.retrograde"'));assert(!s.planetTpl.saturn.includes('data-il-id="natal.modifier.saturn.retrograde"'));}

function geometry(cusps){return A.sections(A.build({ch:{known:true,bodies:[],cusps,asc:8,mc:278}}),{});}
const equal=geometry([8,38,68,98,128,158,188,218,248,278,308,338]);
for(const [h,a]of [[1,'asc'],[4,'ic'],[7,'dsc'],[10,'mc']]){assert(equal.houseTpl[h].includes('data-il-same-position="'+a+'"'));assert(equal.angles.includes('data-il-same-position="house'+h+'"'));}
const whole=geometry(Array.from({length:12},(_,i)=>i*30));assert(!whole.houseTpl[1].includes('data-il-same-position'));assert(!whole.angles.includes('data-il-same-position'));
console.log('PASS accepted additions:'+proof.count+' source-exact readings; all routes, unknown-time suppression, Saturn house-specific retrograde priority, exact angular-cusp identity notes only when longitude truly matches');
