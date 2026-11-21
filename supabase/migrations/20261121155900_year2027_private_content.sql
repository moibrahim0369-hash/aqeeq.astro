-- Server-only library and bounded preview request counters.
begin;
create table if not exists public.year2027_private_content(id text primary key,payload jsonb not null,updated_at timestamptz not null default now());
alter table public.year2027_private_content enable row level security;
revoke all on public.year2027_private_content from public,anon,authenticated;
grant select,insert,update on public.year2027_private_content to service_role;
create table if not exists public.year2027_rate_limits(key text not null,bucket bigint not null,hits integer not null default 1,primary key(key,bucket));
alter table public.year2027_rate_limits enable row level security;
revoke all on public.year2027_rate_limits from public,anon,authenticated;
create or replace function public.year2027_rate_limit(p_key text,p_limit integer) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;b bigint:=floor(extract(epoch from now())/600);
begin
 if p_limit<1 or p_limit>60 or char_length(p_key)<>64 then return false;end if;
 insert into public.year2027_rate_limits(key,bucket,hits) values(p_key,b,1) on conflict(key,bucket) do update set hits=public.year2027_rate_limits.hits+1 returning hits into n;
 delete from public.year2027_rate_limits where bucket<b-144;
 return n<=p_limit;
end $$;
revoke all on function public.year2027_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.year2027_rate_limit(text,integer) to service_role;
commit;
