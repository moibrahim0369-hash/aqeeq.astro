'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),{Astro,sandbox:box}=require('./helpers/production-page').loadAstro();
box.document={addEventListener(){},querySelectorAll(){return []},getElementById(){return {}},body:{}};box.MutationObserver=class{observe(){}};box.window.addEventListener=()=>{};box.norm=Astro.norm;
for(const f of ['vedic-extras.js','vedic-chart.js','vedic-narratives.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets/js',f),'utf8'),box);
const ext=fs.readFileSync(path.join(root,'assets/js/extended-astro-charts.js'),'utf8');
const extract=name=>{const match=ext.match(new RegExp('function '+name+'\\([^]*?\\n  \\}'));assert.ok(match,'extract current '+name);return match[0];};
vm.runInContext(['engineChart','ayanamsa','siderealChart'].map(extract).join('\n')+'\nwindow.AqEam={engineChart,ayanamsa,siderealChart};',box);
const E=box.window.AqEam,VC=box.window.AqVedicChart,N=box.window.AqVedicNarratives;
function input(utc='2000-01-01T10:00:00Z',lat=30,lon=31){const utcMs=Date.parse(utc);return {utcMs,ch:Astro.chart({utcMs,lat,lon,known:true,hs:'whole'})};}
test('real engine precision probe distinguishes stable and unstable high divisions',()=>{
 const natal=input(),sid=E.siderealChart(natal),expected={27:'stable',30:'stable',40:'changed',45:'changed',60:'changed'};
 for(const n of [27,30,40,45,60]){const map=VC.build(sid,n),result=N.stability(map,natal,.5);assert.equal(result.status,expected[n],'D'+n);assert.equal(result.samples,5);assert.equal(result.margin,.5);}
});
test('the probe preserves actual input chart and checks both sides of the recorded UTC',()=>{
 const natal=input('1985-02-28T23:55:00Z',51.5,-.12),saved=JSON.stringify(natal),map=VC.build(E.siderealChart(natal),60),seen=[];
 const result=N.stability(map,natal,2,{chartAt:ms=>{seen.push(ms);return E.siderealChart({ch:E.engineChart(ms,natal)});},build:VC.build});
 assert.equal(JSON.stringify(natal),saved);assert.deepEqual(seen,[natal.utcMs-120000,natal.utcMs-60000,natal.utcMs,natal.utcMs+60000,natal.utcMs+120000]);assert.ok(['stable','changed'].includes(result.status));
});
