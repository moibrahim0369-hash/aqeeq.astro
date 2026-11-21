import { createClient } from 'npm:@supabase/supabase-js@2';
import {previewFor,reportFor,validateInput} from '../_shared/year2027-report.js';
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'private, no-store'};
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
let cached:{content:any,ephemeris:any,loaded:number}|null=null;
async function library(admin:any,full:boolean){
 if(cached&&Date.now()-cached.loaded<300000&&(!full||cached.ephemeris))return cached;
 const {data,error}=await admin.from('year2027_private_content').select('id,payload').in('id',full?['current','ephemeris']:['current']);if(error||!data)throw new Error('content_unavailable');
 const content=data.find((r:any)=>r.id==='current')?.payload,ephemeris=data.find((r:any)=>r.id==='ephemeris')?.payload;
 if(!content||full&&!ephemeris)throw new Error('content_unavailable');cached={content,ephemeris,loaded:Date.now()};return cached;
}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});if(req.method!=='POST')return response({error:'method_not_allowed'},405);
 try{
  const raw=await req.text();if(raw.length>10000)return response({error:'invalid_input'},400);let body;try{body=JSON.parse(raw);}catch{return response({error:'invalid_input'},400);}
  const country=(req.headers.get('cf-ipcountry')||'').toUpperCase();const geo=/^[A-Z]{2}$/.test(country)?country:null;
  if(body.mode==='market')return response({country:geo,source:geo?'network_header':'manual_selection_required'});
  const input=body.input;try{validateInput(input);}catch{return response({error:'invalid_input'},400);}
  const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_ANON_KEY')!,admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+'|'+new Date().toISOString().slice(0,10))))).map(b=>b.toString(16).padStart(2,'0')).join('');
  const rate=await admin.rpc('year2027_rate_limit',{p_key:digest,p_limit:body.mode==='preview'?30:60});if(rate.error||rate.data!==true)return response({error:'too_many_requests'},429);
  if(body.mode==='preview'){const lib=await library(admin,false);return response({...previewFor(input,lib.content),country:geo});}
  const sb=createClient(url,key,{global:{headers:{Authorization:req.headers.get('Authorization')||''}},auth:{persistSession:false}});
  const {data:{user},error}=await sb.auth.getUser();if(error||!user)return response({error:'sign_in_required'},401);
  const {data:access,error:denied}=await sb.rpc('year2027_access',{p_input:input});if(denied||!access)return response({error:'annual_report_not_purchased'},403);
  const lib=await library(admin,true);return response({report:reportFor(input,lib.content,lib.ephemeris),reportId:access});
 }catch{return response({error:'report_temporarily_unavailable'},500);}
});
