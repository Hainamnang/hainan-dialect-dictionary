alter table public.articles
add column if not exists video_url text;

comment on column public.articles.video_url is
  'Optional YouTube or direct video URL displayed after all article images.';
