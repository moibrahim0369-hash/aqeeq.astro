-- Tarot knowledge base foundation. Apply only after reviewing against the live schema.
-- No existing tables or records are modified or dropped.
create extension if not exists pgcrypto;

create table if not exists public.tarot_cards (
  id text primary key,
  number integer not null,
  arcana text not null check (arcana in ('major','minor')),
  suit text,
  rank text,
  name_ar text not null,
  name_en text not null,
  status text not null default 'raw' check (status in ('raw','draft','in_review','approved','published','archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((arcana = 'major' and suit is null) or (arcana = 'minor' and suit is not null))
);

create table if not exists public.tarot_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  publication_year integer,
  publisher text,
  source_url text,
  source_type text not null default 'book' check (source_type in ('book','article','website','course','personal_note','other')),
  citation text,
  internal_notes text,
  status text not null default 'raw' check (status in ('raw','in_review','approved','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tarot_materials (
  id uuid primary key default gen_random_uuid(),
  card_id text references public.tarot_cards(id) on delete set null,
  source_id uuid references public.tarot_sources(id) on delete set null,
  title text not null,
  raw_text text not null,
  normalized_notes text,
  status text not null default 'raw' check (status in ('raw','organized','drafted','archived')),
  created_by uuid not null references auth.users(id) on delete cascade,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (length(btrim(raw_text)) > 0),
  check (length(raw_text) <= 200000)
);

create table if not exists public.tarot_content_versions (
  id uuid primary key default gen_random_uuid(),
  card_id text not null references public.tarot_cards(id) on delete cascade,
  version integer not null check (version > 0),
  reference_content jsonb not null default '{}'::jsonb,
  aqeq_content jsonb not null default '{}'::jsonb,
  source_ids uuid[] not null default '{}'::uuid[],
  provenance text not null default 'aqeq_original' check (provenance in ('reference','aqeq_original','mixed')),
  status text not null default 'draft' check (status in ('raw','draft','in_review','approved','published','rejected','archived')),
  change_summary text,
  created_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique(card_id, version),
  check (jsonb_typeof(reference_content) = 'object'),
  check (jsonb_typeof(aqeq_content) = 'object'),
  check (status not in ('approved','published') or (cardinality(source_ids) > 0 and approved_by is not null and approved_at is not null))
);

create table if not exists public.tarot_reviews (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.tarot_content_versions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  decision text not null check (decision in ('needs_changes','approved','rejected')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.tarot_assistant_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_hash text not null,
  selected_card_ids text[] not null default '{}'::text[],
  status text not null default 'started' check (status in ('started','completed','failed','rejected')),
  model text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists tarot_versions_published_card_idx
  on public.tarot_content_versions(card_id, status, version desc);
create index if not exists tarot_materials_owner_created_idx
  on public.tarot_materials(created_by, created_at desc);
create index if not exists tarot_assistant_user_created_idx
  on public.tarot_assistant_requests(user_id, created_at desc);
create index if not exists tarot_reviews_version_created_idx
  on public.tarot_reviews(version_id, created_at desc);

create or replace function public.is_tarot_editor()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' in ('admin','editor'), false);
$$;

create or replace function public.is_tarot_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', false);
$$;

alter table public.tarot_cards enable row level security;
alter table public.tarot_sources enable row level security;
alter table public.tarot_materials enable row level security;
alter table public.tarot_content_versions enable row level security;
alter table public.tarot_reviews enable row level security;
alter table public.tarot_assistant_requests enable row level security;

revoke all on public.tarot_cards, public.tarot_sources, public.tarot_materials,
  public.tarot_content_versions, public.tarot_reviews, public.tarot_assistant_requests
  from anon, authenticated;

grant select on public.tarot_cards, public.tarot_content_versions to anon, authenticated;
grant select, insert, update on public.tarot_cards, public.tarot_sources,
  public.tarot_materials, public.tarot_content_versions, public.tarot_reviews to authenticated;

create policy tarot_cards_read_published_or_editor
  on public.tarot_cards for select to anon, authenticated
  using (status = 'published' or (select public.is_tarot_editor()));
create policy tarot_cards_editor_insert
  on public.tarot_cards for insert to authenticated
  with check ((select public.is_tarot_editor()) and created_by = (select auth.uid()));
create policy tarot_cards_editor_update
  on public.tarot_cards for update to authenticated
  using ((select public.is_tarot_editor()))
  with check ((select public.is_tarot_editor()));

create policy tarot_sources_editor_read
  on public.tarot_sources for select to authenticated
  using ((select public.is_tarot_editor()));
create policy tarot_sources_editor_insert
  on public.tarot_sources for insert to authenticated
  with check ((select public.is_tarot_editor()) and created_by = (select auth.uid()));
create policy tarot_sources_editor_update
  on public.tarot_sources for update to authenticated
  using ((select public.is_tarot_editor()))
  with check ((select public.is_tarot_editor()));

create policy tarot_materials_editor_read
  on public.tarot_materials for select to authenticated
  using ((select public.is_tarot_editor()));
create policy tarot_materials_editor_insert
  on public.tarot_materials for insert to authenticated
  with check ((select public.is_tarot_editor()) and created_by = (select auth.uid()));
create policy tarot_materials_editor_update
  on public.tarot_materials for update to authenticated
  using ((select public.is_tarot_editor()))
  with check ((select public.is_tarot_editor()));

create policy tarot_versions_read_published_or_editor
  on public.tarot_content_versions for select to anon, authenticated
  using (status = 'published' or (select public.is_tarot_editor()));
create policy tarot_versions_editor_insert
  on public.tarot_content_versions for insert to authenticated
  with check ((select public.is_tarot_editor()) and created_by = (select auth.uid()));
create policy tarot_versions_editor_update
  on public.tarot_content_versions for update to authenticated
  using ((select public.is_tarot_editor()))
  with check ((select public.is_tarot_editor()));

create policy tarot_reviews_editor_read
  on public.tarot_reviews for select to authenticated
  using ((select public.is_tarot_editor()));
create policy tarot_reviews_editor_insert
  on public.tarot_reviews for insert to authenticated
  with check ((select public.is_tarot_editor()) and reviewer_id = (select auth.uid()));

-- Request history is deliberately server-only. Edge Functions use the service role
-- after validating the caller's JWT and applying per-user limits.
