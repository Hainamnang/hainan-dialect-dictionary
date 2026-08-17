"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import HeaderSection from "@/components/HeaderSection";
import MainMenu from "@/components/MainMenu";
import VideoSection from "@/components/VideoSection";
import MusicSection from "@/components/MusicSection";
import ExternalLinksSection from "@/components/ExternalLinksSection";
import NewsSection from "@/components/NewsSection";
import NewsDialog from "@/components/NewsDialog";
import ArticleSection from "@/components/ArticleSection";
import ContactSection from "@/components/ContactSection";
import { getYouTubeVideoId } from "@/lib/contentUrls";
import { logSupabaseError, supabase } from "@/lib/supabaseClient";
import type {
  Article,
  ArticleImage,
  ExternalLink,
  Music,
  News,
  PinyinLesson,
  PinyinLessonMedia,
  ShareContentType,
  Video,
  Word,
} from "@/types/content";

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [linkedWordId, setLinkedWordId] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleImages, setArticleImages] = useState<ArticleImage[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const vocabularyDetailRef = useRef<HTMLElement | null>(null);
  const [pinyinLessons, setPinyinLessons] = useState<PinyinLesson[]>([]);
  const [selectedPinyinLesson, setSelectedPinyinLesson] =
      useState<PinyinLesson | null>(null);
  const [pinyinLessonMedia, setPinyinLessonMedia] =
      useState<PinyinLessonMedia[]>([]);

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
  if (linkedWordId !== null) {
    const url = new URL(window.location.href);
    url.searchParams.delete("dictionary_id");

    if (url.hash === "#dictionary") {
      url.hash = "";
    }

    window.history.replaceState({}, "", url.toString());
  }

  setLinkedWordId(null);
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

const handleDictionaryWordLink = (wordId: number) => {
  const requestedWord = words.find((word) => word.id === wordId);

  if (!requestedWord) {
    return;
  }

  setLinkedWordId(requestedWord.id);
  setSelectedWord(requestedWord);
  setSearch(
    requestedWord.simplified ||
      requestedWord.traditional ||
      requestedWord.meaning_th ||
      ""
  );

  const url = new URL("/", window.location.origin);
  url.searchParams.set("dictionary_id", String(requestedWord.id));
  url.hash = "dictionary";
  window.history.replaceState({}, "", url.toString());

  window.setTimeout(() => {
    document.getElementById("dictionary")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 0);
};

const renderDictionaryLinks = (text: string) => {
  const pattern = /\[\[([^\[\]|]+)\|(\d+)\]\]/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1].trim();
    const wordId = Number(match[2]);
    const availableWord = words.find((word) => word.id === wordId);
    const isChineseOnly = /^[\p{Script=Han}]+$/u.test(label);

    if (availableWord && isChineseOnly) {
      parts.push(
        <a
          key={`dictionary-${wordId}-${match.index}`}
          href={`/?dictionary_id=${wordId}#dictionary`}
          onClick={(event) => {
            event.preventDefault();
            handleDictionaryWordLink(wordId);
          }}
          className="font-semibold text-purple-700 underline decoration-dotted underline-offset-4 hover:text-purple-900"
        >
          {label}
        </a>
      );
    } else {
      parts.push(label);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const buildContentShareUrl = (contentType: ShareContentType, id: number) => {
  const url = new URL("/", window.location.origin);
  url.searchParams.set("content", contentType);
  url.searchParams.set("id", String(id));
  return url.toString();
};

const handleCopyContentLink = async (
  contentType: ShareContentType,
  id: number
) => {
  const url = buildContentShareUrl(contentType, id);
  setShareMessage("");

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (!copied) {
        throw new Error("Copy failed");
      }
    }

    setShareMessage("✓ Copy Link แล้ว");
    window.setTimeout(() => setShareMessage(""), 2500);
  } catch {
    setShareMessage("คัดลอกลิงก์ไม่สำเร็จ");
    window.setTimeout(() => setShareMessage(""), 2500);
  }
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
    if (words.length === 0) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedId = Number(params.get("dictionary_id"));

    if (!Number.isInteger(requestedId) || requestedId <= 0) {
      return;
    }

    const requestedWord = words.find((word) => word.id === requestedId);

    if (!requestedWord) {
      return;
    }

    setLinkedWordId(requestedWord.id);
    setSelectedWord(requestedWord);
    setSearch(
      requestedWord.simplified ||
        requestedWord.traditional ||
        requestedWord.meaning_th ||
        ""
    );

    window.setTimeout(() => {
      document.getElementById("dictionary")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [words]);

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
    const params = new URLSearchParams(window.location.search);

    if (params.get("content") !== "article") {
      return;
    }

    const requestedId = Number(params.get("id"));
    if (!Number.isInteger(requestedId) || requestedId <= 0 || articles.length === 0) {
      return;
    }

    const requestedArticle = articles.find((article) => article.id === requestedId);
    if (!requestedArticle) {
      return;
    }

    setSelectedArticle(requestedArticle);

    window.setTimeout(() => {
      document.getElementById(`article-${requestedId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [articles]);

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
    async function loadExternalLinks() {
      const { data, error } = await supabase
        .from("links")
        .select(
          "id, title, url, link_label, description, image_url, sort_key, is_published, created_at"
        )
        .eq("is_published", true)
        .order("sort_key", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        logSupabaseError("loadExternalLinks", error);
      } else {
        setExternalLinks((data as ExternalLink[]) || []);
      }
    }

    loadExternalLinks();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("content") !== "link") {
      return;
    }

    const requestedId = Number(params.get("id"));

    if (
      !Number.isInteger(requestedId) ||
      requestedId <= 0 ||
      externalLinks.length === 0
    ) {
      return;
    }

    const requestedLink = externalLinks.find(
      (link) => link.id === requestedId
    );

    if (!requestedLink) {
      return;
    }

    window.setTimeout(() => {
      document.getElementById(`link-${requestedId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [externalLinks]);

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
    async function loadPinyinLessons() {
      const { data, error } = await supabase
        .from("pinyin_lessons")
        .select("*")
        .eq("is_published", true)
        .order("sort_key", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        logSupabaseError("loadPinyinLessons", error);
        return;
      }

      setPinyinLessons((data ?? []) as PinyinLesson[]);
    }

    loadPinyinLessons();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("content") !== "pinyin") {
      return;
    }

    const requestedId = Number(params.get("id"));

    if (
      !Number.isInteger(requestedId) ||
      requestedId <= 0 ||
      pinyinLessons.length === 0
    ) {
      return;
    }

    const requestedLesson = pinyinLessons.find(
      (lesson) => lesson.id === requestedId
    );

    if (!requestedLesson) {
      return;
    }

    setSelectedPinyinLesson(requestedLesson);

    window.setTimeout(() => {
      document.getElementById(`pinyin-${requestedId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [pinyinLessons]);

    useEffect(() => {
      async function loadPinyinLessonMedia() {
      if (!selectedPinyinLesson) {
        setPinyinLessonMedia([]);
        return;
      }

      const { data, error } = await supabase
        .from("pinyin_lesson_media")
        .select(
          "id, lesson_id, media_type, media_url, alt_text, caption, sort_key, created_at"
        )
        .eq("lesson_id", selectedPinyinLesson.id)
        .order("sort_key", { ascending: true })
        .order("id", { ascending: true });

      if (error) {
        logSupabaseError("loadPinyinLessonMedia", error);
        setPinyinLessonMedia([]);
        return;
      }

      setPinyinLessonMedia((data ?? []) as PinyinLessonMedia[]);
    }

    loadPinyinLessonMedia();
  }, [selectedPinyinLesson]);
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

const linkedWord =
  linkedWordId === null
    ? null
    : words.find((word) => word.id === linkedWordId) || null;

const displayedWord =
  linkedWordId !== null
    ? linkedWord
    : normalizedSearch === "" || filteredWords.length === 0
      ? null
      : selectedWord && filteredWords.some((word) => word.id === selectedWord.id)
        ? selectedWord
        : filteredWords[0];

  const hasSearch = normalizedSearch !== "" || linkedWordId !== null;
  return (
    <main className="min-h-screen bg-stone-50 px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl">

        {/* 1. Header */}
        <HeaderSection />

        {/* 2. Main menu */}
        <MainMenu />

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
{/* 5. Search Results — shown only for a normal manual search */}
        {hasSearch && linkedWordId === null ? (
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
        <ArticleSection
          articles={articles}
          selectedArticle={selectedArticle}
          articleImages={articleImages}
          shareMessage={shareMessage}
          onSelectArticle={setSelectedArticle}
          onCloseArticle={() => setSelectedArticle(null)}
          onCopyLink={(articleId) =>
            handleCopyContentLink("article", articleId)
          }
          renderDictionaryLinks={renderDictionaryLinks}
        />

        {/* 7. Videos */}
        <VideoSection
          videos={videos}
          renderDictionaryLinks={renderDictionaryLinks}
        />

        {/* 8. Pinyin lessons and music */}
        <section
  id="pinyin-lessons"
  className="scroll-mt-24 rounded-xl border border-rose-200 bg-rose-100 p-5"
>
  <h2 className="text-xl font-bold">Pinyin Lessons</h2>

  {pinyinLessons.length === 0 ? (
    <p className="mt-3 text-gray-700">
      ยังไม่มีบทเรียนที่เผยแพร่ในขณะนี้
    </p>
  ) : (
    <div className="mt-4 space-y-3">
      {pinyinLessons.map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          onClick={() => setSelectedPinyinLesson(lesson)}
          className={`w-full rounded-lg border p-3 text-left transition ${
            selectedPinyinLesson?.id === lesson.id
              ? "border-rose-500 bg-white"
              : "border-rose-200 bg-white/80 hover:bg-white"
          }`}
        >
          <div className="font-bold text-gray-900">
            {lesson.title}
          </div>

          {lesson.title_chinese ? (
            <div className="mt-1 text-lg text-red-700">
              {lesson.title_chinese}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )}
    {selectedPinyinLesson ? (
    <div
      id={`pinyin-${selectedPinyinLesson.id}`}
      className="scroll-mt-24 mt-4 rounded-lg border border-rose-200 bg-white p-4"
    >
      <h3 className="text-lg font-bold text-gray-900">
        {selectedPinyinLesson.title}
      </h3>

      {selectedPinyinLesson.title_chinese ? (
        <div className="mt-1 text-xl text-red-700">
          {selectedPinyinLesson.title_chinese}
        </div>
      ) : null}

      {selectedPinyinLesson.content ? (
        <div className="mt-4 whitespace-pre-wrap leading-8 text-gray-800">
          {renderDictionaryLinks(selectedPinyinLesson.content)}
        </div>
            ) : null}
        {pinyinLessonMedia
  .filter((media) => media.media_type === "image")
  .map((media) => (
    <figure key={media.id} className="mt-4">
      <img
        src={media.media_url}
        alt={media.alt_text || selectedPinyinLesson.title}
        className="max-h-[520px] w-full rounded-lg object-contain"
      />

      {media.caption ? (
        <figcaption className="mt-2 text-sm text-gray-600">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  ))}
            {pinyinLessonMedia
              .filter((media) => media.media_type === "video")
        .map((media) => {

          const videoId = getYouTubeVideoId(media.media_url);

          if (!videoId) {
            return null;
          }

          return (
            <div key={media.id} className="mt-4">
              <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={media.alt_text || media.caption || selectedPinyinLesson.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {media.caption ? (
                <p className="mt-2 text-sm text-gray-600">
                  {media.caption}
                </p>
              ) : null}
            </div>
          );
  })}
              {pinyinLessonMedia
          .filter((media) => media.media_type === "audio")
          .map((media) => (
             <div key={media.id} className="mt-4">
               <audio
                 controls
                 preload="metadata"
                 src={media.media_url}
                className="w-full"
              />

              {media.caption ? (
                <p className="mt-2 text-sm text-gray-600">
              {media.caption}
               </p>
               ) : null}
             </div>
  ))}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            handleCopyContentLink("pinyin", selectedPinyinLesson.id)
          }
          className="rounded-md bg-purple-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-800"
        >
          Copy Link This Content
        </button>

        <button
          type="button"
          onClick={() => setSelectedPinyinLesson(null)}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50"
        >
          ปิดบทเรียน
        </button>

        {shareMessage ? (
          <span className="text-sm font-medium text-green-700">
            {shareMessage}
          </span>
        ) : null}
      </div>
    </div>
  ) : null}
</section>
        <MusicSection
          music={music}
          renderDictionaryLinks={renderDictionaryLinks}
        />
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <ExternalLinksSection
              externalLinks={externalLinks}
            />
            <NewsSection
              news={news}
              onSelectNews={setSelectedNews}
            />
            <section className="min-h-52 rounded-xl bg-blue-700 p-5 text-white">
              <h2 className="text-lg font-bold">Poem and Story</h2>
              <p className="mt-2 text-sm text-blue-50">พื้นที่สำหรับบทกวีและเรื่องเล่า</p>
            </section>
          </aside>
        </div>

        {/* 9. Contact and footer */}
<ContactSection />
        <footer className="py-6 text-center text-sm text-gray-500">
          Hainanese Dialect Dictionary — Version 0.1
        </footer>
      </div>

      <NewsDialog
        selectedNews={selectedNews}
        onClose={() => setSelectedNews(null)}
        renderDictionaryLinks={renderDictionaryLinks}
      />
    </main>
  );
}
