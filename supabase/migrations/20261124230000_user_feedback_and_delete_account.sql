-- ملاحظات المستخدمين من «الإعدادات» + حذف الحساب بطلب صاحبه.
create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 3 and 2000),
  created_at timestamptz not null default now()
);
alter table public.user_feedback enable row level security;
drop policy if exists "feedback insert own" on public.user_feedback;
create policy "feedback insert own" on public.user_feedback for insert to authenticated with check (user_id = auth.uid());

create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
