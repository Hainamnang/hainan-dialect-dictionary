alter table public.pinyin_lessons
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_alt_text text;
