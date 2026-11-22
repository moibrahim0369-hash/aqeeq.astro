'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const box={window:{addEventListener(){}},document:{addEventListener(){},querySelectorAll(){return []},getElementById(){return {}},body:{}},MutationObserver:class{observe(){}}};
vm.createContext(box);
for(const f of ['vedic-extras.js','vedic-chart.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js',f),'utf8'),box);
const VC=box.window.AqVedicChart;
function render({sun=0,mercury=1,retro=false,n=1,known=true}={}){
 const host={innerHTML:'',querySelectorAll(){return []}};
 const ch={known,asc:0,bodies:[{key:'sun',lon:sun},{key:'moon',lon:31},{key:'mercury',lon:mercury,retro}]};
 VC.mount(host,ch,null,n);return host.innerHTML;
}
function combust(o){return /محترق/.test(render(o));}
test('combustion follows proximity to Sun, not proximity to its opposition',()=>{
 assert.equal(combust({mercury:1}),true);assert.equal(combust({mercury:10}),true);
 assert.equal(combust({mercury:90}),false);assert.equal(combust({mercury:179}),false);assert.equal(combust({mercury:180}),false);
});
test('shortest separation wraps across zero Aries in either order',()=>{
 assert.equal(combust({sun:359,mercury:1}),true);assert.equal(combust({sun:1,mercury:359}),true);
 assert.equal(combust({sun:179,mercury:181}),true);
});
test('the existing Mercury direct/retrograde thresholds are preserved exactly',()=>{
 assert.equal(combust({mercury:14}),true);assert.equal(combust({mercury:14.01}),false);
 assert.equal(combust({mercury:12,retro:true}),true);assert.equal(combust({mercury:12.01,retro:true}),false);
});
test('physical combustion is displayed on natal/reference charts, not projected division longitudes',()=>{
 for(const n of [1,'moon','sun'])assert.equal(combust({mercury:1,n}),true);
 for(const n of [2,9,10,30,60])assert.equal(combust({mercury:1,n}),false);
});
test('unknown-time Moon-house fallback remains labelled and is not changed by the fix',()=>{
 const html=render({known:false});assert.ok(html.includes('وقت الميلاد غير معروف'));assert.ok(html.includes('بدل الطالع'));
});
