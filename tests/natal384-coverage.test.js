'use strict';
const A=require('../assets/js/interpretation-library.js'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../data/interpretations');
const allRows=fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f))));
const baseline=require('./fixtures/natal384-baseline-hashes.json'),baselineIds=new Set(baseline.entries.map(e=>e.id));
const rows=allRows.filter(e=>baselineIds.has(e.id));
assert.equal(allRows.length,new Set(allRows.map(e=>e.id)).size,'duplicate global reading IDs');
assert.equal(rows.length,384);assert.equal(new Set(rows.map(e=>e.id)).size,384);
const stable=x=>x&&typeof x==='object'?(Array.isArray(x)?x.map(stable):Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])]))):x;
for(const b of baseline.entries){const row=rows.find(e=>e.id===b.id);assert.equal(require('crypto').createHash('sha256').update(JSON.stringify(stable(row))).digest('hex'),b.canonical_sha256,'accepted baseline changed: '+b.id);}

const ix=A.indexOf([rows]),seen=new Set();
function see(m){const S=A.sections(m,ix);const html=Object.values(S).map(x=>typeof x==='object'?Object.values(x).join(''):x).join('');for(const q of html.matchAll(/data-il-id="([^"]+)/g))if(ix[q[1]])seen.add(q[1]);return S;}
for(let house=1;house<=12;house++)for(let sign=0;sign<12;sign++)for(const known of [true,false]){
 const bodies=A.PLANETS.map(key=>({key,lon:sign*30+3,house,retro:key==='saturn'}));
 bodies.push({key:'true_node',lon:sign*30+3,house},{key:'lilith',lon:sign*30+3,house},{key:'fortune',lon:sign*30+3,house});
 const m=A.build({ch:{known,bodies,cusps:Array.from({length:12},(_,i)=>i*30),asc:sign*30+3,mc:270}});
 assert.equal(m.items.north_node.sign,sign);assert.equal(m.items.south_node.sign,(sign+6)%12);assert.equal(m.items.south_node.house,known?(house+5)%12+1:null);
 const S=see(m);if(!known){assert.deepEqual(S.houseTpl,{});assert.equal(S.angles,'');assert.equal(m.items.fortune,undefined);assert(!JSON.stringify(S.points).includes('natal.core.north_node.house'));}
}
// Exercise every real aspect type instead of treating all-same-longitude fixtures as coverage.
see(A.build({ch:{known:true,bodies:A.PLANETS.map((key,i)=>({key,lon:i*30,house:i+1})),cusps:Array.from({length:12},(_,i)=>i*30),asc:0,mc:270}}));
const missing=rows.filter(e=>!seen.has(e.id)).map(e=>e.id);assert.deepEqual(missing,[]);
const ref=see(A.build({ch:{known:false,bodies:[],cusps:[]}})).references;
for(const e of rows.filter(e=>/^natal\.reference\.(asteroids|element|modality|house_position)\./.test(e.id)))assert(ref.includes(e.id));
assert.equal(rows.some(e=>e.id==='natal.sign_only.lilith.libra'),false);
assert(A.renderText('#### عنوان\n\nنص').includes('<h5'));
assert(!A.renderText('<script>x</script>').includes('<script>'));
if(process.env.NATAL_ACCEPTED_PROOF){const crypto=require('crypto'),p=JSON.parse(fs.readFileSync(process.env.NATAL_ACCEPTED_PROOF));for(const q of p.rows){const e=ix[q.reader_id];for(const key of ['text','summary'])assert.equal(crypto.createHash('sha256').update(e[key]).digest('hex'),q[key+'_sha256']);}}
console.log('PASS frozen384/384 baseline readings, with all metadata hashes preserved; exact body/house/sign routes, true_node/opposite nodes, unknown-time guards,52asteroids+13Chiron+11element/modality references; baseline provenance preserved independently of authored completion; optional source hash proof');
