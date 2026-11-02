-- Migration: Add source_url to public.sources
alter table public.sources add column if not exists source_url text;

