'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root=require('path').resolve(__dirname,'..'),Astronomy=require('../astronomy.min.js');
let source=fs.readFileSync(root+'/assets/js/inline/page-06.js','utf8');source=source.slice(0,source.indexOf('/* ============================== منطق الموقع'));
const engine={Astronomy,window:{},module:{exports:{}},console};vm.runInNewContext(source,engine);const A=engine.module.exports;
function personal(src){const c={Astro:A,window:{Astronomy},console,Date,document:{readyState:'loading',addEventListener(){}}};vm.runInNewContext(src,c);return c.window.AqeqPersonalTransits;}
const old=personal(cp.execFileSync('git',['show','f334bf0:assets/js/personal-transits.js'],{cwd:root,encoding:'utf8'})),now=personal(fs.readFileSync(root+'/assets/js/personal-transits.js','utf8'));
for(const date of['1800-01-01','1899-01-01','2102-01-01','2150-01-01']){
 const d=new Date(date+'T12:00:00Z'),n=now.calculateTransits([{key:'Sun',lon:0}],d);assert(n.missingChiron);assert(!n.transits.some(b=>b.key==='Chiron'));assert(!n.aspects.some(a=>a.transit.key==='Chiron'));
}
for(const date of['1964-03-05','1999-09-25','2026-11-22']){
 const d=new Date(date+'T12:00:00Z'),a=old.calculateTransits([{key:'Sun',lon:0}],d),b=now.calculateTransits([{key:'Sun',lon:0}],d);assert(!b.missingChiron);assert.deepEqual(JSON.parse(JSON.stringify(a.transits)),JSON.parse(JSON.stringify(b.transits)));assert.deepEqual(JSON.parse(JSON.stringify(a.aspects)),JSON.parse(JSON.stringify(b.aspects)));
}
const end=now.calculateTransits([{key:'Sun',lon:254.16}],new Date('2101-01-02T00:00:00Z'));assert(end.aspects.some(a=>a.transit.key==='Chiron'&&a.state==='Uncertain'));
const DAY=864e5,center=Date.UTC(2026,0,1);let fallbackCalls=0;
function cycles(halfCoverage,step){
 const c={Number,Date,window:{AqeqPersonalTransits:{calculateTransits(){fallbackCalls++;return{transits:[{key:'Chiron',lon:0,approximate:true}]};}}},Astro:{chart({utcMs}){const d=(utcMs-center)/DAY;return{bodies:Math.abs(d)<=halfCoverage?[{key:'chiron',lon:((d*step)%360+360)%360}]:[]};}}};
 vm.runInNewContext(fs.readFileSync(root+'/assets/js/you-cycles.js','utf8'),c);return c.window.AqeeqYou.cycles({known:false,bodies:[{key:'sun',lon:0}]},center);
}
assert.equal(cycles(20,.01).filter(c=>c.t==='chiron').length,0,'truncated data must not create cycle edges');
assert(cycles(200,.1).some(c=>c.t==='chiron'&&c.asp==='conj'),'complete in-range cycle must remain');
assert.equal(cycles(-1,.1).length,0);assert.equal(fallbackCalls,0,'cycle engine must not import approximate fallback');
console.log('PASS fail-closed Chiron candidate: 4 unsupported dates omitted, 3 supported dashboards exact, endpoint approach uncertain, no fallback leakage, no source-edge fake cycle, complete cycle retained.');
