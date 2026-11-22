'use strict';
const fs=require('fs'), path=require('path'), os=require('os'), cp=require('child_process'), assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'natal-contract-'));
fs.mkdirSync(path.join(dir,'scripts'),{recursive:true});fs.mkdirSync(path.join(dir,'data/interpretations'),{recursive:true});
for(const f of ['validate-interpretations.js','gen-interpretation-manifest.js'])fs.copyFileSync(path.join(root,'scripts',f),path.join(dir,'scripts',f));
function entry(body,layer,id,rest={}){return {body,layer,id,chart_type:'natal',version:1,status:'approved',summary:'اختبار',text:'نص اختبار',sign:null,house:null,modifier:null,aspect:null,summary_mode:null,placeholders:[],...rest};}
const good=[
 entry('reference','reference','natal.reference.house_position.chiron.house5',{reference_kind:'house_position',reference_key:'chiron.house5'}),
 entry('reference','reference','natal.reference.house.house1',{reference_kind:'house',reference_key:'house1'}),
 entry('reference','reference','natal.reference.asteroid_house.ceres.house12',{reference_kind:'asteroid_house',reference_key:'ceres.house12'})
];
fs.writeFileSync(path.join(dir,'data/interpretations/reference.json'),JSON.stringify(good));
fs.writeFileSync(path.join(dir,'data/interpretations/chiron.json'),JSON.stringify([entry('chiron','core','natal.core.chiron.house5',{house:5}),entry('chiron','sign_only','natal.sign_only.chiron.leo',{sign:'leo'})]));
fs.writeFileSync(path.join(dir,'data/interpretations/saturn.json'),JSON.stringify([entry('saturn','modifier','natal.modifier.saturn.house7.retrograde',{house:7,modifier:'retrograde'})]));
function run(f){return cp.spawnSync(process.execPath,[path.join(dir,'scripts',f)],{encoding:'utf8'});}
assert.equal(run('validate-interpretations.js').status,0);
assert.equal(run('gen-interpretation-manifest.js').status,0);
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'data/interpretations/_manifest.json')));
assert(manifest.entries.some(x=>x.id==='natal.modifier.saturn.house7.retrograde'&&x.status==='approved'));
assert(manifest.entries.some(x=>x.id==='natal.reference.asteroid_house.ceres.house12'));
assert(manifest.entries.some(x=>x.id==='natal.sign_only.north_node.aries'));
assert.equal(new Set(manifest.entries.map(x=>x.id)).size,manifest.total);
for(const bad of [
 {reference_kind:'house',reference_key:'house13',id:'natal.reference.house.house13'},
 {reference_kind:'asteroid_house',reference_key:'sun.house1',id:'natal.reference.asteroid_house.sun.house1'},
 {reference_kind:'planet',reference_key:'invented',id:'natal.reference.planet.invented'}
]){
 fs.writeFileSync(path.join(dir,'data/interpretations/reference.json'),JSON.stringify([entry('reference','reference',bad.id,bad)]));
 assert.notEqual(run('validate-interpretations.js').status,0);
}
fs.rmSync(dir,{recursive:true,force:true});
console.log('PASS natal content contract: valid new layers accepted, invalid references rejected, optional IDs retained, manifest uniqueness');
