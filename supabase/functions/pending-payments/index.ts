import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
async function valid(req:Request){const expected=Deno.env.get('OWNER_MONITOR_KEY'),got=req.headers.get('x-owner-monitor-key')||'';if(!expected||!got||got.length>256)return false;const enc=new TextEncoder(),a=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(expected))),b=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(got)));let n=0;for(let i=0;i<a.length;i++)n|=a[i]^b[i];return n===0;}
Deno.serve(async(req:Request)=>{try{
 if(!await valid(req))return json({error:'unauthorized'},401);
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
 if(req.method==='GET'){const {data,error}=await admin.rpc('owner_pending_payments');if(error)throw Error('list_failed');return json({payments:data||[]});}
 if(req.method==='POST'){if(Number(req.headers.get('content-length')||0)>10000)return json({error:'too_large'},413);const body=await req.json(),ids=body.ids;if(body.action!=='ack'||!Array.isArray(ids)||ids.length>100||ids.some((id:unknown)=>typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)))return json({error:'invalid_request'},400);const {data,error}=await admin.rpc('owner_ack_payments',{p_ids:ids});if(error)throw Error('ack_failed');return json({acknowledged:data});}
 return json({error:'method_not_allowed'},405);
 }catch(_){return json({error:'request_failed'},500);}});
