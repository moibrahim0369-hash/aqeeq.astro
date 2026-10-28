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
  decision text not null check (decision in ('submitted','needs_changes','approved','rejected')),
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
create policy tarot_sources_admin_update
  on public.tarot_sources for update to authenticated
  using ((select public.is_tarot_admin()))
  with check ((select public.is_tarot_admin()));

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

-- Seed the complete 78-card catalog without marking any content approved or published.
insert into public.tarot_cards (id, number, arcana, suit, rank, name_ar, name_en, status, metadata)
values
('major-00-fool',0,'major',NULL,NULL,'الأحمق','The Fool','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-01-magician',1,'major',NULL,NULL,'الساحر','The Magician','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-02-high-priestess',2,'major',NULL,NULL,'الكاهنة العليا','The High Priestess','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-03-empress',3,'major',NULL,NULL,'الإمبراطورة','The Empress','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-04-emperor',4,'major',NULL,NULL,'الإمبراطور','The Emperor','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-05-hierophant',5,'major',NULL,NULL,'الكاهن الأعظم','The Hierophant','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-06-lovers',6,'major',NULL,NULL,'العشاق','The Lovers','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-07-chariot',7,'major',NULL,NULL,'العربة','The Chariot','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-08-strength',8,'major',NULL,NULL,'القوة','Strength','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-09-hermit',9,'major',NULL,NULL,'الناسك','The Hermit','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-10-wheel',10,'major',NULL,NULL,'عجلة الحظ','Wheel of Fortune','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-11-justice',11,'major',NULL,NULL,'العدالة','Justice','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-12-hanged-man',12,'major',NULL,NULL,'الرجل المعلّق','The Hanged Man','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-13-death',13,'major',NULL,NULL,'الموت','Death','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-14-temperance',14,'major',NULL,NULL,'الاعتدال','Temperance','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-15-devil',15,'major',NULL,NULL,'الشيطان','The Devil','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-16-tower',16,'major',NULL,NULL,'البرج','The Tower','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-17-star',17,'major',NULL,NULL,'النجمة','The Star','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-18-moon',18,'major',NULL,NULL,'القمر','The Moon','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-19-sun',19,'major',NULL,NULL,'الشمس','The Sun','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-20-judgement',20,'major',NULL,NULL,'الحُكم','Judgement','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('major-21-world',21,'major',NULL,NULL,'العالم','The World','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-ace',1,'minor','wands','ace','آس من الصولجانات','Ace of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-two',2,'minor','wands','two','اثنان من الصولجانات','Two of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-three',3,'minor','wands','three','ثلاثة من الصولجانات','Three of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-four',4,'minor','wands','four','أربعة من الصولجانات','Four of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-five',5,'minor','wands','five','خمسة من الصولجانات','Five of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-six',6,'minor','wands','six','ستة من الصولجانات','Six of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-seven',7,'minor','wands','seven','سبعة من الصولجانات','Seven of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-eight',8,'minor','wands','eight','ثمانية من الصولجانات','Eight of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-nine',9,'minor','wands','nine','تسعة من الصولجانات','Nine of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-ten',10,'minor','wands','ten','عشرة من الصولجانات','Ten of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-page',11,'minor','wands','page','الصفحة من الصولجانات','Page of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-knight',12,'minor','wands','knight','الفارس من الصولجانات','Knight of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-queen',13,'minor','wands','queen','الملكة من الصولجانات','Queen of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('wands-king',14,'minor','wands','king','الملك من الصولجانات','King of Wands','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-ace',1,'minor','cups','ace','آس من الكؤوس','Ace of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-two',2,'minor','cups','two','اثنان من الكؤوس','Two of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-three',3,'minor','cups','three','ثلاثة من الكؤوس','Three of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-four',4,'minor','cups','four','أربعة من الكؤوس','Four of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-five',5,'minor','cups','five','خمسة من الكؤوس','Five of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-six',6,'minor','cups','six','ستة من الكؤوس','Six of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-seven',7,'minor','cups','seven','سبعة من الكؤوس','Seven of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-eight',8,'minor','cups','eight','ثمانية من الكؤوس','Eight of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-nine',9,'minor','cups','nine','تسعة من الكؤوس','Nine of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-ten',10,'minor','cups','ten','عشرة من الكؤوس','Ten of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-page',11,'minor','cups','page','الصفحة من الكؤوس','Page of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-knight',12,'minor','cups','knight','الفارس من الكؤوس','Knight of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-queen',13,'minor','cups','queen','الملكة من الكؤوس','Queen of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('cups-king',14,'minor','cups','king','الملك من الكؤوس','King of Cups','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-ace',1,'minor','swords','ace','آس من السيوف','Ace of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-two',2,'minor','swords','two','اثنان من السيوف','Two of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-three',3,'minor','swords','three','ثلاثة من السيوف','Three of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-four',4,'minor','swords','four','أربعة من السيوف','Four of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-five',5,'minor','swords','five','خمسة من السيوف','Five of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-six',6,'minor','swords','six','ستة من السيوف','Six of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-seven',7,'minor','swords','seven','سبعة من السيوف','Seven of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-eight',8,'minor','swords','eight','ثمانية من السيوف','Eight of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-nine',9,'minor','swords','nine','تسعة من السيوف','Nine of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-ten',10,'minor','swords','ten','عشرة من السيوف','Ten of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-page',11,'minor','swords','page','الصفحة من السيوف','Page of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-knight',12,'minor','swords','knight','الفارس من السيوف','Knight of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-queen',13,'minor','swords','queen','الملكة من السيوف','Queen of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('swords-king',14,'minor','swords','king','الملك من السيوف','King of Swords','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-ace',1,'minor','pentacles','ace','آس من الخماسيات','Ace of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-two',2,'minor','pentacles','two','اثنان من الخماسيات','Two of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-three',3,'minor','pentacles','three','ثلاثة من الخماسيات','Three of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-four',4,'minor','pentacles','four','أربعة من الخماسيات','Four of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-five',5,'minor','pentacles','five','خمسة من الخماسيات','Five of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-six',6,'minor','pentacles','six','ستة من الخماسيات','Six of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-seven',7,'minor','pentacles','seven','سبعة من الخماسيات','Seven of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-eight',8,'minor','pentacles','eight','ثمانية من الخماسيات','Eight of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-nine',9,'minor','pentacles','nine','تسعة من الخماسيات','Nine of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-ten',10,'minor','pentacles','ten','عشرة من الخماسيات','Ten of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-page',11,'minor','pentacles','page','الصفحة من الخماسيات','Page of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-knight',12,'minor','pentacles','knight','الفارس من الخماسيات','Knight of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-queen',13,'minor','pentacles','queen','الملكة من الخماسيات','Queen of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review')),
('pentacles-king',14,'minor','pentacles','king','الملك من الخماسيات','King of Pentacles','in_review',jsonb_build_object('seed','aqeq-tarot-v2-draft','editorialStatus','in_review'))
on conflict (id) do nothing;
