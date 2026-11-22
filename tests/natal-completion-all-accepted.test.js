'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict'),A=require('../assets/js/interpretation-library.js');
const proof=[...require('./fixtures/natal-completion-packet1-hashes.json').rows,...require('./fixtures/natal-completion-accepted-additions-hashes.json').rows],dir=path.join(__dirname,'../data/interpretations');
const all=fs.readdirSync(dir).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f)))),ix=A.indexOf([all]);
assert.equal(new Set(proof.map(e=>e.id)).size,proof.length);
const inspect=s=>Object.values(s).map(v=>v&&typeof v==='object'?Object.values(v).join(''):v).join('');
for(const p of proof){const e=ix[p.id];assert(e,p.id);for(const k of ['title','summary','text'])assert.equal(crypto.createHash('sha256').update(e[k]).digest('hex'),p[k+'_sha256'],p.id+' changed '+k);
 const sign=A.SIGN_EN.indexOf(e.sign),lon=sign<0?3:sign*30+3,ch={known:true,bodies:[],cusps:Array.from({length:12},(_,i)=>i*30+3),asc:3,mc:273};
 const body=(key,long=lon,house=e.house||1,retro=false)=>({key,lon:long,house,retro});
 switch(e.layer){
 case 'sign_only': ch.known=e.body==='fortune';ch.bodies=[body(e.body)];break;
 case 'modifier':ch.known=false;ch.bodies=[body(e.body,3,1,true)];break;
 case 'house_cusp':ch.cusps[e.house-1]=lon;break;
 case 'angle':if(e.body==='asc')ch.asc=lon;if(e.body==='dsc')ch.asc=lon-180;if(e.body==='mc')ch.mc=lon;if(e.body==='ic')ch.mc=lon-180;break;
 case 'aspect':{const [type,other]=e.aspect.split('.');ch.known=false;ch.bodies=[body(e.body,0),body(other,A.ASPECTS.find(a=>a.slug===type).ang)];break;}
 case 'stellium':ch.known=!!e.house;ch.bodies=A.PLANETS.slice(0,3).map((k,i)=>body(k,lon+i,e.house||1));break;
 case 'sign_tint':ch.bodies=[body(e.body)];break;
 case 'house_blend':ch.bodies=[body(e.planet,3,e.house)];break;
 default:throw Error('New accepted layer needs an explicit display fixture: '+e.layer);
 }
 if(e.body==='north_node'||e.body==='south_node')ch.bodies=[body('true_node',lon-(e.body==='south_node'?180:0))];
 const html=inspect(A.sections(A.build({ch}),ix));assert(html.includes('data-il-id="'+e.id+'"'),e.id+' unreachable');assert(html.includes(A.renderText(e.text)),e.id+' incomplete rendered body');
}
console.log('PASS all '+proof.length+' explicitly accepted completion entries: source hashes, exact key-specific display routing, complete rendered bodies; no other draft implicitly approved');
