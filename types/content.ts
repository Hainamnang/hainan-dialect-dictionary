export type Word = {
  id: number;
  sort_key: number | null;
  meaning_th: string | null;
  simplified: string | null;
  traditional: string | null;
  hainan_pronunciation: string | null;
  hainan_pinyin: string | null;
  hainan_audio: string | null;
  note: string | null;
  example: string | null;
};

export type Article = {
  id: number;
  sort_key: number | null;
  title: string | null;
  summary: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  content: string | null;
};

export type ArticleImage = {
  id: number;
  sort_key: number | null;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
};

export type Video = {
  id: number;
  sort_key: number | null;
  title: string | null;
  description: string | null;
  youtube_video_id: string | null;
  aspect_ratio: string | null;
  published_at: string | null;
};

export type Music = {
  id: number;
  title_hainan_pinyin: string | null;
  title_chinese: string | null;
  title_th: string | null;
  artist: string | null;
  source_url: string;
  description: string | null;
  language_notes: string | null;
  sort_key: number;
  is_published: boolean;
  created_at: string;
};

export type PinyinLesson = {
  id: number;
  title: string;
  title_chinese: string | null;
  content: string | null;
  sort_key: number;
  is_published: boolean;
  created_at: string;
};

export type PinyinLessonMedia = {
  id: number;
  lesson_id: number;
  media_type: "image" | "video" | "audio";
  media_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_key: number;
  created_at: string;
};

export type ExternalLink = {
  id: number;
  title: string;
  url: string;
  link_label: string | null;
  description: string | null;
  image_url: string | null;
  sort_key: number;
  is_published: boolean;
  created_at: string;
};

export type News = {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  video_url: string | null;
  source_url: string | null;
  sort_key: number;
  is_published: boolean;
  created_at: string;
};
export type Edito = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
};

export type EditoImage = {
  id: number;
  edito_id: number;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_key: number;
  created_at: string;
};

export type ShareContentType =
  | "article"
  | "video"
  | "music"
  | "news"
  | "pinyin"
  | "link"
  | "edito";
