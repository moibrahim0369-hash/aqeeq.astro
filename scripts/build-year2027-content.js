#!/usr/bin/env node
/* Compile editorial sources into a customer-safe payload. Never render Markdown source. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),base=process.env.AQEEQ_CONTENT_DIR||path.join(root,'content-sources');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const planets=['saturn','jupiter','rahu','ketu','mars','venus','sun','moon','mercury'];
const clean=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/\(\s*\)/g,'').replace(/[\*`]/g,'').replace(/^[>\-]\s*/gm,'').replace(/\u2014/g,'،').replace(/\s+/g,' ').replace(/\s+([،.?!؛:])/g,'$1').trim();
const withoutDates=s=>clean(s).replace(/(?:ومن|من|في|قبل|بعد)?\s*\d{1,2}\s+(?:يناير|فبراير|مارس|أبريل|ابريل|مايو|يونيو|يوليو|أغسطس|اغسطس|سبتمبر|أكتوبر|اكتوبر|نوفمبر|ديسمبر)(?:\s+202[67])?/g,' خلال هذه الفترة').replace(/\d+(?:\.\d+)?\s*°/g,'').trim();
function field(s,label){const m=s.match(new RegExp('\\*\\*'+label+'[^*]*\\*\\*([^\\n]+)'));return m?clean(m[1]).replace(/^:\s*/,''):'';}
function body(s,closing=false){
  const title=(s.match(/^### (.+)$/m)||[])[1]||'';
  const paragraphs=s.split(/\n\s*\n/).filter(p=>{
    const t=p.trim();return t&&!/^(?:#|---|\[|>|\*\*(?:بنر|الحالة|طبقة|خطوتك|سؤالك|الواقع|الحوار|مشاهد|النسيج|\())/.test(t);
  }).map(p=>closing?withoutDates(p):clean(p)).filter(Boolean);
  // Preserve the approved literary subheadings instead of flattening them away.
  const sections=[],introParagraphs=[];let active=null;
  const opening=field(s,'النسيج العام');if(opening)introParagraphs.push(opening);
  if(/^####\s+/m.test(s)){
    for(const chunk of s.split(/\n\s*\n/)){
      const lines=chunk.trim().split('\n'),heading=lines[0].match(/^####\s+(.+)$/);
      if(heading){active={heading:clean(heading[1]),paragraphs:[]};sections.push(active);lines.shift();}
      const prose=lines.join('\n').trim();
      if(!prose||/^(?:#|---|\[|>|\*\*)/.test(prose))continue;
      const text=closing?withoutDates(prose):clean(prose);
      if(text)(active?active.paragraphs:introParagraphs).push(text);
    }
    paragraphs.splice(0,paragraphs.length,...introParagraphs,...sections.flatMap(x=>x.paragraphs));
  }
  const inner=(s.match(/\*\*الحوار الداخلي:\*\*\s*\n>\s*([^\n]+)/)||[])[1]||'';
  const axis=(s.match(/\[طبقة المحور:\s*«([^»]+)»\]/)||[])[1]||'';
  if(axis){const text=clean(axis);paragraphs.push(text);if(sections.length)sections.push({heading:'الطرف الآخر من الحكاية',paragraphs:[text]});}
  return {title:clean(title.split(':').slice(1).join(':')||title),paragraphs,action:field(s,'خطوتك'),question:field(s,'سؤالك'),dialogue:clean(inner||''),axis:clean(axis),...(sections.length?{sections,introParagraphs}:{})};
}
const lex=JSON.parse(read('lexicon/lexicon.json'));
const data={version:1,templates:{},lordship:{},closing:[],dasha:[],topics:{},closingMeta:[]};
const audit={templates:0,closing:0,dasha:0,sources:[],lexiconFiles:lex.files.length};
for(const k of planets){
  const file='library-2027/'+k+'-templates.md',raw=read(file);
  const sections=raw.split(/^## (?:القالب \d+:|قالب )[^\n]*\n/gm).slice(1);
  if(sections.length!==12)throw new Error(k+': expected twelve house templates, got '+sections.length);
  data.templates[k]=sections.map((s,i)=>{
    const b=body(s);if(b.paragraphs.length<2||!b.action||!b.question)throw new Error(k+': incomplete template '+(i+1));
    const ids=(lex.house_map[String(i+1)]||[]).filter(id=>lex.files.some(f=>f.id===id&&(f.type==='عام'||['saturn','rahu','ketu','mars','venus','moon'].includes(k))));
    if(!ids.length)throw new Error('Missing lexicon mapping');
    audit.templates++;return b;
  });audit.sources.push(file);
  const lp='library-2027/'+k+'-lordship-layer.md';
  if(fs.existsSync(path.join(base,lp))){
    data.lordship[k]=read(lp).split(/^## طالع [^\n]*\n/gm).slice(1).map(s=>clean(s.split(/\n---/)[0]));
    if(data.lordship[k].length!==12)throw new Error('Incomplete lordship '+k);
  }
}
for(let i=1;i<=12;i++){
  const raw=read('closing-2026-2027/lagnas/lagna-'+String(i).padStart(2,'0')+'.md').replace(/<!--[\s\S]*?-->/g,'');
  const sections=raw.split(/^## \d+\. [^\n]*\n/gm).slice(1);
  const retrospective=/^# (?:مراجعة|ملخص) 2026/m.test(raw);
  const closingTitles=[...raw.matchAll(/^## \d+\. (.+)$/gm)].map(x=>x[1]);
  if(retrospective){const facts=JSON.parse(read('closing-2026-2027/year2026-engine.json'));data.closingMeta[i-1]={year:2026,s:Date.UTC(2025,11,31,22),e:Date.UTC(2026,11,31,22),houses:Object.fromEntries(['saturn','jupiter','rahu','mars','mercury'].map(k=>[k,[...new Set(facts.segments[k].map(x=>(x.sign-(i-1)+12)%12+1))]]))};}
  if(sections.length<1)throw new Error('Empty closing '+i);
  if(sections.length>5)throw new Error('Unexpected closing structure '+i);
  if(retrospective)data.closingMeta[i-1].count=sections.length;
  data.closing.push(sections.map((s,idx)=>{
    const scene=(s.match(/\*\*الواقع النفسي واليومي:\*\*([\s\S]*?)\*\*الحوار الداخلي:/)||[])[1]||'';
    const b=body(s,true);if(!b.sections){const bullets=scene.split('\n').map(x=>x.trim()).filter(x=>x.startsWith('- '));b.paragraphs=bullets.map(withoutDates);if(bullets.some(x=>/^- \*\*/.test(x))){b.introParagraphs=[];b.sections=[];for(const raw of bullets){const m=raw.match(/^- \*\*([^*]+)\*\*\s*(.*)$/);if(m)b.sections.push({heading:withoutDates(m[1]).replace(/:$/,''),paragraphs:[withoutDates(m[2])]});else b.introParagraphs.push(withoutDates(raw));}b.paragraphs=[...b.introParagraphs,...b.sections.flatMap(x=>x.paragraphs)];}}
    b.title=b.title||clean(closingTitles[idx]);b.action=withoutDates(b.action);b.question=withoutDates(b.question);audit.closing++;return b;
  }));
}
const lordOrder=['ketu','venus','sun','moon','mars','rahu','jupiter','saturn','mercury'];
for(let i=0;i<9;i++){
  const raw=read('closing-2026-2027/dasha/antar-'+String(i+1).padStart(2,'0')+'-'+lordOrder[i]+'.md');
  const b=body(raw);if(!b.sections)b.paragraphs=[field(raw,'النسيج العام'),...((raw.match(/\*\*مشاهد من الواقع اليومي:\*\*([\s\S]*?)\*\*الحوار الداخلي:/)||[])[1]||'').split('\n').filter(x=>x.trim().startsWith('- ')).map(clean)].filter(Boolean);
  data.dasha.push(b);audit.dasha++;
}
// Only general, house-matched examples enter the Jupiter fallback. No raw shadow records.
for(let h=1;h<=12;h++){
  const ids=lex.house_map[String(h)];const f=lex.files.find(f=>ids.includes(f.id)&&f.type==='عام'&&f.example);
  data.topics[h]=f?clean(f.example):'';
}
const focusedFile=path.join(base,'focused','reading-2027.json');if(fs.existsSync(focusedFile)){data.focused=JSON.parse(fs.readFileSync(focusedFile,'utf8'));const F=require('../assets/js/year2027-focused.js');F.validate(data.focused);}
const serialized=JSON.stringify(data);
function check(v,p=''){if(typeof v==='string'&&/\[طبقة|\{[^}]+\}|ملفات السحب|<!--|ملاحظة هندسية/.test(v))throw new Error('Internal marker at '+p);else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>check(x,p+'.'+k));}check(data);
data.revision=crypto.createHash('sha256').update(serialized).digest('hex').slice(0,16);
const privateDir=process.env.AQEEQ_PRIVATE_DIR||'/tmp/aqeeq-private';fs.mkdirSync(privateDir,{recursive:true});fs.writeFileSync(path.join(privateDir,'year2027-content.json'),JSON.stringify(data));
const sources={};function collect(dir,prefix=''){for(const file of fs.readdirSync(dir,{withFileTypes:true})){const rel=prefix+file.name;if(file.isDirectory())collect(path.join(dir,file.name),rel+'/');else sources[rel]=fs.readFileSync(path.join(dir,file.name),'utf8');}}collect(base);fs.writeFileSync(path.join(privateDir,'sources.json'),JSON.stringify(sources));
fs.mkdirSync(path.join(root,'data/year2027'),{recursive:true});fs.writeFileSync(path.join(root,'data/year2027/build-audit.json'),JSON.stringify({...audit,revision:data.revision},null,2)+'\n');
console.log('Compiled privately:',audit.templates,'templates,',audit.closing,'closing sections,',audit.dasha,'dasha readings; revision',data.revision);
