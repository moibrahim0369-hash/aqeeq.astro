import { createClient } from 'npm:@supabase/supabase-js@2';
/* Karmic tail report: the full text lives only in the private table karmic_content (service role).
   A client gets it only when it is signed in AND karmic_access(date) says this user has an approved, paid order for that
   birth date (or the account passes is_app_admin). Anything else answers 401 or 403. */
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'private, no-store'};
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});

type Block={t:'p',text:string}|{t:'ul',items:string[]}|{t:'h',text:string};
/* Small markdown reader for the report files: "# title", "شفرة:" line, "## section", "### sub", "- item", paragraphs. */
export function parseReport(md:string){
 const lines=md.replace(/\r/g,'').split('\n');
 let title='',tagline='';const intro:Block[]=[];const sections:{title:string,blocks:Block[]}[]=[];
 let cur:Block[]=intro,para:string[]=[],list:string[]=[];
 const flush=()=>{if(para.length){cur.push({t:'p',text:para.join(' ')});para=[];}if(list.length){cur.push({t:'ul',items:list});list=[];}};
 for(const raw of lines){
  const line=raw.trim();
  if(/^# /.test(line)&&!title){title=line.slice(2).trim();continue;}
  if(/^شفرة:/.test(line)&&!tagline){tagline=line.replace(/^شفرة:\s*/,'').trim();continue;}
  if(/^## /.test(line)){flush();const s={title:line.slice(3).trim(),blocks:[] as Block[]};sections.push(s);cur=s.blocks;continue;}
  if(/^### /.test(line)){flush();cur.push({t:'h',text:line.slice(4).trim()});continue;}
  if(/^[-*] /.test(line)){if(para.length){cur.push({t:'p',text:para.join(' ')});para=[];}list.push(line.slice(2).trim());continue;}
  if(line===''){flush();continue;}
  if(list.length){cur.push({t:'ul',items:list});list=[];}
  para.push(line);
 }
 flush();
 return {title,tagline,intro,sections};
}

Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});if(req.method!=='POST')return response({error:'method_not_allowed'},405);
 try{
  const raw=await req.text();if(raw.length>2000)return response({error:'invalid_input'},400);let body;try{body=JSON.parse(raw);}catch{return response({error:'invalid_input'},400);}
  const date=String(body?.date||'');if(body?.mode!=='report'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return response({error:'invalid_input'},400);
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown';const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('karmic|'+ip+'|'+new Date().toISOString().slice(0,10))))).map(b=>b.toString(16).padStart(2,'0')).join('');
  const rate=await admin.rpc('year2027_rate_limit',{p_key:digest,p_limit:60});if(rate.error||rate.data!==true)return response({error:'too_many_requests'},429);
  const authz=req.headers.get('Authorization')||'',token=authz.replace(/^Bearer\s+/i,'').trim();
  if(!token||token.split('.').length!==3)return response({error:'sign_in_required'},401);
  const sb=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data:ud,error:userError}=await admin.auth.getUser(token);if(userError||!ud?.user)return response({error:'sign_in_required'},401);
  let ownerPreview=false;{const {data:isOwner,error:ownerError}=await sb.rpc('is_app_admin');ownerPreview=!ownerError&&isOwner===true;}
  const {data:access,error:denied}=await sb.rpc('karmic_access',{p_date:date});if(!ownerPreview&&(denied||!access))return response({error:'karmic_not_purchased'},403);
  const {data:code}=await admin.rpc('karmic_code_for',{p_date:date});if(!code)return response({error:'report_unavailable'},404);
  const {data:row,error:readError}=await admin.from('karmic_content').select('body').eq('code',code).maybeSingle();if(readError||!row?.body)return response({error:'report_unavailable'},404);
  return response({code,ownerPreview,report:parseReport(row.body)});
 }catch{return response({error:'report_temporarily_unavailable'},500);}
});
