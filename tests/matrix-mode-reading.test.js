'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const adapter=require('../assets/js/matrix-method-adapter.js');
function modes(hostname='localhost',preview='free'){
 const box={window:{AqeeqMatrixMethodAdapter:adapter,location:{hostname},AQ_MATRIX_LOCAL_PREVIEW:preview},module:{exports:{}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/matrix-modes.js'),'utf8'),box);
 return box.module.exports;
}
function host(){return{innerHTML:'',hidden:true,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};}
test('Mode split renders free once and never includes paid or reflection before full preview',()=>{
 const M=modes(),s={free:'FREE <b>&',paid:'PAID',text:'LEGACY',reflection_question:'QUESTION'};
 const free=M.readingHtml(s,false),full=M.readingHtml(s,true);
 assert.match(free,/FREE &lt;b&gt;&amp;/);assert.ok(!/PAID|QUESTION|LEGACY/.test(free));
 assert.equal(full.split('FREE').length-1,1);assert.equal(full.split('PAID').length-1,1);assert.ok(full.includes('QUESTION'));assert.ok(!full.includes('LEGACY'));
 assert.ok(M.readingHtml(null,false).includes('role="status"'));
 assert.ok(!M.readingHtml({text:'PRIVATE_LEGACY',reflection_question:'ask'},false).includes('PRIVATE_LEGACY'));
});
test('Full editorial preview requires a local hostname, never global review flag',()=>{
 for(const h of ['localhost','127.0.0.1','[::1]'])assert.equal(modes(h,'full').localFullPreview(),true);
 for(const h of ['moibrahim0369-hash.github.io','aqeeq.example','localhost.attacker.example'])assert.equal(modes(h,'full').localFullPreview(),false);
 assert.equal(modes('localhost','free').localFullPreview(),false);
});
test('Child sections keep their own IDs and subtitles, without generic adult arcana blocks',()=>{
 const M=modes(),h=host();M.renderChild(h,'2017-08-19','');
 assert.equal((h.innerHTML.match(/data-reading-key=/g)||[]).length,20);
 assert.equal((h.innerHTML.match(/data-section-id="child-/g)||[]).length,8);
 assert.equal((h.innerHTML.match(/id="mxk-sec-/g)||[]).length,8);
 assert.ok(h.innerHTML.includes('ما الذي يطمئنه ويهدّئه؟'));assert.ok(!h.innerHTML.includes('ما الذي جمعكما في الأصل؟'));
 assert.ok(!h.innerHTML.includes('aqm-slot-strengths'));assert.ok(!h.innerHTML.includes('aqm-slot-challenges'));
});
test('Compatibility keeps 22 calculation-bound slots and separate section IDs',()=>{
 const M=modes(),h=host();M.renderPair(h,'1991-08-19','1990-04-12');
 assert.equal((h.innerHTML.match(/data-reading-key=/g)||[]).length,22);
 assert.equal((h.innerHTML.match(/data-section-id="pair-/g)||[]).length,11);
 assert.equal((h.innerHTML.match(/id="mxc-sec-/g)||[]).length,11);
 assert.ok(!h.innerHTML.includes('undefined'));
});
