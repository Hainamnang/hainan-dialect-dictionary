"use client";

import type { ReactNode } from "react";
import type { Article, ArticleImage } from "@/types/content";

type ArticleSectionProps = {
  articles: Article[];
  selectedArticle: Article | null;
  articleImages: ArticleImage[];
  shareMessage: string;
  onSelectArticle: (article: Article) => void;
  onCloseArticle: () => void;
  onCopyLink: (articleId: number) => void | Promise<void>;
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function ArticleSection({
  articles,
  selectedArticle,
  articleImages,
  shareMessage,
  onSelectArticle,
  onCloseArticle,
  onCopyLink,
  renderDictionaryLinks,
}: ArticleSectionProps) {
  return (
    <section
      id="articles"
      className="scroll-mt-24 rounded-xl border bg-white p-4"
    >
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <h2 className="mb-4 font-bold">Articles / บทความ</h2>

        {articles.length === 0 ? (
          <p className="text-gray-500">
            ยังไม่มีบทความที่เผยแพร่ในขณะนี้
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => onSelectArticle(article)}
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
                    <div className="font-semibold text-gray-900">
                      {article.title || "ไม่มีหัวข้อ"}
                    </div>

                    {article.summary ? (
                      <p className="mt-1 text-sm text-gray-600">
                        {renderDictionaryLinks(article.summary)}
                      </p>
                    ) : null}

                    {article.published_at ? (
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(
                          article.published_at
                        ).toLocaleDateString("th-TH")}
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
          <div
            id={`article-${selectedArticle.id}`}
            className="mt-4 scroll-mt-24 rounded-lg border border-stone-200 bg-white p-4"
          >
            <h3 className="font-semibold text-gray-900">
              {selectedArticle.title || "บทความ"}
            </h3>

            <div
              className="mt-3 text-gray-700"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {renderDictionaryLinks(selectedArticle.content || "")}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onCopyLink(selectedArticle.id)}
                className="rounded-md bg-purple-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-800"
              >
                Copy Link This Content
              </button>

              <button
                type="button"
                onClick={onCloseArticle}
                className="rounded-md border border-stone-300 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50"
              >
                ปิดบทความ
              </button>

              {shareMessage ? (
                <span className="text-sm font-medium text-green-700">
                  {shareMessage}
                </span>
              ) : null}
            </div>

            {articleImages.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {articleImages.map((image) => (
                  <figure
                    key={image.id}
                    className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-stone-200 bg-stone-50"
                  >
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.alt_text || "Article image"}
                        className="h-auto w-full object-contain"
                      />
                    ) : null}

                    {image.alt_text || image.caption ? (
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
  );
}
