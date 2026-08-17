"use client";

import { getSafeSourceUrl } from "@/lib/contentUrls";
import type { News } from "@/types/content";

type NewsSectionProps = {
  news: News[];
  onSelectNews: (newsItem: News) => void;
};

export default function NewsSection({
  news,
  onSelectNews,
}: NewsSectionProps) {
  return (
    <section
      id="news"
      className="min-h-52 rounded-xl bg-blue-500 p-4 text-white"
    >
      <h2 className="text-lg font-bold">News / ข่าวสาร</h2>

      {news.length === 0 ? (
        <p className="mt-2 text-sm text-blue-50">
          ยังไม่มีข่าวที่เผยแพร่ในขณะนี้
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {news.map((item) => {
            const safeImageUrl = item.image_url
              ? getSafeSourceUrl(item.image_url)
              : null;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg bg-white text-gray-900 shadow-sm"
              >
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
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-gray-600">
                      {item.summary}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onSelectNews(item)}
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
  );
}
