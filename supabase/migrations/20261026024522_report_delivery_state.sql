-- Paid-order report delivery state, kept separate from payment state.
create table if not exists public.report_deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','delivered','failed')),
  delivery_channel text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_deliveries_channel_check check (delivery_channel is null or delivery_channel in ('email','whatsapp','account'))
);
create index if not exists report_deliveries_user_status_idx
  on public.report_deliveries(user_id, status, created_at desc);
alter table public.report_deliveries enable row level security;
drop policy if exists "Users can view own report delivery status" on public.report_deliveries;
create policy "Users can view own report delivery status"
  on public.report_deliveries for select to authenticated
  using (auth.uid() = user_id);
revoke insert, update, delete on public.report_deliveries from anon, authenticated;

-- Keep the existing HMAC-verified webhook flow and its atomic payment fulfillment.
-- The payment RPC creates a pending delivery row only after amount/currency checks pass.
create or replace function public.fulfill_paid_order(
  p_order_id uuid,
  p_event_id text,
  p_paymob_order_id bigint,
  p_amount_cents integer,
  p_currency text
) returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_order public.orders%rowtype;
  v_days integer;
  v_event bigint;
begin
  insert into public.payment_events (provider, provider_event_id, outcome, amount_cents)
  values ('paymob', p_event_id, 'received', p_amount_cents)
  on conflict (provider, provider_event_id) do nothing
  returning id into v_event;

  if v_event is null then
    return 'duplicate';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    update public.payment_events set outcome = 'unknown_order' where id = v_event;
    return 'unknown_order';
  end if;

  update public.payment_events set order_id = v_order.id where id = v_event;

  if v_order.status = 'paid' then
    update public.payment_events set outcome = 'already_paid' where id = v_event;
    return 'already_paid';
  end if;

  if v_order.amount_cents <> p_amount_cents or v_order.currency <> upper(p_currency) then
    update public.payment_events set outcome = 'amount_mismatch' where id = v_event;
    return 'amount_mismatch';
  end if;

  select access_days into v_days from public.products where code = v_order.product_code;

  update public.orders
     set status = 'paid',
         paid_at = now(),
         paymob_order_id = coalesce(p_paymob_order_id, paymob_order_id)
   where id = v_order.id;

  insert into public.entitlements (user_id, product, status, expires_at, source, external_ref)
  values (
    v_order.user_id, v_order.product_code, 'active',
    case when v_days is null then null else now() + make_interval(days => v_days) end,
    'paymob', p_event_id
  );

  if v_order.product_code = 'full_report' then
    insert into public.report_deliveries (order_id, user_id, status)
    values (v_order.id, v_order.user_id, 'pending')
    on conflict (order_id) do nothing;
  end if;

  update public.payment_events set outcome = 'granted' where id = v_event;
  return 'granted';
end;
$function$;

revoke all on function public.fulfill_paid_order(uuid, text, bigint, integer, text) from public, anon, authenticated;
grant execute on function public.fulfill_paid_order(uuid, text, bigint, integer, text) to service_role;
