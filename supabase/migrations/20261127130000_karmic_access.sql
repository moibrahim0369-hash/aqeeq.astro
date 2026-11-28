-- Karmic tail: private report texts, purchase bound to the birth date, buyer status and access checks.
-- Same idea as the annual report: nothing here returns report text to a client; only service_role reads karmic_content.
begin;

create table if not exists public.karmic_content(code text primary key, body text not null, updated_at timestamptz not null default now());
alter table public.karmic_content enable row level security;
revoke all on public.karmic_content from public,anon,authenticated;
grant select,insert,update on public.karmic_content to service_role;

create table if not exists public.karmic_orders(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 birth_date text not null check (birth_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
 manual_payment_id uuid not null unique references public.manual_payments(id),
 created_at timestamptz not null default now()
);
create index if not exists karmic_orders_user_idx on public.karmic_orders(user_id,birth_date);
alter table public.karmic_orders enable row level security;
revoke all on public.karmic_orders from public,anon,authenticated;
grant select,insert on public.karmic_orders to service_role;

/* The matrix rule used by the site (matrix-method-adapter.js): reduce to 1..22 by digit sum. */
create or replace function public.karmic_reduce(n integer) returns integer language plpgsql immutable set search_path='' as $$
declare v integer := abs(n);
begin
 while v > 22 loop v := (select sum(ch::integer) from regexp_split_to_table(v::text,'') as ch); end loop;
 return case when v = 0 then 22 else v end;
end $$;

/* Karmic tail triad [D, D3, D2] from a birth date, exactly as calculateDestinyMatrix does. null for an invalid date. */
create or replace function public.karmic_triad(p_date text) returns text language plpgsql immutable set search_path='' as $$
declare y integer; m integer; d integer; a integer; b integer; c integer; dd integer; e integer; d2 integer; d3 integer;
begin
 if p_date is null or p_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then return null; end if;
 y := substr(p_date,1,4)::integer; m := substr(p_date,6,2)::integer; d := substr(p_date,9,2)::integer;
 if y < 1900 or y > 2100 then return null; end if;
 begin perform make_date(y,m,d); exception when others then return null; end;
 a := public.karmic_reduce(d); b := public.karmic_reduce(m);
 c := public.karmic_reduce(((select sum(ch::integer) from regexp_split_to_table(y::text,'') as ch))::integer);
 dd := public.karmic_reduce(a+b+c); e := public.karmic_reduce(a+b+c+dd);
 d2 := public.karmic_reduce(dd+e); d3 := public.karmic_reduce(dd+d2);
 return dd::text||'-'||d3::text||'-'||d2::text;
end $$;

/* Which stored report answers this birth date: the exact triad first, then the reversed one (same rule as the site loader). */
create or replace function public.karmic_code_for(p_date text) returns text language plpgsql stable security definer set search_path='' as $$
declare t text := public.karmic_triad(p_date); r text; found_code text;
begin
 if t is null then return null; end if;
 r := (select string_agg(x, '-' order by i desc) from unnest(string_to_array(t,'-')) with ordinality as u(x,i));
 select k.code into found_code from public.karmic_content k where k.code in (t, r) order by (k.code = t) desc limit 1;
 return found_code;
end $$;
revoke all on function public.karmic_code_for(text) from public,anon,authenticated;
grant execute on function public.karmic_code_for(text) to service_role;

create or replace function public.karmic_submit(p_product text,p_method text,p_reference text,p_date text) returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid := auth.uid(); m uuid;
begin
 if u is null then raise exception 'not_authenticated'; end if;
 if p_product not in ('karmic_tail_egp_199','karmic_tail_usd_7') then raise exception 'unknown_product'; end if;
 if public.karmic_code_for(p_date) is null then raise exception 'report_unavailable'; end if;
 if exists(select 1 from public.karmic_orders o join public.manual_payments mp on mp.id=o.manual_payment_id
           where o.user_id=u and o.birth_date=p_date and mp.status in ('pending','approved')) then raise exception 'already_submitted'; end if;
 m := public.submit_manual_payment(p_product,p_method,p_reference);
 insert into public.karmic_orders(user_id,birth_date,manual_payment_id) values(u,p_date,m);
 return m;
end $$;
revoke all on function public.karmic_submit(text,text,text,text) from public,anon;
grant execute on function public.karmic_submit(text,text,text,text) to authenticated;

/* none | pending | approved | rejected for the signed-in user and this birth date (latest order). */
create or replace function public.karmic_status(p_date text) returns text language sql stable security definer set search_path='' as $$
 select coalesce((select mp.status from public.karmic_orders o join public.manual_payments mp on mp.id=o.manual_payment_id
                  where o.user_id=auth.uid() and mp.user_id=auth.uid() and o.birth_date=p_date order by o.created_at desc limit 1),'none');
$$;
revoke all on function public.karmic_status(text) from public,anon;
grant execute on function public.karmic_status(text) to authenticated;

/* The order id when this user may read the report for this birth date: approved, paid, same amount, active entitlement. */
create or replace function public.karmic_access(p_date text) returns uuid language sql stable security definer set search_path='' as $$
 select o2.id from public.karmic_orders o2
  join public.manual_payments mp on mp.id=o2.manual_payment_id
  join public.orders o on o.id=mp.order_id
 where o2.user_id=auth.uid() and o2.birth_date=p_date and mp.user_id=auth.uid() and o.user_id=auth.uid()
   and mp.status='approved' and o.status='paid' and o.product_code in ('karmic_tail_egp_199','karmic_tail_usd_7')
   and o.amount_cents=mp.amount_cents and o.currency=mp.currency
   and exists(select 1 from public.entitlements e where e.user_id=auth.uid() and e.product=o.product_code and e.status='active' and (e.expires_at is null or e.expires_at>now()))
 limit 1;
$$;
revoke all on function public.karmic_access(text) from public,anon;
grant execute on function public.karmic_access(text) to authenticated;

commit;
