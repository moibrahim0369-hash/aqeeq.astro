'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const A=require('../assets/js/interpretation-library.js'),proof=require('./fixtures/natal-completion-packet1-hashes.json');
const dir=path.join(__dirname,'../data/interpretations');
const rows=fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f))));
const ix=A.indexOf([rows]),bodies=['mercury','mars','jupiter'],expected=bodies.flatMap(b=>[...A.SIGN_EN.map(s=>'natal.sign_only.'+b+'.'+s),'natal.modifier.'+b+'.retrograde']);
assert.equal(new Set(rows.map(e=>e.id)).size,rows.length);assert.equal(proof.count,39);assert.deepEqual(proof.rows.map(e=>e.id).sort(),expected.sort());
for(const p of proof.rows){const e=ix[p.id];assert(e,p.id+' absent or not approved');for(const k of ['title','summary','text'])assert.equal(crypto.createHash('sha256').update(e[k]).digest('hex'),p[k+'_sha256'],p.id+' changed '+k);assert.equal(e.editorial_origin.kind,'authored_completion');assert.equal(e.editorial_origin.source_adaptation,false);assert.deepEqual(e.source_ids,[]);assert.equal(e.house,null);}
const seen=new Set();let contexts=0;
for(let sign=0;sign<12;sign++)for(const known of [true,false])for(const retro of [true,false]){
 const ch={known,bodies:A.PLANETS.map(key=>({key,lon:sign*30+3,house:sign+1,retro})),cusps:Array.from({length:12},(_,i)=>i*30),asc:0,mc:270};
 const m=A.build({ch}),s=A.sections(m,ix);contexts++;
 if(!known){assert.deepEqual(s.houseTpl,{});assert.equal(s.angles,'');}
 for(const body of bodies){const html=s.planetTpl[body],id='natal.sign_only.'+body+'.'+A.SIGN_EN[sign];assert(html.includes(A.renderText(ix[id].text)),id+' lost full body');assert.equal(html.split('data-il-id="'+id+'"').length-1,1,id+' duplicated');seen.add(id);const mod='natal.modifier.'+body+'.retrograde';assert.equal(html.includes('data-il-id="'+mod+'"'),retro,mod+' retrograde guard');if(retro){assert(html.includes(A.renderText(ix[mod].text)));seen.add(mod);}if(!known)assert(!/data-il-id="natal\.core\./.test(html));}
}
assert.deepEqual([...seen].sort(),expected.sort());
console.log('PASS packet1:39 accepted full text/title/summary source hashes;48 known/unknown and retrograde/direct routing contexts; all39 reachable once, no invented houses or stale retrograde sections');
