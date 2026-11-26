-- Outside Egypt: one price, 9 USD via PayPal. Egypt stays 299 EGP. Old product rows stay in the table, unused.
begin;
insert into public.products(code,name_ar,amount_cents,currency,active,access_days) values ('year2027_usd_9','تقرير سنة 2027',900,'USD',true,null) on conflict(code) do nothing;
create or replace function public.year2027_quote(p_market text) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();v_code text;v_q public.year2027_quotes%rowtype;p public.products%rowtype;
begin
 if u is null then raise exception 'not_authenticated';end if;
 if p_market not in('EG','SA','AE','KW','QA','BH','OM','INT') then raise exception 'invalid_market';end if;
 v_code:=case when p_market='EG' then 'year2027_egp_299' else 'year2027_usd_9' end;
 select * into p from public.products where code=v_code and active;
 if not found then raise exception 'product_unavailable';end if;
 if not exists(select 1 from (values ('year2027_egp_299',29900,'EGP'),('year2027_egp_249',24900,'EGP'),('year2027_sar_39',3900,'SAR'),('year2027_aed_39',3900,'AED'),('year2027_kwd_3_5',3500,'KWD'),('year2027_qar_39',3900,'QAR'),('year2027_bhd_4',4000,'BHD'),('year2027_omr_4',4000,'OMR'),('year2027_usd_14_99',1499,'USD'),('year2027_usd_9',900,'USD'),('year2027_usd_sa',1040,'USD'),('year2027_usd_ae',1062,'USD'),('year2027_usd_kw',1133,'USD'),('year2027_usd_qa',1071,'USD'),('year2027_usd_bh',1064,'USD'),('year2027_usd_om',1040,'USD')) as expected(code,amount,currency) where expected.code=p.code and expected.amount=p.amount_cents and expected.currency=p.currency) then raise exception 'price_mismatch';end if;
 insert into public.year2027_quotes(user_id,market,product_code,amount_cents,currency) values(u,p_market,p.code,p.amount_cents,p.currency) returning * into v_q;
 return jsonb_build_object('id',v_q.id,'product',v_q.product_code,'amount_cents',v_q.amount_cents,'currency',v_q.currency,'expires_at',v_q.expires_at,'payment_ready',p.currency in('EGP','USD'),'minor_unit',case when p.currency in('KWD','BHD','OMR') then 1000 else 100 end);
end $$;
revoke all on function public.year2027_quote(text) from public,anon;
grant execute on function public.year2027_quote(text) to authenticated;

create or replace function public.year2027_access(p_input jsonb) returns uuid language sql stable security definer set search_path='' as $$
 select r.id from public.year2027_reports r join public.manual_payments m on m.id=r.manual_payment_id join public.orders o on o.id=m.order_id
 where r.user_id=auth.uid() and r.input_key=public.year2027_input_key(p_input) and m.user_id=auth.uid() and o.user_id=auth.uid()
 and m.status='approved' and o.status='paid' and o.product_code in('year2027_egp_249','year2027_egp_299','year2027_sar_39','year2027_aed_39','year2027_kwd_3_5','year2027_qar_39','year2027_bhd_4','year2027_omr_4','year2027_usd_14_99','year2027_usd_9','year2027_usd_sa','year2027_usd_ae','year2027_usd_kw','year2027_usd_qa','year2027_usd_bh','year2027_usd_om')
 and o.amount_cents=m.amount_cents and o.currency=m.currency
 and exists(select 1 from public.entitlements e where e.user_id=auth.uid() and e.product=o.product_code and e.status='active' and (e.expires_at is null or e.expires_at>now())) limit 1;
$$;
revoke all on function public.year2027_access(jsonb) from public,anon;
grant execute on function public.year2027_access(jsonb) to authenticated;
commit;
