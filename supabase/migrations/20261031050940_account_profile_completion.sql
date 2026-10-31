-- Extend the existing account profile without replacing existing user records.
-- Existing profiles, auth users, and auth triggers remain intact.

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists birth_country text,
  add column if not exists birth_time_unknown boolean not null default false,
  add column if not exists avatar_path text,
  add column if not exists profile_completed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_first_name_length_check'
  ) then
    alter table public.profiles
      add constraint profiles_first_name_length_check
      check (first_name is null or char_length(btrim(first_name)) between 1 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_last_name_length_check'
  ) then
    alter table public.profiles
      add constraint profiles_last_name_length_check
      check (last_name is null or char_length(btrim(last_name)) between 1 and 80);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_birth_city_length_check'
  ) then
    alter table public.profiles
      add constraint profiles_birth_city_length_check
      check (birth_city is null or char_length(btrim(birth_city)) <= 120);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_birth_country_length_check'
  ) then
    alter table public.profiles
      add constraint profiles_birth_country_length_check
      check (birth_country is null or char_length(btrim(birth_country)) <= 120);
  end if;
end $$;

-- Avatars are intentionally public for rendering in profile cards.
-- Uploads and mutations remain scoped to the authenticated user's UUID folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar owners can read their files" on storage.objects;
create policy "Avatar owners can read their files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Avatar owners can upload their files" on storage.objects;
create policy "Avatar owners can upload their files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Avatar owners can update their files" on storage.objects;
create policy "Avatar owners can update their files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Avatar owners can delete their files" on storage.objects;
create policy "Avatar owners can delete their files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
