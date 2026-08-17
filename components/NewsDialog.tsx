"use client";

import type { ReactNode } from "react";
import { getSafeSourceUrl, getYouTubeVideoId } from "@/lib/contentUrls";
import type { News } from "@/types/content";

type NewsDialogProps = {
  selectedNews: News | null;
  onClose: () => void;
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function NewsDialog({
  selectedNews,
  onClose,
  renderDictionaryLinks,
}: NewsDialogProps) {
  if (!selectedNews) {
    return null;
  }

  const imageUrl = selectedNews.image_url
    ? getSafeSourceUrl(selectedNews.image_url)
    : null;

  const sourceUrl = selectedNews.source_url
    ? getSafeSourceUrl(selectedNews.source_url)
    : null;

  const videoId = selectedNews.video_url
    ? getYouTubeVideoId(selectedNews.video_url)
    : null;

  return (
    <div
      role="presentation"
      onClick={onClose}
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
          <h2
            id="news-dialog-title"
            className="text-lg font-bold text-gray-900 sm:text-xl"
          >
            {selectedNews.title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดข่าว"
            className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 font-bold text-gray-700 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            ปิด ✕
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={selectedNews.image_alt || selectedNews.title}
              className="max-h-[460px] w-full rounded-lg object-contain"
            />
          ) : null}

          {videoId ? (
            <div
              className={`${
                imageUrl ? "mt-5" : ""
              } aspect-video w-full overflow-hidden rounded-lg bg-black`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={`วิดีโอประกอบข่าว: ${selectedNews.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          ) : null}

          {selectedNews.summary ? (
            <p className="mt-5 whitespace-pre-wrap text-lg leading-7 text-gray-600">
              {renderDictionaryLinks(selectedNews.summary)}
            </p>
          ) : null}

          {selectedNews.content ? (
            <p className="mt-5 whitespace-pre-wrap border-t border-gray-200 pt-5 leading-8 text-gray-800">
              {renderDictionaryLinks(selectedNews.content)}
            </p>
          ) : null}

          {sourceUrl ? (
            <a
              href={sourceUrl}
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
  );
}
