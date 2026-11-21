#!/usr/bin/env node
// Precalculate one-hour tropical positions from the same engine. Private numeric cache only.
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
(async()=>{const {default:Astro}=await import('../supabase/functions/_shared/astro-engine.js');const C=require('../assets/js/year2027-core.js'),keys=C.KEYS,start=C.START,end=C.END,step=3600000,rows=[];const t0=Date.now();
for(let t=start;t<=end;t+=step){const ch=Astro.chart({utcMs:t,lat:0,lon:0,known:false});rows.push(keys.map(k=>{var b=ch.bodies.find(b=>b.key===(k==='rahu'||k==='ketu'?'node':k));if(!b)throw Error('Missing '+k);return Number(C.norm(b.lon+(k==='ketu'?180:0)).toFixed(8));}));}
const out=process.env.AQEEQ_PRIVATE_DIR||'/tmp/aqeeq-private';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'ephemeris.json'),JSON.stringify({start,end,step,keys,rows}));console.log('Computed hourly engine samples:',rows.length,'in',Date.now()-t0,'ms');})().catch(e=>{console.error(e);process.exitCode=1;});
