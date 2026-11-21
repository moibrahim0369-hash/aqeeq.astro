-- Minimal owner-notification queue. Acknowledgement never confirms money or grants access.
begin;
create table if not exists public.owner_payment_notifications(payment_id uuid primary key references public.manual_payments(id) on delete cascade,notified_at timestamptz not null default now());
alter table public.owner_payment_notifications enable row level security;
revoke all on public.owner_payment_notifications from public,anon,authenticated;
create or replace function public.owner_pending_payments() returns table(id uuid,full_name text,email text,method text,amount_cents integer,currency text,reference text,created_at timestamptz) language sql stable security definer set search_path='' as $$
 select m.id,btrim(coalesce(p.first_name,'')||' '||coalesce(p.last_name,'')),u.email::text,m.method,m.amount_cents,m.currency,m.reference,m.created_at
 from public.manual_payments m join auth.users u on u.id=m.user_id left join public.profiles p on p.id=m.user_id
 where m.status='pending' and not exists(select 1 from public.owner_payment_notifications n where n.payment_id=m.id) order by m.created_at,m.id limit 100;
$$;
revoke all on function public.owner_pending_payments() from public,anon,authenticated;
grant execute on function public.owner_pending_payments() to service_role;
create or replace function public.owner_ack_payments(p_ids uuid[]) returns integer language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 if cardinality(p_ids)>100 then raise exception 'too_many_ids';end if;
 insert into public.owner_payment_notifications(payment_id) select id from public.manual_payments where id=any(p_ids) on conflict do nothing;
 get diagnostics n=row_count;return n;
end $$;
revoke all on function public.owner_ack_payments(uuid[]) from public,anon,authenticated;
grant execute on function public.owner_ack_payments(uuid[]) to service_role;
commit;
