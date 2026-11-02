-- ==========================================
-- Sayfold: Schema Migration & Row Level Security
-- ==========================================

-- Enable pgcrypto for UUID generation if not already enabled
create extension if not exists "pgcrypto";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Automatic profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Sources Table (Books, Podcasts)
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text not null default 'book' check (source_type in ('book', 'podcast')),
  creator text,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.sources enable row level security;

create policy "Users can select own sources"
  on public.sources for select
  using (auth.uid() = user_id);

create policy "Users can insert own sources"
  on public.sources for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sources"
  on public.sources for update
  using (auth.uid() = user_id);

create policy "Users can delete own sources"
  on public.sources for delete
  using (auth.uid() = user_id);

create index if not exists sources_user_id_idx on public.sources(user_id);

-- 3. Chapters Table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  chapter_number integer default 1,
  created_at timestamptz not null default now()
);

alter table public.chapters enable row level security;

create policy "Users can select own chapters"
  on public.chapters for select
  using (auth.uid() = user_id);

create policy "Users can insert own chapters"
  on public.chapters for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chapters"
  on public.chapters for update
  using (auth.uid() = user_id);

create policy "Users can delete own chapters"
  on public.chapters for delete
  using (auth.uid() = user_id);

create index if not exists chapters_source_id_idx on public.chapters(source_id);
create index if not exists chapters_user_id_idx on public.chapters(user_id);

-- 4. Knowledge Entries Table
create table if not exists public.knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid references public.sources(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  entry_type text not null check (entry_type in ('Idea', 'Vocab', 'Quote', 'Question', 'Note')),
  title text,
  original_transcription text not null,
  cleaned_content text not null,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  is_favourite boolean not null default false,
  fts tsvector generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(cleaned_content, '') || ' ' ||
      coalesce(original_transcription, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.knowledge_entries enable row level security;

create policy "Users can select own knowledge entries"
  on public.knowledge_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own knowledge entries"
  on public.knowledge_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own knowledge entries"
  on public.knowledge_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own knowledge entries"
  on public.knowledge_entries for delete
  using (auth.uid() = user_id);

-- GIN Index for Postgres Full-Text Search
create index if not exists knowledge_entries_fts_idx on public.knowledge_entries using gin(fts);
create index if not exists knowledge_entries_user_id_idx on public.knowledge_entries(user_id);
create index if not exists knowledge_entries_source_id_idx on public.knowledge_entries(source_id);
create index if not exists knowledge_entries_chapter_id_idx on public.knowledge_entries(chapter_id);
create index if not exists knowledge_entries_entry_type_idx on public.knowledge_entries(entry_type);

-- Updated_at trigger for knowledge_entries
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_knowledge_entries_updated_at on public.knowledge_entries;
create trigger set_knowledge_entries_updated_at
  before update on public.knowledge_entries
  for each row execute procedure public.update_updated_at_column();

