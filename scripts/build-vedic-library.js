#!/usr/bin/env node
'use strict';
// Merge reviewed Vedic prose sources. Combinations are never counted as authored texts.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'content/vedic');
const files=['group-a.json','group-b.json','group-c.json','group-d.json','planets.json'];
const out={schemaVersion:1,charts:{},planets:{}};
for(const file of files){
 const data=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
 if(data.schemaVersion!==1)throw new Error('Unexpected schema: '+file);
 for(const section of ['charts','planets'])for(const [key,value] of Object.entries(data[section]||{})){
  if(out[section][key])throw new Error('Duplicate '+section+' key '+key);
  out[section][key]=value;
 }
}
const box={window:{}};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'assets/js/vedic-narratives.js'),'utf8'),box);
box.window.AqVedicNarratives.validate(out);
const countWords=s=>s.trim().split(/\s+/u).filter(Boolean).length;
const stats={chartViews:Object.keys(out.charts).length,chartIntroductions:0,applicableHouseReadings:0,planetSignContexts:0,planetRoles:0,authoredWords:0};
const leads=new Map(),paragraphs=new Map(),warnings=[];
function checkUnique(map,text,id){const clean=text.replace(/\s+/g,' ').trim();if(map.has(clean))throw new Error('Duplicate prose: '+id+' and '+map.get(clean));map.set(clean,id);}
for(const [key,c] of Object.entries(out.charts)){
 stats.chartIntroductions++;stats.authoredWords+=countWords(c.intro);
 const allowed=key==='2'?[1,2,12]:Array.from({length:12},(_,i)=>i+1);
 for(const [h,e] of Object.entries(c.houseReadings)){
  if(!allowed.includes(+h))throw new Error('Unreachable occupied-house content: '+key+'/'+h);
  const id='vedic.'+key+'.house.'+h;
  if(!e.lead.trim()||!e.paragraphs.every(p=>typeof p==='string'&&p.trim()))throw new Error('Empty prose: '+id);
  checkUnique(leads,e.lead,id+'.lead');e.paragraphs.forEach((p,i)=>checkUnique(paragraphs,p,id+'.paragraph.'+i));
  const words=countWords([e.lead,...e.paragraphs].join(' '));if(words<75||words>230)warnings.push({id,words});
  stats.applicableHouseReadings++;stats.authoredWords+=words;
 }
}
for(const [key,p] of Object.entries(out.planets)){
 if(typeof p.role!=='string'||!p.role.trim())throw new Error('Missing role '+key);
 stats.planetRoles++;stats.authoredWords+=countWords(p.role);
 for(const [s,t] of Object.entries(p.signs)){
  if(!/^([0-9]|10|11)$/.test(s)||!t.trim())throw new Error('Invalid sign '+key+'/'+s);
  checkUnique(paragraphs,t,'planet.'+key+'.sign.'+s);stats.planetSignContexts++;stats.authoredWords+=countWords(t);
 }
}
stats.authoredModules=stats.chartIntroductions+stats.applicableHouseReadings+stats.planetSignContexts+stats.planetRoles;
out.statistics=stats;
const target=path.join(root,'assets/data/vedic/chart-readings.json');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(out));
const version='vedic-'+crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex').slice(0,12);
const resolver=path.join(root,'assets/js/vedic-narratives.js');fs.writeFileSync(resolver,fs.readFileSync(resolver,'utf8').replace(/var VERSION = '[^']+';/,'var VERSION = \''+version+'\';'));
const libraryPage=path.join(root,'vedic-library.html');
let html=fs.readFileSync(libraryPage,'utf8');
for(const file of ['vedic-narratives.js','vedic-library-page.js']){
 const assetHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/js',file))).digest('hex').slice(0,12);
 html=html.replace(new RegExp('assets/js/'+file.replace('.','\\.')+'\\?v=[^"\\s]+','g'),'assets/js/'+file+'?v='+assetHash);
}
fs.writeFileSync(libraryPage,html);
fs.writeFileSync(path.join(dir,'coverage.json'),JSON.stringify({version,statistics:stats,wordRangeWarnings:warnings},null,2)+'\n');
console.log(JSON.stringify({version,...stats,wordRangeWarnings:warnings},null,2));
