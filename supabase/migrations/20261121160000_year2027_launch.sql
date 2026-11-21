-- Annual report is separate from full_report. No recurring plan and no automatic payment capture.
-- Apply after existing manual-payments migrations. Backend release is required before checkout appears.
begin;
insert into public.products(code,name_ar,amount_cents,currency,active,access_days) values
 ('year2027_egp_299','تقرير سنة 2027',29900,'EGP',true,null),
 ('year2027_egp_249','تقرير سنة 2027',24900,'EGP',true,null),
 ('year2027_sar_39','تقرير سنة 2027',3900,'SAR',true,null),
 ('year2027_aed_39','تقرير سنة 2027',3900,'AED',true,null),
 ('year2027_kwd_3_5','تقرير سنة 2027',3500,'KWD',true,null),
 ('year2027_qar_39','تقرير سنة 2027',3900,'QAR',true,null),
 ('year2027_bhd_4','تقرير سنة 2027',4000,'BHD',true,null),
 ('year2027_omr_4','تقرير سنة 2027',4000,'OMR',true,null),
 ('year2027_usd_sa','تقرير سنة 2027',1040,'USD',true,null),
 ('year2027_usd_ae','تقرير سنة 2027',1062,'USD',true,null),
 ('year2027_usd_kw','تقرير سنة 2027',1133,'USD',true,null),
 ('year2027_usd_qa','تقرير سنة 2027',1071,'USD',true,null),
 ('year2027_usd_bh','تقرير سنة 2027',1064,'USD',true,null),
 ('year2027_usd_om','تقرير سنة 2027',1040,'USD',true,null),
 ('year2027_usd_14_99','تقرير سنة 2027',1499,'USD',true,null)
on conflict(code) do nothing;
create table if not exists public.year2027_settings(id boolean primary key default true check(id),eg_price_test boolean not null default false);
insert into public.year2027_settings(id) values(true) on conflict do nothing;
alter table public.year2027_settings enable row level security;
revoke all on public.year2027_settings from anon,authenticated;
create table if not exists public.year2027_quotes(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 market text not null check(market in('EG','SA','AE','KW','QA','BH','OM','INT')), product_code text not null references public.products(code),
 amount_cents integer not null,currency text not null, created_at timestamptz not null default now(),expires_at timestamptz not null default now()+interval '24 hours'
);
create index if not exists year2027_quotes_user_idx on public.year2027_quotes(user_id,created_at desc);
alter table public.year2027_quotes enable row level security;
revoke all on public.year2027_quotes from anon,authenticated;
create table if not exists public.year2027_reports(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 input_key jsonb not null,input jsonb not null,quote_id uuid not null references public.year2027_quotes(id),
 manual_payment_id uuid not null unique references public.manual_payments(id),created_at timestamptz not null default now()
);
create index if not exists year2027_reports_user_idx on public.year2027_reports(user_id);
alter table public.year2027_reports enable row level security;
revoke all on public.year2027_reports from anon,authenticated;
create or replace function public.year2027_input_key(p_input jsonb) returns jsonb language sql immutable set search_path='' as $$
 select jsonb_build_object('date',p_input->>'date','time',case when coalesce((p_input->>'unknown')::boolean,false) then '' else coalesce(p_input->>'time','') end,'unknown',coalesce((p_input->>'unknown')::boolean,false),'city',p_input->>'city','utcMs',p_input->'utcMs','lat',p_input->'lat','lon',p_input->'lon');
$$;
revoke all on function public.year2027_input_key(jsonb) from public,anon,authenticated;
create or replace function public.year2027_quote(p_market text) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();v_code text;v_q public.year2027_quotes%rowtype;p public.products%rowtype;v_test boolean;
begin
 if u is null then raise exception 'not_authenticated';end if;
 if p_market not in('EG','SA','AE','KW','QA','BH','OM','INT') then raise exception 'invalid_market';end if;
 select eg_price_test into v_test from public.year2027_settings where id;
 v_code:=case p_market when 'SA' then 'year2027_usd_sa' when 'AE' then 'year2027_usd_ae' when 'KW' then 'year2027_usd_kw' when 'QA' then 'year2027_usd_qa' when 'BH' then 'year2027_usd_bh' when 'OM' then 'year2027_usd_om' when 'INT' then 'year2027_usd_14_99' else case when v_test and (('x'||substr(md5(u::text),1,8))::bit(32)::bigint % 2)=0 then 'year2027_egp_249' else 'year2027_egp_299' end end;
 select * into p from public.products where code=v_code and active;
 if not found then raise exception 'product_unavailable';end if;
 if not exists(select 1 from (values ('year2027_egp_299',29900,'EGP'),('year2027_egp_249',24900,'EGP'),('year2027_sar_39',3900,'SAR'),('year2027_aed_39',3900,'AED'),('year2027_kwd_3_5',3500,'KWD'),('year2027_qar_39',3900,'QAR'),('year2027_bhd_4',4000,'BHD'),('year2027_omr_4',4000,'OMR'),('year2027_usd_14_99',1499,'USD'),('year2027_usd_sa',1040,'USD'),('year2027_usd_ae',1062,'USD'),('year2027_usd_kw',1133,'USD'),('year2027_usd_qa',1071,'USD'),('year2027_usd_bh',1064,'USD'),('year2027_usd_om',1040,'USD')) as expected(code,amount,currency) where expected.code=p.code and expected.amount=p.amount_cents and expected.currency=p.currency) then raise exception 'price_mismatch';end if;
 insert into public.year2027_quotes(user_id,market,product_code,amount_cents,currency) values(u,p_market,p.code,p.amount_cents,p.currency) returning * into v_q;
 return jsonb_build_object('id',v_q.id,'product',v_q.product_code,'amount_cents',v_q.amount_cents,'currency',v_q.currency,'expires_at',v_q.expires_at,'payment_ready',p.currency in('EGP','USD'),'minor_unit',case when p.currency in('KWD','BHD','OMR') then 1000 else 100 end);
end $$;
revoke all on function public.year2027_quote(text) from public,anon;
grant execute on function public.year2027_quote(text) to authenticated;
create or replace function public.year2027_submit(p_quote uuid,p_input jsonb,p_method text,p_reference text) returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();q public.year2027_quotes%rowtype;m uuid;r uuid; k jsonb;
begin
 if u is null then raise exception 'not_authenticated';end if;
 if pg_catalog.pg_column_size(p_input)>8000 or coalesce(p_input->>'date','')!~'^[0-9]{4}-[0-9]{2}-[0-9]{2}$' or coalesce(p_input->>'city','')='' then raise exception 'invalid_input';end if;
 if coalesce((p_input->>'unknown')::boolean,true) or coalesce(p_input->>'time','')!~'^[0-9]{2}:[0-9]{2}$' then raise exception 'birth_time_required';end if;
 if p_method not in('wallet','paypal') then raise exception 'invalid_method';end if;
 select * into q from public.year2027_quotes where id=p_quote and user_id=u and expires_at>now() for update;
 if not found then raise exception 'quote_expired';end if;
 if not ((q.currency='EGP' and p_method='wallet') or (q.currency='USD' and p_method='paypal')) then raise exception 'currency_method_mismatch';end if;
 if not exists(select 1 from public.products p where p.code=q.product_code and p.active and p.amount_cents=q.amount_cents and p.currency=q.currency) then raise exception 'price_changed';end if;
 k:=public.year2027_input_key(p_input);
 if exists(select 1 from public.year2027_reports y join public.manual_payments mp on mp.id=y.manual_payment_id where y.user_id=u and y.input_key=k and mp.status in('pending','approved')) then raise exception 'already_submitted';end if;
 m:=public.submit_manual_payment(q.product_code,p_method,p_reference);
 insert into public.year2027_reports(user_id,input_key,input,quote_id,manual_payment_id) values(u,k,p_input,q.id,m) returning id into r;
 return r;
end $$;
revoke all on function public.year2027_submit(uuid,jsonb,text,text) from public,anon;
grant execute on function public.year2027_submit(uuid,jsonb,text,text) to authenticated;
create or replace function public.year2027_access(p_input jsonb) returns uuid language sql stable security definer set search_path='' as $$
 select r.id from public.year2027_reports r join public.manual_payments m on m.id=r.manual_payment_id join public.orders o on o.id=m.order_id
 where r.user_id=auth.uid() and r.input_key=public.year2027_input_key(p_input) and m.user_id=auth.uid() and o.user_id=auth.uid()
 and m.status='approved' and o.status='paid' and o.product_code in('year2027_egp_249','year2027_egp_299','year2027_sar_39','year2027_aed_39','year2027_kwd_3_5','year2027_qar_39','year2027_bhd_4','year2027_omr_4','year2027_usd_14_99','year2027_usd_sa','year2027_usd_ae','year2027_usd_kw','year2027_usd_qa','year2027_usd_bh','year2027_usd_om')
 and o.amount_cents=m.amount_cents and o.currency=m.currency
 and exists(select 1 from public.entitlements e where e.user_id=auth.uid() and e.product=o.product_code and e.status='active' and (e.expires_at is null or e.expires_at>now())) limit 1;
$$;
revoke all on function public.year2027_access(jsonb) from public,anon;
grant execute on function public.year2027_access(jsonb) to authenticated;
commit;
