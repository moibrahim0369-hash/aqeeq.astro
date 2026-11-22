'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),box={window:{},document:{addEventListener(){}}};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'assets/js/vedic-extras.js'),'utf8'),box);const div=box.window.AqVedic.div;
// Named Raman Ekadasamsa convention, not the reflected-forward Rath convention.
// Sources: docs/vedic/narratives.md. Each row lists its11 parts from low to high degree.
const rows=[
 [11,10,9,8,7,6,5,4,3,2,1],
 [0,11,10,9,8,7,6,5,4,3,2],
 [1,0,11,10,9,8,7,6,5,4,3],
 [2,1,0,11,10,9,8,7,6,5,4],
 [3,2,1,0,11,10,9,8,7,6,5],
 [4,3,2,1,0,11,10,9,8,7,6],
 [5,4,3,2,1,0,11,10,9,8,7],
 [6,5,4,3,2,1,0,11,10,9,8],
 [7,6,5,4,3,2,1,0,11,10,9],
 [8,7,6,5,4,3,2,1,0,11,10],
 [9,8,7,6,5,4,3,2,1,0,11],
 [10,9,8,7,6,5,4,3,2,1,0]
];
test('all132 D11 sign/part anchors retain the natal source-sign term',()=>{const reached=new Set();for(let s=0;s<12;s++)for(let p=0;p<11;p++){const got=div(s*30+(p+.5)*30/11,11);assert.equal(got,rows[s][p],'source'+s+' part'+p);reached.add(got);}assert.equal(reached.size,12);});
test('D11 changes to the correct adjacent part on both sides of each internal boundary',()=>{for(let s=0;s<12;s++)for(let p=1;p<11;p++){const edge=s*30+p*30/11;assert.equal(div(edge-1e-7,11),rows[s][p-1]);assert.equal(div(edge+1e-7,11),rows[s][p]);}});
test('D11 normalized longitudes wrap and opposite nodes stay opposite',()=>{for(let i=0;i<3600;i++){const lon=i/10+.003,a=div(lon,11),b=div(lon+180,11);assert.equal((b-a+12)%12,6);assert.equal(div(lon+360,11),a);assert.equal(div(lon-360,11),a);}});
