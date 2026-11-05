-- Manual payments (Vodafone Cash / InstaPay / PayPal): the customer submits a transfer reference,
-- the owner reviews it, and approval reuses the existing atomic fulfill_paid_order (entitlement + report delivery).
-- Paymob flow, webhook and existing RLS are untouched.

create table if not exists public.app_admins (email text primary key);
alter table public.app_admins enable row level security;
revoke all on public.app_admins from anon, authenticated;

create table if not exists public.manual_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_code text not null references public.products(code),
  method text not null check (method in ('wallet','vodafone_cash','instapay','paypal')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  reference text not null check (char_length(btrim(reference)) between 3 and 120),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  order_id uuid references public.orders(id),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists manual_payments_user_idx on public.manual_payments(user_id, created_at desc);
create index if not exists manual_payments_status_idx on public.manual_payments(status, created_at desc);
alter table public.manual_payments enable row level security;
drop policy if exists "Users can view own manual payments" on public.manual_payments;
create policy "Users can view own manual payments" on public.manual_payments
  for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.manual_payments from anon, authenticated;

create or replace function public.is_app_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.app_admins a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email','')));
$$;
revoke all on function public.is_app_admin() from public, anon;
grant execute on function public.is_app_admin() to authenticated;

create or replace function public.submit_manual_payment(p_product text, p_method text, p_reference text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_prod public.products%rowtype; v_id uuid;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into v_prod from public.products where code = p_product and active and amount_cents is not null;
  if not found then raise exception 'unknown_product'; end if;
  if p_method not in ('wallet','vodafone_cash','instapay','paypal') then raise exception 'bad_method'; end if;
  if char_length(btrim(coalesce(p_reference,''))) < 3 then raise exception 'bad_reference'; end if;
  if exists (select 1 from public.manual_payments where user_id = v_uid and product_code = p_product and status = 'pending') then
    raise exception 'already_pending';
  end if;
  insert into public.manual_payments (user_id, product_code, method, amount_cents, currency, reference)
  values (v_uid, p_product, p_method, v_prod.amount_cents, v_prod.currency, left(btrim(p_reference), 120))
  returning id into v_id;
  return v_id;
end $$;
revoke all on function public.submit_manual_payment(text, text, text) from public, anon;
grant execute on function public.submit_manual_payment(text, text, text) to authenticated;

create or replace function public.admin_list_manual_payments()
returns table (id uuid, email text, full_name text, product_code text, method text, amount_cents integer, currency text, reference text, status text, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_app_admin() then raise exception 'forbidden'; end if;
  return query
    select m.id, u.email::text, btrim(coalesce(p.first_name,'') || ' ' || coalesce(p.last_name,'')), m.product_code, m.method,
           m.amount_cents, m.currency, m.reference, m.status, m.created_at
    from public.manual_payments m
    join auth.users u on u.id = m.user_id
    left join public.profiles p on p.id = m.user_id
    order by (m.status = 'pending') desc, m.created_at desc
    limit 200;
end $$;
revoke all on function public.admin_list_manual_payments() from public, anon;
grant execute on function public.admin_list_manual_payments() to authenticated;

create or replace function public.admin_review_manual_payment(p_id uuid, p_approve boolean)
returns text language plpgsql security definer set search_path = '' as $$
declare v_m public.manual_payments%rowtype; v_order uuid; v_res text;
begin
  if not public.is_app_admin() then raise exception 'forbidden'; end if;
  select * into v_m from public.manual_payments where id = p_id for update;
  if not found then return 'not_found'; end if;
  if v_m.status <> 'pending' then return 'already_reviewed'; end if;
  if not p_approve then
    update public.manual_payments set status = 'rejected', reviewed_at = now() where id = p_id;
    return 'rejected';
  end if;
  insert into public.orders (user_id, product_code, amount_cents, currency, status)
  values (v_m.user_id, v_m.product_code, v_m.amount_cents, v_m.currency, 'pending')
  returning id into v_order;
  v_res := public.fulfill_paid_order(v_order, 'manual:' || p_id::text, null, v_m.amount_cents, v_m.currency);
  if v_res <> 'granted' then raise exception 'fulfill_failed:%', v_res; end if;
  update public.manual_payments set status = 'approved', order_id = v_order, reviewed_at = now() where id = p_id;
  return 'approved';
end $$;
revoke all on function public.admin_review_manual_payment(uuid, boolean) from public, anon;
grant execute on function public.admin_review_manual_payment(uuid, boolean) to authenticated;

-- Owner allowed to review payments (email of the site owner's login).
insert into public.app_admins (email) values ('mo.ibrahim.0369@gmail.com') on conflict do nothing;
