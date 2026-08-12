"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const logSupabaseError = (
  context: string,
  error: { message?: string; details?: string; hint?: string; code?: string } | null
) => {
  console.error(`[Supabase] ${context}`, {
    message: error?.message ?? null,
    details: error?.details ?? null,
    hint: error?.hint ?? null,
    code: error?.code ?? null,
  });
};

type Word = {
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

type Article = {
  id: number;
  sort_key: number | null;
  title: string | null;
  summary: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  content: string | null;
};

type ArticleImage = {
  id: number;
  sort_key: number | null;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
};

type Video = {
  id: number;
  sort_key: number | null;
  title: string | null;
  description: string | null;
  youtube_video_id: string | null;
  aspect_ratio: string | null;
  published_at: string | null;
};

type Music = {
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

type News = {
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

const getSafeSourceUrl = (sourceUrl: string) => {
  try {
    const url = new URL(sourceUrl);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

const getYouTubeVideoId = (sourceUrl: string) => {
  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else {
        const [route, id] = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(route)) {
          videoId = id || null;
        }
      }
    }

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
};

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleImages, setArticleImages] = useState<ArticleImage[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const vocabularyDetailRef = useRef<HTMLElement | null>(null);

const handleSelectWord = (word: Word) => {
  setSelectedWord(word);

  requestAnimationFrame(() => {
    vocabularyDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
};

const handleSearchChange = (value: string) => {
  setSearch(value);

  const normalized = normalizeText(value);

  if (normalized === "") {
    setSelectedWord(null);
    return;
  }

  const nextFilteredWords = words
    .filter((word) => {
      const text = [
        word.meaning_th,
        word.simplified,
        word.traditional,
        word.hainan_pronunciation,
        word.hainan_pinyin,
      ]
        .filter(Boolean)
        .map((item) => normalizeText(String(item)))
        .join(" ");

      return text.includes(normalized);
    })
    .sort((a, b) => {
      const aMeaning = normalizeText(String(a.meaning_th || ""));
      const bMeaning = normalizeText(String(b.meaning_th || ""));

      const getRank = (meaning: string) => {
        if (meaning === normalized) return 1;
        if (meaning.startsWith(normalized)) return 2;
        if (meaning.includes(normalized)) return 3;
        return 4;
      };

      const rankA = getRank(aMeaning);
      const rankB = getRank(bMeaning);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return (a.sort_key ?? 999999) - (b.sort_key ?? 999999);
    })
    .slice(0, 20);

  setSelectedWord(nextFilteredWords.length > 0 ? nextFilteredWords[0] : null);
};

  useEffect(() => {
    async function loadWords() {
      const { data, error } = await supabase
        .from("hainan_dictionary")
        .select(
          "id, sort_key, meaning_th, simplified, traditional, hainan_pronunciation, hainan_pinyin, hainan_audio, note, example"
        )
        .lte("sort_key", 503)
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadWords", error);
      } else {
        setWords(data || []);
      }
    }

    loadWords();
  }, []);

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase
        .from("articles")
        .select("id, sort_key, title, summary, cover_image_url, published_at, content")
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadArticles", error);
      } else {
        setArticles((data as Article[]) || []);
      }
    }

    loadArticles();
  }, []);

  useEffect(() => {
    async function loadArticleImages() {
      if (!selectedArticle) {
        setArticleImages([]);
        return;
      }

      const { data, error } = await supabase
        .from("article_images")
        .select("id, sort_key, image_url, alt_text, caption")
        .eq("article_id", selectedArticle.id)
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadArticleImages", error);
      } else {
        setArticleImages((data as ArticleImage[]) || []);
      }
    }

    loadArticleImages();
  }, [selectedArticle]);

  useEffect(() => {
    async function loadVideos() {
      const { data, error } = await supabase
        .from("videos")
        .select("id, sort_key, title, description, youtube_video_id, aspect_ratio, published_at")
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadVideos", error);
      } else {
        setVideos((data as Video[]) || []);
      }
    }

    loadVideos();
  }, []);

  useEffect(() => {
    async function loadMusic() {
      const { data, error } = await supabase
        .from("music")
        .select(
          "id, title_hainan_pinyin, title_chinese, title_th, artist, source_url, description, language_notes, sort_key, is_published, created_at"
        )
        .eq("is_published", true)
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadMusic", error);
      } else {
        setMusic((data as Music[]) || []);
      }
    }

    loadMusic();
  }, []);

  useEffect(() => {
    async function loadNews() {
      const { data, error } = await supabase
        .from("news")
        .select(
          "id, title, summary, content, image_url, image_alt, video_url, source_url, sort_key, is_published, created_at"
        )
        .eq("is_published", true)
        .order("sort_key", { ascending: true });

      if (error) {
        logSupabaseError("loadNews", error);
      } else {
        setNews((data as News[]) || []);
      }
    }

    loadNews();
  }, []);

  useEffect(() => {
    if (!selectedNews) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedNews(null);
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNews]);

  const normalizeText = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();

const normalizedSearch = normalizeText(search);

const filteredWords =
  normalizedSearch === ""
    ? []
    : words
        .filter((word) => {
          const text = [
            word.meaning_th,
            word.simplified,
            word.traditional,
            word.hainan_pronunciation,
            word.hainan_pinyin,
          ]
            .filter(Boolean)
            .map((value) => normalizeText(String(value)))
            .join(" ");

          return text.includes(normalizedSearch);
        })
        .sort((a, b) => {
          const aMeaning = normalizeText(String(a.meaning_th || ""));
          const bMeaning = normalizeText(String(b.meaning_th || ""));

          const getRank = (meaning: string) => {
            if (meaning === normalizedSearch) return 1;
            if (meaning.startsWith(normalizedSearch)) return 2;
            if (meaning.includes(normalizedSearch)) return 3;
            return 4;
          };

          const rankA = getRank(aMeaning);
          const rankB = getRank(bMeaning);

          if (rankA !== rankB) {
            return rankA - rankB;
          }

          return (a.sort_key ?? 999999) - (b.sort_key ?? 999999);
        })
        .slice(0, 20);

const displayedWord =
  normalizedSearch === "" || filteredWords.length === 0
    ? null
    : selectedWord && filteredWords.some((word) => word.id === selectedWord.id)
      ? selectedWord
      : filteredWords[0];

  const hasSearch = normalizedSearch !== "";
  const selectedNewsImageUrl = selectedNews?.image_url
    ? getSafeSourceUrl(selectedNews.image_url)
    : null;
  const selectedNewsSourceUrl = selectedNews?.source_url
    ? getSafeSourceUrl(selectedNews.source_url)
    : null;
  const selectedNewsVideoId = selectedNews?.video_url
    ? getYouTubeVideoId(selectedNews.video_url)
    : null;

  return (
    <main className="min-h-screen bg-stone-50 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">

        {/* 1. Header */}
        <section id="home" className="scroll-mt-24 rounded-xl border bg-white p-3 sm:p-4">
          <Image
            src="/heading.jpg"
            alt="Hainanese Dialect Dictionary"
            width={1366}
            height={466}
            priority
            className="w-full h-auto rounded-lg"
          />
        </section>

        {/* 2. Main menu */}
        <nav aria-label="เมนูหลัก" className="sticky top-0 z-20 mt-4 rounded-xl bg-purple-800 p-1 shadow-sm">
          <div className="flex items-center justify-between sm:w-2/3 sm:mx-auto">
            {[
              ["Home", "#home"],
              ["Dictionary", "#dictionary"],
              ["Pinyin", "#pinyin-lessons"],
              ["Article", "#articles"],
              ["Video", "#videos"],
              ["Music", "#music"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="px-1 py-1 text-center text-[12px] leading-none font-bold text-white transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 space-y-6">
       {/* 3. Search */}
<section id="dictionary" className="scroll-mt-24 rounded-xl border bg-white p-4">
  <h2 className="mb-3 font-bold">
    🔍 Search / ค้นหาคำศัพท์ --&gt; พิมพ์คำที่ต้องการค้นในช่องด้านล่าง ▼
  </h2>

  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
      🔍
    </span>

    <input
      className="w-full rounded-lg border-2 border-orange-300 bg-orange-50 pl-12 pr-4 py-3 text-lg
                 focus:border-orange-500 focus:bg-white focus:outline-none"
      placeholder="ค้นหาคำศัพท์..."
      value={search}
      onChange={(e) => {
        handleSearchChange(e.target.value);
      }}
    />
  </div>
</section>

        

        {/* 4. Vocabulary Detail — hidden until a search begins */}
        {hasSearch ? (
<section
  ref={vocabularyDetailRef}
  className="scroll-mt-4 bg-amber-50 rounded-xl border border-amber-200 p-4"
>
          <h2 className="font-bold mb-3">Vocabulary Detail / รายละเอียดคำศัพท์</h2>

        {displayedWord ? (
  <div className="space-y-2">
    <div className="text-sm text-gray-500">#{displayedWord.id}</div>
    <div className="text-2xl font-bold">{displayedWord.meaning_th}</div>
    <div>
  <span className="text-gray-600">อักษรจีนตัวย่อ (简体字):</span>
  <span className="ml-2 text-3xl font-bold text-red-700">
    {displayedWord.simplified || "-"}
  </span>
</div>

<div>
  <span className="text-gray-600">อักษรจีนตัวเต็ม (繁體字):</span>
  <span className="ml-2 text-3xl font-bold text-red-700">
    {displayedWord.traditional || "-"}
  </span>
</div>

<div>
  <span className="font-bold text-gray-700">เสียงไฮ้หน่ำ:</span>
  <span className="ml-2 text-2xl font-bold text-blue-700">
    {displayedWord.hainan_pronunciation || "-"}
  </span>
</div>

<div>
  <span className="font-bold text-gray-700">พินอินไฮ้หน่ำ:</span>
  <span className="ml-2">
    {displayedWord.hainan_pinyin || "-"}
  </span>
</div>

    {displayedWord.note && (
      <div className="mt-4">
        <div className="font-bold text-blue-700">หมายเหตุ :</div>
        <hr className="my-2 border-gray-300" />
        <div className="mt-2 pl-5 whitespace-pre-wrap leading-7">
          {displayedWord.note}
        </div>
      </div>
    )}
    {displayedWord.example && (
  <div className="mt-4">
    <div className="font-bold text-green-700">Example / ตัวอย่าง :</div>
    <hr className="my-2 border-gray-300" />
    <div className="mt-2 pl-2">
      {displayedWord.example}
    </div>
  </div>
)}
    {displayedWord.hainan_audio && (
      <audio
        controls
        className="mt-6"
        src={displayedWord.hainan_audio}
      />
    )}
  </div>
) : (
  <p className="text-gray-500">
    คลิกคำศัพท์จากผลการค้นหา เพื่อดูรายละเอียด
  </p>
)}
        </section>
        ) : null}
{/* 5. Search Results — hidden until a search begins */}
        {hasSearch ? (
        <section className="bg-white rounded-xl border p-4">
          <h2 className="mb-4 font-bold">
            Search Results / ค้นหาเพิ่มเติม --&gt; คลิกเลือกคำอื่นๆ ที่ปรากฏด้านล่าง ▼
          </h2>

          <div className="space-y-2">
            {filteredWords.length === 0 ? (
              <p className="rounded-lg bg-stone-50 p-4 text-gray-600">ไม่พบคำศัพท์ที่ตรงกับคำค้นนี้</p>
            ) : filteredWords.map((word) => (
              <button
                key={word.id}
                onClick={() => handleSelectWord(word)}
  className={`w-full text-left border rounded-lg p-3 transition ${
  displayedWord?.id === word.id
    ? "bg-orange-100 border-orange-400"
    : "bg-white hover:bg-stone-100"
}`}
              >
                <div className="text-sm text-gray-500">#{word.id}</div>
                <div className="font-bold">{word.meaning_th || "ไม่มีคำแปลไทย"}</div>
                <div className="text-sm">
                  {word.simplified} {word.traditional}
                </div>
              </button>
            ))}
          </div>
        </section>
        ) : null}

        {/* 6. Articles */}
        <section id="articles" className="scroll-mt-24 rounded-xl border bg-white p-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <h2 className="font-bold mb-4">Articles / บทความ</h2>

            {articles.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีบทความที่เผยแพร่ในขณะนี้</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`h-full w-full rounded-lg border p-3 text-left transition ${
                      selectedArticle?.id === article.id
                        ? "border-orange-400 bg-orange-50"
                        : "border-stone-200 bg-white hover:bg-stone-100"
                    }`}
                  >
                    <div className="flex h-full flex-col gap-3">
                      {article.cover_image_url ? (
                        <img
                          src={article.cover_image_url}
                          alt={article.title || "Article cover"}
                          className="w-full rounded-md"
                          style={{
                            height: "160px",
                            objectFit: "contain",
                }}
                        />
                      ) : null}
                      <div className="flex-1">
                         <div className="font-semibold text-gray-900">{article.title || "ไม่มีหัวข้อ"}</div>

                         {article.summary ? (
                              <p className="mt-1 text-sm text-gray-600">{article.summary}</p>
                         ) : null}

                      {article.published_at ? (
                         <p className="mt-2 text-xs text-gray-500">
                              {new Date(article.published_at).toLocaleDateString("th-TH")}
                         </p>
                     ) : null}

  <div className="mt-3 inline-flex rounded-md bg-purple-700 px-4 py-2 text-sm font-bold text-white">
    เปิดอ่านบทความ
  </div>
</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedArticle ? (
              <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{selectedArticle.title || "บทความ"}</h3>
                <div
                  className="mt-3 text-gray-700"
                  style={{ whiteSpace: "pre-wrap" }}
            >
                  {selectedArticle.content || ""}
            </div>
                <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="mt-4 rounded-md border border-stone-300 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50"
                  >
                    ปิดบทความ
                  </button>

                {articleImages.length > 0 ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {articleImages.map((image) => (
                      <figure key={image.id} className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                        {image.image_url ? (
                          <img
                            src={image.image_url}
                            alt={image.alt_text || "Article image"}
                            className="h-56 w-full object-cover"
                          />
                        ) : null}
                        {(image.alt_text || image.caption) ? (
                          <figcaption className="p-3 text-sm text-gray-600">
                            {image.caption || image.alt_text}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {/* 7. Videos */}
        <section id="videos" className="scroll-mt-24 rounded-xl border bg-white p-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <h2 className="font-bold mb-4">Videos / วิดีโอ</h2>

            {videos.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีวิดีโอที่เผยแพร่ในขณะนี้</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {videos.map((video) => {
                  if (!video.youtube_video_id?.trim()) {
                    return null;
                  }

                  const aspectRatio = video.aspect_ratio === "9:16" ? "9 / 16" : "16 / 9";

                  return (
                    <div key={video.id} className="rounded-lg border border-stone-200 bg-white p-3">
                      <div className="font-semibold text-gray-900">{video.title || "ไม่มีหัวข้อ"}</div>
                      {video.description ? (
                        <p className="mt-1 text-sm text-gray-600">{video.description}</p>
                      ) : null}
                      <div className="mt-3 w-full max-w-[900px] rounded-lg overflow-hidden border border-stone-200 bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}`}
                          title={video.title || "Video"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ aspectRatio }}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 8. Pinyin lessons and music */}
        <section id="pinyin-lessons" className="scroll-mt-24 rounded-xl border border-rose-200 bg-rose-100 p-5">
          <h2 className="text-xl font-bold">Pinyin Lessons</h2>
          <p className="mt-2 text-gray-700">พื้นที่สำหรับหลักการอ่านและระบบพินอินภาษาไฮ้หน่ำ</p>
        </section>

        <section id="music" className="scroll-mt-24 rounded-xl border border-red-200 bg-red-100 p-5">
          <h2 className="text-xl font-bold">Music / เพลงไฮ้หน่ำ</h2>
          <p className="mt-2 text-gray-700">รวมเพลงและเสียงดนตรีภาษาไฮ้หน่ำจากแหล่งเผยแพร่ต้นฉบับ</p>

          {music.length === 0 ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-white/70 p-4 text-gray-600">
              ยังไม่มีเพลงที่เผยแพร่ในขณะนี้
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {music.map((song) => {
                const safeSourceUrl = getSafeSourceUrl(song.source_url);
                const youtubeVideoId = getYouTubeVideoId(song.source_url);
                const title =
                  song.title_th ||
                  song.title_hainan_pinyin ||
                  song.title_chinese ||
                  "เพลงไฮ้หน่ำ";

                return (
                  <article key={song.id} className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
                    {youtubeVideoId ? (
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                          title={title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                          className="h-full w-full"
                        />
                      </div>
                    ) : null}

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

                      {song.title_hainan_pinyin && song.title_hainan_pinyin !== title ? (
                        <p className="mt-1 text-blue-700">พินอินไฮ้หน่ำ: {song.title_hainan_pinyin}</p>
                      ) : null}
                      {song.title_chinese && song.title_chinese !== title ? (
                        <p className="mt-1 text-xl text-red-700">{song.title_chinese}</p>
                      ) : null}
                      {song.artist ? (
                        <p className="mt-2 text-sm font-medium text-gray-700">ศิลปิน: {song.artist}</p>
                      ) : null}
                      {song.description ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">{song.description}</p>
                      ) : null}
                      {song.language_notes ? (
                        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-gray-700">
                          <span className="font-semibold">หมายเหตุด้านภาษา:</span>{" "}
                          <span className="whitespace-pre-wrap">{song.language_notes}</span>
                        </div>
                      ) : null}

                      {safeSourceUrl ? (
                        <a
                          href={safeSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                        >
                          {youtubeVideoId ? "เปิดวิดีโอต้นฉบับบน YouTube" : "เปิดแหล่งเผยแพร่ต้นฉบับ"}
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="min-h-36 rounded-xl bg-blue-500 p-5 text-white">
              <h2 className="text-lg font-bold">Link</h2>
              <p className="mt-2 text-sm text-blue-50">พื้นที่สำหรับลิงก์ที่เกี่ยวข้อง</p>
            </section>
            <section id="news" className="min-h-52 rounded-xl bg-blue-500 p-4 text-white">
              <h2 className="text-lg font-bold">News / ข่าวสาร</h2>

              {news.length === 0 ? (
                <p className="mt-2 text-sm text-blue-50">ยังไม่มีข่าวที่เผยแพร่ในขณะนี้</p>
              ) : (
                <div className="mt-3 space-y-4">
                  {news.map((item) => {
                    const safeImageUrl = item.image_url ? getSafeSourceUrl(item.image_url) : null;

                    return (
                      <article key={item.id} className="overflow-hidden rounded-lg bg-white text-gray-900 shadow-sm">
                        {safeImageUrl ? (
                          <img
                            src={safeImageUrl}
                            alt={item.image_alt || item.title}
                            loading="lazy"
                            className="h-36 w-full object-cover"
                          />
                        ) : null}

                        <div className="p-3">
                          <h3 className="font-bold leading-6">{item.title}</h3>
                          {item.summary ? (
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-gray-600">{item.summary}</p>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setSelectedNews(item)}
                            className="mt-3 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          >
                            อ่านเพิ่มเติม
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            <section className="min-h-52 rounded-xl bg-blue-700 p-5 text-white">
              <h2 className="text-lg font-bold">Poem and Story</h2>
              <p className="mt-2 text-sm text-blue-50">พื้นที่สำหรับบทกวีและเรื่องเล่า</p>
            </section>
          </aside>
        </div>

        {/* 9. Contact and footer */}
        <section id="contact" className="mt-6 rounded-xl bg-pink-600 p-5 text-white">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p className="mt-2 text-pink-50">พื้นที่สำหรับข้อมูลติดต่อและข้อเสนอแนะเกี่ยวกับพจนานุกรม</p>
        </section>

        <footer className="py-6 text-center text-sm text-gray-500">
          Hainanese Dialect Dictionary — Version 0.1
        </footer>
      </div>

      {selectedNews ? (
        <div
          role="presentation"
          onClick={() => setSelectedNews(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-6"
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white px-4 py-3 sm:px-6">
              <h2 id="news-dialog-title" className="text-lg font-bold text-gray-900 sm:text-xl">
                {selectedNews.title}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                aria-label="ปิดข่าว"
                className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 font-bold text-gray-700 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                ปิด ✕
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {selectedNewsImageUrl ? (
                <img
                  src={selectedNewsImageUrl}
                  alt={selectedNews.image_alt || selectedNews.title}
                  className="max-h-[460px] w-full rounded-lg object-contain"
                />
              ) : null}

              {selectedNewsVideoId ? (
                <div className={`${selectedNewsImageUrl ? "mt-5" : ""} aspect-video w-full overflow-hidden rounded-lg bg-black`}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${selectedNewsVideoId}`}
                    title={`วิดีโอประกอบข่าว: ${selectedNews.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full"
                  />
                </div>
              ) : null}

              {selectedNews.summary ? (
                <p className="mt-5 whitespace-pre-wrap text-lg leading-7 text-gray-600">{selectedNews.summary}</p>
              ) : null}
              {selectedNews.content ? (
                <p className="mt-5 whitespace-pre-wrap border-t border-gray-200 pt-5 leading-8 text-gray-800">
                  {selectedNews.content}
                </p>
              ) : null}
              {selectedNewsSourceUrl ? (
                <a
                  href={selectedNewsSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2 font-bold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  อ่านจากแหล่งข่าวต้นฉบับ
                </a>
              ) : null}
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}
