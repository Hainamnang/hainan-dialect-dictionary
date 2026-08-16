"use client";

import type { ReactNode } from "react";
import { getSafeSourceUrl, getYouTubeVideoId } from "@/lib/contentUrls";
import type { Music } from "@/types/content";

type MusicSectionProps = {
  music: Music[];
  renderDictionaryLinks: (text: string) => ReactNode;
};

export default function MusicSection({
  music,
  renderDictionaryLinks,
}: MusicSectionProps) {
  return (
    <section
      id="music"
      className="scroll-mt-24 rounded-xl border border-red-200 bg-red-100 p-5"
    >
      <h2 className="text-xl font-bold">Music / เพลงไฮ้หน่ำ</h2>

      <p className="mt-2 text-gray-700">
        รวมเพลงและเสียงดนตรีภาษาไฮ้หน่ำจากแหล่งเผยแพร่ต้นฉบับ
      </p>

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
              <article
                key={song.id}
                className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm"
              >
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
                  <h3 className="text-lg font-bold text-gray-900">
                    {title}
                  </h3>

                  {song.title_hainan_pinyin &&
                  song.title_hainan_pinyin !== title ? (
                    <p className="mt-1 text-blue-700">
                      พินอินไฮ้หน่ำ: {song.title_hainan_pinyin}
                    </p>
                  ) : null}

                  {song.title_chinese && song.title_chinese !== title ? (
                    <p className="mt-1 text-xl text-red-700">
                      {song.title_chinese}
                    </p>
                  ) : null}

                  {song.artist ? (
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      ศิลปิน: {song.artist}
                    </p>
                  ) : null}

                  {song.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {renderDictionaryLinks(song.description)}
                    </p>
                  ) : null}

                  {song.language_notes ? (
                    <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-gray-700">
                      <span className="font-semibold">
                        หมายเหตุด้านภาษา:
                      </span>{" "}
                      <span className="whitespace-pre-wrap">
                        {renderDictionaryLinks(song.language_notes)}
                      </span>
                    </div>
                  ) : null}

                  {safeSourceUrl ? (
                    <a
                      href={safeSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    >
                      {youtubeVideoId
                        ? "เปิดวิดีโอต้นฉบับบน YouTube"
                        : "เปิดแหล่งเผยแพร่ต้นฉบับ"}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
