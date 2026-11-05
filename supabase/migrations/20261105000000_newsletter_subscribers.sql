-- اشتراك النشرة البريدية: جمع الإيميلات فقط. الجدول مغلق على المتصفح، والإضافة تتم عبر دالة واحدة.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_norm text generated always as (lower(btrim(email))) stored,
  source text not null default 'featured-content',
  created_at timestamptz not null default now(),
  constraint newsletter_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254)
);
create unique index if not exists newsletter_subscribers_email_norm_key on public.newsletter_subscribers (email_norm);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;

-- ترجع دائمًا 'ok' (لا تكشف إن كان الإيميل مسجلًا من قبل)، و'invalid' للصيغة الخاطئة.
create or replace function public.subscribe_newsletter(p_email text, p_source text default 'featured-content')
returns text
language plpgsql
security definer
set search_path = public
as $$
declare v text := lower(btrim(coalesce(p_email, '')));
begin
  if length(v) > 254 or v !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return 'invalid';
  end if;
  insert into public.newsletter_subscribers (email, source)
  values (v, left(coalesce(nullif(btrim(p_source), ''), 'featured-content'), 40))
  on conflict (email_norm) do nothing;
  return 'ok';
end;
$$;
revoke all on function public.subscribe_newsletter(text, text) from public;
grant execute on function public.subscribe_newsletter(text, text) to anon, authenticated;
