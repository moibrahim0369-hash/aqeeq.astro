#!/usr/bin/env node
// Run locally with a secret-file path supplied by the authorized credential store.
// Never put the token, content JSON or source bundle into the public repository.
'use strict';const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=process.env.AQEEQ_PRIVATE_DIR||'/tmp/aqeeq-private',tokenFile=process.env.SUPABASE_ACCESS_TOKEN_FILE,ref=process.env.SUPABASE_PROJECT_REF||'trcveoewbxqzhhvzawxy';
if(!tokenFile)throw Error('SUPABASE_ACCESS_TOKEN_FILE is required');const token=fs.readFileSync(tokenFile,'utf8').trim();
async function query(query,parameters,read_only=false){const r=await fetch('https://api.supabase.com/v1/projects/'+ref+'/database/query',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({query,parameters,read_only})});const body=await r.text();if(!r.ok)throw Error('Supabase content upload failed: HTTP '+r.status);return JSON.parse(body);}
(async()=>{for(const [id,file] of [['current','year2027-content.json'],['sources','sources.json'],['ephemeris','ephemeris.json']]){
 const raw=fs.readFileSync(path.join(dir,file),'utf8');JSON.parse(raw);
 await query('insert into public.year2027_private_content(id,payload,updated_at) values($1,$2::jsonb,now()) on conflict(id) do update set payload=excluded.payload,updated_at=excluded.updated_at',[id,raw]);
 const check=await query('select payload=$2::jsonb as matches from public.year2027_private_content where id=$1',[id,raw],true);if(check[0]?.matches!==true)throw Error('Uploaded payload verification failed for '+id);
 console.log('Uploaded private artifact:',id,'bytes:',Buffer.byteLength(raw),'sha256:',crypto.createHash('sha256').update(raw).digest('hex'));
 }console.log('Private content upload complete. No customer content was printed.');})().catch(e=>{console.error(e.message);process.exitCode=1;});
