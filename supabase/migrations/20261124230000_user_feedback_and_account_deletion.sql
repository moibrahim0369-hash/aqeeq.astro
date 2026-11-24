-- DRAFT, لم يُطبَّق بعد. ملاحظات المستخدمين + حذف الحساب بمهلة 30 يومًا.
-- المسار: طلب الحذف (استبيان) -> الحساب يُعلَّم محذوفًا ويُسجَّل خروجه -> لو رجع خلال 30 يومًا يُستعاد
-- بتسجيل الدخول -> بعد 30 يومًا يُحذف نهائيًا (auth.users ثم كل ما يتبعه بالـ cascade).

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 3 and 2000),
  created_at timestamptz not null default now()
);
alter table public.user_feedback enable row level security;
drop policy if exists "feedback insert own" on public.user_feedback;
create policy "feedback insert own" on public.user_feedback for insert to authenticated with check (user_id = auth.uid());

-- الحسابات المطلوب حذفها (تُحذف نهائيًا عند purge_after)
create table if not exists public.account_deletions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  requested_at timestamptz not null default now(),
  purge_after timestamptz not null default now() + interval '30 days'
);
alter table public.account_deletions enable row level security;  -- لا سياسات: الوصول عبر الدوال فقط

-- إجابات الاستبيان: بلا ربط بالمستخدم، تبقى بعد الحذف النهائي دون هوية
create table if not exists public.account_deletion_survey (
  id uuid primary key default gen_random_uuid(),
  reason text not null check (reason in ('not_useful','too_many_notifications','privacy','found_alternative','temporary_break','other')),
  details text check (details is null or char_length(details) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.account_deletion_survey enable row level security;

create or replace function public.request_account_deletion(p_reason text, p_details text default null)
returns timestamptz language plpgsql security definer set search_path = public, auth as $$
declare t timestamptz;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.account_deletion_survey(reason, details) values (p_reason, nullif(left(trim(coalesce(p_details,'')),1000),''));
  insert into public.account_deletions(user_id) values (auth.uid())
    on conflict (user_id) do update set requested_at = now(), purge_after = now() + interval '30 days'
    returning purge_after into t;
  return t;
end $$;

-- تُستدعى تلقائيًا عند تسجيل الدخول: ترجع true لو كان الحساب في مهلة الحذف وتم استعادته
create or replace function public.restore_my_account() returns boolean
language plpgsql security definer set search_path = public, auth as $$
declare n int;
begin
  if auth.uid() is null then return false; end if;
  delete from public.account_deletions where user_id = auth.uid() and purge_after > now();
  get diagnostics n = row_count;
  return n > 0;
end $$;

-- الحذف النهائي بعد انتهاء المهلة
create or replace function public.purge_deleted_accounts() returns int
language plpgsql security definer set search_path = public, auth as $$
declare n int;
begin
  delete from auth.users where id in (select user_id from public.account_deletions where purge_after <= now());
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function public.request_account_deletion(text,text), public.restore_my_account(), public.purge_deleted_accounts() from public, anon;
grant execute on function public.request_account_deletion(text,text), public.restore_my_account() to authenticated;
-- purge_deleted_accounts لا يُمنح لأحد: يعمل من الجدولة فقط.

-- جدولة يومية (تتطلب تفعيل إضافة pg_cron من Supabase > Database > Extensions)
-- select cron.schedule('purge-deleted-accounts', '15 3 * * *', $$select public.purge_deleted_accounts()$$);
