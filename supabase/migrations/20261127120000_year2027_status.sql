-- Buyer-facing status of the annual report order for one set of birth inputs.
-- Returns 'none' | 'pending' | 'approved' | 'rejected'. Read-only, own rows only, no report content.
begin;
create or replace function public.year2027_status(p_input jsonb) returns text language sql stable security definer set search_path='' as $$
 select coalesce((
  select m.status from public.year2027_reports r join public.manual_payments m on m.id=r.manual_payment_id
  where r.user_id=auth.uid() and m.user_id=auth.uid() and r.input_key=public.year2027_input_key(p_input)
  order by r.created_at desc limit 1),'none');
$$;
revoke all on function public.year2027_status(jsonb) from public,anon;
grant execute on function public.year2027_status(jsonb) to authenticated;
commit;
