#!/usr/bin/env node
/* Build authored Chiron routes. A missing source fails closed, never invents prose. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),root=path.resolve(__dirname,'..'),X=require('../assets/js/chiron-extensions.js'),composer=require('./lib/chiron-prose-composer.js');
const data=[];
function add(context,first,aspect,second){
 const body=first==='chiron'?second:first,minor=X.MINOR.some(a=>a.key===aspect),id=['chiron',context,first,aspect,second].join('.');
 const summary=context==='natal'?'تفصيل ميلادي إضافي لاتصال '+X.LABELS[body]+' بكيرون.':context==='transit'?'العابر: '+X.LABELS[first]+'؛ موضع الميلاد: '+X.LABELS[second]+'.':'قراءة بين صاحب كيرون وصاحب '+X.LABELS[body]+'.';
 data.push({id,version:1,status:'draft',proseSource:null,editorialStatus:'unreviewed_missing',nucleusId:null,lens:null,context,first,second,aspect,minor,title:'',summary:summary+' مرجع رمزي عام؛ لا يُنسب إلى خريطة إلا إذا تحقق الاتصال.',text:''});
}
const all=X.MAJOR.concat(X.MINOR).map(a=>a.key);
for(const p of X.PLANETS)for(const a of X.MINOR)add('natal',p,a.key,'chiron');
for(const p of X.POINTS)for(const a of all)add('natal',p,a,'chiron');
for(const p of X.PLANETS.concat(['chiron'],X.POINTS))for(const a of all)add('transit','chiron',a,p);
for(const p of X.PLANETS)for(const a of all)add('transit',p,a,'chiron');
for(const p of X.PLANETS.concat(['chiron'],X.POINTS))for(const a of all)add('synastry','chiron',a,p);
for(const p of X.PLANETS.concat(X.POINTS))for(const a of all)add('synastry',p,a,'chiron');
const registry=JSON.parse(fs.readFileSync(root+'/docs/chiron-content-review/source-register.json'));
function reviewed(source){const raw=fs.readFileSync(root+'/'+source.path);if(!/^[a-f0-9]{64}$/.test(source.sha256||'')||crypto.createHash('sha256').update(raw).digest('hex')!==source.sha256)throw Error('Reviewed source missing hash or changed: '+source.path);return JSON.parse(raw);}
for(const source of registry.sources.filter(s=>s.status==='accepted_source')){
 const prose=reviewed(source);
 if(source.kind==='selfCycle')composer.applySelf(data,prose,source.path);
 else if(source.kind==='planet')composer.applyPlanet(data,prose,source.path,'accepted_planet_family');
 else if(source.kind==='point')composer.applyPlanet(data,prose,source.path,'accepted_point_family');
 else if(source.kind==='axis')composer.applyAxis(data,prose,source.path,'accepted_axis_family');
 else throw Error('Unknown prose source kind '+source.kind);
}
// Reviewed full readings always take precedence over family composition.
const matrix=[];
for(const source of registry.fixedSources){for(const n of reviewed(source))matrix.push(Object.assign({editorialStatus:source.editorialStatus,proseSource:source.path},n));}
for(const source of matrix)for(const id of source.ids){const e=data.find(e=>e.id===id);if(!e)throw Error('Unknown representative id '+id);Object.assign(e,{title:source.title,summary:source.summary,text:source.text,nucleusId:source.ids[0],lens:'fullOverride',proseSource:source.proseSource,editorialStatus:source.editorialStatus});}
const missing=data.filter(e=>!e.editorialStatus.startsWith('accepted_')||!e.title||!e.text||!e.nucleusId||!e.lens);
if(missing.length)throw Error('Missing reviewed Chiron routes: '+missing.map(e=>e.id).join(', '));
if(new Set(data.map(e=>e.id)).size!==data.length)throw Error('Duplicate Chiron route');
const release=process.argv.includes('--release');
if(release){if(registry.releaseReady!==true)throw Error('Editorial release gate is closed');data.forEach(e=>e.status='approved');}
const counts=Object.fromEntries([...new Set(data.map(e=>e.editorialStatus))].map(k=>[k,data.filter(e=>e.editorialStatus===k).length]));
fs.writeFileSync(root+'/data/chiron-extensions.json',JSON.stringify({schemaVersion:1,releaseReady:release,policy:{minorAngles:[30,45,135,150],minorOrb:2,scoreContribution:false,interpretation:'symbolic',sources:X.policy.sources},entries:data},null,2)+'\n');
fs.writeFileSync(root+'/docs/chiron-content-review/coverage-manifest.json',JSON.stringify({releaseReady:release,reviewedScope:'Accepted source/model coverage is distinct from broad release approval. All output stays draft by default.',counts,sources:registry.sources,fixedSources:registry.fixedSources,nuclei:matrix.map(e=>({nucleusId:e.ids[0],ids:e.ids,editorialStatus:e.editorialStatus})),routes:data.map(e=>({id:e.id,nucleusId:e.nucleusId,lens:e.lens,proseSource:e.proseSource,editorialStatus:e.editorialStatus}))},null,2)+'\n');
console.log('Chiron stored contextual records:',data.length,Object.fromEntries(['natal','transit','synastry'].map(c=>[c,data.filter(e=>e.context===c).length])));
