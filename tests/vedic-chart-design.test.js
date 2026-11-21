'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const box={window:{addEventListener(){}},document:{addEventListener(){},querySelectorAll(){return []},getElementById(){return {}},body:{}},MutationObserver:class{observe(){}}};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/vedic-chart.js'),'utf8'),box);const VC=box.window.AqVedicChart;
test('all 12 ascending signs keep fixed houses, Arabic names, sign glyphs and their sign-based fills',()=>{
 for(let lagna=0;lagna<12;lagna++){
  const m={n:9,lagna,basis:'asc',items:[]},s=VC.svg(m,'الخريطة');assert.equal((s.match(/class="vc-house"/g)||[]).length,12);assert.equal((s.match(/class="vc-sign-label"/g)||[]).length,12);
  for(let h=0;h<12;h++)assert.ok(s.includes('data-house="'+(h+1)+'" data-sign="'+((lagna+h)%12)+'"'));assert.ok(s.includes('vc-medallion'));assert.ok(s.includes('D9'));
 }
});
test('no planet is dropped in any possible all-nine-body cluster or lagna house',()=>{
 for(let house=0;house<12;house++){
  const m={n:2,lagna:0,basis:'asc',items:VC.PL.map(p=>({key:p[0],name:p[1],ab:p[2],house,sign:house,retro:true}))},s=VC.svg(m,'المال');assert.equal((s.match(/class="vc-body"/g)||[]).length,10,'cluster in house '+(house+1));
  for(const p of VC.PL)assert.ok(s.includes('data-planet="'+p[0]+'"'));assert.ok(s.includes('℞'));
 }
});
test('medallions distinguish annual, lunar, solar and divisional charts and escape their content',()=>{
 const m={n:1,lagna:0,basis:'asc',items:[]};assert.ok(VC.svg(m,'العودة','2027').includes('>2027</text>'));
 for(const [n,label] of [['moon','القمر'],['sun','الشمس'],[60,'D60']])assert.ok(VC.svg({...m,n},'الخريطة').includes('>'+label+'</text>'));
 const s=VC.svg(m,'<bad>','<script>');assert.ok(!s.includes('<script>'));assert.ok(s.includes('&lt;script&gt;'));
});
test('southern fixed-sign layout is left unchanged',()=>{const s=VC.svgSouth({n:1,lagna:0,basis:'asc',items:[]},'الجنوبي');assert.ok(!s.includes('vc-north'));assert.ok(s.includes('D1'));});
