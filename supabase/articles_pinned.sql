alter table public.articles
add column if not exists is_pinned boolean not null default false;

comment on column public.articles.is_pinned is
  'Pin an article above the normal newest-first article list.';
