'use strict';
const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto'),vm=require('vm'),cp=require('child_process'),assert=require('node:assert/strict'),root=path.resolve(__dirname,'..'),dir=path.join(__dirname,'fixtures/chiron-expanded');
const source=fs.readFileSync(root+'/assets/js/inline/page-06.js','utf8'),s={Astronomy:require('../astronomy.min.js'),window:{},module:{exports:{}},console};vm.runInNewContext(source.slice(0,source.indexOf('/* ============================== منطق الموقع')),s);const A=s.module.exports;
const provenance=require('./fixtures/chiron-expanded/provenance.json'),circular=(a,b)=>Math.abs(A.d180(a-b));let noon=0,worst=0;
for(const q of provenance.queries){const raw=zlib.gunzipSync(fs.readFileSync(dir+'/'+q.name+'.json.gz'));assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),q.sha256);const response=JSON.parse(raw);assert(response.result.includes('$$SOE'));assert(q.url.includes('500%40399'));assert(q.url.includes('QUANTITIES=%2731%27'));
 const rows=response.result.split('$$SOE')[1].split('$$EOE')[0].trim().split(/\r?\n/).map(line=>{const cols=line.split(',');return [Number(cols[0]),Number(cols[3])];});assert(rows.length>0);
 for(const[jd,lon]of rows){assert(Number.isFinite(jd)&&Number.isFinite(lon));const val=A.lonOf('chiron',jd+A.deltaT(A.yearOf(jd))/86400),err=circular(val,lon)*3600;assert(Number.isFinite(val));if(q.name.endsWith('-12')){noon++;worst=Math.max(worst,err);assert(err<1.5);}else assert(err<.02);}
}
assert.equal(noon,29220);assert(worst<1.143);
const old=cp.execFileSync('git',['show','f334bf0:assets/js/inline/page-06.js'],{cwd:root,encoding:'utf8',maxBuffer:8e6}),extract=t=>/const CHIRON_TAB = "([a-z0-9]+)";/.exec(t)[1];assert.equal(extract(old).length/5,44197);assert.equal(extract(source).length/5,73418);assert(extract(source).includes(extract(old)),'old encoded samples changed');
const u=provenance.uranusExample;assert.equal(u.forced,false);assert.equal(u.existingOrbDegrees,8);assert(circular(u.samples[0].lon,u.samples[1].lon)<.005);
console.log('PASS expanded Chiron: 29220 independently requested noon samples, max '+worst.toFixed(6)+' arcsec; daily source/UT buffers; all raw NASA response hashes; 44197 encoded original samples preserved. Sampled agreement is not an arbitrary-instant guarantee.');
